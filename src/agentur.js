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

  if (document.querySelector('.team-marquee')) {
    // Initialize your team marquee
    createInfiniteMarquee('.team-marquee', {
      speed: 50,              // Fast smooth scroll
      direction: 'left',       // Left-to-right movement
      pauseOnHover: false,     // Don't pause on hover
      gap: 0,                  // Space between VISUALA and Team
      duplicateContent: true,  // Seamless infinite loop
      smooth: true,            // Smooth continuous animation
      preserveStyles: true     // Preserve Webflow positioning
    });
  }

  
});