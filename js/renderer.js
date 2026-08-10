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