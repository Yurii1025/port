import * as THREE from "../build/three.module.js";

export default class HeroSphere {
  constructor(scene) {
    this.group = new THREE.Group();
    

    const count = 1800;
    const radius = 1.15;

    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();

      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);

      const r = radius * (0.94 + Math.random() * 0.08);
      //   const shellBias = Math.pow(Math.random(), 3);

      //   const r = radius * (0.82 + shellBias * 0.18);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);

      positions[i * 3 + 1] = r * Math.cos(phi);

      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    this.material = new THREE.PointsMaterial({
      color: 0xffffff,

      size: 0.016,

      transparent: true,

      opacity: 0,

      depthWrite: false,
    });

    this.points = new THREE.Points(geometry, this.material);

    // внутреннее ядро
    const innerCount = 420;
    const innerRadius = 0.62;

    const innerPositions = new Float32Array(innerCount * 3);

    for (let i = 0; i < innerCount; i++) {
      const u = Math.random();
      const v = Math.random();

      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);

      const r = innerRadius * (0.85 + Math.random() * 0.15);

      innerPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);

      innerPositions[i * 3 + 1] = r * Math.cos(phi);

      innerPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }

    const innerGeometry = new THREE.BufferGeometry();

    innerGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(innerPositions, 3),
    );

    this.innerMaterial = new THREE.PointsMaterial({
      color: 0x2a4f8f,

      size: 0.022,

      transparent: true,

      opacity: 0,

      depthWrite: false,
    });

    this.innerPoints = new THREE.Points(innerGeometry, this.innerMaterial);

    this.group.add(this.innerPoints);

    this.group.add(this.points);

    this.group.position.set(0, 0, -0.5);

    // this.offsetX = 3.1;
    // this.offsetY = 0.0;
    this.offsetX = 3.6;
    this.offsetY = 0.0;

    this.currentX = this.offsetX;
    this.currentY = this.offsetY;

    this.group.scale.setScalar(1.18);
    this.targetScale = 1.18;

    scene.add(this.group);

    this.opacity = 0;
    this.targetOpacity = 0;

    this.scale = 0.8;
    this.targetScale = 0.8;
  }

  show() {
    this.targetOpacity = 1;
    this.targetScale = 1.08;
  }

  hide() {
    this.targetOpacity = 0;
    this.targetScale = 0.85;
  }

  update() {
    const hero = document.querySelector(".hero_container");

    if (hero) {
      const rect = hero.getBoundingClientRect();

      const x =
        (rect.left + rect.width * 0.82 - window.innerWidth / 2) /
        (window.innerWidth / 2);

      const y =
        -(rect.top + rect.height * 0.5 - window.innerHeight / 2) /
        (window.innerHeight / 2);

      const targetX = x * 3 + this.offsetX;
      const targetY = y * 1.8 + this.offsetY;

      this.currentX += (targetX - this.currentX) * 0.025;
      this.currentY += (targetY - this.currentY) * 0.025;

      this.group.position.x = this.currentX;
      this.group.position.y = this.currentY;
    }

    this.opacity += (this.targetOpacity - this.opacity) * 0.04;
    this.scale += (this.targetScale - this.scale) * 0.04;

    this.material.opacity = this.opacity;
    this.innerMaterial.opacity = this.opacity * 0.55;

    const pulse = 1 + Math.sin(performance.now() * 0.0003) * 0.015;

    this.group.scale.setScalar(this.scale * pulse);

    this.points.rotation.y += 0.0008;
    this.points.rotation.x += 0.0002;

    this.innerPoints.rotation.y -= 0.0013;
    this.innerPoints.rotation.x += 0.0005;
  }
}
