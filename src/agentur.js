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

  // Initialize typewriter effect for changing words
  if (window.createTypewriter && document.querySelector('.changing-word')) {
    createTypewriter('.changing-word', [
      'Herz',
      'Liebe',
      'Erfolg',
      'Vertrauen',
      'Innovation'
    ], {
      typeSpeed: 0.09,           // Slightly slower for more natural feel
      deleteSpeed: 0.05,         // Natural deletion speed
      pauseTime: 3,              // Longer pause to read the word
      cursor: true,              // Show professional cursor
      cursorWidth: '1px',        // Thin professional cursor line
      cursorColor: '#f2f200',    // Lime color to match your design (adjust as needed)
      naturalVariation: true,    // Add human-like timing variations
      blurEffect: true,          // Professional blur transitions
      loop: true
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

  // Initialize text reveal animation for the main paragraph
  if (window.createTextReveal && document.querySelector('.text-reveal-animation')) {
    createTextReveal('.text-reveal-animation', {
      direction: 'left',         // Words slide in from left
      blurAmount: 10,             // 8px blur effect
      moveDistance: 40,          // 80px horizontal movement
      duration: 0.8,             // 1.2s animation duration
      staggerAmount: 0.01,       // 0.04s between each word
      ease: "power4.out",        // Smooth easing
      autoInit: true,            // Auto-trigger on scroll
      triggerStart: "top 85%",   // Start when 85% in view
      scrub: false               // No scroll scrubbing, just trigger once
    });
  }
});