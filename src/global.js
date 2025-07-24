import "./typewriter.js";
import barba from "@barba/core";

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
      '[anim-element="typewriter"]',
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
  document
    .querySelectorAll('[animation-element="text-fade-in"]')
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

  // setupBarbaTransitions();
  // setupHamburgerMenu();



  if (document.querySelector(".client-logos")) {
    gsap.from(".client-logos_item", {
      scrollTrigger: {
        trigger: ".client-logos",
        start: "top 80%",
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
            start: "top 70%",
            markers: false,
          },
          yPercent: 100,
          opacity: 0,
          duration: 0.5,
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
            start: "top 70%",
            markers: false,
          },
          yPercent: 100,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.05,
        });
      });
    }
  }

  if (document.querySelector(".section-features")) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".section-features",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        toggleActions: "restart none reverse",
        pin: ".features-wrapper",
      },
    });
  
    gsap.set(".features-card", {
      opacity: 1,
      yPercent: 0,
      xPercent: 0,
      scale: 1,
      rotation: (index) => {
        if (index === 0) return -8;
        if (index === 1) return 5;
        return 0;
      },
    });
  
    tl.to(".features-card", {
      duration: 0.5,
    })
      .to(".features-card", {
        yPercent: -130,
        xPercent: (index) => (index % 2 === 0 ? 35 : -35),
        scale: 1.25,
        rotation: (index) => (index % 2 === 0 ? 15 : -15),
        duration: 1.8,
        ease: "power2.out",
        stagger: { each: 1.8, from: "start" },
      })
      .to(
        ".features-card",
        {
          opacity: 0,
          yPercent: -150,
          xPercent: (index) => (index % 2 === 0 ? 50 : -50),
          rotation: (index) => (index % 2 === 0 ? 25 : -25),
          scale: 1.1,
          duration: 0.8,
          ease: "power1.in",
          stagger: { each: 1.8, from: "start" },
        },
        "-=0.5",
      ); 
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

// function updateActiveLink() {
//   const currentPath = window.location.pathname;
//   const links = document.querySelectorAll(".navmenu_sub-link");

//   links.forEach((link) => link.classList.remove("w--current"));

//   const routeMapping = {
//     "/angebot": "/angebot",
//     "/projekte": "/projekte",
//     "/agentur": "/agentur",
//     "/kontakt": "/kontakt",
//     "/agb": "/agb",
//     "/impressum": "/impressum",
//     "/datenschutz": "/datenschutz",
//     "/projectdetail": "/projectdetail",
//   };

//   const targetPath = routeMapping[currentPath] || currentPath;
//   const activeLink = document.querySelector(
//     `.navmenu_sub-link[href="${targetPath}"]`,
//   );

//   if (activeLink) {
//     activeLink.classList.add("w--current");
//   }
// }

// function closeHamburgerMenu() {
//   const hamburger = document.querySelector(".navbar_hamburger");
//   const mainNav = document.querySelector(".main-nav");

//   if (mainNav && getComputedStyle(mainNav).display !== "none") {
//     if (hamburger) {
//       hamburger.click();
//     }
//   }
// }

// function playMainTransition(data) {
//   const tl = gsap.timeline();

//   tl.to(data.current.container, {
//     opacity: 0,
//     y: "-12vh",
//     x: "12vw",
//     rotation: 4,
//     ease: "power4.out",
//     duration: 0.8,
//   })
//     .to(
//       data.current.container.closest(".page-wrapper"),
//       {
//         backgroundColor: "#d9d9ce",
//       },
//       "0",
//     )
//     .from(
//       data.next.container,
//       {
//         duration: 1,
//         y: "100vh",
//         x: "-50vw",
//         ease: "power4.out",
//         rotation: -4,
//       },
//       "0",
//     );

//   return tl;
// }

// function setupHamburgerMenu() {
//   const hamburger = document.querySelector(".navbar_hamburger");
//   const mainNav = document.querySelector(".main-nav");
//   const navClose = document.querySelector(".nav_close-button");

//   if (hamburger) {
//     hamburger.addEventListener("click", () => {
//       if (mainNav) {
//         const isVisible = getComputedStyle(mainNav).display !== "none";
//         if (isVisible) {
//           gsap.to(mainNav, {
//             opacity: 0,
//             duration: 0.3,
//             onComplete: () => {
//               mainNav.style.display = "none";
//             },
//           });
//         } else {
//           mainNav.style.display = "block";
//           gsap.fromTo(mainNav, { opacity: 0 }, { opacity: 1, duration: 0.3 });
//         }
//       }
//     });
//   }

//   if (navClose) {
//     navClose.addEventListener("click", () => {
//       if (mainNav) {
//         gsap.to(mainNav, {
//           opacity: 0,
//           duration: 0.3,
//           onComplete: () => {
//             mainNav.style.display = "none";
//           },
//         });
//       }
//     });
//   }

//   const mainNavLinks = document.querySelectorAll(
//     ".main-nav_level1-link, .main-nav_level2-link",
//   );
//   mainNavLinks.forEach((link) => {
//     link.addEventListener("click", (e) => {
//       const href = link.getAttribute("href");
//       if (href && href !== "#") {
//         e.preventDefault();
//         closeHamburgerMenu();

//         setTimeout(() => {
//           barba.go(href);
//         }, 100);
//       }
//     });
//   });
// }

// function setupBarbaTransitions() {
//   barba.hooks.before(() => {
//     closeHamburgerMenu();
//   });

//   barba.hooks.enter((data) => {
//     gsap.set(document.querySelector(".page-wrapper"), { overflow: "hidden" });
//     gsap.set(".navmenu_sub-link", { cursor: "progress" });
//     gsap.set(data.next.container, {
//       position: "fixed",
//       top: 0,
//       left: 0,
//       width: "100%",
//     });
//   });

//   barba.hooks.after(async (data) => {
//     gsap.set(data.next.container, { position: "relative" });
//     gsap.set(document.querySelector(".page-wrapper"), { overflow: "visible" });
//     window.scrollTo(0, 0);
//     gsap.set(".navmenu_sub-link", { cursor: "pointer" });
//     updateActiveLink();

//     setupHamburgerMenu();
//     await initializeAnimations();
//   });

//   barba.init({
//     preventRunning: true,
//     transitions: [
//       {
//         name: "main-transition",
//         sync: true,
//         enter: playMainTransition,
//       },
//       {
//         name: "home-transition",
//         to: { namespace: ["home"] },
//         enter: playMainTransition,
//       },
//       {
//         name: "agentur-transition",
//         to: { namespace: ["agentur"] },
//         enter: playMainTransition,
//       },
//       {
//         name: "agb-transition",
//         to: { namespace: ["agb"] },
//         enter: playMainTransition,
//       },
//       {
//         name: "projekte-transition",
//         to: { namespace: ["projekte"] },
//         enter: playMainTransition,
//       },
//       {
//         name: "projectdetail-transition",
//         to: { namespace: ["projectdetail"] },
//         enter: playMainTransition,
//       },
//       {
//         name: "angebot-transition",
//         to: { namespace: ["angebot"] },
//         enter: playMainTransition,
//       },
//       {
//         name: "impressum-transition",
//         to: { namespace: ["impressum"] },
//         enter: playMainTransition,
//       },
//       {
//         name: "kontakt-transition",
//         to: { namespace: ["kontakt"] },
//         enter: playMainTransition,
//       },
//     ],
//   });
// }

// window.addEventListener("resize", () => {
//   if (window.innerWidth > 991) {
//     const mainNav = document.querySelector(".main-nav");
//     if (mainNav && getComputedStyle(mainNav).display !== "none") {
//       mainNav.style.display = "none";
//     }
//   }
// });
