import "./typewriter.js";

document.addEventListener("DOMContentLoaded", () => {
  
  // Typewriter animations
  if (window.createTypewriter) {
    const typewriterElements = document.querySelectorAll('[anim-element="typewriter"]');
    
    typewriterElements.forEach((element, index) => {
      const wordsData = element.getAttribute("anim-words");
      if (!wordsData) {
        console.warn("Typewriter element missing anim-words attribute:", element);
        return;
      }

      const words = wordsData.split(",").map((word) => word.trim());

      if (!element.id) {
        element.id = `typewriter-${Date.now()}-${index}`;
      }

      const config = {
        typeSpeed: 0.06,
        deleteSpeed: 0.03,
        pauseTime: 1.2,
        cursor: true,
        cursorWidth: "1px",
        cursorColor: "#f2f200",
        naturalVariation: false,
        blurEffect: false,
        loop: true,
        ease: "power2.out",
      };

      createTypewriter(`#${element.id}`, words, config);
    });
  }

  // Navbar show/hide animation
  const showAnim = gsap.fromTo(
    ".navbar-fixed_component",
    {
      yPercent: -100,
      opacity: 0,
      display: "none",
    },
    {
      yPercent: 0,
      opacity: 1,
      paused: true,
      duration: 0.2,
      display: "flex",
    }
  );

  let scrollPositionWhenShown = 0;

  ScrollTrigger.create({
    start: "top top",
    end: "max",
    onUpdate: (self) => {
      const mainNav = document.querySelector(".padding-navbar");
      const mainNavRect = mainNav.getBoundingClientRect();
      const mainNavCompletelyGone = mainNavRect.bottom < 0;

      if (!mainNavCompletelyGone && showAnim.progress() > 0) {
        showAnim.reverse();
      } else if (
        self.direction === -1 &&
        mainNavCompletelyGone &&
        showAnim.progress() === 0
      ) {
        scrollPositionWhenShown = window.pageYOffset;
        showAnim.play();
      } else if (
        self.direction === 1 &&
        showAnim.progress() === 1 &&
        mainNavCompletelyGone
      ) {
        const scrollOffset = window.pageYOffset - scrollPositionWhenShown;
        const hideThreshold = 5;

        if (scrollOffset > hideThreshold) {
          showAnim.reverse();
        }
      }
    },
  });
});