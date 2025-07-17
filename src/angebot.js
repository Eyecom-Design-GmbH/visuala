import "./title-animations.js";

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
        triggerStart: "top 50%",
        triggerEnd: "top top",
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
        triggerStart: "top 50%",
        triggerEnd: "top top",
        blur: 20,
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
        triggerStart: "top 50%",
        triggerEnd: "top top",
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
        triggerStart: "top 50%",
        triggerEnd: "top top",
        blur: 20,
        duration: 1.2,
      },
    },
  ];

  sectionConfigs.forEach((config) => {
    const section = document.querySelector(config.id);

    if (section) {
      console.log(`Setting up animations for section: ${config.id}`);

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

  const yellowCursor = document.createElement("div");
  yellowCursor.style.cssText = `
        position: fixed;
        width: 16px;
        height: 16px;
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

  let mouseX = 0,
    mouseY = 0;
  document.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth) * 100;
    mouseY = (e.clientY / window.innerHeight) * 100;

    yellowCursor.style.left = e.clientX + "px";
    yellowCursor.style.top = e.clientY + "px";
  });

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

      yellowCursor.style.opacity = "1";
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

      yellowCursor.style.opacity = "0";

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

  // let tl = gsap.timeline({
  //   scrollTrigger: {
  //     trigger: ".section-features",
  //     start: "top 5%",
  //     end: "bottom bottom",
  //     scrub: true,
  //     toggleActions: "restart none reverse",
  //     pin: ".features-wrapper",
  //   },
  // });

  // gsap.set(".features-card", {
  //   opacity: 1,
  //   yPercent: 0,
  //   xPercent: 0,
  //   scale: 1,
  //   rotation: (index) => {
  //     if (index === 0) return -8;
  //     if (index === 1) return 5;
  //     return 0;
  //   },
  // });

  // tl.to(".features-card", {
  //   duration: 0.3,
  // })

  //   .to(".features-card", {
  //     yPercent: -130,
  //     xPercent: (index) => (index % 2 === 0 ? 35 : -35),
  //     scale: 1.25,
  //     rotation: (index) => (index % 2 === 0 ? 15 : -15),
  //     duration: 1.8,
  //     ease: "power2.out",
  //     stagger: { each: 1.8, from: "start" },
  //   })
  //   .to(
  //     ".features-card",
  //     {
  //       opacity: 0,
  //       yPercent: -150,
  //       xPercent: (index) => (index % 2 === 0 ? 50 : -50),
  //       rotation: (index) => (index % 2 === 0 ? 25 : -25),
  //       scale: 0.8,
  //       duration: 0.8,
  //       ease: "power1.in",
  //       stagger: { each: 1.8, from: "start" },
  //     },
  //     "-=0.5",
  //   );

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
