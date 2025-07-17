
// Simple, Reliable Typewriter Effect Function
function createTypewriter(selector, words, options = {}) {
  // Default options
  const defaults = {
    typeSpeed: 0.08,          // Speed of typing (seconds per character)
    deleteSpeed: 0.06,        // Speed of deleting (seconds per character)
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

    // Set cursor styles
    gsap.set(cursorElement, {
      display: 'inline-block',
      width: settings.cursorWidth,
      height: '1.2em',
      backgroundColor: settings.cursorColor,
      marginLeft: '2px',
      opacity: 1,
      force3D: true
    });

    element.appendChild(cursorElement);

    // Cursor blinking animation
    gsap.to(cursorElement, {
      opacity: 0,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: settings.ease
    });
  }

  // State variables
  let currentWordIndex = 0;
  let isRunning = false;

  // Main animation function
  function startAnimation() {
    if (isRunning) return;
    isRunning = true;

    // Clear text and start typing first word
    textContainer.textContent = '';
    currentWordIndex = 0;

    // Start typing the first word after initial delay
    gsap.delayedCall(0.5, () => {
      typeWord(words[currentWordIndex]);
    });
  }

  // Type a word character by character
  function typeWord(word) {
    let charIndex = 0;

    function typeNextChar() {
      if (charIndex < word.length) {
        textContainer.textContent += word[charIndex];
        charIndex++;
        gsap.delayedCall(settings.typeSpeed, typeNextChar);
      } else {
        // Word complete, pause then delete
        gsap.delayedCall(settings.pauseTime, () => {
          deleteWord();
        });
      }
    }

    typeNextChar();
  }

  // Delete word character by character
  function deleteWord() {
    function deleteNextChar() {
      if (textContainer.textContent.length > 0) {
        textContainer.textContent = textContainer.textContent.slice(0, -1);
        gsap.delayedCall(settings.deleteSpeed, deleteNextChar);
      } else {
        // Deletion complete, move to next word
        currentWordIndex = (currentWordIndex + 1) % words.length;

        // Check if we should continue
        if (settings.loop || currentWordIndex !== 0) {
          gsap.delayedCall(0.3, () => {
            typeWord(words[currentWordIndex]);
          });
        } else {
          // Not looping and reached end
          textContainer.textContent = originalText;
          isRunning = false;
        }
      }
    }

    deleteNextChar();
  }

  // Initialize
  startAnimation();

  // Return control object
  return {
    stop: () => {
      gsap.killDelayedCallsTo(typeWord);
      gsap.killDelayedCallsTo(deleteWord);
      gsap.killDelayedCallsTo(startAnimation);
      if (cursorElement) {
        gsap.killTweensOf(cursorElement);
        cursorElement.remove();
      }
      textContainer.textContent = originalText;
      isRunning = false;
    },

    restart: () => {
      gsap.killDelayedCallsTo(typeWord);
      gsap.killDelayedCallsTo(deleteWord);
      gsap.killDelayedCallsTo(startAnimation);
      isRunning = false;
      startAnimation();
    },

    destroy: () => {
      gsap.killDelayedCallsTo(typeWord);
      gsap.killDelayedCallsTo(deleteWord);
      gsap.killDelayedCallsTo(startAnimation);
      if (cursorElement) {
        gsap.killTweensOf(cursorElement);
        cursorElement.remove();
      }
      element.innerHTML = originalText;
      isRunning = false;
    }
  };
}

// Auto-initialize elements with data attributes
document.addEventListener('DOMContentLoaded', function () {
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

      // Get options from data attributes
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
  }

  setTimeout(initTypewriters, 100);
});

// Export for manual use
window.createTypewriter = createTypewriter; 