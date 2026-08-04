import * as THREE from "../build/three.module.js";

export const renderer = new THREE.WebGLRenderer({

    antialias: true,

    alpha: true

});

renderer.setPixelRatio(

    Math.min(

        window.devicePixelRatio,

        1

    )

);

renderer.setSize(

    window.innerWidth,

    window.innerHeight

);

renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.toneMapping = THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.0;

document.body.appendChild(

    renderer.domElement

);

window.addEventListener(

    "resize",

    () => {

        renderer.setSize(

            window.innerWidth,

            window.innerHeight

        );

    }

);