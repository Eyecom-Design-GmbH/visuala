document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  if (
    document.querySelector(".work_left") &&
    document.querySelector(".work_right")
  ) {
    const projectsTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".work_wrap",
        start: "top bottom",
        end: "top 20%",
        scrub: 1.5,
        toggleActions: "play none none reverse",
      },
    });

    gsap.set(".work_left", {
      x: "-100vw",
      scale: 2.5,
      opacity: 0,
      filter: "blur(20px)",
    });

    gsap.set(".work_right", {
      x: "100vw",
      scale: 2.5,
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

  if (document.querySelector(".project_item.is-project-list")) {
    if (document.querySelector(".project_item.is-project-list")) {
      gsap.from(".work_crad", {
        scrollTrigger: {
          trigger: ".project_list.is-project",
          start: "top 70%",
        },
        yPercent: 100,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.05,
      });
    }
  
    // // Mobile project cards
    // gsap.utils.toArray(".project_list:not(.is-project)").forEach((wrapper) => {
    //   const cards = wrapper.querySelectorAll(".card-row4_card");
      
    //   cards.forEach((card, index) => {
    //     gsap.from(card, {
    //       scrollTrigger: {
    //         trigger: card,
    //         start: "top 50%",
    //         markers: false,
    //       },
    //       yPercent: 100,
    //       opacity: 0,
    //       duration: 0.6,
    //       ease: "power2.out",
    //       delay: index * 0.1, // Stagger delay within this section
    //     });
    //   });
    // });

    // Mobile project cards animation
  if (document.querySelector(".work_mobile")) {
    console.log("Mobile container found");
    const mobileCards = document.querySelectorAll(".work_mobile .work_crad");
    console.log("Found mobile cards:", mobileCards.length);
    
    if (mobileCards.length > 0) {
      // Set initial state for all cards
      gsap.set(mobileCards, {
        yPercent: 100,
        opacity: 0
      });
      
      mobileCards.forEach((card, index) => {
        console.log(`Setting up animation for card ${index}:`, card);
        
        ScrollTrigger.create({
          trigger: card,
          start: "top 80%",
          end: "top 20%",
          onEnter: () => {
            console.log(`Card ${index} entering viewport`);
            gsap.to(card, {
              yPercent: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
              delay: index * 0.1
            });
          },
          onLeave: () => {
            console.log(`Card ${index} leaving viewport`);
            gsap.to(card, {
              yPercent: -100,
              opacity: 0,
              duration: 0.5,
              ease: "power2.out"
            });
          },
          onEnterBack: () => {
            console.log(`Card ${index} entering viewport again`);
            gsap.to(card, {
              yPercent: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
              delay: index * 0.1
            });
          },
          onLeaveBack: () => {
            console.log(`Card ${index} leaving viewport again`);
            gsap.to(card, {
              yPercent: 100,
              opacity: 0,
              duration: 0.5,
              ease: "power2.out"
            });
          }
        });
      });
    }
  }
  }
  
});
