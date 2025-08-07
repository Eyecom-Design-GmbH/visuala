import "./title-animations.js";
import "./call-embed.js";


$(document).ready(function () {
  const circularTextElements = document.querySelectorAll(".circular-text");
  if (circularTextElements.length > 0) {
    circularTextElements.forEach((element) => {
      if (element && element.innerHTML) {
        try {
          new CircleType(element);
        } catch (error) {
          console.warn("Failed to initialize CircleType for element:", element);
        }
      }
    });
  }

  const sectionConfigs = [
    {
      id: "#branding-design",
      leftTitle: {
        triggerStart: "top bottom",
        triggerEnd: "top 50%",
        blur: 5,
        duration: 0.7,
      },
      rightTitle: {
        triggerStart: "top bottom",
        triggerEnd: "top 50%",
        blur: 20,
        duration: 1.2,
      },
    },
    {
      id: "#webseiten-digital",
      leftTitle: {
        triggerStart: "top bottom",
        triggerEnd: "top 50%",
        blur: 5,
        duration: 0.7,
      },
      rightTitle: {
        triggerStart: "top bottom",
        triggerEnd: "top 50%",
        blur: 20,
        markers: true,
        duration: 1.2,
      },
    },
    {
      id: "#digital-marketing",
      leftTitle: {
        triggerStart: "top bottom",
        triggerEnd: "top 50%",
        blur: 5,
        duration: 0.7,
      },
      rightTitle: {
        triggerStart: "top bottom",
        triggerEnd: "top 50%",
        blur: 20,
        duration: 1.2,
      },
    },
    {
      id: "#fotografie-video",
      leftTitle: {
        triggerStart: "top bottom",
        triggerEnd: "top 50%",
        blur: 5,
        duration: 0.7,
      },
      rightTitle: {
        triggerStart: "top bottom",
        triggerEnd: "top 50%",
        blur: 20,
        duration: 1.2,
      },
    },
  ];

  sectionConfigs.forEach((config) => {
    const section = document.querySelector(config.id);

    if (section) {

      const leftHeading = section.querySelector(
        ".angebot_display-heading-left",
      );
      if (leftHeading) {
        createTitleAnimation(leftHeading, {
          direction: "left",
          trigger: "scrub",
          triggerElement: section,
          triggerStart: config.leftTitle.triggerStart,
          triggerEnd: config.leftTitle.triggerEnd,
          distance: "100vw",
          scale: 2.5,
          opacity: 0,
          blur: config.leftTitle.blur,
          duration: config.leftTitle.duration,
          ease: "power2.out",
        });
      }

      const rightHeading = section.querySelector(
        ".angebot_display-heading-right",
      );
      if (rightHeading) {
        createTitleAnimation(rightHeading, {
          direction: "right",
          trigger: "scrub",
          triggerElement: section,
          triggerStart: config.rightTitle.triggerStart,
          triggerEnd: config.rightTitle.triggerEnd,
          distance: "100vw",
          scale: 2.5,
          opacity: 0,
          blur: config.rightTitle.blur,
          duration: config.rightTitle.duration,
          ease: "power2.out",
        });
      }
    } else {
      console.log(`Section not found: ${config.id}`);
    }
  });

  // Only create yellow cursor on non-touch devices
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  
  let yellowCursor;
  let mouseX = 0,
    mouseY = 0;

  if (!isTouchDevice) {
    yellowCursor = document.createElement("div");
    yellowCursor.style.cssText = `
        position: fixed;
        width: 48px;
        height: 48px;
        background: #f2f200;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.1s ease;
        filter: blur(15px);
    `;
    document.body.appendChild(yellowCursor);

    document.addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / window.innerWidth) * 100;
      mouseY = (e.clientY / window.innerHeight) * 100;

      yellowCursor.style.left = e.clientX + "px";
      yellowCursor.style.top = e.clientY + "px";
    });
  }

  const accordions = document.querySelectorAll(".angebot_accordion");

  accordions.forEach((accordion, index) => {
    const question = accordion.querySelector(".angebot_accordion-question");
    const title = accordion.querySelector(".angebot_accordion-title");
    const answer = accordion.querySelector(".angebot_accordion-answer");
    const icon = accordion.querySelector(".angebot_accordion-icon");

    let isOpen = false;

    question.addEventListener("mouseenter", () => {
      gsap.to(title, {
        color: "#f2f200",
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(icon.querySelector("path"), {
        fill: "#f2f200",
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(icon, {
        borderColor: "#f2f200",
        duration: 0.3,
        ease: "power2.out",
      });

      if (yellowCursor) {
        yellowCursor.style.opacity = "0.8";
      }
    });

    question.addEventListener("mouseleave", () => {
      if (!isOpen) {
        gsap.to(title, {
          color: "white",
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(icon.querySelector("path"), {
          fill: "currentColor",
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(icon, {
          borderColor: "white",
          duration: 0.3,
          ease: "power2.out",
        });
      }

      if (yellowCursor) {
        yellowCursor.style.opacity = "0";
      }

      question.style.cursor = "pointer";

      gsap.to(accordion, {
        scale: 1.0,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    question.addEventListener("click", () => {
      isOpen = !isOpen;

      if (isOpen) {
        gsap.to(answer, {
          height: "auto",
          duration: 0.5,
          ease: "power2.out",
        });

        gsap.to(icon, {
          rotation: 180,
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(title, {
          color: "#ffff00",
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(icon.querySelector("path"), {
          fill: "#ffff00",
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(answer, {
          height: 0,
          duration: 0.5,
          ease: "power2.out",
        });

        gsap.to(icon, {
          rotation: 0,
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(title, {
          color: "white",
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(icon.querySelector("path"), {
          fill: "currentColor",
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(icon, {
          borderColor: "white",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });

    gsap.set(answer, { height: 0 });
  });

  gsap.utils.toArray(".angebot_img").forEach((img, index) => {
    gsap.fromTo(
      img,
      {
        y: "50%",
        opacity: 0,
        scale: 1,
      },
      {
        y: "0%",
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "cubic-bezier(0.53, 0.03, 0.83, 0.25)",
        delay: index * 0.1,
        scrollTrigger: {
          trigger: img,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });
});
