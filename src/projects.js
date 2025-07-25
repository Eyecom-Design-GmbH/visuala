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

  if (document.querySelector(".project_item.is-project-list")) {
    // Desktop project cards
    gsap.utils.toArray(".project_list.is-project").forEach((wrapper) => {
      const cards = wrapper.querySelectorAll(".project_item.is-project-list");
      
      cards.forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 50%",
            markers: true,
          },
          yPercent: 100,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        });
      });
    });
  
    // // Mobile project cards
    // gsap.utils.toArray(".project_list:not(.is-project)").forEach((wrapper) => {
    //   const cards = wrapper.querySelectorAll(".card-row4_card");
      
    //   cards.forEach((card, index) => {
    //     gsap.from(card, {
    //       scrollTrigger: {
    //         trigger: card,
    //         start: "top 50%",
    //         markers: false,
    //       },
    //       yPercent: 100,
    //       opacity: 0,
    //       duration: 0.6,
    //       ease: "power2.out",
    //       delay: index * 0.1, // Stagger delay within this section
    //     });
    //   });
    // });
  }
  
});
