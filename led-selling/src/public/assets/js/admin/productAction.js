function addProductSpecification() {
  let newSpecification = `
      <div class="form-group product-specification">
          <div class="col-md-3 control-label">
              <input name="specification_title[]" placeholder="Tên thông số" class="form-control" type="text" />
          </div>
          <div class="col-md-2 control-type">
              <select name="specification_type[]" class="form-control">
                  <option value="text">Text</option>
                  <option value="link">Link</option>
              </select>
          </div>
          <div class="col-md-7 control-field">
              <input name="specification_value[]" placeholder="Giá trị" class="form-control" type="text" />
          </div>
          <button type="button" class="close remove-product-specification" aria-label="Close" onclick="removeProductSpecification(this)">
              <span aria-hidden="true">&times;</span>
          </button>
      </div>
  `;

  $(newSpecification).insertBefore($(".specification-add-btn")[0]);
}

function removeProductSpecification(productSpecificationNode) {
  $(productSpecificationNode).parent().remove();
}

function showProductCreationConfirmation() {
  $("#productCreationConfirmation").modal("show");
}

function submitProductCreation() {
  let fields = $("form").serializeArray();

  let data = {};
  data.specification_title = [];
  data.specification_type = [];
  data.specification_value = [];

  $.each(fields, function (i, field) {
    if (field.name == "categoryId" && field.value) {
      data.categoryId = field.value;
    } else if (field.name == "name" && field.value) {
      data.name = field.value;
    } else if (field.name == "model" && field.value) {
      data.model = field.value;
    } else if (field.name == "specification_title[]") {
      data.specification_title.push(field.value);
    } else if (field.name == "specification_type[]") {
      data.specification_type.push(field.value);
    } else if (field.name == "specification_value[]") {
      data.specification_value.push(field.value);
    }
  });

  let imageEl = $("input[name='image']").parent().find(".profile-pic").first();
  if (imageEl && imageEl.attr("src")) {
    data.image = imageEl.attr("src");
  }
  if (imageEl && imageEl.data("thumb-src")) {
    data.thumbImage = imageEl.data("thumb-src");
  }

  data.images = $("input[name='images']")
    .parent()
    .find(".profile-pic")
    .toArray()
    .filter(function (el) {
      return $(el).attr("src");
    })
    .map(function (el) {
      return $(el).attr("src");
    });
  data.thumbImages = $("input[name='images']")
    .parent()
    .find(".profile-pic")
    .toArray()
    .filter(function (el) {
      return $(el).data("thumb-src");
    })
    .map(function (el) {
      return $(el).data("thumb-src");
    });

  let description = editor.getData();
  if (description) {
    data.description = description;
  }

  $.post("/admin/product/create", data)
    .done(function (data) {
      $("#productCreationConfirmation").modal("hide");
      alertify.success("Thêm sản phẩm thành công!");
    })
    .fail(function (xhr) {
      $("#productCreationConfirmation").modal("hide");
      let error = xhr.responseJSON;
      alertify.error(error.message || error);
    });
}

window.onload = function () {
  window.addEventListener("beforeunload", function (e) {
    const hasUploadedImages = !!$(
      ".single-image-container .profile-pic"
    ).filter(
      (i, e) =>
        $(e).attr("src") && $(e).attr("src") !== "/assets/images/no-image.png"
    ).length;
    const hasEnteredName = !!$("#name").val();
    const hasEnteredModel = !!$("#model").val();
    const hasEnteredSomeSpecificationTitles = !!$(
      'input[name="specification_title[]"]'
    ).filter((i, e) => $(e).val() && $(e).val().trim()).length;
    const hasEnteredSomeSpecificationValues = !!$(
      'input[name="specification_value[]"]'
    ).filter((i, e) => $(e).val() && $(e).val().trim()).length;
    const hasEnteredDescription = !!editor.getData();

    if (
      hasUploadedImages ||
      hasEnteredName ||
      hasEnteredModel ||
      hasEnteredSomeSpecificationTitles ||
      hasEnteredSomeSpecificationValues ||
      hasEnteredDescription
    ) {
      // Cancel the event
      e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
      // Chrome requires returnValue to be set
      e.returnValue = "";
      return;
    }
  });
};
