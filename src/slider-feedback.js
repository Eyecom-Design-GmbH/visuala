$(".feedback-slider_component").each(function (index) {
    const swiperImpression = new Swiper($(this).find(".swiper")[0], {
      autoHeight: false,
      followFinger: true,
      draggable: true,
      freeMode: false,
      slideToClickedSlide: true,
      centeredSlides: true,
      slidesPerView: 'auto', // Displays the slides with a partial view on the sides
      spaceBetween: "4%",
      allowTouchMove: true,
      autoplay: {
        delay: 5000,
      },
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
      },
    });
  });
  