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

function createImageAnimation(selector, options = {}) {
  const defaults = {
    animationType: "slideUp",
    distance: 100,
    duration: 1,
    ease: "power2.out",
    delay: 0,
    stagger: 0,
    trigger: "scroll",
    triggerStart: "top 80%",
    triggerEnd: "bottom 20%",
    scrub: false,
    toggleActions: "play none none none",
    scale: 1.1,
    rotation: 360,
    opacity: 0,
    blur: 0,
    autoPlay: true,
    once: true,
  };

  const settings = { ...defaults, ...options };

  if (isMobile) {
    settings.blur = 0;
    settings.distance = Math.min(settings.distance, 30);
    settings.duration = Math.max(0.3, settings.duration * 0.7);
    settings.stagger = Math.min(settings.stagger, 0.05);

    console.log("🔋 Image Animation: Mobile optimization applied");
  }

  const elements =
    typeof selector === "string"
      ? document.querySelectorAll(selector)
      : [selector];

  if (elements.length === 0) {
    console.warn(
      `Image Animation: No elements found for selector "${selector}"`,
    );
    return null;
  }

  const elementsToAnimate = isMobile
    ? Array.from(elements).slice(0, 8)
    : elements;

  if (isMobile && elementsToAnimate.length < elements.length) {
    console.log(
      `🔋 Image Animation: Limited to ${elementsToAnimate.length} images on mobile (${elements.length} total)`,
    );
  }

  function getInitialProps(
    animationType,
    distance,
    scale,
    opacity,
    blur,
    rotation,
  ) {
    const props = { opacity: opacity };

    if (blur > 0) props.filter = `blur(${blur}px)`;

    switch (animationType) {
      case "slideUp":
        props.y = distance;
        break;
      case "slideDown":
        props.y = -distance;
        break;
      case "slideLeft":
        props.x = distance;
        break;
      case "slideRight":
        props.x = -distance;
        break;
      case "scale":
        props.scale = scale;
        break;
      case "rotate":
        props.rotation = rotation;
        props.scale = 0.8;
        break;
      case "fade":
        break;
      default:
        props.y = distance;
    }

    return props;
  }

  function getFinalProps(animationType, blur) {
    const props = {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
    };

    if (blur > 0) props.filter = `blur(0px)`;

    return props;
  }

  function setupImageAnimation(element) {
    if (element.classList.contains("image-animation-processed")) return;

    element.classList.add("image-animation-processed");

    const initialProps = getInitialProps(
      settings.animationType,
      settings.distance,
      settings.scale,
      settings.opacity,
      settings.blur,
      settings.rotation,
    );

    gsap.set(element, initialProps);

    function createAnimation() {
      const finalProps = getFinalProps(settings.animationType, settings.blur);

      return gsap.to(element, {
        ...finalProps,
        duration: settings.duration,
        ease: settings.ease,
        delay: settings.delay,
      });
    }

    let animation = null;
    let scrollTrigger = null;

    switch (settings.trigger) {
      case "scroll":
        if (settings.autoPlay) {
          animation = gsap.to(element, {
            ...getFinalProps(settings.animationType, settings.blur),
            duration: settings.duration,
            ease: settings.ease,
            delay: settings.delay,
            scrollTrigger: {
              trigger: element,
              start: settings.triggerStart,
              end: settings.triggerEnd,
              toggleActions: settings.toggleActions,
              scrub: settings.scrub,
              once: settings.once,
              markers: false,
            },
          });
        }
        break;

      case "click":
        element.style.cursor = "pointer";
        element.addEventListener("click", () => {
          if (!animation || !settings.once) {
            animation = createAnimation();
          }
        });
        break;

      case "hover":
        element.addEventListener("mouseenter", () => {
          if (!animation || !settings.once) {
            animation = createAnimation();
          }
        });
        break;

      case "immediate":
        if (settings.autoPlay) {
          animation = createAnimation();
        }
        break;

      case "manual":
        break;
    }

    return {
      element: element,
      animation: animation,
      play: () => {
        if (!animation || !settings.once) {
          animation = createAnimation();
          return animation;
        }
        return animation;
      },
      reset: () => {
        const initialProps = getInitialProps(
          settings.animationType,
          settings.distance,
          settings.scale,
          settings.opacity,
          settings.blur,
          settings.rotation,
        );
        gsap.set(element, initialProps);
        animation = null;
      },
      pause: () => animation?.pause(),
      resume: () => animation?.resume(),
      reverse: () => animation?.reverse(),
    };
  }

  if (typeof gsap === "undefined") {
    console.warn("GSAP not available for image animations");
    return null;
  }

  const processedImages = [];
  elementsToAnimate.forEach((element, index) => {
    const staggeredOptions = { ...settings };
    if (settings.stagger > 0) {
      staggeredOptions.delay = settings.delay + index * settings.stagger;
    }

    const tempSettings = settings;
    Object.assign(settings, staggeredOptions);

    const imageAnimation = setupImageAnimation(element);
    if (imageAnimation) processedImages.push(imageAnimation);

    Object.assign(settings, tempSettings);
  });

  console.log(
    `Image Animation: Processed ${processedImages.length} image elements`,
  );

  return {
    images: processedImages,
    play: () => processedImages.forEach((img) => img.play()),
    reset: () => processedImages.forEach((img) => img.reset()),
    pause: () => processedImages.forEach((img) => img.pause()),
    resume: () => processedImages.forEach((img) => img.resume()),
    reverse: () => processedImages.forEach((img) => img.reverse()),
  };
}

document.addEventListener("DOMContentLoaded", function () {
  function initAutoImageAnimations() {
    if (typeof gsap === "undefined") {
      setTimeout(initAutoImageAnimations, 100);
      return;
    }

    const autoElements = document.querySelectorAll("[data-image-animation]");

    autoElements.forEach((element) => {
      const options = {};

      if (element.hasAttribute("data-animation-type")) {
        options.animationType = element.getAttribute("data-animation-type");
      }
      if (element.hasAttribute("data-animation-distance")) {
        options.distance = parseFloat(
          element.getAttribute("data-animation-distance"),
        );
      }
      if (element.hasAttribute("data-animation-duration")) {
        options.duration = parseFloat(
          element.getAttribute("data-animation-duration"),
        );
      }
      if (element.hasAttribute("data-animation-delay")) {
        options.delay = parseFloat(
          element.getAttribute("data-animation-delay"),
        );
      }
      if (element.hasAttribute("data-animation-ease")) {
        options.ease = element.getAttribute("data-animation-ease");
      }
      if (element.hasAttribute("data-animation-trigger")) {
        options.trigger = element.getAttribute("data-animation-trigger");
      }
      if (element.hasAttribute("data-animation-trigger-start")) {
        options.triggerStart = element.getAttribute(
          "data-animation-trigger-start",
        );
      }
      if (element.hasAttribute("data-animation-scrub")) {
        const scrubValue = element.getAttribute("data-animation-scrub");
        options.scrub =
          scrubValue === "true"
            ? true
            : scrubValue === "false"
              ? false
              : parseFloat(scrubValue);
      }
      if (element.hasAttribute("data-animation-opacity")) {
        options.opacity = parseFloat(
          element.getAttribute("data-animation-opacity"),
        );
      }
      if (element.hasAttribute("data-animation-blur")) {
        options.blur = parseFloat(element.getAttribute("data-animation-blur"));
      }
      if (element.hasAttribute("data-animation-scale")) {
        options.scale = parseFloat(
          element.getAttribute("data-animation-scale"),
        );
      }

      createImageAnimation(element, options);
    });

    if (autoElements.length > 0) {
      console.log(
        `Auto-initialized ${autoElements.length} image animation elements`,
      );
    }
  }

  setTimeout(initAutoImageAnimations, 100);
});

window.createImageAnimation = createImageAnimation;
