console.log("Agentur");
import './typewriter.js';
import './marquee.js';
import './text-reveal.js';


document.addEventListener('DOMContentLoaded', function () {
  const items = document.querySelectorAll('.testimonial_item');

  items.forEach((item, index) => {
    const card = item.querySelector('.testimonial_card');
    card.style.position = 'sticky';
    card.style.top = (3 + (index * 2)) + 'rem';
    card.style.marginTop = (3 + (index) * 2) + 'rem';
    card.style.zIndex = 30 - index;
  });
// TEst
  // Initialize typewriter animations using data attributes - GSAP Best Practices
  if (window.createTypewriter) {
    const typewriterElements = document.querySelectorAll('[anim-element="typewriter"]');
    
    typewriterElements.forEach((element, index) => {
      const wordsData = element.getAttribute('anim-words');
      if (!wordsData) {
        console.warn('Typewriter element missing anim-words attribute:', element);
        return;
      }
      
      const words = wordsData.split(',').map(word => word.trim());
      
      // Give element a unique ID if it doesn't have one
      if (!element.id) {
        element.id = `typewriter-${Date.now()}-${index}`;
      }
      
      // Optimized default configuration - GSAP best practices
      const config = {
        typeSpeed: 0.08,           // Optimized for all devices
        deleteSpeed: 0.06,         // Smooth deletion
        pauseTime: 2.5,            // Balanced timing
        cursor: true,              // Show cursor
        cursorWidth: '1px',        // Thin line
        cursorColor: '#f2f200',    // Brand color
        naturalVariation: false,   // Consistent performance
        blurEffect: false,         // Better performance
        loop: true,                // Continuous loop
        ease: 'power2.out'         // Smooth easing
      };
      
      // Pass the ID selector instead of the element object
      createTypewriter(`#${element.id}`, words, config);
    });
  }

  // Initialize your team marquee
  createInfiniteMarquee('.team-marquee', {
    speed: 150,              // Fast smooth scroll
    direction: 'left',      // Left-to-right movement
    pauseOnHover: false,    // Don't pause on hover
    gap: 0,              // Space between VISUALA and Team
    duplicateContent: true, // Seamless infinite loop
    smooth: true           // Smooth continuous animation
  });

  // // Initialize text reveal animation for the main paragraph - OPTIMIZED
  // if (window.createTextReveal && document.querySelector('.text-reveal-animation')) {
  //   createTextReveal('.text-reveal-animation', {
  //     direction: 'left',         // Words slide in from left
  //     blurAmount: 0,             // REMOVED: Blur is expensive, use opacity instead
  //     moveDistance: 30,          // REDUCED: Smaller movement for better performance
  //     duration: 0.6,             // FASTER: Shorter duration
  //     staggerAmount: 0.05,       // INCREASED: Less frequent staggers (20ms -> 50ms)
  //     ease: "power2.out",        // SIMPLER: Less complex easing
  //     autoInit: true,            // Auto-trigger on scroll
  //     triggerStart: "top 85%",   // Start when 85% in view
  //     scrub: false               // No scroll scrubbing, just trigger once
  //   });
  // }
});