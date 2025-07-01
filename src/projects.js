console.log("Projects");

document.addEventListener('DOMContentLoaded', function () {
  $(".slider-impressionen_component").each(function (index) {
    const swiperImpression = new Swiper($(this).find(".swiper")[0], {
      autoHeight: false,
      followFinger: true,
      draggable: true,
      freeMode: false,
      slideToClickedSlide: true,
      slidesPerView: 1,
      spaceBetween: "4%",
      allowTouchMove: true,
      rewind: false,
      loop: true,
      mousewheel: {
        forceToAxis: true
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true
      },
  
      navigation: {
        nextEl: $(this).find(".swiper-next")[0],
        prevEl: $(this).find(".swiper-prev")[0],
        disabledClass: "is-disabled"
      },
  
      slideActiveClass: "is-active",
      slideDuplicateActiveClass: "is-active"
    });
  });
  
});