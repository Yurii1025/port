import { scene, camera } from "./scene.js";
import { renderer } from "./renderer.js";

import {updateCamera} from "./camera.js";

import Plexus from "./plexus.js";

const plexus=new Plexus(scene);


function animate(){

requestAnimationFrame(animate);

updateCamera(camera);

plexus.update();

renderer.render(

    scene,

    camera

);

}

animate();