import './marquee.js';
import './call-embed.js'



// ===== MOBILE PERFORMANCE DETECTION (SHARED) =====
const isMobile = (() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
    const isMobileUserAgent = mobileKeywords.some(keyword => userAgent.includes(keyword));
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    return isMobileUserAgent || (isTouchDevice && isSmallScreen);
})();

const PERFORMANCE_CONFIG = {
    reducedAnimations: isMobile,
    disableBlur: isMobile,
    simplifyTypewriter: isMobile
}

// Check if the project columns exist on this page
if (document.querySelector('.work_left') && document.querySelector('.work_right')) {

    // Create timeline for projects animation
    let projectsTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.work_wrap',
            start: 'top 70%',     // Start when section enters viewport
            end: 'top 20%',          // End when section is mostly in view
            scrub: 1.5,              // Smooth scrubbing tied to scroll
            toggleActions: 'play none none reverse'
        }
    });

    // Set initial state for entire columns to be off-screen and huge
    gsap.set('.work_left', {
        x: '-100vw',
        scale: 2,
        opacity: 0,
        filter: 'blur(20px)'

    });

    gsap.set('.work_right', {
        x: '100vw',
        scale: 2,
        opacity: 0,
        filter: 'blur(20px)'

    });

    // Add animations to timeline
    projectsTl
        // Animate left column
        .to('.work_left', {
            x: 0,
            scale: 1,
            opacity: 1,
            duration: 1,
            filter: 'blur(0px)',
            ease: "power2.out"
        })
        // Animate right column with slight overlap
        .to('.work_right', {
            x: 0,
            scale: 1,
            opacity: 1,
            duration: 1,
            filter: 'blur(0px)',
            ease: "power2.out"
        }, "-=0.8"); // Start 0.8s before left column finishes
}

// ===== PROJECTS COLUMN FLYING ANIMATION WITH SCROLL SCRUB =====

// Check if the project columns exist on this page
if (document.querySelector('.work_left') && document.querySelector('.work_right')) {

    // Create timeline for projects animation
    let projectsTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.work_wrap',
            start: 'top bottom',     // Start when section enters viewport
            end: 'top 20%',          // End when section is mostly in view
            scrub: 1.5               // Smooth scrubbing tied to scroll
        }
    });

    // Set initial state for entire columns to be off-screen and huge
    gsap.set('.work_left', {
        x: '-100vw',
        scale: 3,
        opacity: 0
    });

    gsap.set('.work_right', {
        x: '100vw',
        scale: 3,
        opacity: 0
    });

    // Add animations to timeline
    projectsTl
        // Animate left column
        .to('.work_left', {
            x: 0,
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        })
        // Animate right column with slight overlap
        .to('.work_right', {
            x: 0,
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        }, "-=0.8"); // Start 0.8s before left column finishes
}

// ===== PROJECT TITLES ANIMATION =====

//     // Check if the project title elements exist
//     if (document.querySelector('.project-tile_wrapper') && document.querySelector('.text-display-left') && document.querySelector('.text-display-right')) {
//         // Use the new modular title animation system
//         createTitleAnimation(['.text-display-left', '.text-display-right'], {
//             animationType: 'slideIn',
//             direction: 'left',        // This will be overridden per element
//             distance: '100vw',
//             duration: 1.5,
//             ease: "power2.out",
//             trigger: 'scrub',
//             triggerElement: '.project-tile_wrapper',
//             triggerStart: 'top bottom',
//             triggerEnd: 'top 30%',
//             scrub: 2.5,
//             scale: 2.5,
//             opacity: 0,
//             blur: 15,
//             overlap: -1.2
//         });

//         // Alternatively, create separate animations for more control:
//         // Left title coming from left
//         createTitleAnimation('.text-display-left', {
//             direction: 'left',
//             trigger: 'scrub',
//             triggerElement: '.project-tile_wrapper',
//             triggerStart: 'top bottom',
//             triggerEnd: 'top 30%',
//             scrub: 2.5
//         });

//         // Right title coming from right
//         createTitleAnimation('.text-display-right', {
//             direction: 'right',
//             trigger: 'scrub',
//             triggerElement: '.project-tile_wrapper',
//             triggerStart: 'top bottom',
//             triggerEnd: 'top 30%',
//             scrub: 2.5
//         });
//     }

//     // ===== END PROJECTS ANIMATION =====

// register plugins
document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin, ScrambleTextPlugin, SplitText)

    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.section-features',
            start: 'top top', // Section becomes sticky immediately
            end: 'bottom bottom', // End when section would naturally end
            scrub: true,
            toggleActions: 'restart none reverse',
            pin: '.features-wrapper',
        },
    })

    // Set initial state - cards are stacked with offsets like in your original design
    gsap.set('.features-card', {
        opacity: 1,
        yPercent: 0,
        xPercent: 0,
        scale: 1,
        rotation: (index) => {
            // Create stacked effect with slight rotation offsets
            if (index === 0) return -8;  // First card rotated left
            if (index === 1) return 5;   // Second card rotated right  
            return 0;                    // Third card straight (visible on top)
        },
    })

    // Add delay before animation starts (cards stay stacked for first 30% of scroll)
    tl.to('.features-card', {
        // Dummy animation to create delay - no visual change
        duration: 0.5, // 30% of timeline = delay period
    })

        // Animate cards flying away as you scroll with fancy effects
        .to('.features-card', {
            yPercent: -130,
            xPercent: (index) => (index % 2 === 0 ? 35 : -35), // Even cards go right, odd cards go left
            scale: 1.25,
            rotation: (index) => (index % 2 === 0 ? 15 : -15), // Alternate rotation direction
            duration: 1.8, // Increased from 1.05 to make it much slower
            ease: "power2.out", // Changed to smoother, less bouncy easing
            stagger: { each: 1.8, from: 'start' }, // Increased stagger timing significantly
        })
        .to('.features-card', {
            opacity: 0,
            yPercent: -150,
            xPercent: (index) => (index % 2 === 0 ? 50 : -50), // More spread as they exit
            rotation: (index) => (index % 2 === 0 ? 25 : -25), // More rotation as they fade
            scale: 1.1, // Shrink as they disappear
            duration: 0.8, // Increased fade duration for slower exit
            ease: "power1.in", // Gentler accelerating fade out
            stagger: { each: 1.8, from: 'start' }, // Match the stagger timing
        }, "-=0.5") // Longer overlap for smoother transition


    // ===== PROJECTS COLUMN FLYING ANIMATION WITH SCROLL SCRUB =====


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
});