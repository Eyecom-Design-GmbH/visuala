console.log("Hello from global.js");
import './text-reveal.js';
import './typewriter.js';

// Cleanup function to remove event listeners and animations
function cleanup() {
    // Kill all GSAP animations
    if (typeof gsap !== 'undefined') {
        gsap.killTweensOf("*");
    }
    
    // Remove ScrollTrigger instances
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.getAll().forEach(st => st.kill());
    }
}

// Add cleanup on page unload
window.addEventListener('pagehide', cleanup, {passive: true});

document.addEventListener('DOMContentLoaded', function() {
    // ===== GLOBAL MINIMALISTIC IMAGE REVEAL ANIMATION =====
    
    // Wait for GSAP to be available
    function initGlobalImageAnimations() {
        if (typeof gsap === 'undefined') {
            setTimeout(initGlobalImageAnimations, 100);
            return;
        }

        // Target all images except those with specific exclusion classes
        const images = document.querySelectorAll('img:not(.no-animation):not(.skip-reveal)');
        
        if (images.length > 0) {
            console.log(`Setting up minimalistic reveal for ${images.length} images`);
            
            images.forEach((img, index) => {
                // Skip if already processed
                if (img.classList.contains('image-reveal-processed')) return;
                img.classList.add('image-reveal-processed');
                
                // Set initial state - subtle and minimalistic
                gsap.set(img, {
                    opacity: 0,
                    y: 50,
                });
                
                // Create reveal animation
                gsap.to(img, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: img,
                        start: "top 90%",           // Start early for smooth reveal
                        end: "bottom 10%",
                        toggleActions: "play none none none",
                        once: true                  // Only animate once
                    }
                });
            });
        }
    }

    // Initialize image animations
    setTimeout(initGlobalImageAnimations, 100);

    // Initialize text reveal animation for the main paragraph
    if (window.createTextReveal) {
        const h1Element = document.querySelector('.h1');
        if (h1Element) {
            createTextReveal('.h1', {
                direction: 'left',         // Words slide in from left
                blurAmount: 10,            // 8px blur effect
                moveDistance: 40,          // 80px horizontal movement
                duration: 0.8,             // 1.2s animation duration
                staggerAmount: 0.01,       // 0.04s between each word
                ease: "power4.out",        // Smooth easing
                autoInit: true,            // Auto-trigger on scroll
                triggerStart: "top 85%",   // Start when 85% in view
                scrub: false               // No scroll scrubbing, just trigger once
            });
        }
    }

    // Initialize typewriter effect for changing words
    if (window.createTypewriter) {
        const changingQuestion = document.querySelector('.changing-question');
        if (changingQuestion) {
            createTypewriter('.changing-question', [
                'im Kopf?',
                'in Planung?',
                'am Start?',
            ], {
                typeSpeed: 0.09,           // Slightly slower for more natural feel
                deleteSpeed: 0.05,         // Natural deletion speed
                pauseTime: 3,              // Longer pause to read the word
                cursor: true,              // Show professional cursor
                cursorWidth: '1px',        // Thin professional cursor line
                cursorColor: '#f2f200',    // Lime color to match your design
                naturalVariation: true,    // Add human-like timing variations
                blurEffect: true,          // Professional blur transitions
                loop: true
            });
        }
    }




});