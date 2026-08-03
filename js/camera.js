import mouse from "./mouse.js";
import {lerp} from "./math.js";
import config from "./config.js";

export function updateCamera(camera){

mouse.x=
lerp(mouse.x,mouse.targetX,.03);

mouse.y=
lerp(mouse.y,mouse.targetY,.03);

camera.position.x=
mouse.x*config.mouseStrength;

camera.position.y=
-mouse.y*config.mouseStrength;

camera.lookAt(0,0,0);

}