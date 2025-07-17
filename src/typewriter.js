function createTypewriter(selector, words, options = {}) {
  const defaults = {
    typeSpeed: 0.08,
    deleteSpeed: 0.06,
    pauseTime: 2.5,
    loop: true,
    cursor: true,
    cursorWidth: "2px",
    cursorColor: "#f2f200",
    ease: "power2.out",
  };

  const settings = { ...defaults, ...options };

  const element = document.querySelector(selector);
  if (!element) {
    console.error(`Typewriter: Element with selector "${selector}" not found`);
    return null;
  }

  const originalText = element.textContent;

  element.innerHTML = "";
  const textContainer = document.createElement("span");
  textContainer.className = "typewriter-text";
  textContainer.style.display = "inline-block";
  element.appendChild(textContainer);

  let cursorElement = null;
  if (settings.cursor) {
    cursorElement = document.createElement("span");
    cursorElement.className = "typewriter-cursor";

    gsap.set(cursorElement, {
      display: "inline-block",
      width: settings.cursorWidth,
      height: "1.2em",
      backgroundColor: settings.cursorColor,
      marginLeft: "2px",
      opacity: 1,
      force3D: true,
    });

    element.appendChild(cursorElement);

    gsap.to(cursorElement, {
      opacity: 0,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: settings.ease,
    });
  }

  let currentWordIndex = 0;
  let isRunning = false;

  function startAnimation() {
    if (isRunning) return;
    isRunning = true;

    textContainer.textContent = "";
    currentWordIndex = 0;

    gsap.delayedCall(0.5, () => {
      typeWord(words[currentWordIndex]);
    });
  }

  function typeWord(word) {
    let charIndex = 0;

    function typeNextChar() {
      if (charIndex < word.length) {
        textContainer.textContent += word[charIndex];
        charIndex++;
        gsap.delayedCall(settings.typeSpeed, typeNextChar);
      } else {
        gsap.delayedCall(settings.pauseTime, () => {
          deleteWord();
        });
      }
    }

    typeNextChar();
  }

  function deleteWord() {
    function deleteNextChar() {
      if (textContainer.textContent.length > 0) {
        textContainer.textContent = textContainer.textContent.slice(0, -1);
        gsap.delayedCall(settings.deleteSpeed, deleteNextChar);
      } else {
        currentWordIndex = (currentWordIndex + 1) % words.length;

        if (settings.loop || currentWordIndex !== 0) {
          gsap.delayedCall(0.3, () => {
            typeWord(words[currentWordIndex]);
          });
        } else {
          textContainer.textContent = originalText;
          isRunning = false;
        }
      }
    }

    deleteNextChar();
  }

  startAnimation();

  return {
    stop: () => {
      gsap.killDelayedCallsTo(typeWord);
      gsap.killDelayedCallsTo(deleteWord);
      gsap.killDelayedCallsTo(startAnimation);
      if (cursorElement) {
        gsap.killTweensOf(cursorElement);
        cursorElement.remove();
      }
      textContainer.textContent = originalText;
      isRunning = false;
    },

    restart: () => {
      gsap.killDelayedCallsTo(typeWord);
      gsap.killDelayedCallsTo(deleteWord);
      gsap.killDelayedCallsTo(startAnimation);
      isRunning = false;
      startAnimation();
    },

    destroy: () => {
      gsap.killDelayedCallsTo(typeWord);
      gsap.killDelayedCallsTo(deleteWord);
      gsap.killDelayedCallsTo(startAnimation);
      if (cursorElement) {
        gsap.killTweensOf(cursorElement);
        cursorElement.remove();
      }
      element.innerHTML = originalText;
      isRunning = false;
    },
  };
}

document.addEventListener("DOMContentLoaded", function () {
  function initTypewriters() {
    if (typeof gsap === "undefined") {
      setTimeout(initTypewriters, 100);
      return;
    }

    const typewriterElements = document.querySelectorAll("[data-typewriter]");

    typewriterElements.forEach((element) => {
      const wordsData = element.getAttribute("data-typewriter");
      if (!wordsData) return;

      const words = wordsData.split(",").map((word) => word.trim());

      const options = {
        typeSpeed: parseFloat(element.getAttribute("data-type-speed")) || 0.08,
        deleteSpeed:
          parseFloat(element.getAttribute("data-delete-speed")) || 0.06,
        pauseTime: parseFloat(element.getAttribute("data-pause-time")) || 2.5,
        cursor: element.getAttribute("data-cursor") !== "false",
        cursorColor: element.getAttribute("data-cursor-color") || "#f2f200",
        loop: element.getAttribute("data-loop") !== "false",
        ease: element.getAttribute("data-ease") || "power2.out",
      };

      if (!element.id) {
        element.id = `typewriter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      }

      createTypewriter(`#${element.id}`, words, options);
    });
  }

  setTimeout(initTypewriters, 100);
});

window.createTypewriter = createTypewriter;
