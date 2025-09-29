import "./marquee.js";
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
});
