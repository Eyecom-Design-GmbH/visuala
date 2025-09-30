import "./call-embed.js";


$(document).ready(function () {
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
});
