function onClickedUploadButton() {
  $(this).parent().find(".file-upload").click();
}

function onChangedImage(){
  let parentEl = $(this).parent();

  if (this.files && this.files[0]) {
      let formdata = new FormData();
      formdata.append("image", this.files[0]);

      $.ajax({
          url: "/admin/upload",
          type: "POST",
          data: formdata,
          processData: false,
          contentType: false,
      })
          .done(function (result) {
              alertify.success("Tải ảnh lên thành công!");
              $(parentEl).find(".profile-pic").attr('src', result.location);

              if (parentEl.parents(".multiple-image-container").length == 1) {
                  let newImageUpload = $(`
                      <div class="col col-md-3 images-single">
                          <div class="container no-padding">
                              <div class="row single-image-container no-margin">
                                  <div class="avatar-wrapper">
                                      <img class="profile-pic" />
                                      <div class="upload-button">
                                          <i class="fa fa-plus" aria-hidden="true"></i>
                                          <i class="fa fa-upload" aria-hidden="true"></i>
                                      </div>
                                      <input name="images" class="file-upload" type="file" accept="image/*" style="display: none;"/>
                                  </div>
                              </div>
                          </div>
                      </div>
                  `);

                  $(".multiple-image-container").append(newImageUpload);
                  newImageUpload.find(".file-upload").on('change', onChangedImage);
                  newImageUpload.find(".upload-button").on('click', onClickedUploadButton);
                  $(".multiple-image-container").scrollLeft($(".multiple-image-container").get(0).scrollWidth + $(".multiple-image-container").get(0).clientWidth);
              }
          })
          .fail(function (xhr) {
              let error = xhr.responseJSON;
              alertify.error(error.message || error);
          });
  }
}

$(document).ready(function() {
  $(".file-upload").on('change', onChangedImage);

  $(".upload-button").on('click', onClickedUploadButton);
});
