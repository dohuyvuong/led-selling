let buildBreadcrumb = (breadcrumb) => {
  if (!breadcrumb) {
    return "";
  }

  let currentBreadcrumb = `<li class="breadcrumb-item"><a href="/category/${breadcrumb.alias}"><span>${breadcrumb.name}</span></a></li>`;

  return buildBreadcrumb(breadcrumb.breadcrumb) + currentBreadcrumb;
};

/**
 * Build list view header
 * @param {Array} categories
 * @param {Array} products
 */
let buildListViewHeader = (categories, products) => {
  if (Array.isArray(categories) && categories.length > 0) {
    return "Danh sách danh mục";
  }

  if (Array.isArray(products) && products.length > 0) {
    return "Danh sách sản phẩm";
  }

  return "Chưa có dữ liệu";
};

/**
 * Build categories view
 * @param {Array} categories
 */
let buildCategoriesView = (categories) => {
  return categories.map(category => {
    return `
        <div class="card col-md-3 col-lg-2 product-card no-padding">
            <div class="container no-padding">
                <div class="row product-image single-image-container no-margin">
                    <a href="/category/${category.alias}"><img src="${category.image}" alt="${category.name}" /></a>
                </div>
                <div class="row card-body product-card-body no-margin">
                    <div class="card-title"><a href="/category/${category.alias}">${category.name}</a></div>
                </div>
            </div>
        </div>
    `;
  }).join("");
};

/**
 * Build products view
 * @param {Array} products
 */
let buildProductsView = (products) => {
  return products.map(product => {
    let productNameAndModel = product.name + (product.model ? " - " + product.model : "");
    let specifications = productBuilder.buildMiniSpecifications(product);

    return `
        <div class="card col-md-3 col-lg-2 product-card no-padding">
            <div class="container no-padding">
                <div class="row product-image single-image-container no-margin" data-toggle="tooltip" data-html="true" title='${specifications}' data-placement="right">
                    <a href="/product/${product.alias}"><img src="${product.image}" alt="${productNameAndModel}" /></a>
                </div>
                <div class="row card-body product-card-body no-margin">
                    <div class="card-title"><a href="/product/${product.alias}">${productNameAndModel}</a></div>
                </div>
            </div>
        </div>
    `;
  }).join("");
};

let buildRootCategoriesPagination = (noOfPages) => {
  let pages = "";
  for (let i = 0; i < noOfPages; i++) {
    pages += `<li class="page-item"><a class="page-link" href="#">${i + 1}</a></li>`;
  }
  return `
    <nav aria-label="Page navigation example" class="wrapped-pagination">
        <ul class="pagination">
            <li class="page-item"><a class="page-link" href="#">Previous</a></li>
            ${pages}
            <li class="page-item"><a class="page-link" href="#">Next</a></li>
        </ul>
    </nav>
  `;
};

let buildCategoryOptions = (categories) => {
  return categories.map(category => {
    return `<option value="${category._id}">${category.name}</option>`;
  }).join("");
};

let buildCategoryOptionsWithEmpty = (categories) => {
  return `<option value="">Không có</option>` + buildCategoryOptions(categories);
};

let productBuilder = {
  buildDetail: (product) => {
    return `
        <div class="detail-header">
            <div class="detail-name">${product.name}</div>
            ${product.model ? `<div class="detail-model">Model: ${product.model}</div>` : ""}
        </div>
    `;
  },

  buildMiniSpecifications: (product) => {
    let specifications = product.specifications;

    if (specifications && specifications.length > 8) {
      specifications = specifications.slice(0, 8);
    }

    let specificationsHTML = `
        <div class="container mini-detail-specifications no-padding">
            ${
              specifications.map((specification) => {
                if (specification.type == "text") {
                  return `
                      <div class="row mini-detail-specification no-margin">
                          <div class="col-6 mini-control-label">${specification.title}</div>
                          <div class="col-6 mini-control-field">${specification.value}</div>
                      </div>
                  `;
                }

                return `
                    <div class="row mini-detail-specification no-margin">
                        <div class="col-6 mini-control-label">${specification.title}</div>
                        <div class="col-6 mini-control-field">
                            <a href=${specification.value} target="_blank">${specification.value}</a>
                        </div>
                    </div>
                `;
              }).join("")
            }
        </div>
    `;

    return specificationsHTML;
  },

  buildShortSpecifications: (product) => {
    let specifications = product.specifications;

    if (specifications && specifications.length > 10) {
      specifications = specifications.slice(0, 10);
    }

    let specificationsHTML = `
        <div class="short-detail-specifications">
            ${
              specifications.map((specification) => {
                if (specification.type == "text") {
                  return `
                      <div class="row detail-specification">
                          <div class="col-4 control-label">${specification.title}</div>
                          <div class="col-8 control-field">${specification.value}</div>
                      </div>
                  `;
                }

                return `
                    <div class="row detail-specification">
                        <div class="col-4 control-label">${specification.title}</div>
                        <div class="col-8 control-field">
                            <a href=${specification.value} target="_blank">${specification.value}</a>
                        </div>
                    </div>
                `;
              }).join("")
            }
            ${ product.specifications.length > 10 ? `
                <div class="detail-see-more">
                    <a href="#specification" onclick="showProductSpecifications();" data-toggle="tab">Xem tất cả</a>
                </div>
            ` : "" }
        </div>
    `;

    return specificationsHTML;
  },

  buildSpecifications: (product) => {
    let specifications = product.specifications;

    let specificationsHTML = `
        <div class="detail-specifications">
            ${
              specifications.map((specification) => {
                if (specification.type == "text") {
                  return `
                      <div class="row detail-specification">
                          <div class="col-4 control-label">${specification.title}</div>
                          <div class="col-8 control-field">${specification.value}</div>
                      </div>
                  `;
                }

                return `
                    <div class="row detail-specification">
                        <div class="col-4 control-label">${specification.title}</div>
                        <div class="col-8 control-field">
                            <a href=${specification.value} target="_blank">${specification.value}</a>
                        </div>
                    </div>
                `;
              }).join("")
            }
        </div>
    `;

    return specificationsHTML;
  },

  imagesBuilder: {
    buildCarouselIndicators: (product) => {
      let images = [ product.image, ...product.images ];
      let alt = product.name + (product.model ? " - " + product.model : "");

      return images
        .filter(image => image)
        .map((image, index) => {
          return `
              <div class="col col-3 images-single">
                  <div class="container no-padding">
                      <div class="row single-image-container no-margin">
                          <li data-target="#carouselExampleIndicators" data-slide-to="${index}" class="avatar-wrapper active">
                              <img class="d-block" src="${image}" alt="${alt}" data-lightbox="${alt}" data-title="${alt}" data-alt="${alt}" />
                          </li>
                      </div>
                  </div>
              </div>
          `;
        })
        .join("");
    },

    buildCarouselInner: (product) => {
      let images = [ product.image, ...product.images ];
      let alt = product.name + (product.model ? " - " + product.model : "");

      return images
        .filter(image => image)
        .map((image, index) => {
          if (index == 0) {
            return `
                <div class="carousel-item active">
                    <a class="d-block" href="${image}" alt="${alt}" data-lightbox="${alt}" data-title="${alt}" data-alt="${alt}">
                        <img class="d-block" src="${image}" alt="${alt}" data-lightbox="${alt}" data-title="${alt}" data-alt="${alt}" />
                    </a>
                </div>
            `;
          }

          return `
              <div class="carousel-item">
                  <a class="d-block" href="${image}" alt="${alt}" data-lightbox="${alt}" data-title="${alt}" data-alt="${alt}">
                      <img class="d-block" src="${image}" alt="${alt}" data-lightbox="${alt}" data-title="${alt}" data-alt="${alt}" />
                  </a>
              </div>
          `;
        })
        .join("");
    },
  },
};

export const ejsBuilder = {
  buildBreadcrumb,
  buildListViewHeader,
  buildCategoriesView,
  buildProductsView,
  buildRootCategoriesPagination,
  buildCategoryOptions,
  buildCategoryOptionsWithEmpty,
  productBuilder,
};
