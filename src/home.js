console.log("Home");

// Import typewriter functionality
import './typewriter.js';

// Import the module on any page that needs it
import './text-reveal.js';
import './marquee.js';
import './image-animations.js';
import './title-animations.js'
import './call-embed.js'

gsap.registerPlugin(SplitText);

document.fonts.ready.then(() => {
  let split = SplitText.create(".animate-me", { type: "words", aria: "hidden" });

  gsap.from(split.words, {
    opacity: 0,
    duration: 2,
    ease: "sine.out",
    stagger: 0.1,
  });
});

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
};

$(document).ready(function () {
    // Only add performance-related passive listeners, not empty ones
    if (isMobile) {
        // Minimal touch handling for mobile performance
        console.log('🔋 Mobile mode: Optimizing touch events');
    }

    var buttonThatOpenedModal;
    var findModal = function (elem) {
        var tabbable = elem.find('select, input, textarea, button, a').filter(':visible');

        var firstTabbable = tabbable.first();
        var lastTabbable = tabbable.last();
        /*set focus on first input*/
        firstTabbable.focus();

        /*redirect last tab to first input*/
        lastTabbable.on('keydown', function (e) {
            if ((e.which === 9 && !e.shiftKey)) {
                e.preventDefault();
                firstTabbable.focus();
            }
        });

        /*redirect first shift+tab to last input*/
        firstTabbable.on('keydown', function (e) {
            if ((e.which === 9 && e.shiftKey)) {
                e.preventDefault();
                lastTabbable.focus();
            }
        });

        /* allow escape key to close insiders div */
        elem.on('keydown', function (e) {
            if (e.keyCode === 27) {
                closeModal();
            };
        });
    };

    // Single modal wrapper reference
    var $modalWrapper = $('.modal-wrapper');

    // Function to open modal
    function openModal($button) {
        var modalContent = $button.data('modal-content');

        // Clear any previous content and set new content
        var $modalContent = $modalWrapper.find('.modal-content');
        $modalContent.empty().html(modalContent);

        // Add active class instead of using .show()
        $modalWrapper.addClass('modal-active').css('display', 'block');

        // Let Webflow handle the animation, then set up accessibility
        setTimeout(function () {
            findModal($modalWrapper);
        }, 50);

        buttonThatOpenedModal = $button;
    }

    // Function to close modal
    function closeModal() {
        // Remove active class and let Webflow handle the animation
        $modalWrapper.removeClass('modal-active');

        // Clear content after a delay to allow animation to complete
        setTimeout(function () {
            $modalWrapper.find('.modal-content').empty();
            $modalWrapper.css('display', 'none');
        }, 300);

        if (buttonThatOpenedModal) {
            buttonThatOpenedModal.focus();
            buttonThatOpenedModal = null;
        }
    }

    var modalOpenButton = $('.modal-open_btn');
    modalOpenButton.on('keydown', function (e) {
        // Only activate on spacebar and enter
        if (e.which !== 13 && e.which !== 32) {
            return;
        }

        e.preventDefault();
        openModal($(this));
    });

    modalOpenButton.on('click', function (e) {
        // Prevent default to avoid conflicts with Webflow
        e.preventDefault();
        openModal($(this));
    });

    var modalCloseButton = $('.modal-close_btn, .modal-close_area');
    modalCloseButton.on('keydown', function (e) {
        // Only activate on spacebar and enter
        if (e.which !== 13 && e.which !== 32) {
            return;
        }

        e.preventDefault();
        closeModal();
    });

    modalCloseButton.on('click', function (e) {
        e.preventDefault();
        closeModal();
    });

    // Initialize typewriter effect for changing words
    if (window.createTypewriter) {
        const changingWord = document.querySelector('.changing-word');
        if (changingWord) {
            // Optimize typewriter for mobile
            const typewriterOptions = PERFORMANCE_CONFIG.simplifyTypewriter ? {
                typeSpeed: 0.12,           // Faster on mobile
                deleteSpeed: 0.08,         // Faster deletion
                pauseTime: 2,              // Shorter pause
                cursor: true,
                cursorWidth: '1px',
                cursorColor: '#f2f200',
                naturalVariation: false,   // Disable variations on mobile
                blurEffect: false,         // Disable blur on mobile
                loop: true
            } : {
                typeSpeed: 0.09,
                deleteSpeed: 0.05,
                pauseTime: 3,
                cursor: true,
                cursorWidth: '1px',
                cursorColor: '#f2f200',
                naturalVariation: true,
                blurEffect: true,
                loop: true
            };
            
            createTypewriter('.changing-word', [
                'Kundenbindung.',
                'Erfolg.',
                'Vertrauen.',
            ], typewriterOptions);
        }
    }

    /********* POPUP OPEN/CLOSE ANIMATION STEPS *********/

    const videoPopupOpenSteps = [
        { opacity: "0" },
        { opacity: "1" }
    ]

    const videoPopupCloseSteps = [
        { opacity: "1" },
        { opacity: "0" }
    ]

    /******************/

    // Grab all the instance of the video popup component
    const videoPopupComponents = document.querySelectorAll('[fc-video-popup ^= "component"]')

    const vimeoComponents = Array.from(videoPopupComponents).filter(component => {
        const iframe = component.querySelector('iframe')
        const src = iframe.getAttribute('src')
        return src.includes('vimeo')
    })

    const youtubeComponents = Array.from(videoPopupComponents).filter(component => {
        const iframe = component.querySelector('iframe')
        const src = iframe.getAttribute('src')
        return src.includes('youtube')
    })

    if (vimeoComponents.length > 0) {
        var script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://player.vimeo.com/api/player.js'
        var firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore(script, firstScriptTag)

        script.onload = () => {
            for (const component of vimeoComponents) {
                // Take the button that will be used to play the video
                const playButton = component.querySelector('[fc-video-popup = play]')

                // Extrapolate the group the component belongs to in case there are more than one instance on the page
                let group = component.getAttribute('fc-video-popup').split('component')[1]
                if (group === undefined)
                    group = ''

                // Get all the open and close buttons associated with the component
                const openButtons = document.querySelectorAll(`[fc-video-popup = open${group}]`)
                const closeButtons = component.querySelectorAll('[fc-video-popup = close]')

                // ...Get the animation parameters...
                const videoPopupParameters = {
                    duration: parseFloat(component.getAttribute('duration')),
                    easing: component.getAttribute('easing')
                }

                if (isNaN(videoPopupParameters.duration))
                    videoPopupParameters.duration = 300

                if (videoPopupParameters.easing === null)
                    videoPopupParameters.easing = 'ease'

                // ...And create the corresponding parameters object to animate the popup
                const videoPopupTiming = {
                    duration: videoPopupParameters.duration,
                    fill: 'forwards',
                    easing: videoPopupParameters.easing
                }

                // Take the corresponding iframe and creates the player
                const iframe = component.querySelector('iframe')
                const player = new Vimeo.Player(iframe)

                // When the player is on pause, the play button fades in
                player.on('pause', function () {
                    playButtonFadeIn(playButton)
                })

                // When the player is on play, the play button fades out
                player.on('play', function () {
                    playButtonFadeOut(playButton)
                })

                // When the play button is clicked, the corresponding player gets started
                playButton.addEventListener('click', function () {
                    player.play()
                })

                // For every open button associated with the current component...
                for (const openButton of openButtons) {
                    // The popup fades in, the video starts playing, and page scrolling is disabled
                    openButton.addEventListener('click', function () {
                        player.play()
                        component.style.display = 'flex'
                        component.animate(videoPopupOpenSteps, videoPopupTiming)
                        document.querySelector('body').style.overflow = 'hidden'
                    })
                }

                // For every close button associated with the current component...
                for (const closeButton of closeButtons) {
                    // The popup fades out, the video gets paused, and page scrolling is enabled
                    closeButton.addEventListener('click', function () {
                        player.pause()
                        component.animate(videoPopupCloseSteps, videoPopupTiming)
                        setTimeout(function () { component.style.display = 'none' }, videoPopupParameters.duration)
                        document.querySelector('body').style.overflow = 'visible'
                    })
                }
            }
        }
    }

    if (youtubeComponents.length > 0) {
        var script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://www.youtube.com/iframe_api'
        var firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore(script, firstScriptTag)

        // Make onYouTubeIframeAPIReady globally accessible
        window.onYouTubeIframeAPIReady = function () {
            initYouTubeComponents();
        }
    }

    function initYouTubeComponents() {
        for (const component of youtubeComponents) {
            // Take the button that will be used to play the video
            const playButton = component.querySelector('[fc-video-popup = play]')

            // Extrapolate the group the component belongs to in case there are more than one instance on the page
            let group = component.getAttribute('fc-video-popup').split('component')[1]
            if (group === undefined)
                group = ''

            // Get all the open and close buttons associated with the component
            const openButtons = document.querySelectorAll(`[fc-video-popup = open${group}]`)
            const closeButtons = component.querySelectorAll('[fc-video-popup = close]')

            // ...Get the animation parameters...
            const videoPopupParameters = {
                duration: parseFloat(component.getAttribute('duration')),
                easing: component.getAttribute('easing')
            }

            if (isNaN(videoPopupParameters.duration))
                videoPopupParameters.duration = 300

            if (videoPopupParameters.easing === null)
                videoPopupParameters.easing = 'ease'

            // ...And create the corresponding parameters object to animate the popup
            const videoPopupTiming = {
                duration: videoPopupParameters.duration,
                fill: 'forwards',
                easing: videoPopupParameters.easing
            }

            // Take the corresponding iframe and creates the player
            const iframe = component.querySelector('iframe')
            const player = new YT.Player(iframe)

            player.addEventListener('onStateChange', (e) => {
                const state = e.data

                switch (state) {
                    // When the player is on play, the play button fades out
                    case 1:
                        playButtonFadeOut(playButton)
                        break
                    // When the player is on pause, the play button fades in
                    case 2:
                        playButtonFadeIn(playButton)
                        break
                }
            })

            // When the play button is clicked, the corresponding player gets started
            playButton.addEventListener('click', function () {
                player.playVideo()
            })

            // For every open button associated with the current component...
            for (const openButton of openButtons) {
                // The popup fades in, the video starts playing, and page scrolling is disabled
                openButton.addEventListener('click', function () {
                    player.playVideo()
                    component.style.display = 'flex'
                    component.animate(videoPopupOpenSteps, videoPopupTiming)
                    document.querySelector('body').style.overflow = 'hidden'
                })
            }

            // For every close button associated with the current component...
            for (const closeButton of closeButtons) {
                // The popup fades out, the video gets paused, and page scrolling is enabled
                closeButton.addEventListener('click', function () {
                    player.pauseVideo()
                    component.animate(videoPopupCloseSteps, videoPopupTiming)
                    setTimeout(function () { component.style.display = 'none' }, videoPopupParameters.duration)
                    document.querySelector('body').style.overflow = 'visible'
                })
            }
        }
    }

    // Fade-out animation for the play button
    function playButtonFadeOut(playButton) {
        const fadeOutSteps = [
            { opacity: "1" },
            { opacity: "0" }
        ]

        const timing = {
            duration: 300,
            fill: 'forwards'
        }

        playButton.parentNode.animate(fadeOutSteps, timing)

        setTimeout(function () {
            playButton.parentNode.style.display = 'none'
        }, 300)
    }

    // Fade-in animation for the play button
    function playButtonFadeIn(playButton) {
        const fadeInSteps = [
            { opacity: "0" },
            { opacity: "1" }
        ]

        const timing = {
            duration: 300,
            fill: 'forwards'
        }

        playButton.parentNode.style.display = 'flex'

        playButton.parentNode.animate(fadeInSteps, timing)
    }

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

    // Check if the project title elements exist
    if (document.querySelector('.project-tile_wrapper') && document.querySelector('.text-display-left') && document.querySelector('.text-display-right')) {
        // Use the new modular title animation system
        createTitleAnimation(['.text-display-left', '.text-display-right'], {
            animationType: 'slideIn',
            direction: 'left',        // This will be overridden per element
            distance: '100vw',
            duration: 1.5,
            ease: "power2.out",
            trigger: 'scrub',
            triggerElement: '.project-tile_wrapper',
            triggerStart: 'top bottom',
            triggerEnd: 'top 30%',
            scrub: 2.5,
            scale: 2.5,
            opacity: 0,
            blur: 15,
            overlap: -1.2
        });

        // Alternatively, create separate animations for more control:
        // Left title coming from left
        createTitleAnimation('.text-display-left', {
            direction: 'left',
            trigger: 'scrub',
            triggerElement: '.project-tile_wrapper',
            triggerStart: 'top bottom',
            triggerEnd: 'top 30%',
            scrub: 2.5
        });

        // Right title coming from right
        createTitleAnimation('.text-display-right', {
            direction: 'right',
            trigger: 'scrub',
            triggerElement: '.project-tile_wrapper',
            triggerStart: 'top bottom',
            triggerEnd: 'top 30%',
            scrub: 2.5
        });
    }

    // ===== END PROJECTS ANIMATION =====

    // Initialize your team marquee
    createInfiniteMarquee('.team-marquee', {
        speed: 150,              // Fast smooth scroll
        direction: 'left',      // Left-to-right movement
        pauseOnHover: false,    // Don't pause on hover
        gap: 0,              // Space between VISUALA and Team
        duplicateContent: true, // Seamless infinite loop
        smooth: true           // Smooth continuous animation
    });

    console.log("Intialized team marquee");

    // Animate gallery images with stagger
    createImageAnimation('.gallery7_image-wrapper', {
        animationType: 'slideUp',
        distance: 80,
        duration: 0.8,
        stagger: 0.1,
        opacity: 0,
        blur: 3
    });
});