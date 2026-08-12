import { scene, camera } from "./scene.js";
import { renderer } from "./renderer.js";
import { playIntro } from "./loader.js";
import {
    revealContent,
    initScrollEffects
}
from "./page.js";

import {updateCamera} from "./camera.js";

import Plexus from "./plexus.js";

import HeroSphere from "./heroSphere.js";

const plexus=new Plexus(scene);

const heroSphere = new HeroSphere(scene);


function animate(){

requestAnimationFrame(animate);

updateCamera(camera);

plexus.update();

renderer.render(

    scene,

    camera

);
heroSphere.update();

}

async function start()
{
    await playIntro(renderer.domElement);

    animate();

    initScrollEffects();

    setTimeout(() =>
{
    revealContent();

    heroSphere.show();

}, 2000);
}

start();