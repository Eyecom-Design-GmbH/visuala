import "./marquee.js";
import "./call-embed.js";

// Mobile performance detection
const isMobile = (() => {
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    "mobile",
    "android",
    "iphone",
    "ipad",
    "ipod",
    "blackberry",
    "windows phone",
  ];
  const isMobileUserAgent = mobileKeywords.some((keyword) =>
    userAgent.includes(keyword),
  );
  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768;
  return isMobileUserAgent || (isTouchDevice && isSmallScreen);
})();

const PERFORMANCE_CONFIG = {
  reducedAnimations: isMobile,
  disableBlur: isMobile,
  simplifyTypewriter: isMobile,
};

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

document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(
    ScrollTrigger,
    Draggable,
    InertiaPlugin,
    ScrambleTextPlugin,
    SplitText,
  );

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

  createInfiniteMarquee(".team-marquee", {
    speed: 50,
    direction: "left",
    pauseOnHover: false,
    gap: 0,
    duplicateContent: true,
    smooth: true,
    preserveStyles: true,
  });
});
