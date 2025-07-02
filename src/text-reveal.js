console.log("Text Reveal Animation loaded");

// ===== MOBILE PERFORMANCE DETECTION =====
const isMobile = (() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
    const isMobileUserAgent = mobileKeywords.some(keyword => userAgent.includes(keyword));
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    return isMobileUserAgent || (isTouchDevice && isSmallScreen);
})();

// ===== PERFORMANCE OPTIMIZATION UTILITIES =====
const PERFORMANCE_CONFIG = {
  maxWords: isMobile ? 15 : 50,           // Limit word count
  useBlur: !isMobile,                     // Disable blur on mobile
  useBatching: true,                      // Batch DOM operations
  useForce3D: true,                       // Force GPU acceleration
  preferredFPS: isMobile ? 30 : 60        // Adaptive frame rate
};

// Batch DOM operations for better performance
function batchDOMOperations(operations) {
  if (!PERFORMANCE_CONFIG.useBatching) {
    operations.forEach(op => op());
    return;
  }
  
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      operations.forEach(op => op());
      resolve();
    });
  });
}

// Modular Text Blur Reveal Animation
function createTextReveal(selector, options = {}) {
  // Default options
  const defaults = {
    blurAmount: 8,            // Initial blur in pixels
    moveDistance: 100,        // Horizontal movement distance in pixels
    duration: 1.5,            // Animation duration
    staggerAmount: 0.05,      // Stagger between each word (in seconds)
    triggerStart: "top 90%",  // When to start animation
    triggerEnd: "top 20%",    // When animation ends
    ease: "power4.out",       // Animation easing
    splitSpaces: true,        // Whether to animate spaces too
    autoInit: false,          // Whether to auto-initialize on scroll
    scrub: false,             // Whether to scrub with scroll (true/false or number)
    toggleActions: "play none none none", // ScrollTrigger toggle actions
    direction: "left"         // Animation direction: "left", "right", "up", "down"
  };
  
  const settings = { ...defaults, ...options };
  
  // ===== MOBILE PERFORMANCE OPTIMIZATION =====
  if (isMobile) {
    // Simplify animation for mobile
    settings.blurAmount = 0;  // Disable blur on mobile (expensive)
    settings.moveDistance = Math.min(settings.moveDistance, 30); // Reduce movement
    settings.duration = Math.max(0.4, settings.duration * 0.7); // Faster animation
    settings.staggerAmount = Math.max(0.03, settings.staggerAmount * 2); // INCREASE stagger for mobile
    settings.splitSpaces = false; // Don't animate spaces on mobile
    
    console.log('🔋 Text Reveal: Mobile optimization applied');
  }
  
  // Get elements
  const elements = typeof selector === 'string' 
    ? document.querySelectorAll(selector)
    : [selector];
  
  if (elements.length === 0) {
    return null;
  }

  // Function to get transform properties based on direction
  function getTransformProperties(direction, distance) {
    switch(direction) {
      case 'right':
        return { x: distance, y: 0 };
      case 'up':
        return { x: 0, y: -distance };
      case 'down':
        return { x: 0, y: distance };
      case 'left':
      default:
        return { x: -distance, y: 0 };
    }
  }

  // Mobile-optimized simple text processing
  function processMobileText(element) {
    const text = element.textContent;
    const words = text.split(' ').filter(word => word.trim() !== '');
    
    // Limit number of words on mobile to prevent performance issues
    const maxWords = 15;
    const wordsToAnimate = words.slice(0, maxWords);
    
    if (wordsToAnimate.length < words.length) {
      console.log(`🔋 Text Reveal: Limited to ${maxWords} words on mobile (${words.length} total)`);
    }
    
    element.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    wordsToAnimate.forEach((word, index) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'text-reveal-word';
      wordSpan.textContent = word;
      
      const transform = getTransformProperties(settings.direction, settings.moveDistance);
      wordSpan.style.cssText = `
        opacity: 0;
        ${settings.blurAmount > 0 && PERFORMANCE_CONFIG.useBlur ? `filter: blur(${settings.blurAmount}px);` : ''}
        transform: translateX(${transform.x}px) translateY(${transform.y}px) ${PERFORMANCE_CONFIG.useForce3D ? 'translateZ(0)' : ''};
        display: inline-block;
        ${PERFORMANCE_CONFIG.useForce3D ? 'will-change: transform, opacity;' : ''}
        backface-visibility: hidden;
      `;
      fragment.appendChild(wordSpan);
      
      // Add space after word (except for the last word)
      if (index < wordsToAnimate.length - 1) {
        fragment.appendChild(document.createTextNode(' '));
      }
    });
    
    element.appendChild(fragment);
  }

  // Function to recursively process text nodes while preserving HTML structure
  function processTextNodes(node) {
    // Use mobile optimization if on mobile
    if (isMobile) {
      processMobileText(node);
      return;
    }
    
    const walker = document.createTreeWalker(
      node,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const textNodes = [];
    let currentNode;
    
    while (currentNode = walker.nextNode()) {
      if (currentNode.textContent.trim() !== '') {
        textNodes.push(currentNode);
      }
    }

    textNodes.forEach(textNode => {
      const text = textNode.textContent;
      
      // Split text into words but preserve spaces between them
      const words = text.split(' ');
      
      if (words.length <= 1) {
        // Single word or no spaces, still wrap it
        if (text.trim() !== '') {
          const wordSpan = document.createElement('span');
          wordSpan.className = 'text-reveal-word';
          wordSpan.textContent = text;
          
          const transform = getTransformProperties(settings.direction, settings.moveDistance);
          wordSpan.style.cssText = `
            opacity: 0;
            ${settings.blurAmount > 0 && PERFORMANCE_CONFIG.useBlur ? `filter: blur(${settings.blurAmount}px);` : ''}
            transform: translateX(${transform.x}px) translateY(${transform.y}px) ${PERFORMANCE_CONFIG.useForce3D ? 'translateZ(0)' : ''};
            display: inline-block;
            ${PERFORMANCE_CONFIG.useForce3D ? 'will-change: transform, opacity;' : ''}
            backface-visibility: hidden;
          `;
          textNode.parentNode.replaceChild(wordSpan, textNode);
        }
        return;
      }

      const fragment = document.createDocumentFragment();
      
      words.forEach((word, index) => {
        if (word.trim() !== '') {
          // Create span for word
          const wordSpan = document.createElement('span');
          wordSpan.className = 'text-reveal-word';
          wordSpan.setAttribute('data-word', word);
          wordSpan.textContent = word;
          
          const transform = getTransformProperties(settings.direction, settings.moveDistance);
          wordSpan.style.cssText = `
            opacity: 0;
            ${settings.blurAmount > 0 && PERFORMANCE_CONFIG.useBlur ? `filter: blur(${settings.blurAmount}px);` : ''}
            transform: translateX(${transform.x}px) translateY(${transform.y}px) ${PERFORMANCE_CONFIG.useForce3D ? 'translateZ(0)' : ''};
            display: inline-block;
            ${PERFORMANCE_CONFIG.useForce3D ? 'will-change: transform, opacity;' : ''}
            backface-visibility: hidden;
          `;
          fragment.appendChild(wordSpan);
        }
        
        // Add space after word (except for the last word)
        if (index < words.length - 1) {
          if (settings.splitSpaces) {
            const spaceSpan = document.createElement('span');
            spaceSpan.className = 'text-reveal-whitespace';
            spaceSpan.innerHTML = '\u00A0'; // Non-breaking space
            
            const transform = getTransformProperties(settings.direction, settings.moveDistance);
            spaceSpan.style.cssText = `
              opacity: 0;
              ${settings.blurAmount > 0 && PERFORMANCE_CONFIG.useBlur ? `filter: blur(${settings.blurAmount}px);` : ''}
              transform: translateX(${transform.x}px) translateY(${transform.y}px) ${PERFORMANCE_CONFIG.useForce3D ? 'translateZ(0)' : ''};
              display: inline-block;
              ${PERFORMANCE_CONFIG.useForce3D ? 'will-change: transform, opacity;' : ''}
              backface-visibility: hidden;
            `;
            fragment.appendChild(spaceSpan);
          } else {
            // Add regular space as text node
            fragment.appendChild(document.createTextNode(' '));
          }
        }
      });

      // Replace the original text node with our wrapped version
      textNode.parentNode.replaceChild(fragment, textNode);
    });
  }

  // Function to split text into words and create animation while preserving HTML
  function setupTextReveal(element) {
    // Skip if element doesn't exist or is already processed
    if (!element || !element.classList) return null;
    if (element.classList.contains('text-reveal-processed')) return element;
    
    // Mark as processed
    element.classList.add('text-reveal-processed');
    
    // Process all text nodes recursively while preserving HTML structure
    processTextNodes(element);

    return element;
  }

  // Function to animate an element
  function animateTextReveal(element) {
    const spans = element.querySelectorAll('.text-reveal-word, .text-reveal-whitespace');
    
    if (spans.length === 0) return;

    // Limit words for performance
    const maxSpans = Math.min(spans.length, PERFORMANCE_CONFIG.maxWords);
    const spansToAnimate = Array.from(spans).slice(0, maxSpans);
    
    if (maxSpans < spans.length) {
      console.log(`🔧 Performance: Limited to ${maxSpans}/${spans.length} words for performance`);
    }

    // GSAP Performance Optimizations
    const animationConfig = {
      x: 0,
      y: 0,
      opacity: 1,
      duration: settings.duration,
      ease: settings.ease,
      stagger: settings.staggerAmount,
      force3D: PERFORMANCE_CONFIG.useForce3D,  // Force GPU acceleration
      transformOrigin: "center center"         // Optimize transform calculations
    };
    
    // Only add filter if blur is enabled and supported
    if (settings.blurAmount > 0 && PERFORMANCE_CONFIG.useBlur) {
      animationConfig.filter = "blur(0px)";
    }

    // Add ScrollTrigger if auto-initializing
    if (settings.autoInit) {
      animationConfig.scrollTrigger = {
        trigger: element,
        start: settings.triggerStart,
        end: settings.triggerEnd,
        toggleActions: settings.toggleActions,
        scrub: settings.scrub,
        markers: false,
        fastScrollEnd: true,           // Optimize for fast scrolling
        refreshPriority: 1             // Lower priority for better performance
      };
    }

    // Create the animation
    const tl = gsap.to(spansToAnimate, animationConfig);

    return tl;
  }

  // Setup all elements
  const processedElements = [];
  elements.forEach(element => {
    const processed = setupTextReveal(element);
    if (processed) processedElements.push(processed);
  });

  // Auto-initialize with scroll trigger if enabled
  if (settings.autoInit) {
    processedElements.forEach(element => {
      animateTextReveal(element);
    });
  }

  console.log(`Text Reveal: Processed ${processedElements.length} elements`);

  // Return control object
  return {
    elements: processedElements,
    animate: function(elementIndex = null) {
      if (elementIndex !== null && processedElements[elementIndex]) {
        return animateTextReveal(processedElements[elementIndex]);
      } else {
        // Animate all elements
        const timelines = processedElements.map(element => animateTextReveal(element));
        return timelines;
      }
    },
    reset: function() {
      processedElements.forEach(element => {
        const spans = element.querySelectorAll('.text-reveal-word, .text-reveal-whitespace');
        const transform = getTransformProperties(settings.direction, settings.moveDistance);
        const resetConfig = {
          opacity: 0,
          x: transform.x,
          y: transform.y
        };
        
        // Only add filter reset if blur was used
        if (settings.blurAmount > 0 && PERFORMANCE_CONFIG.useBlur) {
          resetConfig.filter = `blur(${settings.blurAmount}px)`;
        }
        
        gsap.set(spans, resetConfig);
      });
    }
  };
}

// Auto-initialize elements with data-text-reveal attribute
document.addEventListener('DOMContentLoaded', function() {
  // Wait for GSAP to be available
  function initAutoTextReveal() {
    if (typeof gsap === 'undefined') {
      setTimeout(initAutoTextReveal, 100);
      return;
    }

    const autoElements = document.querySelectorAll('[data-text-reveal]');
    
    autoElements.forEach(element => {
      const options = {};
      
      // Get options from data attributes
      if (element.hasAttribute('data-blur-amount')) {
        options.blurAmount = parseFloat(element.getAttribute('data-blur-amount'));
      }
      if (element.hasAttribute('data-move-distance')) {
        options.moveDistance = parseFloat(element.getAttribute('data-move-distance'));
      }
      if (element.hasAttribute('data-duration')) {
        options.duration = parseFloat(element.getAttribute('data-duration'));
      }
      if (element.hasAttribute('data-stagger-amount')) {
        options.staggerAmount = parseFloat(element.getAttribute('data-stagger-amount'));
      }
      if (element.hasAttribute('data-trigger-start')) {
        options.triggerStart = element.getAttribute('data-trigger-start');
      }
      if (element.hasAttribute('data-direction')) {
        options.direction = element.getAttribute('data-direction');
      }
      if (element.hasAttribute('data-scrub')) {
        const scrubValue = element.getAttribute('data-scrub');
        options.scrub = scrubValue === 'true' ? true : (scrubValue === 'false' ? false : parseFloat(scrubValue));
      }
      
      // Enable auto-initialization
      options.autoInit = true;
      
      createTextReveal(element, options);
    });

    if (autoElements.length > 0) {
      console.log(`Auto-initialized ${autoElements.length} text reveal elements`);
    }
  }

  setTimeout(initAutoTextReveal, 100);
});

// Export for manual use
window.createTextReveal = createTextReveal;