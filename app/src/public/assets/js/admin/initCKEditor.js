let editor;

class UploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file
            .then(file => {
                return new Promise((resolve, reject) => {
                    const formdata = new FormData();
                    formdata.append('image', file);

                    $.ajax({
                        url: "/admin/upload",
                        type: "POST",
                        data: formdata,
                        processData: false,
                        contentType: false,
                    })
                        .done(function (result) {
                            resolve({
                                default: result.location,
                            });
                        })
                        .fail(function (xhr) {
                            let error = xhr.responseJSON;
                            reject(error.message || error);
                        });
                });
            });
    }

    abort() {
    }
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
    } )
    .then( newEditor => {
        editor = newEditor;

        const toolbarContainer = document.querySelector( '#toolbar-container' );

        toolbarContainer.appendChild( editor.ui.view.toolbar.element );

        editor.plugins.get('FileRepository').createUploadAdapter = (loader)=>{
            return new UploadAdapter(loader);
        };
    } )
    .catch( error => {
        console.error( error );
    } );
