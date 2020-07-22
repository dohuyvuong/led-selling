function showCustomizedPageCreationConfirmation() {
    $("#customizedPageCreationConfirmation").modal("show");
}

function submitCustomizedPageCreation() {
    let fields = $("form").serializeArray();

    let data = {};
    
    $.each(fields, function (i, field) {
        if (field.name == "name" && field.value) {
            data.name = field.value;
        }
        else if (field.name == "path" && field.value) {
            data.path = field.value;
        }
    });

    let description = editor.getData();
    if (description) {
        data.description = description;
    }

    $.post("/admin/customized-page/create", data)
        .done(function (data) {
            $("#customizedPageCreationConfirmation").modal("hide");
            alertify.success("Thêm trang thành công!");
        })
        .fail(function (xhr) {
            $("#customizedPageCreationConfirmation").modal("hide");
            let error = xhr.responseJSON;
            alertify.error(error.message || error);
        });
}
