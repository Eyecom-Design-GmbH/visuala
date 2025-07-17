console.log("------------Angebote");

import './title-animations.js';

$(document).ready(function () {

  
    // Check for circular text elements before initializing CircleType
    const circularTextElements = document.querySelectorAll('.circular-text');
    if (circularTextElements.length > 0) {
        circularTextElements.forEach(element => {
            if (element && element.innerHTML) {
                try {
                    new CircleType(element);
                } catch (error) {
                    console.warn('Failed to initialize CircleType for element:', element);
                }
            }
        });
    }

    // ===== ANGEBOT SECTIONS TITLE ANIMATIONS =====

    // Configuration for each section
    const sectionConfigs = [
        {
            id: '#branding-design',
            leftTitle: {
                triggerStart: 'top bottom',
                triggerEnd: 'top 50%',
                blur: 5,
                duration: 0.7
            },
            rightTitle: {
                triggerStart: 'top 50%',
                triggerEnd: 'top top',
                blur: 20,
                duration: 1.2
            }
        },
        {
            id: '#webseiten-digital',
            leftTitle: {
                triggerStart: 'top bottom',
                triggerEnd: 'top 50%',
                blur: 5,
                duration: 0.7
            },
            rightTitle: {
                triggerStart: 'top 50%',
                triggerEnd: 'top top',
                blur: 20,
                duration: 1.2
            }
        },
        {
            id: '#digital-marketing',
            leftTitle: {
                triggerStart: 'top bottom',
                triggerEnd: 'top 50%',
                blur: 5,
                duration: 0.7
            },
            rightTitle: {
                triggerStart: 'top 50%',
                triggerEnd: 'top top',
                blur: 20,
                duration: 1.2
            }
        },
        {
            id: '#fotografie-video',
            leftTitle: {
                triggerStart: 'top bottom',
                triggerEnd: 'top 50%',
                blur: 5,
                duration: 0.7
            },
            rightTitle: {
                triggerStart: 'top 50%',
                triggerEnd: 'top top',
                blur: 20,
                duration: 1.2
            }
        }
    ];

    // Loop through each section configuration
    sectionConfigs.forEach(config => {
        const section = document.querySelector(config.id);

        if (section) {
            console.log(`Setting up animations for section: ${config.id}`);

            // Left heading animation
            const leftHeading = section.querySelector('.angebot_display-heading-left');
            if (leftHeading) {
                createTitleAnimation(leftHeading, {
                    direction: 'left',
                    trigger: 'scrub',
                    triggerElement: section,
                    triggerStart: config.leftTitle.triggerStart,
                    triggerEnd: config.leftTitle.triggerEnd,
                    distance: '100vw',
                    scale: 2.5,
                    opacity: 0,
                    blur: config.leftTitle.blur,
                    duration: config.leftTitle.duration,
                    ease: "power2.out"
                });
            }

            // Right heading animation
            const rightHeading = section.querySelector('.angebot_display-heading-right');
            if (rightHeading) {
                createTitleAnimation(rightHeading, {
                    direction: 'right',
                    trigger: 'scrub',
                    triggerElement: section,
                    triggerStart: config.rightTitle.triggerStart,
                    triggerEnd: config.rightTitle.triggerEnd,
                    distance: '100vw',
                    scale: 2.5,
                    opacity: 0,
                    blur: config.rightTitle.blur,
                    duration: config.rightTitle.duration,
                    ease: "power2.out"
                });
            }
        } else {
            console.log(`Section not found: ${config.id}`);
        }
    });

    // ===== ACCORDION HOVER AND CLICK ANIMATIONS =====

    // Create blurred yellow cursor circle
    const yellowCursor = document.createElement('div');
    yellowCursor.style.cssText = `
        position: fixed;
        width: 16px;
        height: 16px;
        background: #f2f200;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.1s ease;
        filter: blur(15px);
    `;
    document.body.appendChild(yellowCursor);

    // Track mouse position for background effect and cursor
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 100;
        mouseY = (e.clientY / window.innerHeight) * 100;

        // Update yellow cursor position
        yellowCursor.style.left = e.clientX + 'px';
        yellowCursor.style.top = e.clientY + 'px';
    });

    // Setup accordion animations
    const accordions = document.querySelectorAll('.angebot_accordion');

    accordions.forEach((accordion, index) => {
        const question = accordion.querySelector('.angebot_accordion-question');
        const title = accordion.querySelector('.angebot_accordion-title');
        const answer = accordion.querySelector('.angebot_accordion-answer');
        const icon = accordion.querySelector('.angebot_accordion-icon');
        
        // Track accordion state
        let isOpen = false;
        
        // Hover animations
        question.addEventListener('mouseenter', () => {
            // Yellow text color for title
            gsap.to(title, {
                color: '#f2f200',
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Yellow color for the arrow/icon (targeting the SVG path)
            gsap.to(icon.querySelector('path'), {
                fill: '#f2f200',
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Optional: Yellow background for icon wrapper
            gsap.to(icon, {
                borderColor: '#f2f200', // Subtle yellow background
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Show yellow cursor
            gsap.to(yellowCursor, {
                opacity: 1,
                scale: 6,
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Hide default cursor
            question.style.cursor = 'pointer';
            
            // Scale effect
            gsap.to(accordion, {
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        question.addEventListener('mouseleave', () => {
            // Reset text color if not open
            if (!isOpen) {
                gsap.to(title, {
                    color: 'white',
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                // Reset arrow/icon color
                gsap.to(icon.querySelector('path'), {
                    fill: 'currentColor', // or 'white' if you prefer explicit color
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                // Reset icon wrapper background
                gsap.to(icon, {
                    borderColor: 'white',
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
            
            // Hide yellow cursor
            gsap.to(yellowCursor, {
                opacity: 0,
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Restore default cursor
            question.style.cursor = 'pointer';
            
            // Reset scale
            gsap.to(accordion, {
                scale: 1.0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        // Click animations
        question.addEventListener('click', () => {
            isOpen = !isOpen;
            
            if (isOpen) {
                // Open accordion
                gsap.to(answer, {
                    height: 'auto',
                    duration: 0.5,
                    ease: "power2.out"
                });
                
                // Rotate icon
                gsap.to(icon, {
                    rotation: 180,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                // Keep title yellow when open
                gsap.to(title, {
                    color: '#ffff00',
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                // Keep arrow yellow when open
                gsap.to(icon.querySelector('path'), {
                    fill: '#ffff00',
                    duration: 0.3,
                    ease: "power2.out"
                });
                
            } else {
                // Close accordion
                gsap.to(answer, {
                    height: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
                
                // Reset icon rotation
                gsap.to(icon, {
                    rotation: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                // Reset title color
                gsap.to(title, {
                    color: 'white',
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                // Reset arrow color
                gsap.to(icon.querySelector('path'), {
                    fill: 'currentColor',
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                // Reset icon wrapper background
                gsap.to(icon, {
                    borderColor: 'white',
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });
        
        // Set initial state
        gsap.set(answer, { height: 0 });
    });

    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.section-features',
            start: 'top 5%', // Section becomes sticky immediately
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
        duration: 0.3, // 30% of timeline = delay period
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
            scale: 0.8, // Shrink as they disappear
            duration: 0.8, // Increased fade duration for slower exit
            ease: "power1.in", // Gentler accelerating fade out
            stagger: { each: 1.8, from: 'start' }, // Match the stagger timing
        }, "-=0.5") // Longer overlap for smoother transition

    // Animation für alle .angebot_img Elemente
    gsap.utils.toArray('.angebot_img').forEach((img, index) => {
        gsap.fromTo(img, {
            // Initial state - translateY(50%) und opacity: 0
            y: '50%',
            opacity: 0,
            scale: 1
        }, {
            // Final state - translateY(0%) und opacity: 1
            y: '0%',
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "cubic-bezier(0.53, 0.03, 0.83, 0.25)", // Gleiche Easing wie im Original
            delay: index * 0.1, // Gestaffelte Animation
            scrollTrigger: {
                trigger: img,
                start: "top 80%", // Animation startet wenn das Element 80% im Viewport ist
                end: "bottom 20%",
                toggleActions: "play none none reverse", // Animation beim rein/rauscrollen
            }
        });
    });
});