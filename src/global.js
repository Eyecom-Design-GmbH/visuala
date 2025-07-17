import './typewriter.js';
import barba from '@barba/core';

// Font loading utility
function waitForFonts() {
    return new Promise((resolve) => {
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => {
                resolve();
            });
        } else {
            // Fallback for older browsers
            setTimeout(() => {
                resolve();
            }, 100);
        }
    });
}

// Initialize animations after fonts are loaded
async function initializeAnimations() {
    // Wait for fonts to load
    await waitForFonts();
    
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

            if (!element.id) {
                element.id = `typewriter-${Date.now()}-${index}`;
            }

            const config = {
                typeSpeed: 0.06,           // Optimized for all devices
                deleteSpeed: 0.03,         // Smooth deletion
                pauseTime: 1.2,            // Balanced timing
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

    // TEXT FADING IN ANIMATION ON SCROLL
    document.querySelectorAll('[animation-element="text-fade-in"]').forEach(el => {
        const split = new SplitText(el, { type: "words,chars" });
        const totalChars = split.chars.length;
        const staggerTime = 1 / totalChars;  // Total duration divided by number of characters for stagger

        gsap.fromTo(
            split.chars,
            { opacity: 0.1 },
            {
                opacity: 1,
                ease: "none",
                stagger: staggerTime, // Set stagger based on the total time and number of characters
                duration: 1, // Total duration for all characters
                scrollTrigger: {
                    trigger: el,
                    start: "top 70%",
                    end: "top 20%",
                    once: true
                }
            }
        );
    });

    // H1 ANIMATIONS (removed duplicate)
    document.querySelectorAll("h1").forEach(h1 => {
        const split = new SplitText(h1, { type: "lines" });

        gsap.from(split.lines, {
            duration: 1.5,
            opacity: 0,
            x: -100,
            ease: "power2.inOut",
            stagger: 0.06,
            scrollTrigger: {
                trigger: h1,
                start: "top 70%",
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", async (event) => {
    // Initialize animations after fonts are loaded
    await initializeAnimations();
    
    // Initialize other functionality
    setupBarbaTransitions();
    setupHamburgerMenu();

    if (document.querySelector('.client-logos')) {
        gsap.from(".client-logos_item", {
            scrollTrigger: {
            trigger: ".client-logos",
            start: "top 80%",
            },
            yPercent: 100,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.05
        });
    }

    if (document.querySelector('.gallery7_grid-list')) {
        if (document.querySelector('.gallery7_image-wrapper')) {

            gsap.utils.toArray(".gallery7_grid-list").forEach(wrapper => {
                const images = wrapper.querySelectorAll(".gallery7_image-wrapper");

                gsap.from(images, {
                    scrollTrigger: {
                        trigger: wrapper,
                        start: "top 70%",
                        markers: false,
                    },
                    yPercent: 100,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    stagger: 0.05
                });
            });
        }

        if (document.querySelector('.gallery7_image-wrapper-large')) {
            gsap.utils.toArray(".gallery7_grid-list").forEach(wrapper => {
                const images = wrapper.querySelectorAll(".gallery7_image-wrapper-large");

                gsap.from(images, {
                    scrollTrigger: {
                        trigger: wrapper,
                        start: "top 70%",
                        markers: false,
                    },
                    yPercent: 100,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    stagger: 0.05
                });
            });
        }
    }
});

const showAnim = gsap.fromTo('.navbar-fixed_component', 
    {
        yPercent: -100,
        opacity: 0,
        display: "none",
    },
    { 
        yPercent: 0,
        opacity: 1,
        paused: true,
        duration: 0.2,
        display: "flex",
    }
);
let scrollPositionWhenShown = 0; // Track when nav was shown

ScrollTrigger.create({
    start: "top top",
    end: "max",
    markers: false,
    onUpdate: (self) => {
        const mainNav = document.querySelector('.padding-navbar');
        const mainNavRect = mainNav.getBoundingClientRect();
        const mainNavCompletelyGone = mainNavRect.bottom < 0;
        
        // Hide fixed nav immediately if main nav is visible
        if (!mainNavCompletelyGone && showAnim.progress() > 0) {
            showAnim.reverse();
        }
        // Show fixed nav only when scrolling up AND main nav is completely gone
        else if (self.direction === -1 && mainNavCompletelyGone && showAnim.progress() === 0) {
            scrollPositionWhenShown = window.pageYOffset;
            showAnim.play();
        }
        // Hide fixed nav when scrolling down with offset
        else if (self.direction === 1 && showAnim.progress() === 1 && mainNavCompletelyGone) {
            const scrollOffset = window.pageYOffset - scrollPositionWhenShown;
            const hideThreshold = 5;
            
            if (scrollOffset > hideThreshold) {
                showAnim.reverse();
            }
        }
    }
});

function updateActiveLink() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll(".navmenu_sub-link");

    links.forEach(link => link.classList.remove("w--current"));
    
    const routeMapping = {
        '/angebot': '/angebot',
        '/projekte': '/projekte',
        '/agentur': '/agentur',
        '/kontakt': '/kontakt',
        '/agb': '/agb',
        '/impressum': '/impressum',
        '/datenschutz': '/datenschutz',
        '/projectdetail': '/projectdetail'
    };
    
    const targetPath = routeMapping[currentPath] || currentPath;
    const activeLink = document.querySelector(`.navmenu_sub-link[href="${targetPath}"]`);
    
    if (activeLink) {
        activeLink.classList.add("w--current");
    }
}

// Close hamburger menu function
function closeHamburgerMenu() {
    const hamburger = document.querySelector(".navbar_hamburger");
    const mainNav = document.querySelector(".main-nav");
    
    if (mainNav && getComputedStyle(mainNav).display !== "none") {
        // Menu is open, close it
        if (hamburger) {
            hamburger.click();
        }
    }
}

// Main Transition Animation
function playMainTransition(data) {
    const tl = gsap.timeline();

    tl.to(data.current.container, {
        opacity: 0,
        y: "-12vh",
        x: "12vw",
        rotation: 4,
        ease: "power4.out",
        duration: 0.8,
    }).to(data.current.container.closest(".page-wrapper"), {
        backgroundColor: "#d9d9ce",
    }, "0").from(data.next.container, {
        duration: 1,
        y: "100vh",
        x: "-50vw",
        ease: "power4.out",
        rotation: -4,
    }, "0");

    return tl;
}

// Setup hamburger menu functionality
function setupHamburgerMenu() {
    const hamburger = document.querySelector(".navbar_hamburger");
    const mainNav = document.querySelector(".main-nav");
    const navClose = document.querySelector(".nav_close-button");
    
    // Hamburger click handler
    if (hamburger) {
        hamburger.addEventListener("click", () => {
            if (mainNav) {
                const isVisible = getComputedStyle(mainNav).display !== "none";
                if (isVisible) {
                    // Close menu
                    gsap.to(mainNav, {
                        opacity: 0,
                        duration: 0.3,
                        onComplete: () => {
                            mainNav.style.display = "none";
                        }
                    });
                } else {
                    // Open menu
                    mainNav.style.display = "block";
                    gsap.fromTo(mainNav, 
                        { opacity: 0 },
                        { opacity: 1, duration: 0.3 }
                    );
                }
            }
        });
    }
    
    // Close button handler
    if (navClose) {
        navClose.addEventListener("click", () => {
            if (mainNav) {
                gsap.to(mainNav, {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                        mainNav.style.display = "none";
                    }
                });
            }
        });
    }
    
    // Setup navigation links in full-screen menu
    const mainNavLinks = document.querySelectorAll(".main-nav_level1-link, .main-nav_level2-link");
    mainNavLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            if (href && href !== "#") {
                e.preventDefault();
                closeHamburgerMenu();
                
                // Small delay to allow menu to close before navigation
                setTimeout(() => {
                    barba.go(href);
                }, 100);
            }
        });
    });
}

// Barba Hooks and Transitions
function setupBarbaTransitions() {
    barba.hooks.before(() => {
        // Close hamburger menu before any transition
        closeHamburgerMenu();
    });

    barba.hooks.enter(data => {
        gsap.set(document.querySelector(".page-wrapper"), { overflow: "hidden" });
        gsap.set(".navmenu_sub-link", { cursor: "progress" });
        gsap.set(data.next.container, {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
        });
    });

    barba.hooks.after(async (data) => {
        gsap.set(data.next.container, { position: "relative" });
        gsap.set(document.querySelector(".page-wrapper"), { overflow: "visible" });
        window.scrollTo(0, 0);
        gsap.set(".navmenu_sub-link", { cursor: "pointer" });
        updateActiveLink();
        
        // Re-setup hamburger menu for new page
        setupHamburgerMenu();
        
        // Re-initialize animations for new page content
        await initializeAnimations();
    });

    barba.init({
        preventRunning: true,
        transitions: [
            {
                name: "main-transition",
                sync: true,
                enter: playMainTransition,
            },
            {
                name: "home-transition",
                to: { namespace: ["home"] },
                enter: playMainTransition,
            },
            {
                name: "agentur-transition",
                to: { namespace: ["agentur"] },
                enter: playMainTransition,
            },
            {
                name: "agb-transition",
                to: { namespace: ["agb"] },
                enter: playMainTransition,
            },
            {
                name: "projekte-transition",
                to: { namespace: ["projekte"] },
                enter: playMainTransition,
            },
            {
                name: "projectdetail-transition",
                to: { namespace: ["projectdetail"] },
                enter: playMainTransition,
            },
            {
                name: "angebot-transition",
                to: { namespace: ["angebot"] },
                enter: playMainTransition,
            },
            {
                name: "impressum-transition",
                to: { namespace: ["impressum"] },
                enter: playMainTransition,
            },
            {
                name: "kontakt-transition",
                to: { namespace: ["kontakt"] },
                enter: playMainTransition,
            },
        ],
    });
}

// Handle page resize
window.addEventListener("resize", () => {
    // Close mobile menu if screen becomes larger
    if (window.innerWidth > 991) {
        const mainNav = document.querySelector(".main-nav");
        if (mainNav && getComputedStyle(mainNav).display !== "none") {
            mainNav.style.display = "none";
        }
    }
});