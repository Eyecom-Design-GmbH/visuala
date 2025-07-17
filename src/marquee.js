function createInfiniteMarquee(selector, options = {}) {
  const defaults = {
    speed: 50,
    direction: "left",
    pauseOnHover: true,
    duplicateContent: true,
    gap: 50,
    autoStart: true,
    smooth: true,
    responsive: true,
    minDuplicates: 3,
    preserveStyles: true,
    containerStyles: {
      overflow: "hidden",
      whiteSpace: "nowrap",
    },
  };

  const settings = { ...defaults, ...options };

  const elements =
    typeof selector === "string"
      ? document.querySelectorAll(selector)
      : [selector];

  if (elements.length === 0) {
    console.warn(`Marquee: No elements found for selector "${selector}"`);
    return null;
  }

  function setupMarquee(container) {
    if (container.classList.contains("marquee-processed")) return;

    container.classList.add("marquee-processed");

    const originalContainerStyles = {
      overflow:
        container.style.overflow || getComputedStyle(container).overflow,
      whiteSpace:
        container.style.whiteSpace || getComputedStyle(container).whiteSpace,
      position:
        container.style.position || getComputedStyle(container).position,
    };

    let content = container.querySelector(".marquee-content");
    let contentCreated = false;

    if (!content) {
      const children = Array.from(container.children);
      if (children.length > 1 || settings.duplicateContent) {
        content = document.createElement("div");
        content.className = "marquee-content";

        children.forEach((child) => content.appendChild(child));
        container.appendChild(content);
        contentCreated = true;
      } else {
        content = children[0] || container;
      }
    }

    if (!settings.preserveStyles) {
      gsap.set(container, {
        overflow: settings.containerStyles.overflow,
        whiteSpace: settings.containerStyles.whiteSpace,
        position:
          originalContainerStyles.position === "static"
            ? "relative"
            : originalContainerStyles.position,
        force3D: true,
      });
    } else {
      gsap.set(container, {
        overflow: "hidden",
        force3D: true,
      });
    }

    const isHorizontal =
      settings.direction === "left" || settings.direction === "right";

    if (contentCreated || !settings.preserveStyles) {
      gsap.set(content, {
        display: isHorizontal ? "inline-flex" : "flex",
        flexDirection: isHorizontal ? "row" : "column",
        gap: `${settings.gap}px`,
        whiteSpace: "nowrap",
        willChange: "transform",
        force3D: true,
        backfaceVisibility: "hidden",
      });

      if (!settings.preserveStyles) {
        gsap.set(content, {
          alignItems: isHorizontal ? "center" : "stretch",
        });
      }
    }

    function setupContentDuplication() {
      if (!settings.duplicateContent) {
        requestAnimationFrame(() => {
          animation = createAnimation();
        });
        return;
      }

      const originalContent = content.innerHTML;

      gsap.set(content, { visibility: "hidden" });
      content.innerHTML = originalContent;
      gsap.set(content, { visibility: "visible" });

      requestAnimationFrame(() => {
        const containerSize = isHorizontal
          ? container.offsetWidth
          : container.offsetHeight;
        const contentSize = isHorizontal
          ? content.scrollWidth
          : content.scrollHeight;

        if (contentSize === 0) {
          console.warn("Marquee: Content size is 0, retrying...");
          return;
        }

        const bufferMultiplier = 2;
        const requiredSize = containerSize * bufferMultiplier;
        const duplicatesNeeded = Math.max(
          settings.minDuplicates,
          Math.ceil(requiredSize / contentSize) + 1,
        );

        const duplicatedContent = document.createDocumentFragment();
        for (let i = 0; i < duplicatesNeeded; i++) {
          const wrapper = document.createElement("div");
          wrapper.innerHTML = originalContent;
          wrapper.style.display = "contents";
          duplicatedContent.appendChild(wrapper);
        }

        content.innerHTML = "";
        content.appendChild(duplicatedContent);
        content.setAttribute("data-duplicates-count", duplicatesNeeded);

        requestAnimationFrame(() => {
          animation = createAnimation();
        });
      });
    }

    function getAnimationDistance() {
      const duplicatesCount =
        parseInt(content.getAttribute("data-duplicates-count")) || 1;

      if (isHorizontal) {
        const totalWidth = content.scrollWidth;
        return totalWidth / duplicatesCount;
      } else {
        const totalHeight = content.scrollHeight;
        return totalHeight / duplicatesCount;
      }
    }

    function createAnimation() {
      const distance = getAnimationDistance();
      const duration = distance / settings.speed;

      if (distance === 0) {
        console.warn("Marquee: Animation distance is 0, retrying...");
        setTimeout(() => {
          animation = createAnimation();
        }, 100);
        return null;
      }

      let startPos, endPos;

      switch (settings.direction) {
        case "left":
          startPos = { x: 0, y: 0 };
          endPos = { x: -distance, y: 0 };
          break;
        case "right":
          startPos = { x: -distance, y: 0 };
          endPos = { x: 0, y: 0 };
          break;
        case "up":
          startPos = { x: 0, y: 0 };
          endPos = { x: 0, y: -distance };
          break;
        case "down":
          startPos = { x: 0, y: -distance };
          endPos = { x: 0, y: 0 };
          break;
      }

      gsap.set(content, {
        ...startPos,
        force3D: true,
        willChange: "transform",
      });

      const animation = gsap.to(content, {
        ...endPos,
        duration: duration,
        ease: settings.smooth ? "none" : "power1.inOut",
        repeat: -1,
        repeatRefresh: true,
        paused: !settings.autoStart,
        force3D: true,
        transformOrigin: "0 0",
      });

      return animation;
    }

    if (typeof gsap === "undefined") {
      console.warn("GSAP not available for marquee animation");
      return null;
    }

    setupContentDuplication();
    let animation = null;

    if (settings.pauseOnHover) {
      container.addEventListener(
        "mouseenter",
        () => {
          if (animation) animation.pause();
        },
        { passive: true },
      );

      container.addEventListener(
        "mouseleave",
        () => {
          if (animation) animation.play();
        },
        { passive: true },
      );
    }

    let resizeTimeout;
    if (settings.responsive) {
      const resizeObserver = new ResizeObserver(() => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          if (animation) {
            animation.kill();
            animation = null;
          }
          setupContentDuplication();
        }, 100);
      });

      resizeObserver.observe(container);

      container._marqueeCleanup = () => {
        resizeObserver.disconnect();
        clearTimeout(resizeTimeout);
        if (animation) animation.kill();
      };
    }

    return {
      element: container,
      content: content,
      get animation() {
        return animation;
      },
      setAnimation(anim) {
        animation = anim;
      },
      play: () => animation?.play(),
      pause: () => animation?.pause(),
      restart: () => animation?.restart(),
      reverse: () => animation?.reverse(),
      setSpeed: (newSpeed) => {
        if (animation) {
          const newDistance = getAnimationDistance();
          const newDuration = newDistance / newSpeed;
          animation.duration(newDuration);
          settings.speed = newSpeed;
        }
      },
      cleanup: () => {
        if (container._marqueeCleanup) {
          container._marqueeCleanup();
        }
        if (settings.preserveStyles) {
          gsap.set(container, originalContainerStyles);
        }
      },
    };
  }

  const processedMarquees = [];
  elements.forEach((element) => {
    const marquee = setupMarquee(element);
    if (marquee) processedMarquees.push(marquee);
  });

  return {
    marquees: processedMarquees,
    play: () => processedMarquees.forEach((m) => m.play()),
    pause: () => processedMarquees.forEach((m) => m.pause()),
    restart: () => processedMarquees.forEach((m) => m.restart()),
    reverse: () => processedMarquees.forEach((m) => m.reverse()),
    setSpeed: (newSpeed) =>
      processedMarquees.forEach((m) => m.setSpeed(newSpeed)),
    cleanup: () => processedMarquees.forEach((m) => m.cleanup()),
  };
}

document.addEventListener("DOMContentLoaded", function () {
  function initAutoMarquees() {
    if (typeof gsap === "undefined") {
      setTimeout(initAutoMarquees, 100);
      return;
    }

    const autoElements = document.querySelectorAll("[data-marquee]");

    autoElements.forEach((element) => {
      const options = {};

      if (element.hasAttribute("data-marquee-speed")) {
        options.speed = parseFloat(element.getAttribute("data-marquee-speed"));
      }
      if (element.hasAttribute("data-marquee-direction")) {
        options.direction = element.getAttribute("data-marquee-direction");
      }
      if (element.hasAttribute("data-marquee-pause-on-hover")) {
        options.pauseOnHover =
          element.getAttribute("data-marquee-pause-on-hover") === "true";
      }
      if (element.hasAttribute("data-marquee-gap")) {
        options.gap = parseFloat(element.getAttribute("data-marquee-gap"));
      }
      if (element.hasAttribute("data-marquee-duplicate")) {
        options.duplicateContent =
          element.getAttribute("data-marquee-duplicate") === "true";
      }
      if (element.hasAttribute("data-marquee-preserve-styles")) {
        options.preserveStyles =
          element.getAttribute("data-marquee-preserve-styles") === "true";
      }

      createInfiniteMarquee(element, options);
    });

    if (autoElements.length > 0) {
      console.log(`Auto-initialized ${autoElements.length} marquee elements`);
    }
  }

  setTimeout(initAutoMarquees, 100);
});

window.createInfiniteMarquee = createInfiniteMarquee;
