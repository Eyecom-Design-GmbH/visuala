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
  maxWords: isMobile ? 15 : 50,
  useBlur: !isMobile,
  useBatching: true,
  useForce3D: true,
  preferredFPS: isMobile ? 30 : 60,
};

function batchDOMOperations(operations) {
  if (!PERFORMANCE_CONFIG.useBatching) {
    operations.forEach((op) => op());
    return;
  }

  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      operations.forEach((op) => op());
      resolve();
    });
  });
}

function createTextReveal(selector, options = {}) {
  const defaults = {
    blurAmount: 8,
    moveDistance: 100,
    duration: 1.5,
    staggerAmount: 0.05,
    triggerStart: "top 70%",
    triggerEnd: "top 20%",
    ease: "power4.out",
    splitSpaces: true,
    autoInit: false,
    scrub: false,
    toggleActions: "play none none none",
    direction: "left",
  };

  const settings = { ...defaults, ...options };

  if (isMobile) {
    settings.blurAmount = 0;
    settings.moveDistance = Math.min(settings.moveDistance, 30);
    settings.duration = Math.max(0.4, settings.duration * 0.7);
    settings.staggerAmount = Math.max(0.03, settings.staggerAmount * 2);
    settings.splitSpaces = false;

    console.log("🔋 Text Reveal: Mobile optimization applied");
  }

  const elements =
    typeof selector === "string"
      ? document.querySelectorAll(selector)
      : [selector];

  if (elements.length === 0) {
    return null;
  }

  function getTransformProperties(direction, distance) {
    switch (direction) {
      case "right":
        return { x: distance, y: 0 };
      case "up":
        return { x: 0, y: -distance };
      case "down":
        return { x: 0, y: distance };
      case "left":
      default:
        return { x: -distance, y: 0 };
    }
  }

  function processMobileText(element) {
    const text = element.textContent;
    const words = text.split(" ").filter((word) => word.trim() !== "");

    const maxWords = 15;
    const wordsToAnimate = words.slice(0, maxWords);

    if (wordsToAnimate.length < words.length) {
      console.log(
        `🔋 Text Reveal: Limited to ${maxWords} words on mobile (${words.length} total)`,
      );
    }

    element.innerHTML = "";
    const fragment = document.createDocumentFragment();

    wordsToAnimate.forEach((word, index) => {
      const wordSpan = document.createElement("span");
      wordSpan.className = "text-reveal-word";
      wordSpan.textContent = word;

      const transform = getTransformProperties(
        settings.direction,
        settings.moveDistance,
      );
      wordSpan.style.cssText = `
        opacity: 0;
        ${settings.blurAmount > 0 && PERFORMANCE_CONFIG.useBlur ? `filter: blur(${settings.blurAmount}px);` : ""}
        transform: translateX(${transform.x}px) translateY(${transform.y}px) ${PERFORMANCE_CONFIG.useForce3D ? "translateZ(0)" : ""};
        display: inline-block;
        ${PERFORMANCE_CONFIG.useForce3D ? "will-change: transform, opacity;" : ""}
        backface-visibility: hidden;
      `;
      fragment.appendChild(wordSpan);

      if (index < wordsToAnimate.length - 1) {
        fragment.appendChild(document.createTextNode(" "));
      }
    });

    element.appendChild(fragment);
  }

  function processTextNodes(node) {
    if (isMobile) {
      processMobileText(node);
      return;
    }

    const walker = document.createTreeWalker(
      node,
      NodeFilter.SHOW_TEXT,
      null,
      false,
    );

    const textNodes = [];
    let currentNode;

    while ((currentNode = walker.nextNode())) {
      if (currentNode.textContent.trim() !== "") {
        textNodes.push(currentNode);
      }
    }

    textNodes.forEach((textNode) => {
      const text = textNode.textContent;
      const words = text.split(" ");

      if (words.length <= 1) {
        if (text.trim() !== "") {
          const wordSpan = document.createElement("span");
          wordSpan.className = "text-reveal-word";
          wordSpan.textContent = text;

          const transform = getTransformProperties(
            settings.direction,
            settings.moveDistance,
          );
          wordSpan.style.cssText = `
            opacity: 0;
            ${settings.blurAmount > 0 && PERFORMANCE_CONFIG.useBlur ? `filter: blur(${settings.blurAmount}px);` : ""}
            transform: translateX(${transform.x}px) translateY(${transform.y}px) ${PERFORMANCE_CONFIG.useForce3D ? "translateZ(0)" : ""};
            display: inline-block;
            ${PERFORMANCE_CONFIG.useForce3D ? "will-change: transform, opacity;" : ""}
            backface-visibility: hidden;
          `;
          textNode.parentNode.replaceChild(wordSpan, textNode);
        }
        return;
      }

      const fragment = document.createDocumentFragment();

      words.forEach((word, index) => {
        if (word.trim() !== "") {
          const wordSpan = document.createElement("span");
          wordSpan.className = "text-reveal-word";
          wordSpan.setAttribute("data-word", word);
          wordSpan.textContent = word;

          const transform = getTransformProperties(
            settings.direction,
            settings.moveDistance,
          );
          wordSpan.style.cssText = `
            opacity: 0;
            ${settings.blurAmount > 0 && PERFORMANCE_CONFIG.useBlur ? `filter: blur(${settings.blurAmount}px);` : ""}
            transform: translateX(${transform.x}px) translateY(${transform.y}px) ${PERFORMANCE_CONFIG.useForce3D ? "translateZ(0)" : ""};
            display: inline-block;
            ${PERFORMANCE_CONFIG.useForce3D ? "will-change: transform, opacity;" : ""}
            backface-visibility: hidden;
          `;
          fragment.appendChild(wordSpan);
        }

        if (index < words.length - 1) {
          if (settings.splitSpaces) {
            const spaceSpan = document.createElement("span");
            spaceSpan.className = "text-reveal-whitespace";
            spaceSpan.innerHTML = "\u00A0";

            const transform = getTransformProperties(
              settings.direction,
              settings.moveDistance,
            );
            spaceSpan.style.cssText = `
              opacity: 0;
              ${settings.blurAmount > 0 && PERFORMANCE_CONFIG.useBlur ? `filter: blur(${settings.blurAmount}px);` : ""}
              transform: translateX(${transform.x}px) translateY(${transform.y}px) ${PERFORMANCE_CONFIG.useForce3D ? "translateZ(0)" : ""};
              display: inline-block;
              ${PERFORMANCE_CONFIG.useForce3D ? "will-change: transform, opacity;" : ""}
              backface-visibility: hidden;
            `;
            fragment.appendChild(spaceSpan);
          } else {
            fragment.appendChild(document.createTextNode(" "));
          }
        }
      });

      textNode.parentNode.replaceChild(fragment, textNode);
    });
  }

  function setupTextReveal(element) {
    if (!element || !element.classList) return null;
    if (element.classList.contains("text-reveal-processed")) return element;

    element.classList.add("text-reveal-processed");
    processTextNodes(element);

    return element;
  }

  function animateTextReveal(element) {
    const spans = element.querySelectorAll(
      ".text-reveal-word, .text-reveal-whitespace",
    );

    if (spans.length === 0) return;

    const maxSpans = Math.min(spans.length, PERFORMANCE_CONFIG.maxWords);
    const spansToAnimate = Array.from(spans).slice(0, maxSpans);

    if (maxSpans < spans.length) {
      console.log(
        `🔧 Performance: Limited to ${maxSpans}/${spans.length} words for performance`,
      );
    }

    const animationConfig = {
      x: 0,
      y: 0,
      opacity: 1,
      duration: settings.duration,
      ease: settings.ease,
      stagger: settings.staggerAmount,
      force3D: PERFORMANCE_CONFIG.useForce3D,
      transformOrigin: "center center",
    };

    if (settings.blurAmount > 0 && PERFORMANCE_CONFIG.useBlur) {
      animationConfig.filter = "blur(0px)";
    }

    if (settings.autoInit) {
      animationConfig.scrollTrigger = {
        trigger: element,
        start: settings.triggerStart,
        end: settings.triggerEnd,
        toggleActions: settings.toggleActions,
        scrub: settings.scrub,
        markers: false,
        fastScrollEnd: true,
        refreshPriority: 1,
      };
    }

    const tl = gsap.to(spansToAnimate, animationConfig);

    return tl;
  }

  const processedElements = [];
  elements.forEach((element) => {
    const processed = setupTextReveal(element);
    if (processed) processedElements.push(processed);
  });

  if (settings.autoInit) {
    processedElements.forEach((element) => {
      animateTextReveal(element);
    });
  }

  console.log(`Text Reveal: Processed ${processedElements.length} elements`);

  return {
    elements: processedElements,
    animate: function (elementIndex = null) {
      if (elementIndex !== null && processedElements[elementIndex]) {
        return animateTextReveal(processedElements[elementIndex]);
      } else {
        const timelines = processedElements.map((element) =>
          animateTextReveal(element),
        );
        return timelines;
      }
    },
    reset: function () {
      processedElements.forEach((element) => {
        const spans = element.querySelectorAll(
          ".text-reveal-word, .text-reveal-whitespace",
        );
        const transform = getTransformProperties(
          settings.direction,
          settings.moveDistance,
        );
        const resetConfig = {
          opacity: 0,
          x: transform.x,
          y: transform.y,
        };

        if (settings.blurAmount > 0 && PERFORMANCE_CONFIG.useBlur) {
          resetConfig.filter = `blur(${settings.blurAmount}px)`;
        }

        gsap.set(spans, resetConfig);
      });
    },
  };
}

document.addEventListener("DOMContentLoaded", function () {
  function initAutoTextReveal() {
    if (typeof gsap === "undefined") {
      setTimeout(initAutoTextReveal, 100);
      return;
    }

    const autoElements = document.querySelectorAll("[data-text-reveal]");

    autoElements.forEach((element) => {
      const options = {};

      if (element.hasAttribute("data-blur-amount")) {
        options.blurAmount = parseFloat(
          element.getAttribute("data-blur-amount"),
        );
      }
      if (element.hasAttribute("data-move-distance")) {
        options.moveDistance = parseFloat(
          element.getAttribute("data-move-distance"),
        );
      }
      if (element.hasAttribute("data-duration")) {
        options.duration = parseFloat(element.getAttribute("data-duration"));
      }
      if (element.hasAttribute("data-stagger-amount")) {
        options.staggerAmount = parseFloat(
          element.getAttribute("data-stagger-amount"),
        );
      }
      if (element.hasAttribute("data-trigger-start")) {
        options.triggerStart = element.getAttribute("data-trigger-start");
      }
      if (element.hasAttribute("data-direction")) {
        options.direction = element.getAttribute("data-direction");
      }
      if (element.hasAttribute("data-scrub")) {
        const scrubValue = element.getAttribute("data-scrub");
        options.scrub =
          scrubValue === "true"
            ? true
            : scrubValue === "false"
              ? false
              : parseFloat(scrubValue);
      }

      options.autoInit = true;

      createTextReveal(element, options);
    });

    if (autoElements.length > 0) {
      console.log(
        `Auto-initialized ${autoElements.length} text reveal elements`,
      );
    }
  }

  setTimeout(initAutoTextReveal, 100);
});

window.createTextReveal = createTextReveal;
