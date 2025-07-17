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
