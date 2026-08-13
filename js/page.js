let currentIndex = 0;
let isAnimating = false;

let sphere = null;

const sections = Array.from(document.querySelectorAll(".reveal"));

export function revealContent() {
  const header = document.querySelector(".intro-header");

  if (header) {
    header.classList.add("intro-visible");
  }

  if (sections.length === 0) {
    return;
  }

  setTimeout(() => {
    sections[0].classList.add("active");
  }, 600);
}

export function initScrollEffects(heroSphere) {
  sphere = heroSphere;
  let scrollAccumulator = 0;
  const scrollThreshold = 200;

  window.addEventListener(
    "wheel",
    (event) => {
      if (isAnimating) {
        return;
      }

      scrollAccumulator += event.deltaY;

      if (scrollAccumulator >= scrollThreshold) {
        scrollAccumulator = 0;
        goToSection(currentIndex + 1);
      } else if (scrollAccumulator <= -scrollThreshold) {
        scrollAccumulator = 0;
        goToSection(currentIndex - 1);
      }
    },
    { passive: true },
  );
}

function goToSection(index) {
  if (index < 0 || index >= sections.length) {
    return;
  }

  isAnimating = true;

  const current = sections[currentIndex];
  const next = sections[index];

  const goingDown = index > currentIndex;

// --- трансформация объекта ---

// 1 → 2 экран (сфера → галактика)
if (currentIndex === 0 && index === 1) {
  sphere.toNetwork();
}

// 2 → 1 экран (галактика → сфера)
if (currentIndex === 1 && index === 0) {
  sphere.toSphere();
}

// 2 → 3 экран (галактика → солнечная система)
if (currentIndex === 1 && index === 2) {
  sphere.toSolarSystem();
}

// 3 → 2 экран (солнечная система → галактика)
if (currentIndex === 2 && index === 1) {
  sphere.fromSolarSystem();
}

  current.classList.remove("active");
  current.classList.add(goingDown ? "exit-up" : "exit-down");

  next.classList.add(goingDown ? "enter-from-bottom" : "enter-from-top");

  requestAnimationFrame(() => {
    next.classList.add("active");
    next.classList.remove("enter-from-bottom", "enter-from-top");
  });

  setTimeout(() => {
    current.classList.remove("exit-up", "exit-down");

    currentIndex = index;
    isAnimating = false;
  }, 800);
}

function playIntroAnimation() {
  const items = document.querySelectorAll(".intro-item");

  items.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add("intro-visible");
    }, index * 500);
  });
}
