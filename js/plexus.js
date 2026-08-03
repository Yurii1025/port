import * as THREE from "../build/three.module.js";
import { lineVertexShader } from "./shaders/lineVertex.glsl.js";
import { lineFragmentShader } from "./shaders/lineFragment.glsl.js";
import { triangleVertexShader } from "./shaders/triangleVertex.glsl.js";
import { triangleFragmentShader } from "./shaders/triangleFragment.glsl.js";

class ConnectionGraph {
  constructor() {
    this.connections = [];
  }

  add(i, j) {
    this.connections.push(i, j);
  }
}

export default class Plexus {
  constructor(scene) {
    this.scene = scene;

    this.count = 500;

    this.world = {
      width: 18,

      height: 12,

      depth: 10,
    };

    this.positions = new Float32Array(this.count * 3);
    this.velocities = new Float32Array(this.count * 3);
    this.cellSize = 1.0;
    this.grid = new Map();

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;

        this.positions[i3] =
            this.randomDistribution() * this.world.width * 0.5;

        this.positions[i3 + 1] =
            this.randomDistribution() * this.world.height * 0.5;

        this.positions[i3 + 2] =
            this.randomDistribution() * this.world.depth * 0.5;

      this.velocities[i3] = (Math.random() - 0.5) * 0.004;
      this.velocities[i3 + 1] = (Math.random() - 0.5) * 0.004;
      this.velocities[i3 + 2] = (Math.random() - 0.5) * 0.004;
    }

    this.geometry = new THREE.BufferGeometry();

    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.positions, 3),
    );

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.045,

      transparent: true,
      opacity: 0.9,

      depthWrite: false,
    });

    this.points = new THREE.Points(this.geometry, material);

    scene.add(this.points);

    this.lineGeometry = new THREE.BufferGeometry();

    // Максимум: count * maxConnections линий.
    // Каждая линия = 2 вершины = 6 float.

    this.maxConnections = 4;

    const maxLines = this.count * this.maxConnections;

    this.linePositions = new Float32Array(maxLines * 6);

    this.lineStrength = new Float32Array(maxLines * 2);

    this.lineGeometry.setAttribute(
      "strength",

      new THREE.BufferAttribute(this.lineStrength, 1),
    );

    this.lineGeometry.setAttribute(
      "position",

      new THREE.BufferAttribute(this.linePositions, 3),
    );

    this.maxTriangles = this.count * 10;

    this.trianglePositions = new Float32Array(this.maxTriangles * 9);

    this.triangleStrength = new Float32Array(this.maxTriangles * 3);

    this.triangleGeometry = new THREE.BufferGeometry();

    this.triangleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.trianglePositions, 3),
    );

    this.triangleGeometry.setAttribute(
      "strength",
      new THREE.BufferAttribute(this.triangleStrength, 1),
    );

    this.triangleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: {
          value: new THREE.Color(0xffffff),
        },

        time: {
          value: 0,
        },
      },

      vertexShader: triangleVertexShader,
      fragmentShader: triangleFragmentShader,

      transparent: true,

      depthWrite: false,

      side: THREE.DoubleSide,
    });

    this.triangleMesh = new THREE.Mesh(
      this.triangleGeometry,
      this.triangleMaterial,
    );

    this.scene.add(this.triangleMesh);

    const lineMaterial = new THREE.ShaderMaterial({
      transparent: true,

      depthWrite: false,

      uniforms: {
        color: {
          value: new THREE.Color(0xffffff),
        },
      },

      vertexShader: lineVertexShader,

      fragmentShader: lineFragmentShader,
    });

    this.lines = new THREE.LineSegments(
      this.lineGeometry,

      lineMaterial,
    );

    scene.add(this.lines);
  }

  randomDistribution() {
    const r = Math.random() * 2.0 - 1.0;

    return r * r * r;
  }

  update() {
    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;

      this.positions[i3] += this.velocities[i3];
      this.positions[i3 + 1] += this.velocities[i3 + 1];
      this.positions[i3 + 2] += this.velocities[i3 + 2];

      const halfWidth = this.world.width * 0.5;
      const halfHeight = this.world.height * 0.5;
      const halfDepth = this.world.depth * 0.5;

      if (this.positions[i3] > halfWidth || this.positions[i3] < -halfWidth) {
        this.velocities[i3] *= -1;
      }

      if (
        this.positions[i3 + 1] > halfHeight ||
        this.positions[i3 + 1] < -halfHeight
      ) {
        this.velocities[i3 + 1] *= -1;
      }

      if (
        this.positions[i3 + 2] > halfDepth ||
        this.positions[i3 + 2] < -halfDepth
      ) {
        this.velocities[i3 + 2] *= -1;
      }
    }

    this.geometry.attributes.position.needsUpdate = true;

    this.buildSpatialGrid();

    const connections = this.findConnections();

    const adjacency = this.buildAdjacency(connections.connections);

    const triangles = this.findTriangles(adjacency);

    this.updateLines(connections);

    this.updateTriangles(triangles);
    this.triangleMaterial.uniforms.time.value = performance.now() * 0.001;
  }
  buildSpatialGrid() {
    this.grid.clear();

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;

      const cellX = Math.floor(this.positions[i3] / this.cellSize);
      const cellY = Math.floor(this.positions[i3 + 1] / this.cellSize);
      const cellZ = Math.floor(this.positions[i3 + 2] / this.cellSize);

      const key = `${cellX},${cellY},${cellZ}`;

      if (!this.grid.has(key)) {
        this.grid.set(key, []);
      }

      this.grid.get(key).push(i);
    }
  }

  findConnections() {
    const graph = new ConnectionGraph();
    const connectionCount = new Uint8Array(this.count);

    const maxDistance = 0.9;
    const maxDistanceSq = maxDistance * maxDistance;
    const maxConnections = 4;

    for (const [key, particles] of this.grid) {
      const [cellX, cellY, cellZ] = key.split(",").map(Number);

      for (let ox = -1; ox <= 1; ox++) {
        for (let oy = -1; oy <= 1; oy++) {
          for (let oz = -1; oz <= 1; oz++) {
            const neighborKey = `${cellX + ox},${cellY + oy},${cellZ + oz}`;

            const neighbors = this.grid.get(neighborKey);

            if (!neighbors) continue;

            for (const i of particles) {
              if (connectionCount[i] >= maxConnections) continue;

              const i3 = i * 3;

              const x1 = this.positions[i3];
              const y1 = this.positions[i3 + 1];
              const z1 = this.positions[i3 + 2];

              for (const j of neighbors) {
                if (j <= i) continue;

                if (connectionCount[j] >= maxConnections) continue;

                const j3 = j * 3;

                const dx = x1 - this.positions[j3];
                const dy = y1 - this.positions[j3 + 1];
                const dz = z1 - this.positions[j3 + 2];

                const distanceSq = dx * dx + dy * dy + dz * dz;

                if (distanceSq > maxDistanceSq) continue;

                graph.add(i, j);

                connectionCount[i]++;
                connectionCount[j]++;

                if (connectionCount[i] >= maxConnections) break;
              }
            }
          }
        }
      }
    }

    return graph;
  }

  buildAdjacency(connections) {
    const adjacency = new Map();

    for (let k = 0; k < connections.length; k += 2) {
      const a = connections[k];
      const b = connections[k + 1];

      if (!adjacency.has(a)) {
        adjacency.set(a, new Set());
      }

      if (!adjacency.has(b)) {
        adjacency.set(b, new Set());
      }

      adjacency.get(a).add(b);
      adjacency.get(b).add(a);
    }

    return adjacency;
  }

  findTriangles(adjacency) {
    const triangles = [];

    for (const [a, neighbors] of adjacency) {
      const list = [...neighbors];

      for (let i = 0; i < list.length - 1; i++) {
        const b = list[i];

        if (b <= a) continue;

        const neighborsB = adjacency.get(b);

        for (let j = i + 1; j < list.length; j++) {
          const c = list[j];

          if (c <= b) continue;

          if (neighborsB.has(c)) {
            triangles.push(a, b, c);
          }
        }
      }
    }

    return triangles;
  }

  updateLines(graph) {
    let positionOffset = 0;
    let strengthOffset = 0;

    const maxDistance = 0.9;
    const maxDistanceSq = maxDistance * maxDistance;

    for (let k = 0; k < graph.connections.length; k += 2) {
      const i = graph.connections[k];
      const j = graph.connections[k + 1];

      const i3 = i * 3;
      const j3 = j * 3;

      const dx = this.positions[i3] - this.positions[j3];
      const dy = this.positions[i3 + 1] - this.positions[j3 + 1];
      const dz = this.positions[i3 + 2] - this.positions[j3 + 2];

      const distanceSq = dx * dx + dy * dy + dz * dz;

      const strength = 1.0 - distanceSq / maxDistanceSq;

      this.linePositions[positionOffset++] = this.positions[i3];
      this.linePositions[positionOffset++] = this.positions[i3 + 1];
      this.linePositions[positionOffset++] = this.positions[i3 + 2];

      this.linePositions[positionOffset++] = this.positions[j3];
      this.linePositions[positionOffset++] = this.positions[j3 + 1];
      this.linePositions[positionOffset++] = this.positions[j3 + 2];

      this.lineStrength[strengthOffset++] = strength;
      this.lineStrength[strengthOffset++] = strength;
    }

    this.lineGeometry.setDrawRange(0, positionOffset / 3);

    this.lineGeometry.attributes.position.needsUpdate = true;
    this.lineGeometry.attributes.strength.needsUpdate = true;
  }

  updateTriangles(triangles) {
    const positions = this.positions;

    let vertex = 0;

    for (let i = 0; i < triangles.length; i += 3) {
      if (vertex >= this.maxTriangles) {
        break;
      }

      const a = triangles[i] * 3;
      const b = triangles[i + 1] * 3;
      const c = triangles[i + 2] * 3;

      // ---------- Проверяем размеры треугольника ----------

      const abx = positions[a] - positions[b];
      const aby = positions[a + 1] - positions[b + 1];
      const abz = positions[a + 2] - positions[b + 2];

      const bcx = positions[b] - positions[c];
      const bcy = positions[b + 1] - positions[c + 1];
      const bcz = positions[b + 2] - positions[c + 2];

      const cax = positions[c] - positions[a];
      const cay = positions[c + 1] - positions[a + 1];
      const caz = positions[c + 2] - positions[a + 2];

      const ab = Math.sqrt(abx * abx + aby * aby + abz * abz);
      const bc = Math.sqrt(bcx * bcx + bcy * bcy + bcz * bcz);
      const ca = Math.sqrt(cax * cax + cay * cay + caz * caz);

      // Максимальная допустимая длина ребра
      const maxEdge = 0.75;

      if (ab > maxEdge || bc > maxEdge || ca > maxEdge) {
        continue;
      }

      // -----------------------------------------------

      const offset = vertex * 9;

      // вершина A
      this.trianglePositions[offset + 0] = positions[a + 0];
      this.trianglePositions[offset + 1] = positions[a + 1];
      this.trianglePositions[offset + 2] = positions[a + 2];

      // вершина B
      this.trianglePositions[offset + 3] = positions[b + 0];
      this.trianglePositions[offset + 4] = positions[b + 1];
      this.trianglePositions[offset + 5] = positions[b + 2];

      // вершина C
      this.trianglePositions[offset + 6] = positions[c + 0];
      this.trianglePositions[offset + 7] = positions[c + 1];
      this.trianglePositions[offset + 8] = positions[c + 2];

      // Пока одинаковая интенсивность для всех вершин
      const averageEdge = (ab + bc + ca) / 3;

      const strength = Math.max(0.0, 1.0 - averageEdge / maxEdge);

      this.triangleStrength[vertex * 3 + 0] = strength;
      this.triangleStrength[vertex * 3 + 1] = strength;
      this.triangleStrength[vertex * 3 + 2] = strength;

      vertex++;
    }

    this.triangleGeometry.attributes.position.needsUpdate = true;
    this.triangleGeometry.attributes.strength.needsUpdate = true;

    this.triangleGeometry.setDrawRange(0, vertex * 3);
  }
}
