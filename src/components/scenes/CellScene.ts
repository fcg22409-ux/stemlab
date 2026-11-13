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
  const shadow = createContactShadow(3.8, 0.45);
  group.add(shadow);

  // Subgroup for organelles to animate
  const plantGroup = new THREE.Group();
  const animalGroup = new THREE.Group();
  group.add(plantGroup);
  group.add(animalGroup);

  interface OrganellePart {
    mesh: THREE.Object3D;
    basePos: THREE.Vector3;
    explodeDir: THREE.Vector3;
    id: string;
    originalMat?: THREE.Material | THREE.Material[];
  }
  const parts: OrganellePart[] = [];
  const interactiveObjects: THREE.Object3D[] = [];

  // Reusable PBR materials
  const plantWallMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    roughness: 0.35,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85,
  });
  const membraneMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.25,
    metalness: 0.15,
    transparent: true,
    opacity: 0.7,
  });
  const cytoplasmMat = new THREE.MeshStandardMaterial({
    color: 0xc4b5fd,
    roughness: 0.45,
    metalness: 0.05,
    transparent: true,
    opacity: 0.3,
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
  const chloroplastOuterMat = new THREE.MeshStandardMaterial({
    color: 0x15803d,
    roughness: 0.3,
    metalness: 0.1,
  });
  const thylakoidMat = new THREE.MeshStandardMaterial({
    color: 0x4ade80,
    roughness: 0.2,
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
    opacity: 0.65,
  });
  const golgiMat = new THREE.MeshStandardMaterial({
    color: 0xeab308,
    roughness: 0.3,
    metalness: 0.2,
  });
  const erMat = new THREE.MeshStandardMaterial({
    color: 0xa855f7,
    roughness: 0.4,
    metalness: 0.1,
  });

  // Highlight material
  const highlightMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.2,
    metalness: 0.5,
    emissive: 0xca8a04,
    emissiveIntensity: 0.6,
  });

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

  // Helper to build detailed Chloroplast with inner thylakoid grana stacks
  const createDetailedChloroplast = () => {
    const chGroup = new THREE.Group();
    const chGeo = new THREE.SphereGeometry(0.3, 16, 16);
    chGeo.scale(1.4, 0.6, 0.8);
    const outer = new THREE.Mesh(chGeo, chloroplastOuterMat);
    chGroup.add(outer);

    // Inner thylakoid stacks (3 tiny stacks of green disks)
    for (let s = -1; s <= 1; s++) {
      for (let d = 0; d < 3; d++) {
        const discGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.02, 12);
        const disc = new THREE.Mesh(discGeo, thylakoidMat);
        disc.position.set(s * 0.18, -0.04 + d * 0.03, 0.04);
        chGroup.add(disc);
      }
    }
    return chGroup;
  };

  // Helper to build Golgi Apparatus (curved flattened cisternae sacs)
  const createGolgi = () => {
    const gGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const curveGeo = new THREE.TorusGeometry(0.35 + i * 0.08, 0.035, 12, 24, Math.PI * 0.7);
      const mesh = new THREE.Mesh(curveGeo, golgiMat);
      mesh.rotation.z = Math.PI * 0.65;
      mesh.position.set(0, 0, i * 0.08);
      gGroup.add(mesh);
    }
    // Small secretory vesicles budding off
    const vGeo = new THREE.SphereGeometry(0.04, 8, 8);
    for (let v = 0; v < 5; v++) {
      const vMesh = new THREE.Mesh(vGeo, golgiMat);
      vMesh.position.set(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.4,
        0.35 + Math.random() * 0.15
      );
      gGroup.add(vMesh);
    }
    return gGroup;
  };

  // Helper to build Endoplasmic Reticulum (convoluted folded tubular network around nucleus)
  const createER = () => {
    const erGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 1.5;
      const torus = new THREE.TorusGeometry(0.85 + (i % 2) * 0.15, 0.04, 8, 24, Math.PI * 0.4);
      const mesh = new THREE.Mesh(torus, erMat);
      mesh.rotation.set(0.3 * i, angle, 0.2 * i);
      erGroup.add(mesh);
    }
    return erGroup;
  };

  // 1. PLANT CELL ASSEMBLY
  // Cell wall cutaway
  const plantWallGeo = new THREE.CylinderGeometry(2.5, 2.5, 1.4, 6, 1, false, 0, Math.PI * 1.55);
  const plantWall = new THREE.Mesh(plantWallGeo, plantWallMat);
  plantWall.position.set(0, 0.7, 0);
  registerPart(plantWall, new THREE.Vector3(0, 0, 1.5), 'cell_wall', plantGroup);

  // Cell Membrane
  const plantMemGeo = new THREE.CylinderGeometry(2.35, 2.35, 1.35, 6, 1, false, 0, Math.PI * 1.55);
  const plantMem = new THREE.Mesh(plantMemGeo, membraneMat);
  plantMem.position.set(0, 0.7, 0);
  registerPart(plantMem, new THREE.Vector3(0, 0, 1.2), 'membrane', plantGroup);

  // Cytoplasm
  const plantCytoGeo = new THREE.CylinderGeometry(2.2, 2.2, 1.2, 6, 1, false, 0, Math.PI * 1.55);
  const plantCyto = new THREE.Mesh(plantCytoGeo, cytoplasmMat);
  plantCyto.position.set(0, 0.7, 0);
  registerPart(plantCyto, new THREE.Vector3(0, -0.5, 0), 'cytoplasm', plantGroup);

  // Central Vacuole
  const vacuoleGeo = new THREE.SphereGeometry(1.05, 24, 24);
  vacuoleGeo.scale(1.2, 0.65, 0.9);
  const plantVacuole = new THREE.Mesh(vacuoleGeo, vacuoleMat);
  plantVacuole.position.set(-0.55, 0.7, -0.4);
  registerPart(plantVacuole, new THREE.Vector3(-1.3, 0.8, -1), 'vacuole', plantGroup);

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

  // ER hugging Nucleus
  const plantER = createER();
  plantER.position.copy(nucleusGroup.position);
  registerPart(plantER, new THREE.Vector3(1.3, 1.2, -0.4), 'er', plantGroup);

  // Golgi Apparatus
  const plantGolgi = createGolgi();
  plantGolgi.position.set(0.7, 0.65, 0.8);
  registerPart(plantGolgi, new THREE.Vector3(1.2, 0.6, 1.3), 'golgi', plantGroup);

  // Chloroplasts (4 items around periphery)
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 1.4 + 0.3;
    const chl = createDetailedChloroplast();
    const cx = Math.cos(angle) * 1.45;
    const cz = Math.sin(angle) * 1.15;
    chl.position.set(cx, 0.65, cz);
    chl.rotation.y = angle;
    registerPart(chl, new THREE.Vector3(cx * 1.5, 0.6, cz * 1.5), 'chloroplast', plantGroup);
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

  // 3D Label Sprites for Plant
  const nucLabel = createTextSprite('Nhân tế bào (ADN)', 'rgba(225, 29, 72, 0.85)', '#ffffff', 22);
  nucLabel.position.set(0.9, 1.6, -0.3);
  plantGroup.add(nucLabel);

  const wallLabel = createTextSprite('Thành xenlulôzơ', 'rgba(5, 150, 105, 0.85)', '#ffffff', 22);
  wallLabel.position.set(0, 1.8, 1.5);
  plantGroup.add(wallLabel);

  const chlLabel = createTextSprite('Lục lạp (Quang hợp)', 'rgba(22, 163, 74, 0.85)', '#ffffff', 22);
  chlLabel.position.set(1.4, 1.4, 0.9);
  plantGroup.add(chlLabel);

  const vacLabel = createTextSprite('Không bào lớn (Nước)', 'rgba(8, 145, 178, 0.85)', '#ffffff', 22);
  vacLabel.position.set(-0.6, 1.5, -0.4);
  plantGroup.add(vacLabel);

  // 2. ANIMAL CELL ASSEMBLY (Spherical, No wall, No chloroplasts, Golgi, Mitochondria, ER)
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

  const animER = createER();
  animER.position.set(0, 1.0, 0);
  registerPart(animER, new THREE.Vector3(0, 1.3, 0.3), 'er', animalGroup);

  const animGolgi = createGolgi();
  animGolgi.position.set(-0.8, 0.9, 0.6);
  registerPart(animGolgi, new THREE.Vector3(-1.2, 0.9, 0.9), 'golgi', animalGroup);

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

  const animMemLabel = createTextSprite('Màng sinh chất mềm', 'rgba(2, 132, 199, 0.85)', '#ffffff', 22);
  animMemLabel.position.set(0, 2.4, 0);
  animalGroup.add(animMemLabel);

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
