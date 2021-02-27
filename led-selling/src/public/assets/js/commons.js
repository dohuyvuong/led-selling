function showProductSpecifications() {
  $("html, body").animate({
    scrollTop: $("#specification-tab").offset().top - 100,
  }, 500);
  $("#specification-tab").tab("show");
}

$(document).ready(function () {
  let scrollCount = 0;
  let direction = 0;

  $(".multiple-image-container").mousewheel(function(event, delta) {
		const maxScrollable = $(".multiple-image-container")[0].scrollWidth - $(".multiple-image-container")[0].offsetWidth;

    const canScrollToLeft = (this.scrollLeft >= 2) && (delta > 0);
    const canScrollToRight = (this.scrollLeft <= (maxScrollable - 2)) && (delta < 0);
    if (canScrollToLeft || canScrollToRight) {
      this.scrollLeft -= (delta * 80);
      event.preventDefault();
      return;
    }

    if (direction != delta) {
      scrollCount = 0;
      direction = delta;
    }

    if (scrollCount < 3) {
      scrollCount++;
      event.preventDefault();
    }
  });

  $(".product-card .product-image").tooltip({ html: true });
});
