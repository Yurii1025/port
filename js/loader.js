export function playIntro(canvas)
{
    return new Promise(resolve =>
    {
        setTimeout(() =>
        {
            canvas.classList.add("visible");

            document
                .getElementById("loader")
                .classList
                .add("hide");

            resolve();

        }, 3000);
    });
}