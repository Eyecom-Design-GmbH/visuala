console.log("Typewriter effect loaded");

// GSAP Typewriter Effect Function with Natural Animations
function createTypewriter(selector, words, options = {}) {
  // Default options
  const defaults = {
    typeSpeed: 0.08,          // Base speed of typing (seconds per character)
    deleteSpeed: 0.04,        // Base speed of deleting (seconds per character)
    pauseTime: 2.5,           // Pause time between words (seconds)
    loop: true,               // Whether to loop infinitely
    cursor: true,             // Whether to show a blinking cursor
    cursorChar: '|',          // Character to use for cursor
    naturalVariation: true,   // Add natural timing variations
    blurEffect: true,         // Add blur effect during transitions
    cursorWidth: '2px',       // Width of cursor line
    cursorColor: 'currentColor' // Color of cursor
  };
  
  const settings = { ...defaults, ...options };
  
  // Get the element
  const element = document.querySelector(selector);
  if (!element) {
    console.error(`Typewriter: Element with selector "${selector}" not found`);
    return;
  }
  
  // Store original text content
  const originalText = element.textContent;
  
  // Add CSS styles for the typewriter
  if (!document.querySelector('#typewriter-styles')) {
    const style = document.createElement('style');
    style.id = 'typewriter-styles';
    style.textContent = `
      .typewriter-cursor {
        display: inline-block;
        background-color: ${settings.cursorColor};
        width: ${settings.cursorWidth};
        margin-left: 2px;
        animation: none !important;
      }
      .typewriter-text {
        display: inline-block;
        transition: filter 0.1s ease;
      }
      .typewriter-blur {
        filter: blur(1px);
      }
    `;
    document.head.appendChild(style);
  }
  
  // Wrap element content for blur effects
  if (settings.blurEffect) {
    const wrapper = document.createElement('span');
    wrapper.className = 'typewriter-text';
    wrapper.textContent = element.textContent;
    element.textContent = '';
    element.appendChild(wrapper);
  }
  
  const textElement = settings.blurEffect ? element.querySelector('.typewriter-text') : element;
  
  // Create cursor element
  let cursorElement = null;
  if (settings.cursor) {
    cursorElement = document.createElement('span');
    cursorElement.className = 'typewriter-cursor';
    cursorElement.style.height = '1.2em';
    cursorElement.style.opacity = '1';
    element.appendChild(cursorElement);
    
    // Professional cursor blinking animation
    gsap.to(cursorElement, {
      opacity: 0,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });
  }
  
  let currentWordIndex = 0;
  let isDeleting = false;
  
  // Function to get natural timing variation
  function getNaturalSpeed(baseSpeed, isTyping = true) {
    if (!settings.naturalVariation) return baseSpeed;
    
    // Add human-like variation (faster/slower based on character)
    const variation = (Math.random() - 0.5) * 0.02; // ±0.01s variation
    const pauseChance = Math.random();
    
    // Occasional longer pauses (like thinking)
    if (isTyping && pauseChance < 0.1) {
      return baseSpeed + 0.15; // Brief hesitation
    }
    
    return baseSpeed + variation;
  }
  
  function addBlurEffect() {
    if (settings.blurEffect && textElement) {
      textElement.classList.add('typewriter-blur');
    }
  }
  
  function removeBlurEffect() {
    if (settings.blurEffect && textElement) {
      textElement.classList.remove('typewriter-blur');
    }
  }
  
  function typeWord() {
    const currentWord = words[currentWordIndex];
    const currentText = textElement.textContent;
    
    if (!isDeleting) {
      // Typing phase
      if (currentText.length < currentWord.length) {
        // Add slight blur before typing next character
        if (settings.blurEffect && Math.random() < 0.3) {
          addBlurEffect();
          gsap.delayedCall(0.02, () => {
            removeBlurEffect();
            const nextChar = currentWord[currentText.length];
            textElement.textContent = currentText + nextChar;
          });
        } else {
          const nextChar = currentWord[currentText.length];
          textElement.textContent = currentText + nextChar;
        }
        
        const speed = getNaturalSpeed(settings.typeSpeed, true);
        gsap.delayedCall(speed, typeWord);
      } else {
        // Word is complete, pause then start deleting
        removeBlurEffect();
        gsap.delayedCall(settings.pauseTime, () => {
          isDeleting = true;
          addBlurEffect();
          gsap.delayedCall(0.2, () => {
            removeBlurEffect();
            typeWord();
          });
        });
      }
    } else {
      // Deleting phase
      if (currentText.length > 0) {
        // Add subtle blur during deletion
        if (settings.blurEffect && Math.random() < 0.2) {
          addBlurEffect();
          gsap.delayedCall(0.02, () => {
            removeBlurEffect();
            textElement.textContent = currentText.slice(0, -1);
          });
        } else {
          textElement.textContent = currentText.slice(0, -1);
        }
        
        const speed = getNaturalSpeed(settings.deleteSpeed, false);
        gsap.delayedCall(speed, typeWord);
      } else {
        // Word is deleted, move to next word
        isDeleting = false;
        currentWordIndex = (currentWordIndex + 1) % words.length;
        
        // If not looping and we've reached the end, stop
        if (!settings.loop && currentWordIndex === 0) {
          textElement.textContent = originalText;
          if (cursorElement) {
            cursorElement.remove();
          }
          removeBlurEffect();
          return;
        }
        
        // Brief pause before starting new word
        removeBlurEffect();
        gsap.delayedCall(0.3, typeWord);
      }
    }
  }
  
  // Start the animation with initial blur
  textElement.textContent = '';
  if (settings.blurEffect) {
    addBlurEffect();
    gsap.delayedCall(0.5, () => {
      removeBlurEffect();
      typeWord();
    });
  } else {
    gsap.delayedCall(0.5, typeWord);
  }
  
  // Return control object
  return {
    stop: function() {
      gsap.killDelayedCallsTo(typeWord);
      if (cursorElement) {
        gsap.killTweensOf(cursorElement);
        cursorElement.remove();
      }
      removeBlurEffect();
    },
    restart: function() {
      currentWordIndex = 0;
      isDeleting = false;
      textElement.textContent = '';
      if (settings.blurEffect) {
        addBlurEffect();
        gsap.delayedCall(0.5, () => {
          removeBlurEffect();
          typeWord();
        });
      } else {
        gsap.delayedCall(0.5, typeWord);
      }
    }
  };
}

// Initialize typewriters when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Auto-initialize elements with data-typewriter attribute
  const typewriterElements = document.querySelectorAll('[data-typewriter]');
  
  typewriterElements.forEach(element => {
    const wordsData = element.getAttribute('data-typewriter');
    const words = wordsData.split(',').map(word => word.trim());
    
    // Get options from data attributes
    const options = {};
    if (element.hasAttribute('data-type-speed')) {
      options.typeSpeed = parseFloat(element.getAttribute('data-type-speed'));
    }
    if (element.hasAttribute('data-delete-speed')) {
      options.deleteSpeed = parseFloat(element.getAttribute('data-delete-speed'));
    }
    if (element.hasAttribute('data-pause-time')) {
      options.pauseTime = parseFloat(element.getAttribute('data-pause-time'));
    }
    if (element.hasAttribute('data-cursor')) {
      options.cursor = element.getAttribute('data-cursor') === 'true';
    }
    if (element.hasAttribute('data-cursor-color')) {
      options.cursorColor = element.getAttribute('data-cursor-color');
    }
    if (element.hasAttribute('data-blur-effect')) {
      options.blurEffect = element.getAttribute('data-blur-effect') === 'true';
    }
    
    // Create typewriter effect
    createTypewriter(`[data-typewriter="${wordsData}"]`, words, options);
  });
});

// Export for manual use
window.createTypewriter = createTypewriter; 