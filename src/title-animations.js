function createTitleAnimation(selector, options = {}) {
  const defaults = {
    animationType: "slideIn",
    direction: "left",
    distance: "100vw",
    duration: 1.5,
    ease: "power2.out",
    delay: 0,
    stagger: 0,
    trigger: "scroll",

    triggerElement: null,
    triggerStart: "top bottom",
    triggerEnd: "top 30%",
    scrub: 2.5,
    toggleActions: "play none none none",

    scale: 2.5,
    opacity: 0,
    blur: 15,
    rotation: 0,

    autoPlay: true,
    once: true,
    overlap: -1.2,
    responsive: true,
  };

  const settings = { ...defaults, ...options };

  const elements =
    typeof selector === "string"
      ? document.querySelectorAll(selector)
      : [selector];

  if (elements.length === 0) {
    console.warn(
      `Title Animation: No elements found for selector "${selector}"`,
    );
    return null;
  }

  function getInitialProps(
    animationType,
    direction,
    distance,
    scale,
    opacity,
    blur,
    rotation,
  ) {
    const props = {
      opacity: opacity,
      scale: scale,
      rotation: rotation,
    };

    if (blur > 0) props.filter = `blur(${blur}px)`;

    switch (animationType) {
      case "slideIn":
        switch (direction) {
          case "left":
            props.x = `-${distance}`;
            break;
          case "right":
            props.x = distance;
            break;
          case "up":
            props.y = `-${distance}`;
            break;
          case "down":
            props.y = distance;
            break;
        }
        break;

      case "scale":
        break;

      case "blur":
        break;

      case "fade":
        break;

      default:
        props.x = `-${distance}`;
    }

    return props;
  }

  function getFinalProps(blur) {
    const props = {
      opacity: 1,
      scale: 1,
      rotation: 0,
      x: 0,
      y: 0,
    };

    if (blur > 0) props.filter = `blur(0px)`;

    return props;
  }

  function setupTitleAnimation(element, index = 0) {
    if (!element || !element.classList) return null;
    if (element.classList.contains("title-animation-processed")) return element;

    element.classList.add("title-animation-processed");

    const initialProps = getInitialProps(
      settings.animationType,
      settings.direction,
      settings.distance,
      settings.scale,
      settings.opacity,
      settings.blur,
      settings.rotation,
    );

    gsap.set(element, initialProps);

    const staggerDelay =
      settings.stagger > 0
        ? settings.delay + index * settings.stagger
        : settings.delay;

    function createAnimation() {
      const finalProps = getFinalProps(settings.blur);

      return gsap.to(element, {
        ...finalProps,
        duration: settings.duration,
        ease: settings.ease,
        delay: staggerDelay,
      });
    }

    function createTimelineAnimation(timeline) {
      const finalProps = getFinalProps(settings.blur);

      const animationDelay = index > 0 ? settings.overlap : 0;

      return timeline.to(
        element,
        {
          ...finalProps,
          duration: settings.duration,
          ease: settings.ease,
        },
        animationDelay,
      );
    }

    let animation = null;
    let scrollTrigger = null;

    switch (settings.trigger) {
      case "scroll":
        if (settings.autoPlay) {
          animation = gsap.to(element, {
            ...getFinalProps(settings.blur),
            duration: settings.duration,
            ease: settings.ease,
            delay: staggerDelay,
            scrollTrigger: {
              trigger: settings.triggerElement || element,
              start: settings.triggerStart,
              end: settings.triggerEnd,
              toggleActions: settings.toggleActions,
              once: settings.once,
              markers: false,
            },
          });
        }
        break;

      case "scrub":
        if (settings.autoPlay) {
          animation = gsap.to(element, {
            ...getFinalProps(settings.blur),
            duration: settings.duration,
            ease: settings.ease,
            scrollTrigger: {
              trigger: settings.triggerElement || element,
              start: settings.triggerStart,
              end: settings.triggerEnd,
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
        // Animation will be triggered manually via returned control object
        break;
    }

    return {
      element: element,
      animation: animation,
      index: index,
      createAnimation: createAnimation,
      createTimelineAnimation: createTimelineAnimation,
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
          settings.direction,
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
    console.warn("GSAP not available for title animations");
    return null;
  }

  const processedTitles = [];
  elements.forEach((element, index) => {
    const titleAnimation = setupTitleAnimation(element, index);
    if (titleAnimation) processedTitles.push(titleAnimation);
  });

  function createCoordinatedTimeline(timelineOptions = {}) {
    const defaultTimelineOptions = {
      scrollTrigger:
        settings.trigger === "scrub" || settings.trigger === "scroll"
          ? {
              trigger: settings.triggerElement || processedTitles[0]?.element,
              start: settings.triggerStart,
              end: settings.triggerEnd,
              scrub: settings.trigger === "scrub" ? settings.scrub : false,
              toggleActions: settings.toggleActions,
              once: settings.once,
              markers: false,
            }
          : undefined,
    };

    const tlOptions = { ...defaultTimelineOptions, ...timelineOptions };
    const timeline = gsap.timeline(tlOptions);

    processedTitles.forEach((titleAnim) => {
      titleAnim.createTimelineAnimation(timeline);
    });

    return timeline;
  }

  return {
    titles: processedTitles,
    timeline: createCoordinatedTimeline(),
    createTimeline: createCoordinatedTimeline,
    play: () => processedTitles.forEach((title) => title.play()),
    reset: () => processedTitles.forEach((title) => title.reset()),
    pause: () => processedTitles.forEach((title) => title.pause()),
    resume: () => processedTitles.forEach((title) => title.resume()),
    reverse: () => processedTitles.forEach((title) => title.reverse()),
  };
}

document.addEventListener("DOMContentLoaded", function () {
  function initAutoTitleAnimations() {
    if (typeof gsap === "undefined") {
      setTimeout(initAutoTitleAnimations, 100);
      return;
    }

    const autoElements = document.querySelectorAll("[data-title-animation]");

    autoElements.forEach((element) => {
      const options = {};

      if (element.hasAttribute("data-animation-type")) {
        options.animationType = element.getAttribute("data-animation-type");
      }
      if (element.hasAttribute("data-animation-direction")) {
        options.direction = element.getAttribute("data-animation-direction");
      }
      if (element.hasAttribute("data-animation-distance")) {
        options.distance = element.getAttribute("data-animation-distance");
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
      if (element.hasAttribute("data-animation-trigger-end")) {
        options.triggerEnd = element.getAttribute("data-animation-trigger-end");
      }
      if (element.hasAttribute("data-animation-scrub")) {
        options.scrub = parseFloat(
          element.getAttribute("data-animation-scrub"),
        );
      }
      if (element.hasAttribute("data-animation-scale")) {
        options.scale = parseFloat(
          element.getAttribute("data-animation-scale"),
        );
      }
      if (element.hasAttribute("data-animation-opacity")) {
        options.opacity = parseFloat(
          element.getAttribute("data-animation-opacity"),
        );
      }
      if (element.hasAttribute("data-animation-blur")) {
        options.blur = parseFloat(element.getAttribute("data-animation-blur"));
      }
      if (element.hasAttribute("data-animation-stagger")) {
        options.stagger = parseFloat(
          element.getAttribute("data-animation-stagger"),
        );
      }

      createTitleAnimation(element, options);
    });

    if (autoElements.length > 0) {
      console.log(
        `Auto-initialized ${autoElements.length} title animation elements`,
      );
    }
  }

  setTimeout(initAutoTitleAnimations, 100);
});

window.createTitleAnimation = createTitleAnimation;
