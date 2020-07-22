export const errorMessages = {
  server_error: "Có lỗi thuộc về server. Vui lòng liên hệ với chúng tôi và rất mong bạn thông cảm.",
  bad_request: "Yêu cầu không hợp lệ",
  category_not_found: "Không tìm thấy danh mục!",
  category_parent_must_not_be_leaf: "Danh mục cha phải là danh mục không chứa sản phẩm nào!",
  product_category_is_required: "Danh mục của sản phẩm là bắt buộc!",
  product_category_must_be_leaf: "Danh mục của sản phẩm là danh mục không chứa danh mục nào khác!",
  product_not_found: "Không tìm thấy sản phẩm!",
  customized_page_not_found: "Không tìm thấy trang!",
  product_alias_existed: "Không phải lỗi, bạn chỉ cần gửi lại yêu cầu!",
  category_alias_existed: "Tên danh mục đã tồn tại!",
  customized_page_alias_existed: "Đường dẫn trang đã tồn tại!",
  require_fields: (fields) => {
    return `Vui lòng nhập các trường sau: ${fields}`;
  },
  file_empty: "Vui lòng chọn hình ảnh!",
  file_type_not_allowed: "Kiểu tệp tin không được hỗ trợ!",
  upload_error: {
    LIMIT_PART_COUNT: "Too many parts",
    LIMIT_FILE_SIZE: "Dung lượng tối đa là 10MB!",
    LIMIT_FILE_COUNT: "Ảnh đại diện cho sản phẩm là duy nhất!",
    LIMIT_FIELD_KEY: "Field name too long",
    LIMIT_FIELD_VALUE: "Field value too long",
    LIMIT_FIELD_COUNT: "Too many fields",
    LIMIT_UNEXPECTED_FILE: "Unexpected field",
  },
};
