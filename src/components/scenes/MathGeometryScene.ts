import * as THREE from 'three';
import { createContactShadow, createTextSprite } from '../../utils/threeHelpers';

export interface MathGeometryController {
  group: THREE.Group;
  setDimensions: (a: number, b: number, h: number) => void;
  setUnfoldProgress: (progress: number) => void;
  setShapeType: (type: 'box' | 'cube') => void;
  update: (delta: number) => void;
  dispose: () => void;
}

export function createMathGeometryScene(): MathGeometryController {
  const group = new THREE.Group();
  group.add(createContactShadow(4.0, 0.45));

  let dimA = 2.4; // Length (dài)
  let dimB = 1.6; // Width (rộng)
  let dimH = 1.8; // Height (cao)
  let unfoldProgress = 0; // 0 = closed 3D solid, 1 = completely flat 2D net
  let shapeType: 'box' | 'cube' = 'box';

  const boxNetGroup = new THREE.Group();
  boxNetGroup.position.set(0, 0.05, 0);
  group.add(boxNetGroup);

  // Materials with clear distinct colors for faces
  const bottomMat = new THREE.MeshStandardMaterial({
    color: 0x3b82f6, // Blue
    roughness: 0.3,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });
  const topMat = new THREE.MeshStandardMaterial({
    color: 0x60a5fa, // Light blue
    roughness: 0.3,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });
  const frontMat = new THREE.MeshStandardMaterial({
    color: 0x10b981, // Emerald green
    roughness: 0.3,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });
  const backMat = new THREE.MeshStandardMaterial({
    color: 0x059669, // Dark emerald
    roughness: 0.3,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });
  const leftMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Amber
    roughness: 0.3,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });
  const rightMat = new THREE.MeshStandardMaterial({
    color: 0xd97706, // Dark amber
    roughness: 0.3,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });

  // Wireframe outline material
  const edgeLineMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    linewidth: 2,
  });

  // Nodes for unfolding hierarchy
  // Bottom Face is the root
  let bottomMesh: THREE.Mesh;
  let frontPivot: THREE.Group;
  let backPivot: THREE.Group;
  let leftPivot: THREE.Group;
  let rightPivot: THREE.Group;
  let topPivot: THREE.Group;

  const labelsGroup = new THREE.Group();
  group.add(labelsGroup);

  const rebuildNet = () => {
    // Clear previous children
    while (boxNetGroup.children.length > 0) {
      const c = boxNetGroup.children[0];
      boxNetGroup.remove(c);
    }
    while (labelsGroup.children.length > 0) {
      const c = labelsGroup.children[0];
      labelsGroup.remove(c);
    }

    const a = dimA; // along X
    const b = dimB; // along Z
    const h = dimH; // along Y

    // 1. Bottom Face (Đáy 1 - X by Z) centered at (0, 0, 0)
    const bGeo = new THREE.PlaneGeometry(a, b);
    bottomMesh = new THREE.Mesh(bGeo, bottomMat);
    bottomMesh.rotation.x = -Math.PI / 2; // Flat on XZ plane
    boxNetGroup.add(bottomMesh);

    // Helper for face wireframe
    const addWireframe = (parent: THREE.Object3D, w: number, d: number) => {
      const pts = [
        new THREE.Vector3(-w / 2, -d / 2, 0.005),
        new THREE.Vector3(w / 2, -d / 2, 0.005),
        new THREE.Vector3(w / 2, d / 2, 0.005),
        new THREE.Vector3(-w / 2, d / 2, 0.005),
        new THREE.Vector3(-w / 2, -d / 2, 0.005),
      ];
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      const l = new THREE.Line(g, edgeLineMat);
      parent.add(l);
    };
    addWireframe(bottomMesh, a, b);

    // 2. Front Face (Mặt trước - X by H) hinged at Z = +b/2
    frontPivot = new THREE.Group();
    frontPivot.position.set(0, 0, b / 2);
    const fGeo = new THREE.PlaneGeometry(a, h);
    const fMesh = new THREE.Mesh(fGeo, frontMat);
    fMesh.position.set(0, h / 2, 0);
    frontPivot.add(fMesh);
    addWireframe(fMesh, a, h);
    boxNetGroup.add(frontPivot);

    // 3. Back Face (Mặt sau - X by H) hinged at Z = -b/2
    backPivot = new THREE.Group();
    backPivot.position.set(0, 0, -b / 2);
    const bkGeo = new THREE.PlaneGeometry(a, h);
    const bkMesh = new THREE.Mesh(bkGeo, backMat);
    bkMesh.position.set(0, h / 2, 0);
    backPivot.add(bkMesh);
    addWireframe(bkMesh, a, h);
    boxNetGroup.add(backPivot);

    // 4. Left Face (Mặt trái - Z by H) hinged at X = -a/2
    leftPivot = new THREE.Group();
    leftPivot.position.set(-a / 2, 0, 0);
    const lGeo = new THREE.PlaneGeometry(b, h);
    const lMesh = new THREE.Mesh(lGeo, leftMat);
    lMesh.rotation.y = Math.PI / 2;
    lMesh.position.set(0, h / 2, 0);
    leftPivot.add(lMesh);
    addWireframe(lMesh, b, h);
    boxNetGroup.add(leftPivot);

    // 5. Right Face (Mặt phải - Z by H) hinged at X = +a/2
    rightPivot = new THREE.Group();
    rightPivot.position.set(a / 2, 0, 0);
    const rGeo = new THREE.PlaneGeometry(b, h);
    const rMesh = new THREE.Mesh(rGeo, rightMat);
    rMesh.rotation.y = -Math.PI / 2;
    rMesh.position.set(0, h / 2, 0);
    rightPivot.add(rMesh);
    addWireframe(rMesh, b, h);
    boxNetGroup.add(rightPivot);

    // 6. Top Face (Đáy 2 - X by Z) hinged at the top edge of Right Face (at height H, X = +a/2)
    topPivot = new THREE.Group();
    topPivot.position.set(0, h, 0); // relative to right face
    const tGeo = new THREE.PlaneGeometry(a, b);
    const tMesh = new THREE.Mesh(tGeo, topMat);
    tMesh.rotation.x = -Math.PI / 2;
    tMesh.position.set(a / 2, 0, 0);
    topPivot.add(tMesh);
    addWireframe(tMesh, a, b);
    rightPivot.add(topPivot);

    // Dimension indicators
    const dimALabel = createTextSprite(`a = ${Math.round(a * 5)} cm (dài)`, 'rgba(15, 23, 42, 0.85)', '#38bdf8', 22);
    dimALabel.position.set(0, -0.2, b / 2 + 0.4);
    labelsGroup.add(dimALabel);

    const dimBLabel = createTextSprite(`b = ${Math.round(b * 5)} cm (rộng)`, 'rgba(15, 23, 42, 0.85)', '#f59e0b', 22);
    dimBLabel.position.set(-a / 2 - 0.5, -0.2, 0);
    labelsGroup.add(dimBLabel);

    const dimHLabel = createTextSprite(`h = ${Math.round(h * 5)} cm (cao)`, 'rgba(15, 23, 42, 0.85)', '#10b981', 22);
    dimHLabel.position.set(a / 2 + 0.5, h / 2, -b / 2);
    labelsGroup.add(dimHLabel);

    // Apply current unfold angle
    applyFold(unfoldProgress);
  };

  const applyFold = (u: number) => {
    // u = 0: closed box (perpendicular faces)
    // u = 1: 100% unfolded flat net (lying on the desk)
    const angle90 = Math.PI / 2;

    if (frontPivot) {
      // Closed: rotation.x = 0 (standing vertical)
      // Unfolded: rotation.x = +Math.PI/2 (flat forward)
      frontPivot.rotation.x = u * angle90;
    }
    if (backPivot) {
      // Closed: rotation.x = 0
      // Unfolded: rotation.x = -Math.PI/2 (flat backward)
      backPivot.rotation.x = -u * angle90;
    }
    if (leftPivot) {
      // Closed: rotation.z = 0
      // Unfolded: rotation.z = angle90 (flat to the left)
      leftPivot.rotation.z = u * angle90;
    }
    if (rightPivot) {
      // Closed: rotation.z = 0
      // Unfolded: rotation.z = -angle90 (flat to the right)
      rightPivot.rotation.z = -u * angle90;
    }
    if (topPivot) {
      // Closed: rightPivot is vertical (z=0), topPivot folds horizontally over the box (rotation.z = 0)
      // Unfolded: unfolds further flat alongside the right face (rotation.z = -angle90 * (1 - u))
      topPivot.rotation.z = (1 - u) * angle90;
    }
  };

  rebuildNet();

  return {
    group,
    setDimensions: (a: number, b: number, h: number) => {
      dimA = Math.max(1.0, Math.min(4.0, a));
      dimB = Math.max(1.0, Math.min(3.5, b));
      dimH = Math.max(1.0, Math.min(3.5, h));
      rebuildNet();
    },
    setUnfoldProgress: (progress: number) => {
      unfoldProgress = Math.max(0, Math.min(1, progress));
      applyFold(unfoldProgress);
    },
    setShapeType: (type: 'box' | 'cube') => {
      shapeType = type;
      if (shapeType === 'cube') {
        const side = 2.0;
        dimA = side;
        dimB = side;
        dimH = side;
      }
      rebuildNet();
    },
    update: (delta: number) => {
      // Gentle slow drift when not interacted
      boxNetGroup.rotation.y += delta * 0.1;
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
