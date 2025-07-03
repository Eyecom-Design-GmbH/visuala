// GSAP Optimized Infinite Marquee Animation
function createInfiniteMarquee(selector, options = {}) {
  // Default options
  const defaults = {
    speed: 50,              // Pixels per second
    direction: 'left',      // 'left', 'right', 'up', 'down'
    pauseOnHover: true,     // Pause animation on hover
    duplicateContent: true, // Automatically duplicate content for seamless loop
    gap: 50,               // Gap between duplicated content (pixels)
    autoStart: true,       // Start animation immediately
    smooth: true,          // Use smooth animation (vs discrete steps)
    responsive: true,      // Adjust speed on smaller screens
    minDuplicates: 3,      // Minimum number of content duplicates
    preserveStyles: true,  // Preserve original Webflow styles
    containerStyles: {     // Optional container style overrides
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    }
  };
  
  const settings = { ...defaults, ...options };
  
  // Get elements
  const elements = typeof selector === 'string' 
    ? document.querySelectorAll(selector)
    : [selector];
  
  if (elements.length === 0) {
    console.warn(`Marquee: No elements found for selector "${selector}"`);
    return null;
  }

  // Function to set up a single marquee
  function setupMarquee(container) {
    // Skip if already processed
    if (container.classList.contains('marquee-processed')) return;
    
    container.classList.add('marquee-processed');
    
    // Store original styles for potential restoration
    const originalContainerStyles = {
      overflow: container.style.overflow || getComputedStyle(container).overflow,
      whiteSpace: container.style.whiteSpace || getComputedStyle(container).whiteSpace,
      position: container.style.position || getComputedStyle(container).position
    };

    // Find the content wrapper (or create one if needed)
    let content = container.querySelector('.marquee-content');
    let contentCreated = false;
    
    if (!content) {
      // Check if we should create wrapper (only if multiple children or specific structure needed)
      const children = Array.from(container.children);
      if (children.length > 1 || settings.duplicateContent) {
        content = document.createElement('div');
        content.className = 'marquee-content';
        
        // Move children to content wrapper
        children.forEach(child => content.appendChild(child));
        container.appendChild(content);
        contentCreated = true;
      } else {
        // Use the single child as content
        content = children[0] || container;
      }
    }

    // GSAP Best Practice: Use gsap.set() for styling instead of direct CSS
    
    // Only apply container styles if not preserving original styles
    if (!settings.preserveStyles) {
      gsap.set(container, {
        overflow: settings.containerStyles.overflow,
        whiteSpace: settings.containerStyles.whiteSpace,
        position: originalContainerStyles.position === 'static' ? 'relative' : originalContainerStyles.position,
        force3D: true // GPU acceleration
      });
    } else {
      // Minimal required styles only
      gsap.set(container, {
        overflow: 'hidden', // This is required for marquee to work
        force3D: true
      });
    }

    // Set up content styles based on direction
    const isHorizontal = settings.direction === 'left' || settings.direction === 'right';
    
    // GSAP Best Practice: Use gsap.set() with performance optimizations
    if (contentCreated || !settings.preserveStyles) {
      gsap.set(content, {
        display: isHorizontal ? 'inline-flex' : 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        gap: `${settings.gap}px`,
        whiteSpace: 'nowrap',
        willChange: 'transform', // Performance hint
        force3D: true,
        backfaceVisibility: 'hidden' // Performance optimization
      });
      
      // Only add alignment if not preserving styles
      if (!settings.preserveStyles) {
        gsap.set(content, {
          alignItems: isHorizontal ? 'center' : 'stretch'
        });
      }
    }

    // Function to calculate required duplicates and duplicate content
    function setupContentDuplication() {
      if (!settings.duplicateContent) {
        // No duplication needed, just create animation directly
        requestAnimationFrame(() => {
          animation = createAnimation();
        });
        return;
      }

      // Store original content
      const originalContent = content.innerHTML;
      
      // Use GSAP to force layout calculation
      gsap.set(content, { visibility: 'hidden' });
      content.innerHTML = originalContent;
      gsap.set(content, { visibility: 'visible' });
      
      // Get dimensions using RequestAnimationFrame for better performance
      requestAnimationFrame(() => {
        const containerSize = isHorizontal ? container.offsetWidth : container.offsetHeight;
        const contentSize = isHorizontal ? content.scrollWidth : content.scrollHeight;
        
        if (contentSize === 0) {
          console.warn('Marquee: Content size is 0, retrying...');
          setTimeout(() => {
            setupContentDuplication();
          }, 100);
          return;
        }
        
        // Calculate duplicates needed
        const bufferMultiplier = 2;
        const requiredSize = containerSize * bufferMultiplier;
        const duplicatesNeeded = Math.max(
          settings.minDuplicates, 
          Math.ceil(requiredSize / contentSize) + 1
        );
        
        console.log(`Marquee: Container ${containerSize}px, Content ${contentSize}px, Creating ${duplicatesNeeded} duplicates`);
        
        // Create duplicated content with proper structure
        const duplicatedContent = document.createDocumentFragment();
        for (let i = 0; i < duplicatesNeeded; i++) {
          const wrapper = document.createElement('div');
          wrapper.innerHTML = originalContent;
          wrapper.style.display = 'contents'; // Preserve layout
          duplicatedContent.appendChild(wrapper);
        }
        
        content.innerHTML = '';
        content.appendChild(duplicatedContent);
        content.setAttribute('data-duplicates-count', duplicatesNeeded);
        
        // Trigger animation creation after content is ready
        requestAnimationFrame(() => {
          animation = createAnimation();
        });
      });
    }

    // Calculate animation properties
    function getAnimationDistance() {
      const duplicatesCount = parseInt(content.getAttribute('data-duplicates-count')) || 1;
      
      if (isHorizontal) {
        const totalWidth = content.scrollWidth;
        return totalWidth / duplicatesCount;
      } else {
        const totalHeight = content.scrollHeight;
        return totalHeight / duplicatesCount;
      }
    }

    // Create the animation using GSAP best practices
    function createAnimation() {
      const distance = getAnimationDistance();
      const duration = distance / settings.speed;
      
      if (distance === 0) {
        console.warn('Marquee: Animation distance is 0, retrying...');
        setTimeout(() => {
          animation = createAnimation();
        }, 100);
        return null;
      }
      
      // GSAP Best Practice: Set initial position with gsap.set()
      let startPos, endPos;
      
      switch (settings.direction) {
        case 'left':
          startPos = { x: 0, y: 0 };
          endPos = { x: -distance, y: 0 };
          break;
        case 'right':
          startPos = { x: -distance, y: 0 };
          endPos = { x: 0, y: 0 };
          break;
        case 'up':
          startPos = { x: 0, y: 0 };
          endPos = { x: 0, y: -distance };
          break;
        case 'down':
          startPos = { x: 0, y: -distance };
          endPos = { x: 0, y: 0 };
          break;
      }

      // GSAP Best Practice: Set initial state
      gsap.set(content, {
        ...startPos,
        force3D: true,
        willChange: 'transform'
      });

      // GSAP Best Practice: Create optimized animation
      const animation = gsap.to(content, {
        ...endPos,
        duration: duration,
        ease: settings.smooth ? "none" : "power1.inOut",
        repeat: -1,
        repeatRefresh: true,
        paused: !settings.autoStart,
        force3D: true, // GPU acceleration
        transformOrigin: "0 0" // Optimize transform calculations
      });

      return animation;
    }

    // Wait for GSAP to be available
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not available for marquee animation');
      return null;
    }

    // Setup content and create animation
    setupContentDuplication();
    let animation = null;

    // Add pause on hover functionality with GSAP best practices
    if (settings.pauseOnHover) {
      container.addEventListener('mouseenter', () => {
        if (animation) animation.pause();
      }, { passive: true });
      
      container.addEventListener('mouseleave', () => {
        if (animation) animation.play();
      }, { passive: true });
    }

    // GSAP Best Practice: Use ResizeObserver with RequestAnimationFrame
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
      
      // Store cleanup function
      container._marqueeCleanup = () => {
        resizeObserver.disconnect();
        clearTimeout(resizeTimeout);
        if (animation) animation.kill();
      };
    }

    return {
      element: container,
      content: content,
      get animation() { return animation; },
      setAnimation(anim) { animation = anim; },
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
        // Restore original styles if needed
        if (settings.preserveStyles) {
          gsap.set(container, originalContainerStyles);
        }
      }
    };
  }

  // Process all elements
  const processedMarquees = [];
  elements.forEach(element => {
    const marquee = setupMarquee(element);
    if (marquee) processedMarquees.push(marquee);
  });

  console.log(`Marquee: Processed ${processedMarquees.length} marquee elements with GSAP best practices`);

  // Return control object
  return {
    marquees: processedMarquees,
    play: () => processedMarquees.forEach(m => m.play()),
    pause: () => processedMarquees.forEach(m => m.pause()),
    restart: () => processedMarquees.forEach(m => m.restart()),
    reverse: () => processedMarquees.forEach(m => m.reverse()),
    setSpeed: (newSpeed) => processedMarquees.forEach(m => m.setSpeed(newSpeed)),
    cleanup: () => processedMarquees.forEach(m => m.cleanup())
  };
}

// Auto-initialize marquees with data attributes
document.addEventListener('DOMContentLoaded', function() {
  // Wait for GSAP to be available
  function initAutoMarquees() {
    if (typeof gsap === 'undefined') {
      setTimeout(initAutoMarquees, 100);
      return;
    }

    const autoElements = document.querySelectorAll('[data-marquee]');
    
    autoElements.forEach(element => {
      const options = {};
      
      // Get options from data attributes
      if (element.hasAttribute('data-marquee-speed')) {
        options.speed = parseFloat(element.getAttribute('data-marquee-speed'));
      }
      if (element.hasAttribute('data-marquee-direction')) {
        options.direction = element.getAttribute('data-marquee-direction');
      }
      if (element.hasAttribute('data-marquee-pause-on-hover')) {
        options.pauseOnHover = element.getAttribute('data-marquee-pause-on-hover') === 'true';
      }
      if (element.hasAttribute('data-marquee-gap')) {
        options.gap = parseFloat(element.getAttribute('data-marquee-gap'));
      }
      if (element.hasAttribute('data-marquee-duplicate')) {
        options.duplicateContent = element.getAttribute('data-marquee-duplicate') === 'true';
      }
      if (element.hasAttribute('data-marquee-preserve-styles')) {
        options.preserveStyles = element.getAttribute('data-marquee-preserve-styles') === 'true';
      }
      
      createInfiniteMarquee(element, options);
    });

    if (autoElements.length > 0) {
      console.log(`Auto-initialized ${autoElements.length} marquee elements`);
    }
  }

  setTimeout(initAutoMarquees, 100);
});

// Export for manual use
window.createInfiniteMarquee = createInfiniteMarquee; 