function showProductSpecifications() {
  $("html, body").animate({
    scrollTop: $("#specification-tab").offset().top - 100,
  }, 500);
  $("#specification-tab").tab("show");
}

$(document).ready(function () {
  $(".multiple-image-container").mousewheel(function(event, delta) {
		this.scrollLeft -= (delta * 80);
		this.scrollRight -= (delta * 80);
		event.preventDefault();
  });

  $(".product-card .product-image").tooltip({ html: true });
});
