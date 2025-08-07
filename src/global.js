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
    // Check if device is mobile (you can adjust this breakpoint)
    const isMobile = window.innerWidth <= 768;
    
    // Define responsive values
    const responsiveValues = {
      desktop: {
        yPercent: -200,
        xPercent: (index) => (index % 2 === 0 ? 35 : -35),
        scale: 1.25,
        rotation: (index) => (index % 2 === 0 ? 15 : -15),
        finalYPercent: -200,
        finalXPercent: (index) => (index % 2 === 0 ? 50 : -50),
        finalRotation: (index) => (index % 2 === 0 ? 25 : -25),
        finalScale: 1.1,
        stagger: { each: 1.8, from: "start" }
      },
      mobile: {
        yPercent: -200,
        xPercent: (index) => (index % 2 === 0 ? 20 : -20),
        scale: 1.15,
        rotation: (index) => (index % 2 === 0 ? 10 : -10),
        finalYPercent: -200,
        finalXPercent: (index) => (index % 2 === 0 ? 30 : -30),
        finalRotation: (index) => (index % 2 === 0 ? 15 : -15),
        finalScale: 1.05,
        stagger: { each: 1.2, from: "start" }
      }
    };
    
    const values = isMobile ? responsiveValues.mobile : responsiveValues.desktop;
    
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
        if (index === 0) return isMobile ? -5 : -8;
        if (index === 1) return isMobile ? 3 : 5;
        return 0;
      },
    });
  
    tl.to(".features-card", {
      duration: 0.5,
    })
      .to(".features-card", {
        yPercent: values.yPercent,
        xPercent: values.xPercent,
        scale: values.scale,
        rotation: values.rotation,
        duration: 1.8,
        ease: "power2.out",
        stagger: values.stagger,
      })
      .to(
        ".features-card",
        {
          opacity: 0,
          yPercent: values.finalYPercent,
          xPercent: values.finalXPercent,
          rotation: values.finalRotation,
          scale: values.finalScale,
          duration: 0.8,
          ease: "power1.in",
          stagger: values.stagger,
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
