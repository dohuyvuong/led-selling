function showCategoryCreationConfirmation() {
    $("#categoryCreationConfirmation").modal("show");
}

function submitCategoryCreation() {
    let fields = $("form").serializeArray();

    let data = {};

    $.each(fields, function (i, field) {
        if (field.name == "parentId") {
            data.parentId = field.value;
        }
        else if (field.name == "name" && field.value) {
            data.name = field.value;
        }
    });

    let imageEl = $("input[name='image']").parent().find(".profile-pic").first();
    if (imageEl && imageEl.attr("src")) {
        data.image = imageEl.attr("src");
    }
    if (imageEl && imageEl.data("thumb-src")) {
        data.thumbImage = imageEl.data("thumb-src");
    }

    data.images = $("input[name='images']").parent().find(".profile-pic").toArray().filter(function (el) {
        return $(el).attr("src");
    }).map(function (el) {
        return $(el).attr("src");
    });
    data.thumbImages = $("input[name='images']").parent().find(".profile-pic").toArray().filter(function (el) {
        return $(el).data("thumb-src");
    }).map(function (el) {
        return $(el).data("thumb-src");
    });

    let description = editor.getData();
    if (description) {
        data.description = description;
    }

    $.post("/admin/category/create", data)
        .done(function (data) {
            $("#categoryCreationConfirmation").modal("hide");
            alertify.success("Thêm danh mục thành công!");
        })
        .fail(function (xhr) {
            $("#categoryCreationConfirmation").modal("hide");
            let error = xhr.responseJSON;
            alertify.error(error.message || error);
        });
}
