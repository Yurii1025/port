import * as THREE from "../build/three.module.js";

export default class HeroSphere {
  constructor(scene) {
    this.group = new THREE.Group();

    const count = 2200;
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

    this.positions = positions;
    this.spherePositions = positions.slice();
    this.networkPositions = new Float32Array(positions.length);

   this.solarPositions = new Float32Array(positions.length);

this.solarProgress = 0;
this.targetSolar = 0;

    this.morphProgress = 0;
    this.targetMorph = 0;


    // галактика
    const arms = 5;
    const galaxyRadius = 1.3;

    for (let i = 0; i < count; i++) {
      // больше точек в центре
      const t = Math.pow(Math.random(), 0.6);

      const r = t * galaxyRadius;

      // выбор рукава
      const arm = Math.floor(Math.random() * arms);

      // угол спирали
      const angle =
        r * 5.2 + (arm / arms) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;

      // небольшой шум
      const noise = (Math.random() - 0.5) * 0.05;

      this.networkPositions[i * 3] =
        Math.cos(angle) * r + Math.cos(angle * 2) * noise;

      this.networkPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.12;

      this.networkPositions[i * 3 + 2] =
        Math.sin(angle) * r + Math.sin(angle * 2) * noise;
    }

// ---------- SOLAR SYSTEM ----------

const orbitRadii = [0.65, 0.95, 1.28];
const planetAngles = [0.3, 2.1, 4.0];

let index = 0;

// орбиты
for (let orbit = 0; orbit < orbitRadii.length; orbit++) {
  const radius = orbitRadii[orbit];

  for (let i = 0; i < 220; i++) {
    const angle = (i / 360) * Math.PI * 2;

    this.solarPositions[index++] = Math.cos(angle) * radius;
    this.solarPositions[index++] = (Math.random() - 0.5) * 0.008;
    this.solarPositions[index++] = Math.sin(angle) * radius;
  }
}

// три планеты
const planetRadius = 0.08;
const planetPointCount = 120;

for (let p = 0; p < 3; p++) {
  const orbitRadius = orbitRadii[p];
  const centerAngle = planetAngles[p];

  // центр планеты на орбите
  const cx = Math.cos(centerAngle) * orbitRadius;
  const cy = 0;
  const cz = Math.sin(centerAngle) * orbitRadius;

  for (let i = 0; i < planetPointCount; i++) {
    const u = Math.random();
    const v = Math.random();

    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);

    const r = planetRadius * Math.pow(Math.random(), 0.35);

    this.solarPositions[index++] =
      cx + r * Math.sin(phi) * Math.cos(theta);

    this.solarPositions[index++] =
      cy + r * Math.cos(phi);

    this.solarPositions[index++] =
      cz + r * Math.sin(phi) * Math.sin(theta);
  }
}

// если точки ещё остались — распределяем по орбитам
while (index < this.solarPositions.length) {
  const orbit = Math.floor(Math.random() * orbitRadii.length);
  const radius = orbitRadii[orbit];
  const angle = Math.random() * Math.PI * 2;

  this.solarPositions[index++] = Math.cos(angle) * radius;
  this.solarPositions[index++] = (Math.random() - 0.5) * 0.008;
  this.solarPositions[index++] = Math.sin(angle) * radius;
}

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
    const innerRadius = 0.18;

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

    this.group.rotation.x = -0.65;
    this.group.rotation.y = 0.75;

    this.group.position.set(0, 0, -0.5);

    // this.offsetX = 3.6;
    // this.offsetY = 0.0;

    // this.currentX = this.offsetX;
    // this.currentY = this.offsetY;

    // позиции объекта на разных экранах
    this.heroPosition = { x: 3.6, y: 0.0 };
    this.aboutPosition = { x: -2.8, y: -0.2 };
    this.skillsPosition = { x: 3.1, y: -0.15 };

    // текущая и целевая позиции
    this.currentX = this.heroPosition.x;
    this.currentY = this.heroPosition.y;

    this.targetX = this.heroPosition.x;
    this.targetY = this.heroPosition.y;

    this.group.scale.setScalar(1.18);
    this.targetScale = 1.18;

    scene.add(this.group);

    this.opacity = 0;
    this.targetOpacity = 0;

    this.scale = 0.8;
    this.targetScale = 0.8;

    // hover
    this.hover = 0;
    this.targetHover = 0;
  }

  show() {
    this.targetOpacity = 1;
    this.targetScale = 1.08;
  }

  hide() {
    this.targetOpacity = 0;
    this.targetScale = 0.85;
  }

  onHover() {
    this.targetHover = 1;
  }

  onLeave() {
    this.targetHover = 0;
  }

  toSphere() {
    this.targetMorph = 0;
    this.targetScale = 1.08;

    this.targetX = this.heroPosition.x;
    this.targetY = this.heroPosition.y;
    this.innerMaterial.color.set(0x2a4f8f);
  }

  toNetwork() {
    this.targetMorph = 1;
    this.targetScale = 0.82;

    this.targetX = this.aboutPosition.x;
    this.targetY = this.aboutPosition.y;
  }
toSolarSystem() {
  this.targetSolar = 1;
  this.targetScale = 0.75;

  this.targetX = this.skillsPosition.x;
  this.targetY = this.skillsPosition.y;
  this.innerMaterial.color.set(0xffd45c);
}

fromSolarSystem() {
  this.targetSolar = 0;

  this.targetX = this.aboutPosition.x;
  this.targetY = this.aboutPosition.y;
}

  update() {
    this.hover += (this.targetHover - this.hover) * 0.08;
    const hero = document.querySelector(".hero_container");

    if (hero) {
      const rect = hero.getBoundingClientRect();

      const x =
        (rect.left + rect.width * 0.82 - window.innerWidth / 2) /
        (window.innerWidth / 2);

      const y =
        -(rect.top + rect.height * 0.5 - window.innerHeight / 2) /
        (window.innerHeight / 2);

      // const targetX = x * 3 + this.offsetX;
      // const targetY = y * 1.8 + this.offsetY;

      // this.currentX += (targetX - this.currentX) * 0.025;
      // this.currentY += (targetY - this.currentY) * 0.025;

      // небольшое следование за героем только на первом экране
      const heroFollowX = x * 0.6;
      const heroFollowY = y * 0.4;

      // итоговая цель
      const targetX = this.targetX + heroFollowX * (1 - this.morphProgress);
      const targetY = this.targetY + heroFollowY * (1 - this.morphProgress);

      // плавное движение
      this.currentX += (targetX - this.currentX) * 0.018;
      this.currentY += (targetY - this.currentY) * 0.018;

      this.group.position.x = this.currentX;
      this.group.position.y = this.currentY;
    }

    this.opacity += (this.targetOpacity - this.opacity) * 0.04;
    this.scale += (this.targetScale - this.scale) * 0.04;

    this.morphProgress += (this.targetMorph - this.morphProgress) * 0.035;

    this.solarProgress +=
  (this.targetSolar - this.solarProgress) * 0.04;

    //   // плавная смена цвета ядра
    // const galaxyColor = new THREE.Color(0xffd66b);
    // const sphereColor = new THREE.Color(0x2a4f8f);

    // this.innerMaterial.color.copy(sphereColor).lerp(galaxyColor, this.morphProgress);

    const pos = this.points.geometry.attributes.position.array;

    for (let i = 0; i < pos.length; i++) {
      const galaxy =
        this.spherePositions[i] * (1 - this.morphProgress) +
        this.networkPositions[i] * this.morphProgress;

      pos[i] =
  galaxy * (1 - this.solarProgress) +
  this.solarPositions[i] * this.solarProgress;
    }

    this.points.geometry.attributes.position.needsUpdate = true;

    if (this.morphProgress > 0.7) {
      const pulse = 1 + Math.sin(performance.now() * 0.0012) * 0.025;

      this.group.scale.setScalar(this.scale * pulse);
    }

    this.material.opacity = this.opacity;
    // ядро исчезает при превращении в галактику
    // this.innerMaterial.opacity =
    // this.opacity * 0.55 * (1 - this.morphProgress);
    // this.material.opacity = this.opacity * (1 + this.hover * 0.25);
    const sphereColor = new THREE.Color(0xffffff);
    const solarColor = new THREE.Color(0xffe37a);

    const currentColor = sphereColor
  .clone()
  .lerp(solarColor, this.solarProgress);

    this.material.color.set(0xffffff);

    this.material.opacity = this.opacity;
    this.innerMaterial.opacity =
  this.opacity *
  (1 - this.morphProgress + this.solarProgress * 0.8);

this.innerMaterial.color
  .set(0x2a4f8f)
  .lerp(new THREE.Color(0xffd45a), this.solarProgress);

    const pulse = 1 + Math.sin(performance.now() * 0.0003) * 0.015;

    const hoverScale = 1 + this.hover * 0.18;

    this.group.scale.setScalar(this.scale * pulse * hoverScale);

    const galaxySpeed =
      (0.0008 + this.morphProgress * 0.0014) * (1 + this.hover * 0.6);

    this.points.rotation.y += galaxySpeed;
    
    this.points.rotation.x += 0.00025;
    this.points.rotation.z += 0.00012;

    this.innerPoints.rotation.y -= 0.0013;
    this.innerPoints.rotation.x += 0.0005;
  }
}
