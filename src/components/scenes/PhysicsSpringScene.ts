import * as THREE from 'three';
import { createContactShadow, createHelicalSpringGeometry, createRulerTexture, createTextSprite } from '../../utils/threeHelpers';

export interface SpringSceneController {
  group: THREE.Group;
  setMode: (mode: 'spring' | 'lever') => void;
  // Spring mode
  setMass: (grams: number) => void;
  setSpringConstant: (k: number) => void;
  setGravity: (g: number) => void;
  triggerPerturbation: () => void;
  getCurrentExtensionCm: () => number;
  // Lever mode
  setLeverLeft: (massG: number, distCm: number) => void;
  setLeverRight: (massG: number, distCm: number) => void;
  update: (delta: number) => void;
  dispose: () => void;
}

export function createPhysicsSpringScene(): SpringSceneController {
  const group = new THREE.Group();
  group.add(createContactShadow(4.2, 0.45));

  let currentMode: 'spring' | 'lever' = 'spring';

  // 1. SPRING RIG
  const springGroup = new THREE.Group();
  group.add(springGroup);

  let massKg = 0.2;
  let springK = 25;
  let gravity = 9.8;
  const naturalLength = 1.8;
  let currentY = -naturalLength;
  let velocityY = 0;
  const damping = 4.0;

  const metalMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.25 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.15 });

  // Stand base & rod
  const baseGeo = new THREE.BoxGeometry(2.4, 0.15, 1.6);
  const baseMesh = new THREE.Mesh(baseGeo, metalMat);
  baseMesh.position.set(-0.6, 0.075, 0);
  springGroup.add(baseMesh);

  const rodGeo = new THREE.CylinderGeometry(0.06, 0.06, 4.2, 16);
  const rodMesh = new THREE.Mesh(rodGeo, chromeMat);
  rodMesh.position.set(-1.4, 2.1, 0);
  springGroup.add(rodMesh);

  const clampGeo = new THREE.BoxGeometry(0.2, 0.15, 0.2);
  const clampMesh = new THREE.Mesh(clampGeo, metalMat);
  clampMesh.position.set(-1.4, 4.0, 0);
  springGroup.add(clampMesh);

  const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.6, 16);
  const armMesh = new THREE.Mesh(armGeo, chromeMat);
  armMesh.rotation.z = Math.PI / 2;
  armMesh.position.set(-0.6, 4.0, 0);
  springGroup.add(armMesh);

  const ringGeo = new THREE.TorusGeometry(0.09, 0.02, 12, 24);
  const ringMesh = new THREE.Mesh(ringGeo, chromeMat);
  ringMesh.position.set(0, 3.9, 0);
  springGroup.add(ringMesh);

  // Ruler
  const rulerGeo = new THREE.BoxGeometry(0.35, 3.6, 0.04);
  const rulerTex = createRulerTexture(30);
  const rulerMat = new THREE.MeshStandardMaterial({ map: rulerTex, roughness: 0.3 });
  const rulerMesh = new THREE.Mesh(rulerGeo, rulerMat);
  rulerMesh.position.set(0.7, 2.1, 0);
  springGroup.add(rulerMesh);

  const rulerLabel = createTextSprite('Thước đo (cm / mm)', 'rgba(30, 41, 59, 0.9)', '#facc15', 20);
  rulerLabel.position.set(0.7, 4.1, 0);
  springGroup.add(rulerLabel);

  // Dynamic spring
  const springMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.85, roughness: 0.15 });
  const initialGeo = createHelicalSpringGeometry(0.25, 12, naturalLength, 0.035, 10, 220);
  const springMesh = new THREE.Mesh(initialGeo, springMat);
  springMesh.position.set(0, 3.85, 0);
  springGroup.add(springMesh);

  // Bob group
  const bobGroup = new THREE.Group();
  bobGroup.position.set(0, 3.85 - naturalLength, 0);

  const hookGeo = new THREE.TorusGeometry(0.08, 0.02, 12, 24, Math.PI * 1.5);
  const hookMesh = new THREE.Mesh(hookGeo, chromeMat);
  hookMesh.rotation.z = Math.PI / 2;
  hookMesh.position.set(0, 0.08, 0);
  bobGroup.add(hookMesh);

  const pointerGeo = new THREE.ConeGeometry(0.04, 0.45, 16);
  const pointerMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.2, roughness: 0.3 });
  const pointerMesh = new THREE.Mesh(pointerGeo, pointerMat);
  pointerMesh.rotation.z = -Math.PI / 2;
  pointerMesh.position.set(0.28, 0, 0);
  bobGroup.add(pointerMesh);

  const weightMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.7, roughness: 0.3 });
  const weightGroup = new THREE.Group();
  bobGroup.add(weightGroup);

  const rebuildWeightVisuals = (kg: number) => {
    while (weightGroup.children.length > 0) {
      const obj = weightGroup.children[0];
      if (obj instanceof THREE.Mesh) obj.geometry.dispose();
      weightGroup.remove(obj);
    }
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

  const forceDownArrow = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, -0.6, 0), 0.8, 0xf43f5e, 0.2, 0.1);
  bobGroup.add(forceDownArrow);
  const forceUpArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0.2, 0), 0.8, 0x22c55e, 0.2, 0.1);
  bobGroup.add(forceUpArrow);

  const forceLabel = createTextSprite('Lực đàn hồi Fđh = P', 'rgba(15, 23, 42, 0.85)', '#38bdf8', 20);
  forceLabel.position.set(-0.8, -0.4, 0);
  bobGroup.add(forceLabel);
  springGroup.add(bobGroup);

  // 2. LEVER RIG (Đòn bẩy học sinh lớp 6)
  const leverGroup = new THREE.Group();
  leverGroup.visible = false;
  group.add(leverGroup);

  let leftMassG = 200;
  let leftDistCm = 15;
  let rightMassG = 100;
  let rightDistCm = 30;
  let leverAngle = 0;
  let leverAngleVel = 0;

  // Fulcrum (Điểm tựa tam giác O)
  const fulcrumMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.3 });
  const fulcrumGeo = new THREE.ConeGeometry(0.5, 1.2, 4);
  const fulcrum = new THREE.Mesh(fulcrumGeo, fulcrumMat);
  fulcrum.rotation.y = Math.PI / 4;
  fulcrum.position.set(0, 0.6, 0);
  leverGroup.add(fulcrum);

  const fulcrumLabel = createTextSprite('Điểm tựa (O)', 'rgba(217, 119, 6, 0.9)', '#ffffff', 20);
  fulcrumLabel.position.set(0, 1.4, 0);
  leverGroup.add(fulcrumLabel);

  // Balanced beam rotating around Z at y = 1.25
  const beamPivot = new THREE.Group();
  beamPivot.position.set(0, 1.25, 0);
  leverGroup.add(beamPivot);

  const beamGeo = new THREE.BoxGeometry(4.2, 0.12, 0.3);
  const beamMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.85, roughness: 0.2 });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beamPivot.add(beam);

  // Beam calibration ticks and hang holes
  for (let cm = -20; cm <= 20; cm += 5) {
    if (cm === 0) continue;
    const x = (cm / 20) * 1.9;
    const tickGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.08, 8);
    const tick = new THREE.Mesh(tickGeo, metalMat);
    tick.position.set(x, 0, 0.16);
    beamPivot.add(tick);
  }

  // Left & Right hanging hooks & weights on beam
  const leftBob = new THREE.Group();
  beamPivot.add(leftBob);
  const rightBob = new THREE.Group();
  beamPivot.add(rightBob);

  const updateLeverVisuals = () => {
    // Left position x
    const lx = -(leftDistCm / 20) * 1.9;
    leftBob.position.set(lx, -0.1, 0);
    while (leftBob.children.length > 0) {
      const c = leftBob.children[0];
      if (c instanceof THREE.Mesh) c.geometry.dispose();
      leftBob.remove(c);
    }
    const lWeightGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1 + (leftMassG / 500) * 0.2, 16);
    const lWeight = new THREE.Mesh(lWeightGeo, weightMat);
    lWeight.position.set(0, -0.2, 0);
    leftBob.add(lWeight);

    // Right position x
    const rx = (rightDistCm / 20) * 1.9;
    rightBob.position.set(rx, -0.1, 0);
    while (rightBob.children.length > 0) {
      const c = rightBob.children[0];
      if (c instanceof THREE.Mesh) c.geometry.dispose();
      rightBob.remove(c);
    }
    const rWeightGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1 + (rightMassG / 500) * 0.2, 16);
    const rWeight = new THREE.Mesh(rWeightGeo, weightMat);
    rWeight.position.set(0, -0.2, 0);
    rightBob.add(rWeight);
  };
  updateLeverVisuals();

  return {
    group,
    setMode: (mode: 'spring' | 'lever') => {
      currentMode = mode;
      springGroup.visible = currentMode === 'spring';
      leverGroup.visible = currentMode === 'lever';
    },
    setMass: (grams: number) => {
      massKg = Math.max(0.02, grams / 1000);
      rebuildWeightVisuals(massKg);
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
      velocityY = -0.5;
    },
    getCurrentExtensionCm: () => {
      const currentLength = -currentY;
      const ext = Math.max(0, currentLength - naturalLength);
      return Math.round(ext * 10 * 10) / 10;
    },
    setLeverLeft: (mG: number, dCm: number) => {
      leftMassG = mG;
      leftDistCm = dCm;
      updateLeverVisuals();
    },
    setLeverRight: (mG: number, dCm: number) => {
      rightMassG = mG;
      rightDistCm = dCm;
      updateLeverVisuals();
    },
    update: (delta: number) => {
      if (currentMode === 'spring') {
        const dt = Math.min(delta, 0.05);
        const springLength = -currentY;
        const extension = springLength - naturalLength;
        const forceGravity = -massKg * gravity;
        const forceSpring = springK * extension;
        const totalForce = forceGravity + forceSpring;
        const accel = massKg > 0 ? totalForce / massKg - damping * velocityY : 0;

        velocityY += accel * dt;
        currentY += velocityY * dt;

        if (currentY > -0.4) {
          currentY = -0.4;
          velocityY = 0;
        }

        const activeLength = -currentY;
        springMesh.scale.set(1, Math.max(0.1, activeLength / naturalLength), 1);
        bobGroup.position.y = 3.85 + currentY;

        const P = massKg * gravity;
        const arrowLength = Math.min(1.4, Math.max(0.2, (P / 10) * 0.8));
        forceDownArrow.setLength(arrowLength, 0.15, 0.08);
        forceUpArrow.setLength(arrowLength, 0.15, 0.08);
      } else {
        // Lever dynamics: Torque tau = Left torque - Right torque
        // Left arm produces counterclockwise (+Z), Right produces clockwise (-Z)
        const leftTorque = (leftMassG / 1000) * 9.8 * (leftDistCm / 100);
        const rightTorque = (rightMassG / 1000) * 9.8 * (rightDistCm / 100);
        const netTorque = leftTorque - rightTorque;

        // Target angle based on net torque
        const maxAngle = 0.35; // ~20 degrees
        let targetAngle = 0;
        if (Math.abs(netTorque) < 0.01) {
          targetAngle = 0; // Balanced!
        } else if (netTorque > 0) {
          targetAngle = maxAngle; // Left tilts down
        } else {
          targetAngle = -maxAngle; // Right tilts down
        }

        // Smooth physics spring towards targetAngle
        const angleDiff = targetAngle - leverAngle;
        leverAngleVel += angleDiff * 15 * delta;
        leverAngleVel *= Math.exp(-6 * delta); // damping
        leverAngle += leverAngleVel * delta;

        beamPivot.rotation.z = leverAngle;
      }
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
