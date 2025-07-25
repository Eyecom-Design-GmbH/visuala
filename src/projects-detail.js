// document.addEventListener("DOMContentLoaded", function () {
//   gsap.registerPlugin(ScrollTrigger);

//     // Initialize sliders only once
//     $(".slider-impressionen_component").each(function (index) {
//       // Check if slider already initialized
//       if ($(this).data('swiper-initialized')) {
//         return;
//       }
//       $(this).data('swiper-initialized', true);

//       function updateSlideStyles(swiper) {
//         const activeIndex = swiper.activeIndex;
//         const totalSlides = swiper.slides.length;

//         swiper.slides.forEach((slide, index) => {
//           const $slide = $(slide);

//           let distance = Math.abs(index - activeIndex);

//           if (swiper.params.loop) {
//             const distanceFromEnd = Math.abs(index - (activeIndex + totalSlides));
//             const distanceFromStart = Math.abs(
//               index - (activeIndex - totalSlides),
//             );
//             distance = Math.min(distance, distanceFromEnd, distanceFromStart);
//           }

//           const isActive = distance === 0;

//           if (isActive) {
//             slide.style.transform = "scale(1)";
//             slide.style.zIndex = "999";
//           } else {
//             slide.style.transform = "scale(0.8)";
//             slide.style.zIndex = "1";
//           }

//           let overlay = slide.querySelector(".slide-overlay");
//           if (!isActive) {
//             if (!overlay) {
//               overlay = document.createElement("div");
//               overlay.className = "slide-overlay";
//               slide.appendChild(overlay);
//             }
//             overlay.style.opacity = "0.6";
//           } else if (overlay) {
//             overlay.style.opacity = "0";
//           }
//         });
//       }

//       const swiperImpression = new Swiper($(this).find(".swiper")[0], {
//         autoHeight: false,
//         followFinger: true,
//         draggable: true,
//         freeMode: false,
//         slideToClickedSlide: true,
//         slidesPerView: 1,
//         loop: true,
//         spaceBetween: "2%",
//         allowTouchMove: true,
//         autoplay: {
//           delay: 5000,
//         },
//         rewind: false,
//         loop: true,
//         centeredSlides: true,
//         mousewheel: {
//           forceToAxis: true,
//         },
//         keyboard: {
//           enabled: true,
//           onlyInViewport: true,
//         },
//         a11y: {
//           enabled: true,
//           slideRole: 'listitem',
//         },

//         navigation: {
//           nextEl: $(this).find(".swiper-next")[0],
//           prevEl: $(this).find(".swiper-prev")[0],
//           disabledClass: "is-disabled",
//         },
//         slideActiveClass: "is-active",
//         slideDuplicateActiveClass: "is-active",
//         on: {
//           init: function () {
//             setTimeout(() => updateSlideStyles(this), 100);
//           },
//           slideChange: function () {
//             updateSlideStyles(this);
//           },
//           slideChangeTransitionEnd: function () {
//             updateSlideStyles(this);
//           },
//         },
//       });
//     });

//     // Feature image animation - only run once
//     if (!window.featureImageAnimated) {
//       window.featureImageAnimated = true;
      
//       const fimageTl = gsap.timeline();

//       fimageTl.fromTo(
//         ".feature-img",
//         {
//           opacity: 0,
//           yPercent: 100,
//         },
//         {
//           opacity: 1,
//           yPercent: 0,
//           duration: 0.7,
//           ease: "power2.inOut",
//         },
//       );

//       fimageTl.to(".feature-img", {
//         y: -20,
//         duration: 1.5,
//         ease: "sine.inOut",
//         repeat: -1,
//         yoyo: true,
//       });
//     }

//     // Image animations with better performance
//     gsap.utils.toArray(".image-projects_wrapper").forEach((wrapper) => {
//       // Check if already animated
//       if (wrapper.dataset.animated) return;
//       wrapper.dataset.animated = 'true';
      
//       const images = wrapper.querySelectorAll(".project-image");

//       gsap.from(images, {
//         scrollTrigger: {
//           trigger: wrapper,
//           start: "top 70%",
//           markers: false,
//           once: true, // Only trigger once
//         },
//         yPercent: 100,
//         opacity: 0,
//         duration: 0.5,
//         ease: "power2.out",
//         stagger: 0.05,
//       });
//     });

//     gsap.utils.toArray(".image-projects-wrapper-big").forEach((wrapper) => {
//       // Check if already animated
//       if (wrapper.dataset.animated) return;
//       wrapper.dataset.animated = 'true';
      
//       const images = wrapper.querySelectorAll(".project-image-big");

//       gsap.from(images, {
//         scrollTrigger: {
//           trigger: wrapper,
//           start: "top 70%",
//           markers: false,
//           once: true, // Only trigger once
//         },
//         yPercent: 100,
//         opacity: 0,
//         duration: 0.5,
//         ease: "power2.out",
//         stagger: 0.05,
//       });
//     });

//     gsap.utils.toArray(".product-videos").forEach((wrapper) => {
//       // Check if already animated
//       if (wrapper.dataset.animated) return;
//       wrapper.dataset.animated = 'true';
      
//       const vids = wrapper.querySelectorAll(".video-iframe");

//       gsap.set(vids, {
//         opacity: 0,
//         yPercent: 100,
//       });

//       gsap.to(vids, {
//         scrollTrigger: {
//           trigger: wrapper,
//           start: "top 70%",
//           once: true, // Only trigger once
//         },
//         yPercent: 0,
//         opacity: 1,
//         duration: 0.6,
//         ease: "power2.out",
//         stagger: 0.1,
//       });
//     });

//     // const testimonalTL = gsap.timeline({
//     //   scrollTrigger: {
//     //     trigger: ".section_project_highlights",
//     //     start: "top 50%",
//     //     scrub: false,
//     //     markers: false,
//     //   },
//     // });

//     // testimonalTL.from(
//     //   ".feedback_wrapper .text-size-large.text-color-white.text-weight-semibold",
//     //   {
//     //     yPercent: 100,
//     //     opacity: 0,
//     //     duration: 0.5,
//     //     ease: "power2.out",
//     //   },
//     // );

//     // testimonalTL.from(".feedback_wrapper h1", {
//     //   yPercent: 100,
//     //   opacity: 0,
//     //   duration: 0.5,
//     //   ease: "power2.out",
//     // });

//     // testimonalTL.from(".feedback_wrapper .button-group.is-center", {
//     //   yPercent: 100,
//     //   opacity: 0,
//     //   duration: 0.5,
//     //   ease: "power2.out",
//     // });
//   });
// }
