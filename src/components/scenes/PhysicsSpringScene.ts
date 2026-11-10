import * as THREE from 'three';
import { createContactShadow, createHelicalSpringGeometry, createRulerTexture, createTextSprite } from '../../utils/threeHelpers';

export interface SpringSceneController {
  group: THREE.Group;
  setMass: (grams: number) => void;
  setSpringConstant: (k: number) => void;
  setGravity: (g: number) => void;
  triggerPerturbation: () => void;
  getCurrentExtensionCm: () => number;
  update: (delta: number) => void;
  dispose: () => void;
}

export function createPhysicsSpringScene(): SpringSceneController {
  const group = new THREE.Group();

  // Contact shadow
  group.add(createContactShadow(3.5, 0.45));

  // Physics state
  let massKg = 0.2; // 200g default
  let springK = 25; // 25 N/m
  let gravity = 9.8; // Earth m/s^2
  let naturalLength = 1.8; // 3D units (~18cm)
  let currentY = -naturalLength;
  let velocityY = 0;
  const damping = 4.0; // Air / internal resistance

  // 1. LAB STAND (Giá thí nghiệm vật lý)
  const standGroup = new THREE.Group();
  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    metalness: 0.8,
    roughness: 0.25,
  });
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.9,
    roughness: 0.15,
  });

  // Base
  const baseGeo = new THREE.BoxGeometry(2.4, 0.15, 1.6);
  const baseMesh = new THREE.Mesh(baseGeo, metalMat);
  baseMesh.position.set(-0.6, 0.075, 0);
  standGroup.add(baseMesh);

  // Vertical rod
  const rodGeo = new THREE.CylinderGeometry(0.06, 0.06, 4.2, 16);
  const rodMesh = new THREE.Mesh(rodGeo, chromeMat);
  rodMesh.position.set(-1.4, 2.1, 0);
  standGroup.add(rodMesh);

  // Top clamp & horizontal arm
  const clampGeo = new THREE.BoxGeometry(0.2, 0.15, 0.2);
  const clampMesh = new THREE.Mesh(clampGeo, metalMat);
  clampMesh.position.set(-1.4, 4.0, 0);
  standGroup.add(clampMesh);

  const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.6, 16);
  const armMesh = new THREE.Mesh(armGeo, chromeMat);
  armMesh.rotation.z = Math.PI / 2;
  armMesh.position.set(-0.6, 4.0, 0);
  standGroup.add(armMesh);

  // Top suspension ring
  const ringGeo = new THREE.TorusGeometry(0.09, 0.02, 12, 24);
  const ringMesh = new THREE.Mesh(ringGeo, chromeMat);
  ringMesh.position.set(0, 3.9, 0);
  standGroup.add(ringMesh);

  group.add(standGroup);

  // 2. RULER (Thước chia khoảng mm)
  const rulerGeo = new THREE.BoxGeometry(0.35, 3.6, 0.04);
  const rulerTex = createRulerTexture(30);
  const rulerMat = new THREE.MeshStandardMaterial({
    map: rulerTex,
    roughness: 0.3,
  });
  const rulerMesh = new THREE.Mesh(rulerGeo, rulerMat);
  rulerMesh.position.set(0.7, 2.1, 0);
  group.add(rulerMesh);

  // Stand and ruler label
  const rulerLabel = createTextSprite('Thước đo (cm / mm)', 'rgba(30, 41, 59, 0.9)', '#facc15', 22);
  rulerLabel.position.set(0.7, 4.1, 0);
  group.add(rulerLabel);

  // 3. DYNAMIC SPRING MESH
  const springMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    metalness: 0.85,
    roughness: 0.15,
  });
  let springMesh: THREE.Mesh | null = null;

  const updateSpringGeometry = (length: number) => {
    if (springMesh) {
      springMesh.geometry.dispose();
      springMesh.geometry = createHelicalSpringGeometry(0.25, 12, length, 0.035, 10, 220);
    }
  };

  const initialGeo = createHelicalSpringGeometry(0.25, 12, naturalLength, 0.035, 10, 220);
  springMesh = new THREE.Mesh(initialGeo, springMat);
  springMesh.position.set(0, 3.85, 0);
  group.add(springMesh);

  // 4. SUSPENDED WEIGHT & POINTER
  const bobGroup = new THREE.Group();
  bobGroup.position.set(0, 3.85 - naturalLength, 0);

  // Hook
  const hookGeo = new THREE.TorusGeometry(0.08, 0.02, 12, 24, Math.PI * 1.5);
  const hookMesh = new THREE.Mesh(hookGeo, chromeMat);
  hookMesh.rotation.z = Math.PI / 2;
  hookMesh.position.set(0, 0.08, 0);
  bobGroup.add(hookMesh);

  // Red pointer needle pointing at the ruler
  const pointerGeo = new THREE.ConeGeometry(0.04, 0.45, 16);
  const pointerMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    metalness: 0.2,
    roughness: 0.3,
  });
  const pointerMesh = new THREE.Mesh(pointerGeo, pointerMat);
  pointerMesh.rotation.z = -Math.PI / 2;
  pointerMesh.position.set(0.28, 0, 0);
  bobGroup.add(pointerMesh);

  // Hanging Weight Mesh (cylindrical brass/steel weights)
  const weightMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.7,
    roughness: 0.3,
  });
  const weightGroup = new THREE.Group();
  bobGroup.add(weightGroup);

  const rebuildWeightVisuals = (kg: number) => {
    // Clear old weight discs
    while (weightGroup.children.length > 0) {
      const obj = weightGroup.children[0];
      if (obj instanceof THREE.Mesh) obj.geometry.dispose();
      weightGroup.remove(obj);
    }

    // Represent as stacked discs of 100g each
    const discs = Math.max(1, Math.min(10, Math.round(kg * 10)));
    const radius = 0.35 + Math.min(0.15, kg * 0.05);
    const discH = 0.12;

    for (let i = 0; i < discs; i++) {
      const dGeo = new THREE.CylinderGeometry(radius, radius, discH, 24);
      const dMesh = new THREE.Mesh(dGeo, weightMat);
      dMesh.position.set(0, -0.15 - i * (discH + 0.02), 0);
      weightGroup.add(dMesh);
    }
  };
  rebuildWeightVisuals(massKg);

  // Force vector indicators: P (Down) & F_dh (Up)
  const arrowUpMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
  const arrowDownMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e });

  const forceDownArrow = new THREE.ArrowHelper(
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, -0.6, 0),
    0.8,
    0xf43f5e,
    0.2,
    0.1
  );
  bobGroup.add(forceDownArrow);

  const forceUpArrow = new THREE.ArrowHelper(
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0.2, 0),
    0.8,
    0x22c55e,
    0.2,
    0.1
  );
  bobGroup.add(forceUpArrow);

  // Dynamic label for weight & force
  const forceLabel = createTextSprite('P = 1.96 N', 'rgba(15, 23, 42, 0.85)', '#38bdf8', 22);
  forceLabel.position.set(-0.8, -0.5, 0);
  bobGroup.add(forceLabel);

  group.add(bobGroup);

  return {
    group,
    setMass: (grams: number) => {
      massKg = Math.max(0.02, grams / 1000);
      rebuildWeightVisuals(massKg);
      // Give gentle nudge
      velocityY += 0.08;
    },
    setSpringConstant: (k: number) => {
      springK = Math.max(5, k);
    },
    setGravity: (g: number) => {
      gravity = Math.max(0, g);
      velocityY += 0.05;
    },
    triggerPerturbation: () => {
      // Pull down slightly and release
      velocityY = -0.5;
    },
    getCurrentExtensionCm: () => {
      const currentLength = -currentY;
      const ext = Math.max(0, currentLength - naturalLength);
      // 1 unit ≈ 10 cm in this scale
      return Math.round(ext * 10 * 10) / 10;
    },
    update: (delta: number) => {
      const dt = Math.min(delta, 0.05);

      // Current spring length = -currentY
      const springLength = -currentY;
      const extension = springLength - naturalLength;

      // Forces: Gravity (Down = negative Y), Spring restorative (Up = positive Y when extended)
      const forceGravity = -massKg * gravity;
      // Spring Force F_dh = -k * extension
      // In 3D: if currentY is more negative than -naturalLength, extension > 0, spring pulls UP (+Y)
      const forceSpring = springK * extension;
      const totalForce = forceGravity + forceSpring;

      // Acceleration = F / m - damping * v
      const accel = massKg > 0 ? totalForce / massKg - damping * velocityY : 0;

      velocityY += accel * dt;
      currentY += velocityY * dt;

      // Prevent spring from inverting or collapsing into ceiling
      if (currentY > -0.4) {
        currentY = -0.4;
        velocityY = 0;
      }

      // Update Spring 3D Geometry
      const activeLength = -currentY;
      updateSpringGeometry(activeLength);

      // Update Bob position
      bobGroup.position.y = 3.85 + currentY;

      // Update force arrows length & labels
      const P = massKg * gravity;
      const arrowLength = Math.min(1.4, Math.max(0.2, (P / 10) * 0.8));
      forceDownArrow.setLength(arrowLength, 0.15, 0.08);
      forceUpArrow.setLength(arrowLength, 0.15, 0.08);

      const P_rounded = Math.round(P * 100) / 100;
      const m_g = Math.round(massKg * 1000);
      forceLabel.position.set(-0.8, -0.4, 0);
    },
    dispose: () => {
      group.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
    },
  };
}
