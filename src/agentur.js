import "./typewriter.js";
import "./marquee.js";
import "./title-animations.js";
import "./call-embed.js";


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

  // Konfiguration für die Team-Sektion
const teamConfig = {
  id: "#teamtitle", // Korrekte ID für die Team-Sektion
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
  // Standard-Selektoren (ohne -2 Suffix)
  leftSelector: ".angebot_display-heading-left",
  rightSelector: ".angebot_display-heading-right",
};

// Animation für die Team-Sektion anwenden
const teamSection = document.querySelector(teamConfig.id);

if (teamSection) {
  // Linker Titel "Die Visuala"
  const leftHeading = teamSection.querySelector(teamConfig.leftSelector);
  if (leftHeading) {
    createTitleAnimation(leftHeading, {
      direction: "left",
      trigger: "scrub",
      triggerElement: teamSection,
      triggerStart: teamConfig.leftTitle.triggerStart,
      triggerEnd: teamConfig.leftTitle.triggerEnd,
      distance: "100vw",
      scale: 2.5,
      opacity: 0,
      blur: teamConfig.leftTitle.blur,
      duration: teamConfig.leftTitle.duration,
      ease: "power2.out",
    });
  }

  // Rechter Titel "Teampower"
  const rightHeading = teamSection.querySelector(teamConfig.rightSelector);
  if (rightHeading) {
    createTitleAnimation(rightHeading, {
      direction: "right",
      trigger: "scrub",
      triggerElement: teamSection,
      triggerStart: teamConfig.rightTitle.triggerStart,
      triggerEnd: teamConfig.rightTitle.triggerEnd,
      distance: "100vw",
      scale: 2.5,
      opacity: 0,
      blur: teamConfig.rightTitle.blur,
      duration: teamConfig.rightTitle.duration,
      ease: "power2.out",
    });
  }
}
});
