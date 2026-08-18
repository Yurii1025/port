import mouse from "./mouse.js";
import { lerp } from "./math.js";
import config from "./config.js";

let scrollOffset = 0;
let scrollVelocity = 0;

window.addEventListener("wheel", (event) => {
  scrollVelocity += event.deltaY * 0.0008;
});

export function updateCamera(camera) {
  mouse.x = lerp(mouse.x, mouse.targetX, 0.03);

  scrollOffset += scrollVelocity;

  scrollVelocity *= 0.9;

  scrollOffset *= 0.92;

  mouse.y = lerp(mouse.y, mouse.targetY, 0.03);

  camera.position.x = mouse.x * config.mouseStrength;

  // camera.position.y=
  // -mouse.y*config.mouseStrength;

  camera.position.y = -mouse.y * config.mouseStrength + scrollOffset;

  camera.lookAt(0, 0, 0);
}
