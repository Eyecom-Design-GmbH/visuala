document.addEventListener("DOMContentLoaded", function () {
  // gsap.registerPlugin(ScrollTrigger);

  $(".slider-impressionen_component").each(function (index) {
    function updateSlideStyles(swiper) {
      const activeIndex = swiper.activeIndex;
      const totalSlides = swiper.slides.length;

      swiper.slides.forEach((slide, index) => {
        const $slide = $(slide);

        let distance = Math.abs(index - activeIndex);

        if (swiper.params.loop) {
          const distanceFromEnd = Math.abs(index - (activeIndex + totalSlides));
          const distanceFromStart = Math.abs(
            index - (activeIndex - totalSlides),
          );
          distance = Math.min(distance, distanceFromEnd, distanceFromStart);
        }

        const isActive = distance === 0;

        if (isActive) {
          slide.style.transform = "scale(1)";
          slide.style.zIndex = "999";
        } else {
          slide.style.transform = "scale(0.8)";
          slide.style.zIndex = "1";
        }

        let overlay = slide.querySelector(".slide-overlay");
        if (!isActive) {
          if (!overlay) {
            overlay = document.createElement("div");
            overlay.className = "slide-overlay";
            slide.appendChild(overlay);
          }
          overlay.style.opacity = "0.6";
        } else if (overlay) {
          overlay.style.opacity = "0";
        }
      });
    }

    const swiperImpression = new Swiper($(this).find(".swiper")[0], {
      autoHeight: false,
      followFinger: true,
      draggable: true,
      freeMode: false,
      slideToClickedSlide: true,
      slidesPerView: 1,
      loop: true,
      spaceBetween: 40,
      allowTouchMove: true,
      autoplay: {
        delay: 5000,
      },
      rewind: false,
      loop: true,
      centeredSlides: true,
      mousewheel: {
        forceToAxis: true,
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      a11y: {
        enabled: true,
        slideRole: 'listitem',
      },

      navigation: {
        nextEl: $(this).find(".swiper-next")[0],
        prevEl: $(this).find(".swiper-prev")[0],
        disabledClass: "is-disabled",
      },
      slideActiveClass: "is-active",
      slideDuplicateActiveClass: "is-active",
      on: {
        init: function () {
          setTimeout(() => updateSlideStyles(this), 100);
        },
        slideChange: function () {
          updateSlideStyles(this);
        },
        slideChangeTransitionEnd: function () {
          updateSlideStyles(this);
        },
      },
    });
  });


  // gsap.utils.toArray(".image-projects_wrapper").forEach((wrapper) => {
  //   const images = wrapper.querySelectorAll(".project-image");

  //   gsap.from(images, {
  //     scrollTrigger: {
  //       trigger: wrapper,
  //       start: "top 70%",
  //       markers: false,
  //     },
  //     yPercent: 100,
  //     opacity: 0,
  //     duration: 0.5,
  //     ease: "power2.out",
  //     stagger: 0.05,
  //   });
  // });

  // gsap.utils.toArray(".image-projects-wrapper-big").forEach((wrapper) => {
  //   const images = wrapper.querySelectorAll(".project-image-big");

  //   gsap.from(images, {
  //     scrollTrigger: {
  //       trigger: wrapper,
  //       start: "top 70%",
  //       markers: false,
  //     },
  //     yPercent: 100,
  //     opacity: 0,
  //     duration: 0.5,
  //     ease: "power2.out",
  //     stagger: 0.05,
  //   });
  // });

  // gsap.utils.toArray(".product-videos").forEach((video) => {
  //   gsap.set(video, {
  //     opacity: 0,
  //     yPercent: 100,
  //   });
  
  //   gsap.to(video, {
  //     scrollTrigger: {
  //       trigger: video,
  //       start: "top 90%%",
  //     },
  //     yPercent: 0,
  //     opacity: 1,
  //     duration: 0.6,
  //     ease: "power2.out",
  //   });
  // });
  
});
