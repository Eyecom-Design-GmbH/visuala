document.addEventListener("DOMContentLoaded", function () {
  gsap.utils.toArray(".contact_component").forEach((wrapper) => {
    const images = wrapper.querySelectorAll(".contact_item");
    gsap.from(images, {
      scrollTrigger: {
        trigger: wrapper,
        start: "top 70%",
        markers: false,
      },
      yPercent: 100,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      stagger: 0.05,
    });
  });

  gsap.utils.toArray(".contact_faq_list").forEach((wrapper) => {
    const images = wrapper.querySelectorAll(".contact_faq-item ");
    gsap.from(images, {
      scrollTrigger: {
        trigger: wrapper,
        start: "top 70%",
        markers: false,
      },
      yPercent: 100,
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      stagger: 0.05,
    });
  });

  const faqs = document.querySelectorAll(".contact_faq-accordion");
  faqs.forEach((faq) => {
    const question = faq.querySelector(".contact_faq-question");
    const title = question.querySelector(".heading-style-h3");
    const iconWrapper = question.querySelector(".contact_faq-icon-wrapper");
    const iconPath = iconWrapper.querySelector("path");
    const answer = faq.querySelector(".contact_faq-answer");
    let isOpen = false;
    gsap.set(answer, { height: 0, overflow: "hidden" });
    question.addEventListener("mouseenter", () => {
      gsap.to(title, {
        color: "#6B1B3D",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(iconPath, {
        color: "#ffffff",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(iconWrapper, {
        borderColor: "#6B1B3D",
        backgroundColor: "#6B1B3D",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(faq, {
        scale: 1.00,
        duration: 0.3,
        ease: "power2.out",
      });
    });
    question.addEventListener("mouseleave", () => {
      if (!isOpen) {
        gsap.to(title, {
          color: "#1F1F1F",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(iconPath, {
          color: "#1F1F1F",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(iconWrapper, {
          borderColor: "#1F1F1F",
          backgroundColor: "transparent",
          duration: 0.3,
          ease: "power2.out",
        });
      }
      gsap.to(faq, {
        scale: 1,
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
        gsap.to(iconWrapper, {
          rotation: 180,
          duration: 0.3,
          backgroundColor: "#6B1B3D",
          borderColor: "#6B1B3D",
          ease: "power2.out",
        });
        gsap.to(title, {
          color: "#6B1B3D",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(iconPath, {
          color: "#ffffff",
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(answer, {
          height: 0,
          duration: 0.5,
          ease: "power2.out",
        });
        gsap.to(iconWrapper, {
          backgroundColor: "transparent",
          borderColor: "#1F1F1F",
          rotation: 0,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(title, {
          color: "#1F1F1F",
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(iconPath, {
          color: "#1F1F1F",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });
  });
});

