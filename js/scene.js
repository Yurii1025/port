import * as THREE from "../build/three.module.js";

export const scene = new THREE.Scene();

export const camera = new THREE.PerspectiveCamera(
  55,

  window.innerWidth / window.innerHeight,

  0.1,

  100,
);
//Camera range
camera.position.z = 6.5;

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();
});
