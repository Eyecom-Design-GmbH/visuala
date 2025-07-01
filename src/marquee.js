console.log("Infinite Marquee loaded");

// Modular Infinite Marquee Animation
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
    minDuplicates: 3       // Minimum number of content duplicates
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
    
    // Find the content wrapper (or create one)
    let content = container.querySelector('.marquee-content');
    if (!content) {
      // If no .marquee-content, wrap all children
      content = document.createElement('div');
      content.className = 'marquee-content';
      while (container.firstChild) {
        content.appendChild(container.firstChild);
      }
      container.appendChild(content);
    }

    // Set up container styles
    container.style.cssText += `
      overflow: hidden;
      white-space: nowrap;
      position: relative;
    `;

    // Set up content styles based on direction
    const isHorizontal = settings.direction === 'left' || settings.direction === 'right';
    
    content.style.cssText += `
      display: ${isHorizontal ? 'inline-flex' : 'flex'};
      ${isHorizontal ? 'flex-direction: row;' : 'flex-direction: column;'}
      ${isHorizontal ? 'align-items: center;' : 'align-items: stretch;'}
      gap: ${settings.gap}px;
      white-space: nowrap;
    `;

    // Function to calculate required duplicates and duplicate content
    function setupContentDuplication() {
      if (!settings.duplicateContent) return;

      // Store original content
      const originalContent = content.innerHTML;
      
      // Temporarily clear content to measure original size
      content.innerHTML = originalContent;
      
      // Force layout recalculation
      container.offsetHeight;
      
      // Get dimensions
      const containerSize = isHorizontal ? container.offsetWidth : container.offsetHeight;
      const contentSize = isHorizontal ? content.scrollWidth : content.scrollHeight;
      
      if (contentSize === 0) {
        console.warn('Marquee: Content size is 0, retrying...');
        setTimeout(() => setupContentDuplication(), 100);
        return;
      }
      
      // Calculate how many duplicates we need to fill the container + buffer
      const bufferMultiplier = 2; // Extra buffer to ensure no gaps
      const requiredSize = containerSize * bufferMultiplier;
      const duplicatesNeeded = Math.max(
        settings.minDuplicates, 
        Math.ceil(requiredSize / contentSize) + 1
      );
      
      console.log(`Marquee: Container ${containerSize}px, Content ${contentSize}px, Creating ${duplicatesNeeded} duplicates`);
      
      // Create the duplicated content
      let duplicatedHTML = '';
      for (let i = 0; i < duplicatesNeeded; i++) {
        duplicatedHTML += originalContent;
        if (i < duplicatesNeeded - 1) {
          // Add gap between duplicates (except the last one)
          if (isHorizontal) {
            duplicatedHTML += `<div style="width: ${settings.gap}px; flex-shrink: 0;"></div>`;
          } else {
            duplicatedHTML += `<div style="height: ${settings.gap}px; flex-shrink: 0;"></div>`;
          }
        }
      }
      
      content.innerHTML = duplicatedHTML;
      
      // Store the number of duplicates for animation calculation
      content.setAttribute('data-duplicates-count', duplicatesNeeded);
    }

    // Setup content duplication
    setupContentDuplication();

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

    // Create the animation
    function createAnimation() {
      const distance = getAnimationDistance();
      const duration = distance / settings.speed;
      
      if (distance === 0) {
        console.warn('Marquee: Animation distance is 0, retrying...');
        setTimeout(createAnimation, 100);
        return null;
      }
      
      // Set initial position based on direction
      let startPos, endPos;
      
      switch (settings.direction) {
        case 'left':
          startPos = { x: 0 };
          endPos = { x: -distance };
          break;
        case 'right':
          startPos = { x: -distance };
          endPos = { x: 0 };
          break;
        case 'up':
          startPos = { y: 0 };
          endPos = { y: -distance };
          break;
        case 'down':
          startPos = { y: -distance };
          endPos = { y: 0 };
          break;
      }

      // Set initial position
      gsap.set(content, startPos);

      // Create the infinite animation
      const animation = gsap.to(content, {
        ...endPos,
        duration: duration,
        ease: settings.smooth ? "none" : "power1.inOut",
        repeat: -1,
        repeatRefresh: true,
        paused: !settings.autoStart
      });

      return animation;
    }

    // Wait for GSAP to be available
    if (typeof gsap === 'undefined') {
      console.warn('GSAP not available for marquee animation');
      return null;
    }

    const animation = createAnimation();

    // Add pause on hover functionality
    if (settings.pauseOnHover && animation) {
      container.addEventListener('mouseenter', () => {
        animation.pause();
      });
      
      container.addEventListener('mouseleave', () => {
        animation.play();
      });
    }

    // Handle responsive behavior and window resize
    if (settings.responsive) {
      const resizeObserver = new ResizeObserver(() => {
        if (animation) {
          // Recalculate duplicates and animation on resize
          setupContentDuplication();
          
          // Update animation
          setTimeout(() => {
            const newDistance = getAnimationDistance();
            const newDuration = newDistance / settings.speed;
            if (newDistance > 0) {
              animation.duration(newDuration);
            }
          }, 50);
        }
      });
      
      resizeObserver.observe(container);
      
      // Also listen to window resize for better responsiveness
      const handleResize = () => {
        setTimeout(() => {
          setupContentDuplication();
          if (animation) {
            const newDistance = getAnimationDistance();
            const newDuration = newDistance / settings.speed;
            if (newDistance > 0) {
              animation.duration(newDuration);
            }
          }
        }, 100);
      };
      
      window.addEventListener('resize', handleResize);
      
      // Store cleanup function
      container._marqueeCleanup = () => {
        window.removeEventListener('resize', handleResize);
        resizeObserver.disconnect();
      };
    }

    return {
      element: container,
      content: content,
      animation: animation,
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
      }
    };
  }

  // Process all elements
  const processedMarquees = [];
  elements.forEach(element => {
    const marquee = setupMarquee(element);
    if (marquee) processedMarquees.push(marquee);
  });

  console.log(`Marquee: Processed ${processedMarquees.length} marquee elements`);

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
      if (element.hasAttribute('data-marquee-auto-start')) {
        options.autoStart = element.getAttribute('data-marquee-auto-start') === 'true';
      }
      if (element.hasAttribute('data-marquee-min-duplicates')) {
        options.minDuplicates = parseInt(element.getAttribute('data-marquee-min-duplicates'));
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