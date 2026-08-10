import * as THREE from "../build/three.module.js";

export const renderer = new THREE.WebGLRenderer({

    antialias: true,

    alpha: true

});


renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);
// renderer.setPixelRatio(window.devicePixelRatio);

// renderer.setPixelRatio(

//     Math.min(

//         window.devicePixelRatio,

//         1

//     )

// );

renderer.setSize(
    window.innerWidth,
    window.innerHeight,
    false
);

renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.toneMapping = THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.0;

document.body.appendChild(

    renderer.domElement

);

// setTimeout(() =>
// {
//     renderer.domElement.classList.add("visible");

//     document
//         .getElementById("loader")
//         .classList
//         .add("hide");

// }, 4300);

window.addEventListener("resize", () =>
{
    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight,
        false
    );
});