import * as THREE from "../build/three.module.js";
import { scene, camera } from "./scene.js";
import { renderer } from "./renderer.js";
import { playIntro } from "./loader.js";
import { revealContent, initScrollEffects } from "./page.js";
import { updateCamera } from "./camera.js";
import Plexus from "./plexus.js";
import HeroSphere from "./heroSphere.js";

const plexus = new Plexus(scene);

const heroSphere = new HeroSphere(scene);
window.heroSphere = heroSphere;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
  requestAnimationFrame(animate);

  updateCamera(camera);

  plexus.update();

  renderer.render(
    scene,

    camera,
  );
  heroSphere.update();


  raycaster.setFromCamera(mouse, camera);

// уменьшили область наведения
raycaster.params.Points.threshold = 0.08;

const intersects = raycaster.intersectObject(heroSphere.points);

  if (intersects.length > 0) {
    heroSphere.onHover();
  } else {
    heroSphere.onLeave();
  }
}

async function start() {
  await playIntro(renderer.domElement);

  animate();

  initScrollEffects(heroSphere);

  setTimeout(() => {
    revealContent();

    heroSphere.show();
  }, 2000);
}

start();
