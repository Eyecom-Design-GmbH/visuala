import "./typewriter.js";
// Font loading utility
function waitForFonts() {
  return new Promise((resolve) => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        resolve();
      });
    } else {
      setTimeout(() => {
        resolve();
      }, 100);
    }
  });
}

// Initialize animations after fonts are loaded
async function initializeAnimations() {
  await waitForFonts();

  if (window.createTypewriter) {
    const typewriterElements = document.querySelectorAll(
      '[anim-element="typewriter"]'
    );

    typewriterElements.forEach((element, index) => {
      const wordsData = element.getAttribute("anim-words");
      if (!wordsData) {
        console.warn(
          "Typewriter element missing anim-words attribute:",
          element,
        );
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

  // Text fading in animation on scroll
  document.querySelectorAll('[animation-element="text-fade-in"]')
    .forEach((el) => {
      const split = new SplitText(el, { type: "words,chars" });
      const totalChars = split.chars.length;
      const staggerTime = 1 / totalChars;

      gsap.fromTo(
        split.chars,
        { opacity: 0.1 },
        {
          opacity: 1,
          ease: "none",
          stagger: staggerTime,
          duration: 0.7,
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
            end: "top 20%",
            once: true,
          },
        },
      );
    });

  // // H1 animations
  // document.querySelectorAll("h1").forEach((h1) => {
  //   const split = new SplitText(h1, { type: "lines" });

  //   gsap.from(split.lines, {
  //     duration: 1.5,
  //     opacity: 0,
  //     x: -100,
  //     ease: "power2.inOut",
  //     stagger: 0.06,
  //     scrollTrigger: {
  //       trigger: h1,
  //       start: "top 70%",
  //     },
  //   });
  // });
}

document.addEventListener("DOMContentLoaded", async (event) => {
  await initializeAnimations();

  // setupHamburgerMenu();



  if (document.querySelector(".client-logos_list") && document.querySelector(".client-logos_item")) {
    gsap.from(".client-logos_item", {
      scrollTrigger: {
        trigger: ".client-logos_list",
        start: "top 70%",
      },
      yPercent: 100,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      stagger: 0.05,
    });
  }

  if (document.querySelector(".gallery7_grid-list")) {
    if (document.querySelector(".gallery7_image-wrapper")) {
      gsap.utils.toArray(".gallery7_grid-list").forEach((wrapper) => {
        const images = wrapper.querySelectorAll(".gallery7_image-wrapper");

        gsap.from(images, {
          scrollTrigger: {
            trigger: wrapper,
            start: "top 60%",
            markers: false,
          },
          yPercent: 100,
          opacity: 0,
          duration: 1.2,
          ease: "power2.out",
          stagger: 0.05,
        });
      });
    }

    if (document.querySelector(".gallery7_image-wrapper-large")) {
      gsap.utils.toArray(".gallery7_grid-list").forEach((wrapper) => {
        const images = wrapper.querySelectorAll(
          ".gallery7_image-wrapper-large",
        );

        gsap.from(images, {
          scrollTrigger: {
            trigger: wrapper,
            start: "top 60%",
            markers: false,
          },
          yPercent: 100,
          opacity: 0,
          duration: 1.2,
          ease: "power2.out",
          stagger: 0.05,
        });
      });
    }
  }

  if (document.querySelector(".section-features")) {
  

  const cards = document.querySelectorAll(".features-card");
  const cardArray = gsap.utils.toArray(".features-card");
  
  const navbarHeight = document.querySelector(".navbar-fixed_component")?.offsetHeight || 0;
  
  gsap.matchMedia().add("(min-width: 768px)", function() {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".features-wrapper",
        pin: true,
        scrub: 0,
        start: "center center",
        end: "top+=" + (document.querySelector(".features-card-wrapper").offsetHeight * cards.length + navbarHeight) + " top",
        invalidateOnRefresh: true
      }
    });
    
    // Set initial positions - stacked with different rotations
    cardArray.forEach(function(card, index) {
      gsap.set(card, {
        clearProps: "transform", // Clear any existing CSS transforms first
        opacity: 1,
        x: "0%",
        y: "0%",
        rotation: (() => {
          if (index === 0) return -8;
          if (index === 1) return 5;
          return 0;
        })(),
        zIndex: cardArray.length - index // Higher index cards appear on top
      });
    });
    
    // Animate ALL cards
    cardArray.forEach(function(card, index) {
      timeline.to(cardArray[index], {
        x: "0%", /* Keep centered horizontally */
        y: "-150vh", /* Move up by full viewport height */
        rotation: -90,
        ease: "none"
      }, index ? "+=0.2" : "");
    });
  })
  
  .add("(max-width: 767px)", function() {
    // Similar changes for mobile...
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".features-wrapper",
        pin: true,
        scrub: 0,
        start: `top top+=${navbarHeight + 10}px`,
        end: "top+=" + (document.querySelector(".features-card-wrapper").offsetHeight * cards.length * 6 + navbarHeight + window.innerHeight) + " top",
        invalidateOnRefresh: true
      }
    });
    
    // Set initial positions for mobile - stacked with different rotations
    cardArray.forEach(function(card, index) {
      gsap.set(card, {
        clearProps: "transform", // Clear any existing CSS transforms first
        opacity: 1,
        x: "0%",
        y: "50%",
        rotation: (() => {
          if (index === 0) return -5;
          if (index === 1) return 3;
          return 0;
        })(),
        zIndex: cardArray.length - index // Higher index cards appear on top
      });
    });
    
    cardArray.forEach(function(card, index) {
      timeline.to(cardArray[index], {
        x: "0%",
        y: "-150vh",
        rotation: -90,
        ease: "none"
      }, index ? "+=0.2" : "");
        // Add pause after the last card
      if (index === cardArray.length - 1) {
        timeline.to({}, { duration: 1 }); // 1 second pause - adjust as needed
      }
    });
  });
  }

  
});

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
  },
);

let scrollPositionWhenShown = 0;

ScrollTrigger.create({
  start: "top top",
  end: "max",
  markers: false,
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
