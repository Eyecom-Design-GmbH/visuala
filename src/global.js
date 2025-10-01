// import "./typewriter.js";

// document.addEventListener("DOMContentLoaded", () => {
  
//   // Typewriter animations
//   if (window.createTypewriter) {
//     const typewriterElements = document.querySelectorAll('[anim-element="typewriter"]');
    
//     typewriterElements.forEach((element, index) => {
//       const wordsData = element.getAttribute("anim-words");
//       if (!wordsData) {
//         console.warn("Typewriter element missing anim-words attribute:", element);
//         return;
//       }

//       const words = wordsData.split(",").map((word) => word.trim());

//       if (!element.id) {
//         element.id = `typewriter-${Date.now()}-${index}`;
//       }

//       const config = {
//         typeSpeed: 0.06,
//         deleteSpeed: 0.03,
//         pauseTime: 1.2,
//         cursor: true,
//         cursorWidth: "1px",
//         cursorColor: "#f2f200",
//         naturalVariation: false,
//         blurEffect: false,
//         loop: true,
//         ease: "power2.out",
//       };

//       createTypewriter(`#${element.id}`, words, config);
//     });
//   }

//   // Navbar show/hide animation
//   const showAnim = gsap.fromTo(
//     ".navbar-fixed_component",
//     {
//       yPercent: -100,
//       opacity: 0,
//       display: "none",
//     },
//     {
//       yPercent: 0,
//       opacity: 1,
//       paused: true,
//       duration: 0.2,
//       display: "flex",
//     }
//   );

//   let scrollPositionWhenShown = 0;

//   ScrollTrigger.create({
//     start: "top top",
//     end: "max",
//     onUpdate: (self) => {
//       const mainNav = document.querySelector(".padding-navbar");
//       const mainNavRect = mainNav.getBoundingClientRect();
//       const mainNavCompletelyGone = mainNavRect.bottom < 0;

//       if (!mainNavCompletelyGone && showAnim.progress() > 0) {
//         showAnim.reverse();
//       } else if (
//         self.direction === -1 &&
//         mainNavCompletelyGone &&
//         showAnim.progress() === 0
//       ) {
//         scrollPositionWhenShown = window.pageYOffset;
//         showAnim.play();
//       } else if (
//         self.direction === 1 &&
//         showAnim.progress() === 1 &&
//         mainNavCompletelyGone
//       ) {
//         const scrollOffset = window.pageYOffset - scrollPositionWhenShown;
//         const hideThreshold = 5;

//         if (scrollOffset > hideThreshold) {
//           showAnim.reverse();
//         }
//       }
//     },
//   });

//   ScrollTrigger.refresh()
// });


import "./typewriter.js";

document.addEventListener("DOMContentLoaded", () => {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  // 1. TYPEWRITER - In Safari deaktivieren oder stark vereinfachen
  if (window.createTypewriter && !isSafari) {
    const typewriterElements = document.querySelectorAll('[anim-element="typewriter"]');
    
    typewriterElements.forEach((element, index) => {
      const wordsData = element.getAttribute("anim-words");
      if (!wordsData) return;

      const words = wordsData.split(",").map((word) => word.trim());

      if (!element.id) {
        element.id = `typewriter-${Date.now()}-${index}`;
      }

      const config = {
        typeSpeed: isSafari ? 0.15 : 0.06, // Langsamer in Safari
        deleteSpeed: isSafari ? 0.1 : 0.03,
        pauseTime: isSafari ? 2 : 1.2,
        cursor: !isSafari, // Kein Cursor in Safari
        cursorWidth: "1px",
        cursorColor: "#f2f200",
        naturalVariation: false,
        blurEffect: false,
        loop: !isSafari, // Kein Loop in Safari
        ease: "power1.out", // Einfacheres Easing
      };

      createTypewriter(`#${element.id}`, words, config);
    });
  } else if (isSafari) {
    // Safari: Zeige nur erstes Wort statisch
    const typewriterElements = document.querySelectorAll('[anim-element="typewriter"]');
    typewriterElements.forEach((element) => {
      const wordsData = element.getAttribute("anim-words");
      if (wordsData) {
        const firstWord = wordsData.split(",")[0].trim();
        element.textContent = firstWord;
      }
    });
  }

  // 2. NAVBAR - Optimiert mit Throttle
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
      duration: isSafari ? 0.15 : 0.2,
      display: "flex",
      ease: "power1.out",
    }
  );

  let scrollPositionWhenShown = 0;
  let lastScrollTime = 0;
  const throttleDelay = isSafari ? 100 : 50; // Throttle in Safari

  ScrollTrigger.create({
    start: "top top",
    end: "max",
    onUpdate: (self) => {
      const now = Date.now();
      if (now - lastScrollTime < throttleDelay) return;
      lastScrollTime = now;

      const mainNav = document.querySelector(".padding-navbar");
      if (!mainNav) return;
      
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
        const hideThreshold = isSafari ? 10 : 5;

        if (scrollOffset > hideThreshold) {
          showAnim.reverse();
        }
      }
    },
  });

  ScrollTrigger.refresh();
});