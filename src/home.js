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
  // Konfiguration für die Team-Sektion
const projectConfig = {
  id: "#project-section", // Korrekte ID für die Team-Sektion
  leftTitle: {
    triggerStart: "top bottom",
    triggerEnd: "top 70%",
    blur: 5,
    duration: 0.7,
  },
  rightTitle: {
    triggerStart: "top 70%",
    triggerEnd: "top top",
    blur: 20,
    duration: 1.2,
  },
  // Standard-Selektoren (ohne -2 Suffix)
  leftSelector: ".angebot_display-heading-left",
  rightSelector: ".angebot_display-heading-right",
};

// Animation für die Team-Sektion anwenden
const projectSection = document.querySelector(projectConfig.id);

if (projectSection) {
  // Linker Titel "Die Visuala"
  const leftHeading = projectSection.querySelector(projectConfig.leftSelector);
  if (leftHeading) {
    createTitleAnimation(leftHeading, {
      direction: "left",
      trigger: "scrub",
      triggerElement: projectSection,
      triggerStart: projectConfig.leftTitle.triggerStart,
      triggerEnd: projectConfig.leftTitle.triggerEnd,
      distance: "100vw",
      scale: 2.5,
      opacity: 0,
      blur: projectConfig.leftTitle.blur,
      duration: projectConfig.leftTitle.duration,
      ease: "power2.out",
    });
  }

  // Rechter Titel "Teampower"
  const rightHeading = projectSection.querySelector(projectConfig.rightSelector);
  if (rightHeading) {
    createTitleAnimation(rightHeading, {
      direction: "right",
      trigger: "scrub",
      triggerElement: projectSection,
      triggerStart: projectConfig.rightTitle.triggerStart,
      triggerEnd: projectConfig.rightTitle.triggerEnd,
      distance: "100vw",
      scale: 2.5,
      opacity: 0,
      blur: projectConfig.rightTitle.blur,
      duration: projectConfig.rightTitle.duration,
      ease: "power2.out",
    });
  }
}

if (document.querySelector(".work_mobile")) {
  const mobileCards = document.querySelectorAll(".work_mobile .card-row4_card");

  if (mobileCards.length > 0) {
    gsap.set(mobileCards, {
      yPercent: 100,
      opacity: 0
    });

    mobileCards.forEach((card, index) => {
      let hasAnimated = false;

      ScrollTrigger.create({
        trigger: card,
        start: "top bottom",
        end: "top top",
        onEnter: () => {
          if (!hasAnimated) {
            gsap.to(card, {
              yPercent: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
              //delay: index * 0.1
            });
            hasAnimated = true;
          }
        },

      });
    });
  }
}

});
