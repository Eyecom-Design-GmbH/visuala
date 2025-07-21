import "./typewriter.js";
import "./marquee.js";
import "./text-reveal.js";

document.addEventListener("DOMContentLoaded", function () {
  const items = document.querySelectorAll(".testimonial_item");

  items.forEach((item, index) => {
    const card = item.querySelector(".testimonial_card");
    card.style.position = "sticky";
    card.style.top = 3 + index * 2 + "rem";
    card.style.marginTop = 3 + index * 2 + "rem";
    card.style.zIndex = 30 - index;
  });

  if (document.querySelector(".team-marquee")) {
    createInfiniteMarquee(".team-marquee", {
      speed: 50,
      direction: "left",
      pauseOnHover: false,
      gap: 0,
      duplicateContent: true,
      smooth: true,
      preserveStyles: true,
    });
  }

  // Konfiguration für die Projekte-Sektion
  const projekteConfig = {
    id: "#teamtitle",
    leftTitle: {
      triggerStart: "top bottom",
      triggerEnd: "top 50%",
      blur: 5,
      duration: 0.7,
    },
    rightTitle: {
      triggerStart: "top 50%",
      triggerEnd: "top top",
      blur: 20,
      duration: 1.2,
    },
    // Spezielle Selektoren für die Projekte-Sektion
    leftSelector: ".angebot_display-heading-left-2",
    rightSelector: ".angebot_display-heading-right-2",
  };

  // Animation für die Projekte-Sektion anwenden
  const projekteSection = document.querySelector(projekteConfig.id);

  if (projekteSection) {
    // Linker Titel "UNSERE"
    const leftHeading = projekteSection.querySelector(projekteConfig.leftSelector);
    if (leftHeading) {
      createTitleAnimation(leftHeading, {
        direction: "left",
        trigger: "scrub",
        triggerElement: projekteSection,
        triggerStart: projekteConfig.leftTitle.triggerStart,
        triggerEnd: projekteConfig.leftTitle.triggerEnd,
        distance: "100vw",
        scale: 2.5,
        opacity: 0,
        blur: projekteConfig.leftTitle.blur,
        duration: projekteConfig.leftTitle.duration,
        ease: "power2.out",
      });
    }

    // Rechter Titel "PROJEKTE"
    const rightHeading = projekteSection.querySelector(projekteConfig.rightSelector);
    if (rightHeading) {
      createTitleAnimation(rightHeading, {
        direction: "right",
        trigger: "scrub",
        triggerElement: projekteSection,
        triggerStart: projekteConfig.rightTitle.triggerStart,
        triggerEnd: projekteConfig.rightTitle.triggerEnd,
        distance: "100vw",
        scale: 2.5,
        opacity: 0,
        blur: projekteConfig.rightTitle.blur,
        duration: projekteConfig.rightTitle.duration,
        ease: "power2.out",
      });
    }
  }
});
