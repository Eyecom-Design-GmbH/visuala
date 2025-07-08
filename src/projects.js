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

      // Check if the project columns exist on this page
      if (document.querySelector('.work_left') && document.querySelector('.work_right')) {

        // Create timeline for projects animation
        let projectsTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.work_wrap',
                start: 'top 70%',     // Start when section enters viewport
                end: 'top 20%',          // End when section is mostly in view
                scrub: 1.5,              // Smooth scrubbing tied to scroll
                toggleActions: 'play none none reverse'
            }
        });

        // Set initial state for entire columns to be off-screen and huge
        gsap.set('.work_left', {
            x: '-100vw',
            scale: 2,
            opacity: 0,
            filter: 'blur(20px)'

        });

        gsap.set('.work_right', {
            x: '100vw',
            scale: 2,
            opacity: 0,
            filter: 'blur(20px)'

        });

        // Add animations to timeline
        projectsTl
            // Animate left column
            .to('.work_left', {
                x: 0,
                scale: 1,
                opacity: 1,
                duration: 1,
                filter: 'blur(0px)',
                ease: "power2.out"
            })
            // Animate right column with slight overlap
            .to('.work_right', {
                x: 0,
                scale: 1,
                opacity: 1,
                duration: 1,
                filter: 'blur(0px)',
                ease: "power2.out"
            }, "-=0.8"); // Start 0.8s before left column finishes
    }

    // ===== PROJECTS COLUMN FLYING ANIMATION WITH SCROLL SCRUB =====

    // Check if the project columns exist on this page
    if (document.querySelector('.work_left') && document.querySelector('.work_right')) {

        // Create timeline for projects animation
        let projectsTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.work_wrap',
                start: 'top bottom',     // Start when section enters viewport
                end: 'top 20%',          // End when section is mostly in view
                scrub: 1.5               // Smooth scrubbing tied to scroll
            }
        });

        // Set initial state for entire columns to be off-screen and huge
        gsap.set('.work_left', {
            x: '-100vw',
            scale: 3,
            opacity: 0
        });

        gsap.set('.work_right', {
            x: '100vw',
            scale: 3,
            opacity: 0
        });

        // Add animations to timeline
        projectsTl
            // Animate left column
            .to('.work_left', {
                x: 0,
                scale: 1,
                opacity: 1,
                duration: 1,
                ease: "power2.out"
            })
            // Animate right column with slight overlap
            .to('.work_right', {
                x: 0,
                scale: 1,
                opacity: 1,
                duration: 1,
                ease: "power2.out"
            }, "-=0.8"); // Start 0.8s before left column finishes
    }

    // ===== PROJECT TITLES ANIMATION =====

  
});