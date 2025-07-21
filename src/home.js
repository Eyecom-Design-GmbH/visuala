import "./marquee.js";
import "./call-embed.js";
import "./title-animations.js";



document.addEventListener("DOMContentLoaded", function () {

  // Projects column flying animation with scroll scrub
  if (
    document.querySelector(".work_left") &&
    document.querySelector(".work_right")
  ) {
    const projectsTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".work_wrap",
        start: "top 70%",
        end: "top 20%",
        scrub: 1.5,
        toggleActions: "play none none reverse",
      },
    });

    gsap.set(".work_left", {
      x: "-100vw",
      scale: 2,
      opacity: 0,
      filter: "blur(20px)",
    });

    gsap.set(".work_right", {
      x: "100vw",
      scale: 2,
      opacity: 0,
      filter: "blur(20px)",
    });

    projectsTl
      .to(".work_left", {
        x: 0,
        scale: 1,
        opacity: 1,
        duration: 1,
        filter: "blur(0px)",
        ease: "power2.out",
      })
      .to(
        ".work_right",
        {
          x: 0,
          scale: 1,
          opacity: 1,
          duration: 1,
          filter: "blur(0px)",
          ease: "power2.out",
        },
        "-=0.8",
      );
  }

  createInfiniteMarquee(".team-marquee", {
    speed: 50,
    direction: "left",
    pauseOnHover: false,
    gap: 0,
    duplicateContent: true,
    smooth: true,
    preserveStyles: true,
  });

  const leftHeading = section.querySelector(
    ".angebot_display-heading-left",
  );
  if (leftHeading) {
    createTitleAnimation(leftHeading, {
      direction: "left",
      trigger: "scrub",
      triggerElement: leftHeading,
      triggerStart: "top bottom",
      triggerEnd: "top 50%",
      distance: "100vw",
      scale: 2.5,
      opacity: 0,
      blur: 5,
      duration: 0.7,
      ease: "power2.out",
    });
  }

  const rightHeading = section.querySelector(
    ".angebot_display-heading-right",
  );
  if (rightHeading) {
    createTitleAnimation(rightHeading, {
      direction: "right",
      trigger: "scrub",
      triggerElement: rightHeading,
      triggerStart: "top 50%",
      triggerEnd: "top top",
      distance: "100vw",
      scale: 2.5,
      opacity: 0,
      blur: 20,
      duration: 1.2,
      ease: "power2.out",
    });
  }
});
