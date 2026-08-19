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

    // Цвет каждой отдельной точки.
    const pointColors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pointColors[i * 3] = 1;
      pointColors[i * 3 + 1] = 1;
      pointColors[i * 3 + 2] = 1;
    }

    geometry.setAttribute("color", new THREE.BufferAttribute(pointColors, 3));
    // const geometry = new THREE.BufferGeometry();

    // geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    this.positions = positions;
    this.spherePositions = positions.slice();
    this.networkPositions = new Float32Array(positions.length);

    this.solarPositions = new Float32Array(positions.length);

    this.sunPositions = new Float32Array(positions.length);
    this.sunPhases = new Float32Array(count);

    this.solarProgress = 0;
    this.targetSolar = 0;

    this.sunProgress = 0;
    this.targetSun = 0;

    this.blackHoleProgress = 0;
    this.targetBlackHole = 0;

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

        this.solarPositions[index++] = cx + r * Math.sin(phi) * Math.cos(theta);

        this.solarPositions[index++] = cy + r * Math.cos(phi);

        this.solarPositions[index++] = cz + r * Math.sin(phi) * Math.sin(theta);
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
    // // ---------- SUN ----------

    // const sunRadius = 0.96;

    // for (let i = 0; i < count; i++) {
    //   const u = Math.random();
    //   const v = Math.random();

    //   const theta = 2 * Math.PI * u;
    //   const phi = Math.acos(2 * v - 1);

    //   // плотное облако внутри шара
    //   const r = sunRadius * Math.pow(Math.random(), 0.45);

    //   this.sunPositions[i * 3] =
    //     r * Math.sin(phi) * Math.cos(theta);

    //   this.sunPositions[i * 3 + 1] =
    //     r * Math.cos(phi);

    //   this.sunPositions[i * 3 + 2] =
    //     r * Math.sin(phi) * Math.sin(theta);

    //   this.sunPhases[i] = Math.random() * Math.PI * 2;
    // }
    // ---------- SUN ----------

    const sunRadius = 1;

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();

      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);

      // Плотная внешняя оболочка Солнца
      const shell = Math.pow(Math.random(), 0.35);

      const r = sunRadius * (0.72 + shell * 0.28);

      this.sunPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);

      this.sunPositions[i * 3 + 1] = r * Math.cos(phi);

      this.sunPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      this.sunPhases[i] = Math.random() * Math.PI * 2;
    }

    // ---------- BLACK HOLE ----------

    // Все внешние точки становятся
    // частью аккреционного диска.
    // Чёрное ядро теперь отдельный Mesh.

    this.blackHoleRadii = new Float32Array(count);
    this.blackHoleAngles = new Float32Array(count);
    this.blackHoleSpeeds = new Float32Array(count);
    this.blackHolePhases = new Float32Array(count);

    const diskInnerRadius = 0.34;
    const diskOuterRadius = 1.28;

    for (let i = 0; i < count; i++) {
      this.blackHolePhases[i] = Math.random() * Math.PI * 2;

      this.blackHoleRadii[i] =
        diskInnerRadius +
        Math.pow(Math.random(), 0.65) * (diskOuterRadius - diskInnerRadius);

      this.blackHoleAngles[i] = Math.random() * Math.PI * 2;

      this.blackHoleSpeeds[i] = 0.45 + Math.random() * 0.65;
    }

    this.material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.016,
      transparent: true,
      opacity: 0,
      depthWrite: true,
      depthTest: true,
      vertexColors: true,
    });

    this.points = new THREE.Points(geometry, this.material);
    this.points.renderOrder = 1;

    // ---------- BLACK HOLE CORE ----------

    // const blackHoleGeometry = new THREE.SphereGeometry(1, 48, 48);

    // const blackHoleMaterial = new THREE.MeshBasicMaterial({
    //   color: 0x000000,
    //   transparent: true,
    //   opacity: 0,
    //   depthWrite: true,
    //   depthTest: true,
    // });

    // this.blackHoleCore = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
    const blackHoleGeometry = new THREE.SphereGeometry(1, 48, 48);

    const blackHoleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: true,
      depthTest: true,

      uniforms: {
        uOpacity: { value: 0 },
      },

      vertexShader: `
    varying vec3 vNormal;

    void main() {
      vNormal = normalize(normalMatrix * normal);

      gl_Position =
        projectionMatrix *
        modelViewMatrix *
        vec4(position, 1.0);
    }
  `,

      fragmentShader: `
  varying vec3 vNormal;

  uniform float uOpacity;

  void main() {
    vec3 normal = normalize(vNormal);

    // Направление небольшого источника света.
    vec3 lightDirection = normalize(vec3(0.45, 0.65, 1.0));

    // Насколько поверхность повернута к свету.
    float light = max(dot(normal, lightDirection), 0.0);

    // Сильно концентрируем свет в небольшой области.
    light = pow(light, 7.0);

    // Почти полностью чёрная поверхность.
    vec3 darkColor = vec3(0.0015, 0.0015, 0.002);

    // Очень мягкий серый блик.
    vec3 lightColor = vec3(0.22, 0.22, 0.24);

    vec3 color = darkColor + lightColor * light;

    gl_FragColor = vec4(color, uOpacity);
  }
`,
    });

    this.blackHoleCore = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);

    // Размер event horizon.
    // Сама геометрия имеет радиус 1,
    // поэтому scale определяет реальный размер.
    this.blackHoleCore.scale.setScalar(0.3);

    this.blackHoleCore.renderOrder = 0;

    this.group.add(this.blackHoleCore);

    // внутреннее ядро
    const innerCount = 420;
    const innerRadius = 0.18;

    const innerPositions = new Float32Array(innerCount * 3);

    this.sunCorePositions = new Float32Array(innerCount * 3);
    this.sunCorePhases = new Float32Array(innerCount);

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

    this.innerPositions = innerPositions.slice();

    // ---------- SUN CORE ----------

    const coreRadius = 0.8;

    for (let i = 0; i < innerCount; i++) {
      const u = Math.random();
      const v = Math.random();

      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);

      // плотное центральное облако
      const r = coreRadius * Math.pow(Math.random(), 0.55);

      this.sunCorePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);

      this.sunCorePositions[i * 3 + 1] = r * Math.cos(phi);

      this.sunCorePositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      this.sunCorePhases[i] = Math.random() * Math.PI * 2;
    }

    const innerGeometry = new THREE.BufferGeometry();

    innerGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(innerPositions, 3),
    );

    this.innerMaterial = new THREE.PointsMaterial({
      color: 0x66b4f6,

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
    this.worksPosition = { x: 0.0, y: -2.5 };

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
    this.targetSolar = 0;
    this.targetSun = 0;
    this.targetBlackHole = 0;

    this.targetScale = 1.08;

    this.targetX = this.heroPosition.x;
    this.targetY = this.heroPosition.y;
  }

  toNetwork() {
    this.targetMorph = 1;
    this.targetSolar = 0;
    this.targetSun = 0;
    this.targetBlackHole = 0;

    this.targetScale = 0.82;

    this.targetX = this.aboutPosition.x;
    this.targetY = this.aboutPosition.y;
  }
  toSolarSystem() {
    this.targetMorph = 1;
    this.targetSun = 0;
    this.targetBlackHole = 0;
    this.targetSolar = 1;

    this.targetScale = 0.75;

    this.targetX = this.skillsPosition.x;
    this.targetY = this.skillsPosition.y;
  }

  toSun() {
    this.targetMorph = 1;
    this.targetSolar = 1;
    this.targetSun = 1;
    this.targetBlackHole = 0;

    this.targetScale = 0.42;

    this.targetX = this.worksPosition.x;
    this.targetY = this.worksPosition.y;
  }

  toBlackHole() {
    this.targetSolar = 1;
    this.targetSun = 1;
    this.targetBlackHole = 1;

    this.targetScale = 0.72;

    // Black Hole — отдельная композиция аутро.
    // Не используем позицию 4-го экрана.
    this.targetX = 0.0;
    this.targetY = 0.0;
  }

  // fromSolarSystem() {
  //   this.targetSolar = 0;
  //   this.targetSun = 0;

  //   this.targetX = this.aboutPosition.x;
  //   this.targetY = this.aboutPosition.y;
  // }

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

    this.solarProgress += (this.targetSolar - this.solarProgress) * 0.04;

    // ---------- SUN ----------

    const sunSpeed = this.targetSun < this.sunProgress ? 0.12 : 0.04;

    this.sunProgress += (this.targetSun - this.sunProgress) * sunSpeed;

    if (Math.abs(this.sunProgress - this.targetSun) < 0.005) {
      this.sunProgress = this.targetSun;
    }

    // ---------- BLACK HOLE ----------

    const blackHoleSpeed =
      this.targetBlackHole > this.blackHoleProgress ? 0.012 : 0.06;

    this.blackHoleProgress +=
      (this.targetBlackHole - this.blackHoleProgress) * blackHoleSpeed;

    if (Math.abs(this.blackHoleProgress - this.targetBlackHole) < 0.005) {
      this.blackHoleProgress = this.targetBlackHole;
    }
    // this.morphProgress += (this.targetMorph - this.morphProgress) * 0.035;

    // this.solarProgress += (this.targetSolar - this.solarProgress) * 0.04;

    // // Солнце возвращается быстрее, чем формируется,
    // // чтобы к моменту окончания перехода 4 → 3
    // // ядро уже вернулось в компактное состояние.
    // const sunSpeed = this.targetSun < this.sunProgress ? 0.12 : 0.04;

    // this.sunProgress += (this.targetSun - this.sunProgress) * sunSpeed;

    // // Полностью фиксируем состояние,
    // // когда почти достигли цели.
    // if (Math.abs(this.sunProgress - this.targetSun) < 0.005) {
    //   this.sunProgress = this.targetSun;
    // }
    //   this.morphProgress += (this.targetMorph - this.morphProgress) * 0.035;

    //   this.solarProgress +=
    // (this.targetSolar - this.solarProgress) * 0.04;

    // this.sunProgress +=
    // (this.targetSun - this.sunProgress) * 0.04;

    //   // плавная смена цвета ядра
    // const galaxyColor = new THREE.Color(0xffd66b);
    // const sphereColor = new THREE.Color(0x2a4f8f);

    // this.innerMaterial.color.copy(sphereColor).lerp(galaxyColor, this.morphProgress);

    //   const pos = this.points.geometry.attributes.position.array;

    //   for (let i = 0; i < pos.length; i++) {
    //     const galaxy =
    //       this.spherePositions[i] * (1 - this.morphProgress) +
    //       this.networkPositions[i] * this.morphProgress;

    //     pos[i] =
    // galaxy * (1 - this.solarProgress) +
    // this.solarPositions[i] * this.solarProgress;
    //   }

    // const pos = this.points.geometry.attributes.position.array;

    // for (let i = 0; i < pos.length; i++) {
    //   const galaxy =
    //     this.spherePositions[i] * (1 - this.morphProgress) +
    //     this.networkPositions[i] * this.morphProgress;

    //   const solar =
    //     galaxy * (1 - this.solarProgress) +
    //     this.solarPositions[i] * this.solarProgress;

    //   const pointIndex = Math.floor(i / 3);
    //   const phase = this.sunPhases[pointIndex];

    //   // const time = performance.now() * 0.00035;
    //   const time = performance.now() * 0.001;

    //   const movementX = Math.sin(time + phase) * 0.018 * this.sunProgress;

    //   const movementY =
    //     Math.cos(time * 0.9 + phase * 1.7) * 0.018 * this.sunProgress;

    //   const movementZ =
    //     Math.sin(time * 0.75 + phase * 2.3) * 0.018 * this.sunProgress;
    //   // const movementX =
    //   //   Math.sin(time + phase) * 0.012 * this.sunProgress;

    //   // const movementY =
    //   //   Math.cos(time * 0.9 + phase * 1.7) * 0.012 * this.sunProgress;

    //   // const movementZ =
    //   //   Math.sin(time * 0.75 + phase * 2.3) * 0.012 * this.sunProgress;

    //   pos[i] =
    //     solar * (1 - this.sunProgress) +
    //     (this.sunPositions[i] +
    //       (i % 3 === 0 ? movementX : i % 3 === 1 ? movementY : movementZ)) *
    //       this.sunProgress;
    // }

    // this.points.geometry.attributes.position.needsUpdate = true;

    const pos = this.points.geometry.attributes.position.array;

    const pointColors = this.points.geometry.attributes.color.array;

    // ---------- BLACK HOLE SHAPE ----------

    const blackCoreProgress = THREE.MathUtils.smoothstep(
      this.blackHoleProgress,
      0.12,
      0.72,
    );

    const diskProgress = THREE.MathUtils.smoothstep(
      this.blackHoleProgress,
      0.2,
      0.82,
    );

    // Плавно появляется центральная чёрная область.
    // this.blackHoleCore.material.opacity = blackCoreProgress;
    this.blackHoleCore.material.uniforms.uOpacity.value = blackCoreProgress;

    this.blackHoleCore.material.depthWrite = blackCoreProgress > 0.05;

    // const coreScale = 0.3 * blackCoreProgress;
    const coreScale = 0.45 * blackCoreProgress;

    this.blackHoleCore.scale.setScalar(coreScale);

    const blackHoleTime = performance.now() * 0.00055;

    const TWO_PI = Math.PI * 2;

    const sunTime = performance.now() * 0.001;

    for (let i = 0; i < pos.length; i += 3) {
      const pointIndex = i / 3;

      // --------------------------------
      // SPHERE → GALAXY
      // --------------------------------

      const galaxyX =
        this.spherePositions[i] * (1 - this.morphProgress) +
        this.networkPositions[i] * this.morphProgress;

      const galaxyY =
        this.spherePositions[i + 1] * (1 - this.morphProgress) +
        this.networkPositions[i + 1] * this.morphProgress;

      const galaxyZ =
        this.spherePositions[i + 2] * (1 - this.morphProgress) +
        this.networkPositions[i + 2] * this.morphProgress;

      // --------------------------------
      // GALAXY → SOLAR SYSTEM
      // --------------------------------

      const solarX =
        galaxyX * (1 - this.solarProgress) +
        this.solarPositions[i] * this.solarProgress;

      const solarY =
        galaxyY * (1 - this.solarProgress) +
        this.solarPositions[i + 1] * this.solarProgress;

      const solarZ =
        galaxyZ * (1 - this.solarProgress) +
        this.solarPositions[i + 2] * this.solarProgress;

      // --------------------------------
      // SOLAR SYSTEM → SUN
      // --------------------------------

      const phase = this.sunPhases[pointIndex];

      const movementX = Math.sin(sunTime + phase) * 0.018 * this.sunProgress;

      const movementY =
        Math.cos(sunTime * 0.9 + phase * 1.7) * 0.018 * this.sunProgress;

      const movementZ =
        Math.sin(sunTime * 0.75 + phase * 2.3) * 0.018 * this.sunProgress;

      const normalX =
        solarX * (1 - this.sunProgress) +
        (this.sunPositions[i] + movementX) * this.sunProgress;

      const normalY =
        solarY * (1 - this.sunProgress) +
        (this.sunPositions[i + 1] + movementY) * this.sunProgress;

      const normalZ =
        solarZ * (1 - this.sunProgress) +
        (this.sunPositions[i + 2] + movementZ) * this.sunProgress;

      // --------------------------------
      // BLACK HOLE — ACCRETION DISK
      // --------------------------------

      const baseRadius = this.blackHoleRadii[pointIndex];

      const baseAngle = this.blackHoleAngles[pointIndex];

      const speed = this.blackHoleSpeeds[pointIndex];

      const blackHolePhase = this.blackHolePhases[pointIndex];

      // Постоянное движение по орбите.
      // Частицы не исчезают и не телепортируются.

      const angle = baseAngle + blackHoleTime * speed;

      // Небольшая толщина диска.
      const thickness =
        Math.sin(blackHolePhase + blackHoleTime * speed * 0.8) * 0.045;

      // Небольшая радиальная деформация,
      // чтобы диск не выглядел математически идеальным.
      const radialNoise =
        Math.sin(blackHolePhase + blackHoleTime * speed * 0.35) * 0.025;

      const radius = baseRadius + radialNoise;

      const blackX = Math.cos(angle) * radius;

      const blackY = thickness;

      const blackZ = Math.sin(angle) * radius;

      // --------------------------------
      // BLEND
      // --------------------------------

      pos[i] = normalX * (1 - diskProgress) + blackX * diskProgress;

      pos[i + 1] = normalY * (1 - diskProgress) + blackY * diskProgress;

      pos[i + 2] = normalZ * (1 - diskProgress) + blackZ * diskProgress;
    }

    // ВАЖНО:
    // обновляем GPU один раз за кадр,
    // а не 2200 раз.
    this.points.geometry.attributes.position.needsUpdate = true;

    // ---------- BLACK HOLE PARTICLE COLORS ----------

    // Все частицы аккреционного диска остаются светлыми.

    for (let i = 0; i < pointColors.length; i += 3) {
      pointColors[i] = 1;
      pointColors[i + 1] = 1;
      pointColors[i + 2] = 1;
    }

    this.points.geometry.attributes.color.needsUpdate = true;

    // ---------- SUN CORE ANIMATION ----------

    const corePos = this.innerPoints.geometry.attributes.position.array;

    const coreTime = performance.now() * 0.00045;

    for (let i = 0; i < corePos.length; i++) {
      const pointIndex = Math.floor(i / 3);
      const phase = this.sunCorePhases[pointIndex];

      const coreMovementX =
        Math.sin(coreTime + phase) * 0.025 * this.sunProgress;

      const coreMovementY =
        Math.cos(coreTime * 1.1 + phase * 1.4) * 0.025 * this.sunProgress;

      const coreMovementZ =
        Math.sin(coreTime * 0.8 + phase * 2.1) * 0.025 * this.sunProgress;

      const targetX = this.sunCorePositions[i];

      const targetY = this.sunCorePositions[i + 1];

      const targetZ = this.sunCorePositions[i + 2];

      const movement =
        i % 3 === 0
          ? coreMovementX
          : i % 3 === 1
            ? coreMovementY
            : coreMovementZ;

      const coreCollapse =
        1 -
        THREE.MathUtils.smoothstep(this.blackHoleProgress, 0.0, 0.85) * 0.45;

      corePos[i] =
        (this.innerPositions[i] * (1 - this.sunProgress) +
          (this.sunCorePositions[i] + movement) * this.sunProgress) *
        coreCollapse;
      // corePos[i] =
      //   this.innerPositions[i] * (1 - this.sunProgress) +
      //   (this.sunCorePositions[i] + movement) * this.sunProgress;
    }

    this.innerPoints.geometry.attributes.position.needsUpdate = true;

    if (this.morphProgress > 0.7) {
      const pulse = 1 + Math.sin(performance.now() * 0.0012) * 0.025;

      this.group.scale.setScalar(this.scale * pulse);
    }

    this.material.opacity = this.opacity;
    // ядро исчезает при превращении в галактику
    // this.innerMaterial.opacity =
    // this.opacity * 0.55 * (1 - this.morphProgress);
    // this.material.opacity = this.opacity * (1 + this.hover * 0.25);
    // const sphereColor = new THREE.Color(0xffffff);
    // const solarColor = new THREE.Color(0xffe37a);

    // const currentColor = sphereColor.clone().lerp(solarColor, this.sunProgress);

    // this.material.color.copy(currentColor);
    // this.material.color.set(0xffffff);
    const sphereColor = new THREE.Color(0xffffff);

    const solarColor = new THREE.Color(0xffe37a);

    const redColor = new THREE.Color(0xff2414);

    const whiteColor = new THREE.Color(0xffffff);

    let currentColor;

    if (this.blackHoleProgress <= 0.001) {
      // Обычные состояния:
      // Sphere / Galaxy / Solar System / Sun
      currentColor = sphereColor.clone().lerp(solarColor, this.sunProgress);
    } else if (this.blackHoleProgress < 0.55) {
      // Sun → red
      const redProgress = THREE.MathUtils.smoothstep(
        this.blackHoleProgress,
        0.0,
        0.55,
      );

      currentColor = solarColor.clone().lerp(redColor, redProgress);
    } else {
      // red → white flash
      const whiteProgress = THREE.MathUtils.smoothstep(
        this.blackHoleProgress,
        0.55,
        0.82,
      );

      currentColor = redColor.clone().lerp(whiteColor, whiteProgress);
    }

    this.material.color.copy(currentColor);

    this.material.opacity = this.opacity;
    this.innerMaterial.opacity =
      this.opacity *
      (1 - this.morphProgress + this.solarProgress * 0.8) *
      (1 - blackCoreProgress);

    // const innerColor = new THREE.Color(0x2a4f8f).lerp(
    //   new THREE.Color(0xffd45a),
    //   this.solarProgress,
    // );
    const innerColor = new THREE.Color(0x66b4f6).lerp(
      new THREE.Color(0xffd45a),
      this.solarProgress,
    );

    this.innerMaterial.color
      .copy(innerColor)
      .lerp(new THREE.Color(0x000000), this.blackHoleProgress);

    // const pulse = 1 + Math.sin(performance.now() * 0.0003) * 0.015;

    // const hoverScale = 1 + this.hover * 0.18;

    // this.group.scale.setScalar(this.scale * pulse * hoverScale);

    // // const galaxySpeed =
    // //   (0.0008 + this.morphProgress * 0.0014) * (1 + this.hover * 0.6);

    // // this.points.rotation.y += galaxySpeed;
    // // const galaxySpeed =
    // //   (0.0008 + this.morphProgress * 0.0014) * (1 + this.hover * 0.6);
    // const galaxySpeed =
    //   (0.0008 + this.morphProgress * 0.0014) * (1 + this.hover * 0.6);

    // const sunRotationBoost = 1 + this.sunProgress * 2.5;

    // this.points.rotation.y += galaxySpeed * sunRotationBoost;

    // this.points.rotation.y += galaxySpeed * sunRotationBoost;

    // this.points.rotation.x += 0.00025;
    // this.points.rotation.z += 0.00012;

    // // this.innerPoints.rotation.y -= 0.0013;
    // // this.innerPoints.rotation.x += 0.0005;
    // const coreRotationBoost = 1 + this.sunProgress * 2.5;

    // this.innerPoints.rotation.y -= 0.0013 * coreRotationBoost;
    // this.innerPoints.rotation.x += 0.0005 * coreRotationBoost;
    const pulse = 1 + Math.sin(performance.now() * 0.0003) * 0.015;

    const hoverScale = 1 + this.hover * 0.18;

    this.group.scale.setScalar(this.scale * pulse * hoverScale);

    const galaxySpeed =
      (0.0008 + this.morphProgress * 0.0014) * (1 + this.hover * 0.6);

    const normalRotation =
      1 - THREE.MathUtils.smoothstep(this.blackHoleProgress, 0.0, 0.18);

    this.points.rotation.y += galaxySpeed * normalRotation;

    this.points.rotation.x += 0.00025;
    this.points.rotation.z += 0.00012;

    const coreRotationBoost =
      1 - THREE.MathUtils.smoothstep(this.blackHoleProgress, 0.0, 0.18);

    const solarCoreRotation = 1 + this.sunProgress * 2.5;

    this.innerPoints.rotation.y -=
      0.0013 * solarCoreRotation * coreRotationBoost;

    this.innerPoints.rotation.x +=
      0.0005 * solarCoreRotation * coreRotationBoost;
  }
}
