document.addEventListener("DOMContentLoaded", function () {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  // Contact items animation
  gsap.utils.toArray(".contact_component").forEach((wrapper) => {
    const images = wrapper.querySelectorAll(".contact_item");
    
    gsap.from(images, {
      scrollTrigger: {
        trigger: wrapper,
        start: "top 75%",
        once: true,
      },
      y: isSafari ? 0 : 100,
      opacity: 0,
      duration: isSafari ? 0.5 : 0.8,
      ease: "power1.out",
      stagger: 0.08,
    });
  });

  // FAQ list animation
  gsap.utils.toArray(".contact_faq_list").forEach((wrapper) => {
    const items = wrapper.querySelectorAll(".contact_faq-item");
    
    gsap.from(items, {
      scrollTrigger: {
        trigger: wrapper,
        start: "top 75%",
        once: true,
      },
      y: isSafari ? 0 : 100,
      opacity: 0,
      duration: isSafari ? 0.5 : 0.8,
      ease: "power1.out",
      stagger: 0.08,
    });
  });

  // FAQ accordion
  const faqs = document.querySelectorAll(".contact_faq-accordion");
  
  faqs.forEach((faq) => {
    const question = faq.querySelector(".contact_faq-question");
    const title = question.querySelector(".heading-style-h3");
    const iconWrapper = question.querySelector(".contact_faq-icon-wrapper");
    const iconPath = iconWrapper.querySelector("path");
    const answer = faq.querySelector(".contact_faq-answer");
    let isOpen = false;

    gsap.set(answer, { height: 0, overflow: "hidden" });

    if (isSafari) {
      // CSS-based animations for Safari
      title.style.transition = "color 0.25s ease";
      iconWrapper.style.transition = "all 0.25s ease";
      iconPath.style.transition = "color 0.25s ease";
      answer.style.transition = "height 0.4s ease";

      question.addEventListener("mouseenter", () => {
        if (!isOpen) {
          title.style.color = "#6B1B3D";
          iconWrapper.style.borderColor = "#6B1B3D";
          iconWrapper.style.backgroundColor = "#6B1B3D";
          iconPath.style.color = "#ffffff";
        }
      });

      question.addEventListener("mouseleave", () => {
        if (!isOpen) {
          title.style.color = "#1F1F1F";
          iconWrapper.style.borderColor = "#1F1F1F";
          iconWrapper.style.backgroundColor = "transparent";
          iconPath.style.color = "#1F1F1F";
        }
      });

      question.addEventListener("click", () => {
        isOpen = !isOpen;
        
        if (isOpen) {
          answer.style.height = answer.scrollHeight + "px";
          iconWrapper.style.transform = "rotate(180deg)";
          iconWrapper.style.backgroundColor = "#6B1B3D";
          iconWrapper.style.borderColor = "#6B1B3D";
          title.style.color = "#6B1B3D";
          iconPath.style.color = "#ffffff";
        } else {
          answer.style.height = "0";
          iconWrapper.style.transform = "rotate(0deg)";
          iconWrapper.style.backgroundColor = "transparent";
          iconWrapper.style.borderColor = "#1F1F1F";
          title.style.color = "#1F1F1F";
          iconPath.style.color = "#1F1F1F";
        }
      });

    } else {
      // GSAP animations for other browsers
      question.addEventListener("mouseenter", () => {
        gsap.to(title, { color: "#6B1B3D", duration: 0.25 });
        gsap.to(iconPath, { color: "#ffffff", duration: 0.25 });
        gsap.to(iconWrapper, {
          borderColor: "#6B1B3D",
          backgroundColor: "#6B1B3D",
          duration: 0.25,
        });
      });

      question.addEventListener("mouseleave", () => {
        if (!isOpen) {
          gsap.to(title, { color: "#1F1F1F", duration: 0.25 });
          gsap.to(iconPath, { color: "#1F1F1F", duration: 0.25 });
          gsap.to(iconWrapper, {
            borderColor: "#1F1F1F",
            backgroundColor: "transparent",
            duration: 0.25,
          });
        }
      });

      question.addEventListener("click", () => {
        isOpen = !isOpen;
        
        if (isOpen) {
          gsap.to(answer, { height: "auto", duration: 0.4, ease: "power1.out" });
          gsap.to(iconWrapper, {
            rotation: 180,
            duration: 0.25,
            backgroundColor: "#6B1B3D",
            borderColor: "#6B1B3D",
          });
          gsap.to(title, { color: "#6B1B3D", duration: 0.25 });
          gsap.to(iconPath, { color: "#ffffff", duration: 0.25 });
        } else {
          gsap.to(answer, { height: 0, duration: 0.4, ease: "power1.out" });
          gsap.to(iconWrapper, {
            backgroundColor: "transparent",
            borderColor: "#1F1F1F",
            rotation: 0,
            duration: 0.25,
          });
          gsap.to(title, { color: "#1F1F1F", duration: 0.25 });
          gsap.to(iconPath, { color: "#1F1F1F", duration: 0.25 });
        }
      });
    }
  });
});