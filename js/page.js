export function revealContent()
{
    const elements =
        document.querySelectorAll(".reveal");

    elements.forEach((element, index) =>
    {
        setTimeout(() =>
        {
            element.classList.add("visible");
        }, index * 180);
    });
}

export function initScrollEffects()
{
    let scrollTarget = 0;
    let scrollCurrent = 0;

    window.addEventListener("wheel", event =>
    {
        scrollTarget += event.deltaY * 0.0015;

        scrollTarget = Math.max(
            0,
            Math.min(scrollTarget, 1)
        );
    });

    function update()
    {
        scrollCurrent +=
            (scrollTarget - scrollCurrent) * 0.08;

        document.documentElement.style.setProperty(
            "--scroll-progress",
            scrollCurrent.toFixed(3)
        );

        requestAnimationFrame(update);
    }

    update();
}