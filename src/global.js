// console.log("Hello from global.js");
// import './text-reveal.js';
// import './typewriter.js';

// // ===== MOBILE PERFORMANCE DETECTION =====
// const isMobile = (() => {
//     const userAgent = navigator.userAgent.toLowerCase();
//     const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
//     const isMobileUserAgent = mobileKeywords.some(keyword => userAgent.includes(keyword));
//     const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
//     const isSmallScreen = window.innerWidth <= 768;
//     return isMobileUserAgent || (isTouchDevice && isSmallScreen);
// })();

// const isLowPerformanceDevice = (() => {
//     // Check for low-end devices
//     const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
//     const slowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
//     const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
//     const oldDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    
//     return slowConnection || lowMemory || oldDevice;
// })();

// // Performance settings based on device
// const PERFORMANCE_CONFIG = {
//     // Reduce animation complexity on mobile/low-end devices
//     reducedAnimations: isMobile || isLowPerformanceDevice,
//     disableBlur: isMobile || isLowPerformanceDevice,
//     limitScrollTriggers: isMobile,
//     simplifyTextAnimations: isMobile,
//     reducedStagger: isMobile ? 0.005 : 0.01, // Faster stagger on mobile
//     maxAnimatedElements: isMobile ? 10 : 50  // Limit number of animated elements
// };

// console.log('Performance config:', PERFORMANCE_CONFIG);

// // Cleanup function to remove event listeners and animations
// function cleanup() {
//     // Kill all GSAP animations
//     if (typeof gsap !== 'undefined') {
//         gsap.killTweensOf("*");
//     }
    
//     // Remove ScrollTrigger instances
//     if (typeof ScrollTrigger !== 'undefined') {
//         ScrollTrigger.getAll().forEach(st => st.kill());
//     }
// }

// // Add cleanup on page unload
// window.addEventListener('pagehide', cleanup, {passive: true});

// document.addEventListener('DOMContentLoaded', function() {
//     // ===== OPTIMIZED GLOBAL IMAGE REVEAL ANIMATION =====
    
//     // Wait for GSAP to be available
//     function initGlobalImageAnimations() {
//         if (typeof gsap === 'undefined') {
//             setTimeout(initGlobalImageAnimations, 100);
//             return;
//         }

//         // Target all images except those with specific exclusion classes
//         const images = document.querySelectorAll('img:not(.no-animation):not(.skip-reveal)');
        
//         if (images.length > 0) {
//             // Limit number of animated images on mobile
//             const imagesToAnimate = PERFORMANCE_CONFIG.limitScrollTriggers 
//                 ? Array.from(images).slice(0, PERFORMANCE_CONFIG.maxAnimatedElements)
//                 : images;
            
//             console.log(`Setting up reveal for ${imagesToAnimate.length}/${images.length} images (performance: ${PERFORMANCE_CONFIG.reducedAnimations ? 'reduced' : 'full'})`);
            
//             if (PERFORMANCE_CONFIG.reducedAnimations) {
//                 // Simple, lightweight animation for mobile
//                 imagesToAnimate.forEach((img, index) => {
//                     if (img.classList.contains('image-reveal-processed')) return;
//                     img.classList.add('image-reveal-processed');
                    
//                     gsap.set(img, { opacity: 0 });
                    
//                     gsap.to(img, {
//                         opacity: 1,
//                         duration: 0.6,
//                         ease: "power2.out",
//                         scrollTrigger: {
//                             trigger: img,
//                             start: "top 85%",
//                             toggleActions: "play none none none",
//                             once: true
//                         }
//                     });
//                 });
//             } else {
//                 // Full animation for desktop
//                 imagesToAnimate.forEach((img, index) => {
//                     if (img.classList.contains('image-reveal-processed')) return;
//                     img.classList.add('image-reveal-processed');
                    
//                     gsap.set(img, {
//                         opacity: 0,
//                         y: 50,
//                     });
                    
//                     gsap.to(img, {
//                         opacity: 1,
//                         y: 0,
//                         duration: 0.8,
//                         ease: "power2.out",
//                         scrollTrigger: {
//                             trigger: img,
//                             start: "top 90%",
//                             end: "bottom 10%",
//                             toggleActions: "play none none none",
//                             once: true
//                         }
//                     });
//                 });
//             }
//         }
//     }

//     // Initialize image animations
//     setTimeout(initGlobalImageAnimations, 100);

//     // Initialize text reveal animation for the main paragraph
//     if (window.createTextReveal) {
//         const h1Element = document.querySelector('.h1');
//         if (h1Element) {
//             // Use simplified text animation on mobile
//             const textRevealOptions = PERFORMANCE_CONFIG.simplifyTextAnimations ? {
//                 direction: 'left',
//                 blurAmount: 0,            // Disable blur on mobile
//                 moveDistance: 20,         // Reduced movement
//                 duration: 0.6,            // Faster duration
//                 staggerAmount: PERFORMANCE_CONFIG.reducedStagger,
//                 ease: "power2.out",       // Simpler easing
//                 autoInit: true,
//                 triggerStart: "top 85%",
//                 scrub: false
//             } : {
//                 direction: 'left',
//                 blurAmount: PERFORMANCE_CONFIG.disableBlur ? 0 : 10,
//                 moveDistance: 40,
//                 duration: 0.8,
//                 staggerAmount: 0.01,
//                 ease: "power4.out",
//                 autoInit: true,
//                 triggerStart: "top 85%",
//                 scrub: false
//             };
            
//             createTextReveal('.h1', textRevealOptions);
//         }
//     }

//     // Initialize typewriter effect for changing words
//     if (window.createTypewriter) {
//         const changingQuestion = document.querySelector('.changing-question');
//         if (changingQuestion) {
//             // Simplified typewriter for mobile
//             const typewriterOptions = PERFORMANCE_CONFIG.reducedAnimations ? {
//                 typeSpeed: 0.12,           // Faster typing
//                 deleteSpeed: 0.08,         // Faster deletion
//                 pauseTime: 2,              // Shorter pause
//                 cursor: true,
//                 cursorWidth: '1px',
//                 cursorColor: '#f2f200',
//                 naturalVariation: false,   // Disable variations on mobile
//                 blurEffect: false,         // Disable blur on mobile
//                 loop: true
//             } : {
//                 typeSpeed: 0.09,
//                 deleteSpeed: 0.05,
//                 pauseTime: 3,
//                 cursor: true,
//                 cursorWidth: '1px',
//                 cursorColor: '#f2f200',
//                 naturalVariation: true,
//                 blurEffect: !PERFORMANCE_CONFIG.disableBlur,
//                 loop: true
//             };
            
//             createTypewriter('.changing-question', [
//                 'im Kopf?',
//                 'in Planung?',
//                 'am Start?',
//             ], typewriterOptions);
//         }
//     }

//     // ===== PERFORMANCE MONITORING =====
//     if (PERFORMANCE_CONFIG.reducedAnimations) {
//         console.log('🔋 Mobile/Low-performance mode: Animations simplified for better performance');
//     }
// });

document.addEventListener("DOMContentLoaded", (event) => {
    // Initialize typewriter animations using data attributes - GSAP Best Practices
    if (window.createTypewriter) {
        const typewriterElements = document.querySelectorAll('[anim-element="typewriter"]');

        typewriterElements.forEach((element, index) => {
            console.log(`Processing typewriter ${index + 1}:`, element);
            
            const wordsData = element.getAttribute('anim-words');
            if (!wordsData) {
                console.warn('Typewriter element missing anim-words attribute:', element);
                return;
            }
            
            console.log(`Words data for element ${index + 1}:`, wordsData);

            const words = wordsData.split(',').map(word => word.trim());

            if (!element.id) {
                element.id = `typewriter-${Date.now()}-${index}`;
            }

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
});