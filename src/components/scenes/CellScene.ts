import * as THREE from 'three';
import { createContactShadow, createTextSprite } from '../../utils/threeHelpers';

export interface CellSceneController {
  group: THREE.Group;
  setExploded: (factor: number) => void;
  setCellType: (type: 'plant' | 'animal') => void;
  setSelectedOrganelle: (id: string | null) => void;
  getInteractiveObjects: () => THREE.Object3D[];
  update: (delta: number) => void;
  dispose: () => void;
}

export function createCellScene(
  onSelectOrganelle: (id: string) => void
): CellSceneController {
  const group = new THREE.Group();
  let explodedFactor = 0;
  let cellType: 'plant' | 'animal' = 'plant';
  let selectedId: string | null = null;

  // Contact shadow
  const shadow = createContactShadow(3.5, 0.4);
  group.add(shadow);

  // Subgroup for organelles to animate
  const plantGroup = new THREE.Group();
  const animalGroup = new THREE.Group();
  group.add(plantGroup);
  group.add(animalGroup);

  // Storage for parts to animate exploded view
  interface OrganellePart {
    mesh: THREE.Object3D;
    basePos: THREE.Vector3;
    explodeDir: THREE.Vector3;
    id: string;
    originalMat?: THREE.Material | THREE.Material[];
  }
  const parts: OrganellePart[] = [];
  const interactiveObjects: THREE.Object3D[] = [];

  // Reusable materials
  const plantWallMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    roughness: 0.4,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85,
  });
  const membraneMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.3,
    metalness: 0.1,
    transparent: true,
    opacity: 0.65,
  });
  const cytoplasmMat = new THREE.MeshStandardMaterial({
    color: 0xc4b5fd,
    roughness: 0.5,
    metalness: 0.05,
    transparent: true,
    opacity: 0.35,
  });
  const nucleusMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    roughness: 0.3,
    metalness: 0.2,
  });
  const nucleolusMat = new THREE.MeshStandardMaterial({
    color: 0xbe123c,
    roughness: 0.2,
    metalness: 0.3,
  });
  const chloroplastMat = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    roughness: 0.3,
    metalness: 0.1,
  });
  const mitochondriaMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.35,
    metalness: 0.1,
  });
  const vacuoleMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    roughness: 0.1,
    metalness: 0.1,
    transparent: true,
    opacity: 0.6,
  });

  // Highlight material
  const highlightMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.2,
    metalness: 0.5,
    emissive: 0xca8a04,
    emissiveIntensity: 0.5,
  });

  // Helper to register parts
  const registerPart = (
    mesh: THREE.Object3D,
    dir: THREE.Vector3,
    id: string,
    parent: THREE.Group
  ) => {
    mesh.userData = { organelleId: id };
    parts.push({
      mesh,
      basePos: mesh.position.clone(),
      explodeDir: dir.clone().normalize(),
      id,
    });
    interactiveObjects.push(mesh);
    parent.add(mesh);
  };

  // 1. PLANT CELL BUILD
  // Hexagonal/rounded rectangular cutaway cell wall
  const plantWallGeo = new THREE.CylinderGeometry(2.4, 2.4, 1.4, 6, 1, false, 0, Math.PI * 1.5);
  const plantWall = new THREE.Mesh(plantWallGeo, plantWallMat);
  plantWall.position.set(0, 0.7, 0);
  registerPart(plantWall, new THREE.Vector3(0, 0, 1.5), 'cell_wall', plantGroup);

  // Plant Membrane
  const plantMemGeo = new THREE.CylinderGeometry(2.25, 2.25, 1.35, 6, 1, false, 0, Math.PI * 1.5);
  const plantMem = new THREE.Mesh(plantMemGeo, membraneMat);
  plantMem.position.set(0, 0.7, 0);
  registerPart(plantMem, new THREE.Vector3(0, 0, 1.2), 'membrane', plantGroup);

  // Cytoplasm base
  const plantCytoGeo = new THREE.CylinderGeometry(2.1, 2.1, 1.2, 6, 1, false, 0, Math.PI * 1.5);
  const plantCyto = new THREE.Mesh(plantCytoGeo, cytoplasmMat);
  plantCyto.position.set(0, 0.7, 0);
  registerPart(plantCyto, new THREE.Vector3(0, -0.5, 0), 'cytoplasm', plantGroup);

  // Big Central Vacuole (Unique to Plant)
  const vacuoleGeo = new THREE.SphereGeometry(1.0, 24, 24);
  vacuoleGeo.scale(1.2, 0.7, 0.9);
  const plantVacuole = new THREE.Mesh(vacuoleGeo, vacuoleMat);
  plantVacuole.position.set(-0.5, 0.7, -0.4);
  registerPart(plantVacuole, new THREE.Vector3(-1.2, 0.8, -1), 'vacuole', plantGroup);

  // Nucleus & Nucleolus
  const nucleusGroup = new THREE.Group();
  const nucGeo = new THREE.SphereGeometry(0.55, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.85);
  const nucMesh = new THREE.Mesh(nucGeo, nucleusMat);
  const nucleolusGeo = new THREE.SphereGeometry(0.22, 16, 16);
  const nucleolusMesh = new THREE.Mesh(nucleolusGeo, nucleolusMat);
  nucleolusMesh.position.set(0, 0.1, 0);
  nucleusGroup.add(nucMesh);
  nucleusGroup.add(nucleolusMesh);
  nucleusGroup.position.set(0.9, 0.8, -0.3);
  registerPart(nucleusGroup, new THREE.Vector3(1.5, 1.2, -0.5), 'nucleus', plantGroup);

  // Chloroplasts (Plant cell green powerhouses)
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 1.4 + 0.3;
    const chlGroup = new THREE.Group();
    const chlGeo = new THREE.SphereGeometry(0.28, 16, 16);
    chlGeo.scale(1.5, 0.6, 0.8);
    const chlMesh = new THREE.Mesh(chlGeo, chloroplastMat);
    chlGroup.add(chlMesh);
    const cx = Math.cos(angle) * 1.4;
    const cz = Math.sin(angle) * 1.1;
    chlGroup.position.set(cx, 0.6, cz);
    chlGroup.rotation.y = angle;
    registerPart(chlGroup, new THREE.Vector3(cx * 1.5, 0.6, cz * 1.5), 'chloroplast', plantGroup);
  }

  // Mitochondria (2 items)
  for (let i = 0; i < 2; i++) {
    const mitGroup = new THREE.Group();
    const mitGeo = new THREE.CapsuleGeometry(0.18, 0.35, 12, 16);
    const mitMesh = new THREE.Mesh(mitGeo, mitochondriaMat);
    mitMesh.rotation.z = Math.PI / 2;
    mitGroup.add(mitMesh);
    const mx = i === 0 ? 0.3 : -1.2;
    const mz = i === 0 ? 0.8 : 0.4;
    mitGroup.position.set(mx, 0.6, mz);
    registerPart(mitGroup, new THREE.Vector3(mx * 1.4, 0.8, mz * 1.4), 'mitochondria', plantGroup);
  }

  // Add 3D Label Sprites
  const nucLabel = createTextSprite('Nhân tế bào', 'rgba(225, 29, 72, 0.85)', '#ffffff', 26);
  nucLabel.position.set(0.9, 1.6, -0.3);
  plantGroup.add(nucLabel);

  const wallLabel = createTextSprite('Thành tế bào (Xenlulôzơ)', 'rgba(5, 150, 105, 0.85)', '#ffffff', 24);
  wallLabel.position.set(0, 1.8, 1.5);
  plantGroup.add(wallLabel);

  const chlLabel = createTextSprite('Lục lạp (Quang hợp)', 'rgba(22, 163, 74, 0.85)', '#ffffff', 24);
  chlLabel.position.set(1.4, 1.4, 0.9);
  plantGroup.add(chlLabel);

  // 2. ANIMAL CELL BUILD (Rounder, No cell wall, No chloroplasts, small vacuoles)
  const animMemGeo = new THREE.SphereGeometry(2.1, 32, 32, 0, Math.PI * 1.5, 0, Math.PI);
  const animMem = new THREE.Mesh(animMemGeo, membraneMat);
  animMem.position.set(0, 1.0, 0);
  registerPart(animMem, new THREE.Vector3(0, 0, 1.2), 'membrane', animalGroup);

  const animCytoGeo = new THREE.SphereGeometry(1.95, 32, 32, 0, Math.PI * 1.5, 0, Math.PI);
  const animCyto = new THREE.Mesh(animCytoGeo, cytoplasmMat);
  animCyto.position.set(0, 1.0, 0);
  registerPart(animCyto, new THREE.Vector3(0, -0.4, 0), 'cytoplasm', animalGroup);

  const animNucGroup = new THREE.Group();
  const aNucGeo = new THREE.SphereGeometry(0.65, 24, 24);
  const aNucMesh = new THREE.Mesh(aNucGeo, nucleusMat);
  const aNucleolusMesh = new THREE.Mesh(nucleolusGeo, nucleolusMat);
  animNucGroup.add(aNucMesh);
  animNucGroup.add(aNucleolusMesh);
  animNucGroup.position.set(0, 1.0, 0);
  registerPart(animNucGroup, new THREE.Vector3(0, 1.5, 0), 'nucleus', animalGroup);

  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 1.5;
    const mitGroup = new THREE.Group();
    const mitGeo = new THREE.CapsuleGeometry(0.18, 0.4, 12, 16);
    const mitMesh = new THREE.Mesh(mitGeo, mitochondriaMat);
    mitMesh.rotation.z = Math.PI / 2;
    mitGroup.add(mitMesh);
    const mx = Math.cos(angle) * 1.1;
    const mz = Math.sin(angle) * 1.1;
    mitGroup.position.set(mx, 1.0, mz);
    registerPart(mitGroup, new THREE.Vector3(mx * 1.5, 0.8, mz * 1.5), 'mitochondria', animalGroup);
  }

  // Animal cell label
  const animMemLabel = createTextSprite('Màng sinh chất mềm', 'rgba(2, 132, 199, 0.85)', '#ffffff', 24);
  animMemLabel.position.set(0, 2.4, 0);
  animalGroup.add(animMemLabel);

  // Default to plant cell visible
  animalGroup.visible = false;
  plantGroup.visible = true;

  return {
    group,
    setExploded: (factor: number) => {
      explodedFactor = Math.max(0, Math.min(1, factor));
      const dist = explodedFactor * 2.2;
      parts.forEach((p) => {
        p.mesh.position.copy(p.basePos).addScaledVector(p.explodeDir, dist);
      });
    },
    setCellType: (type: 'plant' | 'animal') => {
      cellType = type;
      plantGroup.visible = cellType === 'plant';
      animalGroup.visible = cellType === 'animal';
    },
    setSelectedOrganelle: (id: string | null) => {
      selectedId = id;
      parts.forEach((p) => {
        p.mesh.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (p.id === selectedId) {
              if (!child.userData.originalMat) {
                child.userData.originalMat = child.material;
              }
              child.material = highlightMat;
            } else if (child.userData.originalMat) {
              child.material = child.userData.originalMat;
            }
          }
        });
      });
    },
    getInteractiveObjects: () => interactiveObjects,
    update: (delta: number) => {
      // Gentle floating animation
      group.rotation.y += delta * 0.15;
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
