class DeleteImageAdapter {
  constructor(urls) {
      this.urls = urls;
  }

  delete() {
      this._initRequest();
      this._initListeners();
      this._sendRequest();
  }

  // Initializes the XMLHttpRequest object using the URL passed to the constructor.
  _initRequest() {
      const xhr = this.xhr = new XMLHttpRequest();

      xhr.open( 'DELETE', `/admin/upload?${this.urls.map(url => `url=${encodeURI(url)}`).join('&')}`, true );
      xhr.withCredentials = true;
      xhr.responseType = 'json';
  }

  // Initializes XMLHttpRequest listeners.
  _initListeners() {
      const genericErrorText = `Couldn't delete file(s).`;

      this.xhr.addEventListener( 'load', () => {
          const status = this.xhr.status;
          const response = this.xhr.response;

          if ( status !== 200 || response?.message ) {
              return alertify.error(response?.message || genericErrorText);
          }

          alertify.success("Đã xoá file(s)!");
      } );
  }

  // Prepares the data and sends the request.
  _sendRequest() {
      // Send the request.
      this.xhr.send();
  }
}
