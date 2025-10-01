document.addEventListener("DOMContentLoaded", () => {

  // Navbar show/hide animation
  const showAnim = gsap.fromTo(
    ".navbar-fixed_component",
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

  let scrollPositionWhenShown = 0;

  ScrollTrigger.create({
    start: "top top",
    end: "max",
    onUpdate: (self) => {
      const mainNav = document.querySelector(".padding-navbar");
      const mainNavRect = mainNav.getBoundingClientRect();
      const mainNavCompletelyGone = mainNavRect.bottom < 0;

      if (!mainNavCompletelyGone && showAnim.progress() > 0) {
        showAnim.reverse();
      } else if (
        self.direction === -1 &&
        mainNavCompletelyGone &&
        showAnim.progress() === 0
      ) {
        scrollPositionWhenShown = window.pageYOffset;
        showAnim.play();
      } else if (
        self.direction === 1 &&
        showAnim.progress() === 1 &&
        mainNavCompletelyGone
      ) {
        const scrollOffset = window.pageYOffset - scrollPositionWhenShown;
        const hideThreshold = 5;

        if (scrollOffset > hideThreshold) {
          showAnim.reverse();
        }
      }
    },
  });

  ScrollTrigger.refresh()
});
