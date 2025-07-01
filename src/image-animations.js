console.log("Image Animations loaded");

// Modular Image Animation System
function createImageAnimation(selector, options = {}) {
  // Default options
  const defaults = {
    animationType: 'slideUp',     // 'slideUp', 'slideDown', 'slideLeft', 'slideRight', 'fade', 'scale', 'rotate'
    distance: 100,                // Distance to move (pixels or percentage)
    duration: 1,                  // Animation duration in seconds
    ease: "power2.out",           // Animation easing
    delay: 0,                     // Delay before animation starts
    stagger: 0,                   // Stagger time between multiple images
    trigger: 'scroll',            // 'scroll', 'click', 'hover', 'manual', 'immediate'
    triggerStart: "top 80%",      // ScrollTrigger start position
    triggerEnd: "bottom 20%",     // ScrollTrigger end position
    scrub: false,                 // ScrollTrigger scrub (true/false or number)
    toggleActions: "play none none none", // ScrollTrigger toggle actions
    scale: 1.1,                   // Scale amount for scale animation
    rotation: 360,                // Rotation amount for rotate animation
    opacity: 0,                   // Starting opacity
    blur: 0,                      // Starting blur amount
    autoPlay: true,               // Whether to auto-play the animation
    once: true                    // Play animation only once
  };
  
  const settings = { ...defaults, ...options };
  
  // Get elements
  const elements = typeof selector === 'string' 
    ? document.querySelectorAll(selector)
    : [selector];
  
  if (elements.length === 0) {
    console.warn(`Image Animation: No elements found for selector "${selector}"`);
    return null;
  }

  // Function to get initial animation properties based on type
  function getInitialProps(animationType, distance, scale, opacity, blur, rotation) {
    const props = { opacity: opacity };
    
    if (blur > 0) props.filter = `blur(${blur}px)`;
    
    switch (animationType) {
      case 'slideUp':
        props.y = distance;
        break;
      case 'slideDown':
        props.y = -distance;
        break;
      case 'slideLeft':
        props.x = distance;
        break;
      case 'slideRight':
        props.x = -distance;
        break;
      case 'scale':
        props.scale = scale;
        break;
      case 'rotate':
        props.rotation = rotation;
        props.scale = 0.8;
        break;
      case 'fade':
        // Only opacity change
        break;
      default:
        props.y = distance; // Default to slideUp
    }
    
    return props;
  }

  // Function to get final animation properties
  function getFinalProps(animationType, blur) {
    const props = { 
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0
    };
    
    if (blur > 0) props.filter = `blur(0px)`;
    
    return props;
  }

  // Function to setup a single image animation
  function setupImageAnimation(element) {
    // Skip if already processed
    if (element.classList.contains('image-animation-processed')) return;
    
    element.classList.add('image-animation-processed');

    // Set initial state
    const initialProps = getInitialProps(
      settings.animationType, 
      settings.distance, 
      settings.scale, 
      settings.opacity, 
      settings.blur,
      settings.rotation
    );
    
    gsap.set(element, initialProps);

    // Create animation function
    function createAnimation() {
      const finalProps = getFinalProps(settings.animationType, settings.blur);
      
      return gsap.to(element, {
        ...finalProps,
        duration: settings.duration,
        ease: settings.ease,
        delay: settings.delay
      });
    }

    // Handle different trigger types
    let animation = null;
    let scrollTrigger = null;

    switch (settings.trigger) {
      case 'scroll':
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
              markers: false
            }
          });
        }
        break;

      case 'click':
        element.style.cursor = 'pointer';
        element.addEventListener('click', () => {
          if (!animation || !settings.once) {
            animation = createAnimation();
          }
        });
        break;

      case 'hover':
        element.addEventListener('mouseenter', () => {
          if (!animation || !settings.once) {
            animation = createAnimation();
          }
        });
        break;

      case 'immediate':
        if (settings.autoPlay) {
          animation = createAnimation();
        }
        break;

      case 'manual':
        // Animation will be triggered manually via returned control object
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
          settings.rotation
        );
        gsap.set(element, initialProps);
        animation = null;
      },
      pause: () => animation?.pause(),
      resume: () => animation?.resume(),
      reverse: () => animation?.reverse()
    };
  }

  // Wait for GSAP to be available
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not available for image animations');
    return null;
  }

  // Process all elements
  const processedImages = [];
  elements.forEach((element, index) => {
    // Apply stagger delay
    const staggeredOptions = { ...settings };
    if (settings.stagger > 0) {
      staggeredOptions.delay = settings.delay + (index * settings.stagger);
    }
    
    const tempSettings = settings;
    Object.assign(settings, staggeredOptions);
    
    const imageAnimation = setupImageAnimation(element);
    if (imageAnimation) processedImages.push(imageAnimation);
    
    Object.assign(settings, tempSettings); // Restore original settings
  });

  console.log(`Image Animation: Processed ${processedImages.length} image elements`);

  // Return control object
  return {
    images: processedImages,
    play: () => processedImages.forEach(img => img.play()),
    reset: () => processedImages.forEach(img => img.reset()),
    pause: () => processedImages.forEach(img => img.pause()),
    resume: () => processedImages.forEach(img => img.resume()),
    reverse: () => processedImages.forEach(img => img.reverse())
  };
}

// Auto-initialize images with data attributes
document.addEventListener('DOMContentLoaded', function() {
  // Wait for GSAP to be available
  function initAutoImageAnimations() {
    if (typeof gsap === 'undefined') {
      setTimeout(initAutoImageAnimations, 100);
      return;
    }

    const autoElements = document.querySelectorAll('[data-image-animation]');
    
    autoElements.forEach(element => {
      const options = {};
      
      // Get options from data attributes
      if (element.hasAttribute('data-animation-type')) {
        options.animationType = element.getAttribute('data-animation-type');
      }
      if (element.hasAttribute('data-animation-distance')) {
        options.distance = parseFloat(element.getAttribute('data-animation-distance'));
      }
      if (element.hasAttribute('data-animation-duration')) {
        options.duration = parseFloat(element.getAttribute('data-animation-duration'));
      }
      if (element.hasAttribute('data-animation-delay')) {
        options.delay = parseFloat(element.getAttribute('data-animation-delay'));
      }
      if (element.hasAttribute('data-animation-ease')) {
        options.ease = element.getAttribute('data-animation-ease');
      }
      if (element.hasAttribute('data-animation-trigger')) {
        options.trigger = element.getAttribute('data-animation-trigger');
      }
      if (element.hasAttribute('data-animation-trigger-start')) {
        options.triggerStart = element.getAttribute('data-animation-trigger-start');
      }
      if (element.hasAttribute('data-animation-scrub')) {
        const scrubValue = element.getAttribute('data-animation-scrub');
        options.scrub = scrubValue === 'true' ? true : (scrubValue === 'false' ? false : parseFloat(scrubValue));
      }
      if (element.hasAttribute('data-animation-opacity')) {
        options.opacity = parseFloat(element.getAttribute('data-animation-opacity'));
      }
      if (element.hasAttribute('data-animation-blur')) {
        options.blur = parseFloat(element.getAttribute('data-animation-blur'));
      }
      if (element.hasAttribute('data-animation-scale')) {
        options.scale = parseFloat(element.getAttribute('data-animation-scale'));
      }
      
      createImageAnimation(element, options);
    });

    if (autoElements.length > 0) {
      console.log(`Auto-initialized ${autoElements.length} image animation elements`);
    }
  }

  setTimeout(initAutoImageAnimations, 100);
});

// Export for manual use
window.createImageAnimation = createImageAnimation; 