let currentIndex = 0;
let isAnimating = false;

const sections =
    Array.from(
        document.querySelectorAll(".reveal")
    );

export function revealContent()
{
    if (sections.length === 0)
    {
        return;
    }

    sections[0].classList.add("active");
}

export function initScrollEffects()
{
    let scrollAccumulator = 0;
    const scrollThreshold = 200;

    window.addEventListener(
    "wheel",
    event =>
    {
        if (isAnimating)
        {
            return;
        }

        scrollAccumulator += event.deltaY;

        if (scrollAccumulator >= scrollThreshold)
        {
            scrollAccumulator = 0;
            goToSection(currentIndex + 1);
        }
        else if (scrollAccumulator <= -scrollThreshold)
        {
            scrollAccumulator = 0;
            goToSection(currentIndex - 1);
        }
    },
    { passive: true }
);
}

function goToSection(index)
{
    if (index < 0 || index >= sections.length)
    {
        return;
    }

    isAnimating = true;

    const current = sections[currentIndex];
    const next = sections[index];

    const goingDown = index > currentIndex;

    current.classList.remove("active");
    current.classList.add(
        goingDown ? "exit-up" : "exit-down"
    );

    next.classList.add(
        goingDown
            ? "enter-from-bottom"
            : "enter-from-top"
    );

    requestAnimationFrame(() =>
    {
        next.classList.add("active");
        next.classList.remove(
            "enter-from-bottom",
            "enter-from-top"
        );
    });

    setTimeout(() =>
    {
        current.classList.remove(
            "exit-up",
            "exit-down"
        );

        currentIndex = index;
        isAnimating = false;
    }, 800);
}