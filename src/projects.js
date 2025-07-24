document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  if (
    document.querySelector(".work_left") &&
    document.querySelector(".work_right")
  ) {
    const projectsTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".work_wrap",
        start: "top bottom",
        end: "top 20%",
        scrub: 1.5,
        toggleActions: "play none none reverse",
      },
    });

    gsap.set(".work_left", {
      x: "-100vw",
      scale: 2.5,
      opacity: 0,
      filter: "blur(20px)",
    });

    gsap.set(".work_right", {
      x: "100vw",
      scale: 2.5,
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

  if (document.querySelector(".card-row4_card")) {
    gsap.utils.toArray(".card-row4_card").forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          markers: true,
        },
        yPercent: 100,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    });
  }
});
