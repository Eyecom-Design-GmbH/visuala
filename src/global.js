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

  if (document.querySelector(".section-features")) {
    const cards = document.querySelectorAll(".features-card");
    const cardArray = gsap.utils.toArray(".features-card");
    const navbarHeight = document.querySelector(".navbar-fixed_component")?.offsetHeight || 0;
  
    gsap.matchMedia()
      .add("(min-width: 768px)", () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".features-wrapper",
            pin: true,
            scrub: 0,
            start: "center center",
            // Use a more predictable end calculation
            end: () => `+=${cards.length * window.innerHeight * 0.8}`,
            invalidateOnRefresh: true,
            // Add these for better compatibility
            anticipatePin: 1,
            refreshPriority: -1
          }
        });
  
        // Set initial positions - stacked with different rotations
        cardArray.forEach((card, index) => {
          gsap.set(card, {
            clearProps: "transform",
            opacity: 1,
            x: "0%",
            y: "0%",
            rotation: index === 0 ? -8 : index === 1 ? 5 : 0,
            zIndex: cardArray.length - index
          });
        });
  
        // Animate all cards with better timing
        cardArray.forEach((card, index) => {
          timeline.to(cardArray[index], {
            x: "0%",
            y: "-150vh",
            rotation: -90,
            ease: "none"
          }, index * 0.15); // More consistent spacing
        });
      })
      .add("(max-width: 767px)", () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".features-wrapper",
            pin: true,
            scrub: 0,
            start: `top top+=${navbarHeight + 10}px`,
            // Simplified mobile end calculation
            end: () => `+=${cards.length * window.innerHeight * 1.2}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            refreshPriority: -1
          }
        });
  
        // Set initial positions for mobile
        cardArray.forEach((card, index) => {
          gsap.set(card, {
            clearProps: "transform",
            opacity: 1,
            x: "0%",
            y: "50%",
            rotation: index === 0 ? -5 : index === 1 ? 3 : 0,
            zIndex: cardArray.length - index
          });
        });
  
        cardArray.forEach((card, index) => {
          timeline.to(cardArray[index], {
            x: "0%",
            y: "-150vh",
            rotation: -90,
            ease: "none"
          }, index * 0.15);
        });
  
        // Add final pause more predictably
        timeline.to({}, { duration: 0.3 });
      });
  }
  ScrollTrigger.refresh()

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

  ScrollTrigger.refresh()
});