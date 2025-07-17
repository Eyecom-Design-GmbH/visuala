document.addEventListener('DOMContentLoaded', function () {

  gsap.registerPlugin(ScrollTrigger);

  // ===== PROJECTS COLUMN FLYING ANIMATION WITH SCROLL SCRUB =====
  // Check if the project columns exist on this page
  if (document.querySelector('.work_left') && document.querySelector('.work_right')) {

    // Create timeline for projects animation
    let projectsTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.work_wrap',
        start: 'top bottom',     // Start when section enters viewport
        end: 'top 20%',          // End when section is mostly in view
        scrub: 1.5,              // Smooth scrubbing tied to scroll
        toggleActions: 'play none none reverse'
      }
    });

    // Set initial state for entire columns to be off-screen and scaled
    gsap.set('.work_left', {
      x: '-100vw',
      scale: 2.5,
      opacity: 0,
      filter: 'blur(20px)'
    });

    gsap.set('.work_right', {
      x: '100vw',
      scale: 2.5,
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

  //===== PROJECT TITLES ANIMATION =====



    // const fimageTl = gsap.timeline();

    // fimageTl.fromTo(".is-feature-img", {
    //   opacity: 0,
    //   yPercent: 100
    // }, {
    //   opacity: 1,
    //   yPercent: 0,
    //   duration: 0.7,
    //   ease: "power2.inOut"
    // });

    // fimageTl.to(".is-feature-img", {
    //   y: -20,              
    //   duration: 1.5,       
    //   ease: "sine.inOut",  
    //   repeat: -1,          
    //   yoyo: true           
    // });

});