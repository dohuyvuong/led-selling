let editor;
let selection;
let selected;

class UploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file
            .then( file => new Promise( ( resolve, reject ) => {
                this._initRequest();
                this._initListeners( resolve, reject, file );
                this._sendRequest( file );
            } ) );
    }

    // Aborts the upload process.
    abort() {
        if ( this.xhr ) {
            this.xhr.abort();
        }
    }

    // Initializes the XMLHttpRequest object using the URL passed to the constructor.
    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();

        xhr.open( 'POST', '/admin/upload', true );
        xhr.withCredentials = true;
        xhr.responseType = 'json';
    }

    // Initializes XMLHttpRequest listeners.
    _initListeners( resolve, reject, file ) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = `Couldn't upload file: ${ file.name }.`;

        xhr.addEventListener( 'error', () => reject( genericErrorText ) );
        xhr.addEventListener( 'abort', () => reject() );
        xhr.addEventListener( 'load', () => {
            const response = xhr.response;

            if ( !response || !response?.location ) {
                return reject( response?.message || genericErrorText );
            }

            resolve( {
                default: response.location
            } );
        } );

        if ( xhr.upload ) {
            xhr.upload.addEventListener( 'progress', evt => {
                if ( evt.lengthComputable ) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            } );
        }
    }

    // Prepares the data and sends the request.
    _sendRequest( file ) {
        // Prepare the form data.
        const data = new FormData();

        data.append( 'image', file );

        // Send the request.
        this.xhr.send( data );
    }
}

function MyCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        return new UploadAdapter( loader );
    };
}

DecoupledDocumentEditor
    .create( document.querySelector( '#editor' ), {
        toolbar: {
            items: [
                'heading',
                '|',
                'fontFamily',
                'fontSize',
                'fontBackgroundColor',
                'fontColor',
                '|',
                'bold',
                'italic',
                'underline',
                'strikethrough',
                'highlight',
                'horizontalLine',
                '|',
                'alignment',
                '|',
                'numberedList',
                'bulletedList',
                '|',
                'indent',
                'outdent',
                '|',
                'todoList',
                'link',
                'blockQuote',
                'imageUpload',
                'insertTable',
                'mediaEmbed',
                '|',
                'undo',
                'redo'
            ]
        },
        placeholder: 'Viết mô tả ở đây!',
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
            ]
        },
        image: {
            // You need to configure the image toolbar, too, so it uses the new style buttons.
            toolbar: [ 'imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignCenter', 'imageStyle:side', 'imageStyle:alignRight' ],

            styles: [
                'full',
                'side',
                'alignLeft',
                'alignCenter',
                'alignRight'
            ]
        },
        link: {
            addTargetToExternalLinks: true,
        },
        extraPlugins: [ MyCustomUploadAdapterPlugin ],
    } )
    .then( newEditor => {
        editor = newEditor;

        const toolbarContainer = document.querySelector( '#toolbar-container' );

        toolbarContainer.appendChild( editor.ui.view.toolbar.element );

        editor.model.document.on('change:data', (event) => {
            const differ = event.source.differ

            // if no difference
            if (differ.isEmpty) {
                return;
            }

            const changes = differ.getChanges({
                includeChangesInGraveyard: true
            });

            if (changes.length === 0) {
                return;
            }

            let hasNoImageRemoved = true

            // check any image remove or not
            for (let i = 0; i < changes.length; i++){
                const change = changes[i]
                // if image remove exists
                if (change && change.type === 'remove' && change.name === 'image') {
                    hasNoImageRemoved = false
                    break
                }
            }

            // if not image remove stop execution
            if (hasNoImageRemoved) {
                return;
            }

            // get removed nodes
            const removedNodes = changes.filter(change => (change.type === 'insert' && change.name === 'image'))

            // removed images src
            const removedImagesSrc = [];
            // removed image nodes
            const removedImageNodes = []

            removedNodes.forEach(node => {
                const removedNode = node.position.nodeAfter
                removedImageNodes.push(removedNode)
                removedImagesSrc.push(removedNode.getAttribute('src'))
            });

            if (removedImagesSrc.length) {
                new DeleteImageAdapter(removedImagesSrc).delete();
            }
        });
    } )
    .catch( error => {
        console.error( error );
    } );
