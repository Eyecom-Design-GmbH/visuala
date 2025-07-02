console.log("Typewriter effect loaded - GSAP Optimized");

// GSAP Optimized Typewriter Effect Function
function createTypewriter(selector, words, options = {}) {
  // Default options following GSAP best practices
  const defaults = {
    typeSpeed: 0.08,          // Base speed of typing (seconds per character)
    deleteSpeed: 0.06,        // Base speed of deleting (seconds per character)
    pauseTime: 2.5,           // Pause time between words (seconds)
    loop: true,               // Whether to loop infinitely
    cursor: true,             // Whether to show a blinking cursor
    cursorWidth: '2px',       // Width of cursor line
    cursorColor: '#f2f200',   // Color of cursor
    ease: 'power2.out'        // GSAP easing function
  };
  
  const settings = { ...defaults, ...options };
  
  // Get the element
  const element = document.querySelector(selector);
  if (!element) {
    console.error(`Typewriter: Element with selector "${selector}" not found`);
    return null;
  }
  
  // Store original text content
  const originalText = element.textContent;
  
  // Create container structure
  element.innerHTML = '';
  const textContainer = document.createElement('span');
  textContainer.className = 'typewriter-text';
  textContainer.style.display = 'inline-block';
  element.appendChild(textContainer);
  
  // Create cursor element
  let cursorElement = null;
  if (settings.cursor) {
    cursorElement = document.createElement('span');
    cursorElement.className = 'typewriter-cursor';
    
    // GSAP Best Practice: Use gsap.set() for initial styles
    gsap.set(cursorElement, {
      display: 'inline-block',
      width: settings.cursorWidth,
      height: '1.2em',
      backgroundColor: settings.cursorColor,
      marginLeft: '2px',
      opacity: 1,
      force3D: true  // GPU acceleration
    });
    
    element.appendChild(cursorElement);
    
    // GSAP Best Practice: Use timeline for cursor animation
    const cursorTl = gsap.timeline({ repeat: -1, yoyo: true });
    cursorTl.to(cursorElement, {
      opacity: 0,
      duration: 0.8,
      ease: settings.ease
    });
  }
  
  // State management
  let currentWordIndex = 0;
  let masterTimeline = gsap.timeline();
  
  // GSAP Best Practice: Use timeline for animation sequences
  function createWordAnimation(word, isFirstWord = false) {
    const tl = gsap.timeline();
    
    if (!isFirstWord) {
      // Delete previous word - capture current text length
      const currentText = textContainer.textContent;
      
      // Add deletion calls with proper timing
      for (let i = currentText.length; i > 0; i--) {
        tl.call(() => {
          textContainer.textContent = textContainer.textContent.slice(0, -1);
        });
        
        // Add delay after each deletion (except the last one)
        if (i > 1) {
          tl.to({}, { duration: settings.deleteSpeed });
        }
      }
      
      // Pause before new word
      tl.to({}, { duration: 0.3 });
    } else {
      // Initial delay for first word
      tl.to({}, { duration: 0.5 });
    }
    
    // Type new word
    for (let i = 0; i < word.length; i++) {
      tl.call(() => {
        textContainer.textContent += word[i];
      });
      
      // Add delay after each character (except the last one)
      if (i < word.length - 1) {
        tl.to({}, { duration: settings.typeSpeed });
      }
    }
    
    // Pause after word completion
    tl.to({}, { duration: settings.pauseTime });
    
    return tl;
  }
  
  function startTypewriter() {
    // GSAP Best Practice: Kill existing animations before starting new ones
    masterTimeline.kill();
    masterTimeline = gsap.timeline({ 
      repeat: settings.loop ? -1 : 0,
      onComplete: () => {
        if (!settings.loop) {
          textContainer.textContent = originalText;
          if (cursorElement) {
            gsap.killTweensOf(cursorElement);
            cursorElement.remove();
          }
        }
      }
    });
    
    // GSAP Best Practice: Set initial state
    gsap.set(textContainer, { 
      textContent: '',
      force3D: true 
    });
    
    // Create animation sequence for all words
    words.forEach((word, index) => {
      const wordTl = createWordAnimation(word, index === 0);
      masterTimeline.add(wordTl);
    });
    
    return masterTimeline;
  }
  
  // Initialize the animation
  const animation = startTypewriter();
  
  // GSAP Best Practice: Return control object with proper cleanup
  return {
    timeline: animation,
    
    play: () => animation.play(),
    
    pause: () => animation.pause(),
    
    stop: () => {
      animation.kill();
      if (cursorElement) {
        gsap.killTweensOf(cursorElement);
        cursorElement.remove();
      }
      textContainer.textContent = originalText;
    },
    
    restart: () => {
      currentWordIndex = 0;
      return startTypewriter();
    },
    
    // GSAP Best Practice: Provide access to timeline for advanced control
    getTimeline: () => animation,
    
    // Performance: Cleanup method
    destroy: () => {
      animation.kill();
      if (cursorElement) {
        gsap.killTweensOf(cursorElement);
        cursorElement.remove();
      }
      element.innerHTML = originalText;
    }
  };
}

// Auto-initialize elements with data attributes
document.addEventListener('DOMContentLoaded', function() {
  // Wait for GSAP to be available
  function initTypewriters() {
    if (typeof gsap === 'undefined') {
      setTimeout(initTypewriters, 100);
      return;
    }
    
    const typewriterElements = document.querySelectorAll('[data-typewriter]');
    
    typewriterElements.forEach(element => {
      const wordsData = element.getAttribute('data-typewriter');
      if (!wordsData) return;
      
      const words = wordsData.split(',').map(word => word.trim());
      
      // Get options from data attributes with performance defaults
      const options = {
        typeSpeed: parseFloat(element.getAttribute('data-type-speed')) || 0.08,
        deleteSpeed: parseFloat(element.getAttribute('data-delete-speed')) || 0.06,
        pauseTime: parseFloat(element.getAttribute('data-pause-time')) || 2.5,
        cursor: element.getAttribute('data-cursor') !== 'false',
        cursorColor: element.getAttribute('data-cursor-color') || '#f2f200',
        loop: element.getAttribute('data-loop') !== 'false',
        ease: element.getAttribute('data-ease') || 'power2.out'
      };
      
      // Create typewriter effect with unique selector
      if (!element.id) {
        element.id = `typewriter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }
      
      createTypewriter(`#${element.id}`, words, options);
    });
    
    console.log(`Initialized ${typewriterElements.length} typewriter elements with GSAP best practices`);
  }
  
  setTimeout(initTypewriters, 100);
});

// Export for manual use
window.createTypewriter = createTypewriter; 