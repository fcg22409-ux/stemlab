import * as THREE from 'three';
import { createContactShadow, createTextSprite } from '../../utils/threeHelpers';

export interface MathGeometryController {
  group: THREE.Group;
  setDimensions: (a: number, b: number, h: number) => void;
  setUnfoldProgress: (progress: number) => void;
  setShapeType: (type: 'box' | 'cube' | 'tri_prism') => void;
  toggleVoxels: (show: boolean) => void;
  update: (delta: number) => void;
  dispose: () => void;
}

export function createMathGeometryScene(): MathGeometryController {
  const group = new THREE.Group();
  group.add(createContactShadow(4.5, 0.45));

  let dimA = 2.4;
  let dimB = 1.6;
  let dimH = 1.8;
  let unfoldProgress = 0;
  let shapeType: 'box' | 'cube' | 'tri_prism' = 'box';
  let showVoxels = false;

  const netContainer = new THREE.Group();
  netContainer.position.set(0, 0.05, 0);
  group.add(netContainer);

  const voxelGroup = new THREE.Group();
  netContainer.add(voxelGroup);

  const labelsGroup = new THREE.Group();
  group.add(labelsGroup);

  // Materials
  const bottomMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3, metalness: 0.1, side: THREE.DoubleSide });
  const topMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3, metalness: 0.1, side: THREE.DoubleSide });
  const frontMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.1, side: THREE.DoubleSide });
  const backMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.3, metalness: 0.1, side: THREE.DoubleSide });
  const leftMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.1, side: THREE.DoubleSide });
  const rightMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.1, side: THREE.DoubleSide });

  // Prism base materials
  const triBottomMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3, metalness: 0.15, side: THREE.DoubleSide });
  const triTopMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.3, metalness: 0.15, side: THREE.DoubleSide });

  const edgeLineMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
  const vertexMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 0.6, roughness: 0.2 });

  const voxelMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.55,
    roughness: 0.2,
    metalness: 0.1,
  });
  const voxelEdgeMat = new THREE.LineBasicMaterial({ color: 0x0284c7 });

  // Box Pivots
  let boxFrontPivot: THREE.Group | null = null;
  let boxBackPivot: THREE.Group | null = null;
  let boxTopPivot: THREE.Group | null = null;
  let boxLeftPivot: THREE.Group | null = null;
  let boxRightPivot: THREE.Group | null = null;

  // Prism Pivots
  let prismLeftPivot: THREE.Group | null = null;
  let prismRightPivot: THREE.Group | null = null;
  let prismBottomPivot: THREE.Group | null = null;
  let prismTopPivot: THREE.Group | null = null;

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

  const addTriangleWireframe = (parent: THREE.Object3D, w: number, h: number, dir: 1 | -1) => {
    const pts = [
      new THREE.Vector3(-w / 2, 0, 0.005),
      new THREE.Vector3(w / 2, 0, 0.005),
      new THREE.Vector3(0, dir * h, 0.005),
      new THREE.Vector3(-w / 2, 0, 0.005),
    ];
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    const l = new THREE.Line(g, edgeLineMat);
    parent.add(l);
  };

  const rebuildVoxels = () => {
    while (voxelGroup.children.length > 0) {
      const c = voxelGroup.children[0];
      if (c instanceof THREE.Mesh) c.geometry.dispose();
      voxelGroup.remove(c);
    }
    if (!showVoxels || shapeType === 'tri_prism' || unfoldProgress > 0.05) return;

    const unit = 0.4;
    const nx = Math.max(1, Math.round(dimA / unit));
    const nz = Math.max(1, Math.round(dimB / unit));
    const ny = Math.max(1, Math.round(dimH / unit));

    const vGeo = new THREE.BoxGeometry(unit * 0.95, unit * 0.95, unit * 0.95);
    const eGeo = new THREE.EdgesGeometry(vGeo);

    for (let x = 0; x < nx; x++) {
      for (let y = 0; y < ny; y++) {
        for (let z = 0; z < nz; z++) {
          const vMesh = new THREE.Mesh(vGeo, voxelMat);
          const px = -((nx - 1) * unit) / 2 + x * unit;
          const py = unit / 2 + y * unit;
          const pz = -((nz - 1) * unit) / 2 + z * unit;
          vMesh.position.set(px, py, pz);

          const wire = new THREE.LineSegments(eGeo, voxelEdgeMat);
          vMesh.add(wire);
          voxelGroup.add(vMesh);
        }
      }
    }
  };

  const rebuildNet = () => {
    // Clear previous children
    while (netContainer.children.length > 0) {
      const c = netContainer.children[0];
      netContainer.remove(c);
    }
    netContainer.add(voxelGroup);

    while (labelsGroup.children.length > 0) {
      const c = labelsGroup.children[0];
      labelsGroup.remove(c);
    }

    // Reset pivot pointers
    boxFrontPivot = null;
    boxBackPivot = null;
    boxTopPivot = null;
    boxLeftPivot = null;
    boxRightPivot = null;

    prismLeftPivot = null;
    prismRightPivot = null;
    prismBottomPivot = null;
    prismTopPivot = null;

    const a = dimA;
    const b = dimB;
    const h = dimH;

    if (shapeType === 'tri_prism') {
      // TRIANGULAR PRISM (LĂNG TRỤ ĐỨNG TAM GIÁC)
      // Base is an equilateral triangle with side 'a', prism height is 'h'
      const triH = (a * Math.sqrt(3)) / 2;

      // 1. Center Lateral Face (Mặt bên 1 - Hình chữ nhật ở giữa)
      // Extends from X in [-a/2, a/2], Y in [0, h]
      const centerGeo = new THREE.PlaneGeometry(a, h);
      const centerMesh = new THREE.Mesh(centerGeo, bottomMat);
      centerMesh.position.set(0, h / 2, 0);
      netContainer.add(centerMesh);
      addWireframe(centerMesh, a, h);

      // 2. Left Lateral Face (Mặt bên 2 - Hình chữ nhật bên trái)
      // Hinged at X = -a/2
      prismLeftPivot = new THREE.Group();
      prismLeftPivot.position.set(-a / 2, 0, 0);
      const leftGeo = new THREE.PlaneGeometry(a, h);
      const leftMesh = new THREE.Mesh(leftGeo, leftMat);
      leftMesh.position.set(-a / 2, h / 2, 0);
      prismLeftPivot.add(leftMesh);
      addWireframe(leftMesh, a, h);
      netContainer.add(prismLeftPivot);

      // 3. Right Lateral Face (Mặt bên 3 - Hình chữ nhật bên phải)
      // Hinged at X = +a/2
      prismRightPivot = new THREE.Group();
      prismRightPivot.position.set(a / 2, 0, 0);
      const rightGeo = new THREE.PlaneGeometry(a, h);
      const rightMesh = new THREE.Mesh(rightGeo, rightMat);
      rightMesh.position.set(a / 2, h / 2, 0);
      prismRightPivot.add(rightMesh);
      addWireframe(rightMesh, a, h);
      netContainer.add(prismRightPivot);

      // 4. Bottom Triangular Base (Mặt đáy dưới - Hình tam giác)
      // Hinged at bottom edge: Y = 0
      prismBottomPivot = new THREE.Group();
      prismBottomPivot.position.set(0, 0, 0);
      const bottomTriShape = new THREE.Shape();
      bottomTriShape.moveTo(-a / 2, 0);
      bottomTriShape.lineTo(a / 2, 0);
      bottomTriShape.lineTo(0, -triH);
      bottomTriShape.closePath();
      const bottomTriGeo = new THREE.ShapeGeometry(bottomTriShape);
      const bottomTriMesh = new THREE.Mesh(bottomTriGeo, triBottomMat);
      prismBottomPivot.add(bottomTriMesh);
      addTriangleWireframe(prismBottomPivot, a, triH, -1);
      netContainer.add(prismBottomPivot);

      // 5. Top Triangular Base (Mặt đáy trên - Hình tam giác)
      // Hinged at top edge: Y = h
      prismTopPivot = new THREE.Group();
      prismTopPivot.position.set(0, h, 0);
      const topTriShape = new THREE.Shape();
      topTriShape.moveTo(-a / 2, 0);
      topTriShape.lineTo(a / 2, 0);
      topTriShape.lineTo(0, triH);
      topTriShape.closePath();
      const topTriGeo = new THREE.ShapeGeometry(topTriShape);
      const topTriMesh = new THREE.Mesh(topTriGeo, triTopMat);
      prismTopPivot.add(topTriMesh);
      addTriangleWireframe(prismTopPivot, a, triH, 1);
      netContainer.add(prismTopPivot);

      // 6 Glowing Vertex Spheres (at 6 vertices of the prism)
      const vSphGeo = new THREE.SphereGeometry(0.06, 16, 16);
      const vOffsetZ = triH / 3;

      // Bottom 3 vertices
      const v1 = new THREE.Mesh(vSphGeo, vertexMat);
      v1.position.set(-a / 2, 0, -vOffsetZ);
      const v2 = new THREE.Mesh(vSphGeo, vertexMat);
      v2.position.set(a / 2, 0, -vOffsetZ);
      const v3 = new THREE.Mesh(vSphGeo, vertexMat);
      v3.position.set(0, 0, triH - vOffsetZ);

      // Top 3 vertices
      const v4 = new THREE.Mesh(vSphGeo, vertexMat);
      v4.position.set(-a / 2, h, -vOffsetZ);
      const v5 = new THREE.Mesh(vSphGeo, vertexMat);
      v5.position.set(a / 2, h, -vOffsetZ);
      const v6 = new THREE.Mesh(vSphGeo, vertexMat);
      v6.position.set(0, h, triH - vOffsetZ);

      // Add vertices to netContainer so they can fade/show with the shape
      const verticesGroup = new THREE.Group();
      verticesGroup.add(v1, v2, v3, v4, v5, v6);
      netContainer.add(verticesGroup);

      // 3D Labels for Educational Guidance
      const titleLabel = createTextSprite(
        'Lăng trụ đứng tam giác (5 mặt • 9 cạnh • 6 đỉnh)',
        'rgba(15, 23, 42, 0.9)',
        '#38bdf8',
        22
      );
      titleLabel.position.set(0, h + 0.8, 0);
      labelsGroup.add(titleLabel);

      const aLabel = createTextSprite(
        `a = ${Math.round(a * 5)} cm (cạnh đáy)`,
        'rgba(15, 23, 42, 0.85)',
        '#06b6d4',
        18
      );
      aLabel.position.set(0, -0.3, 0.3);
      labelsGroup.add(aLabel);

      const hLabel = createTextSprite(
        `h = ${Math.round(h * 5)} cm (chiều cao lăng trụ)`,
        'rgba(15, 23, 42, 0.85)',
        '#10b981',
        18
      );
      hLabel.position.set(a / 2 + 0.6, h / 2, 0);
      labelsGroup.add(hLabel);
    } else {
      // RECTANGULAR CUBOID (HÌNH HỘP CHỮ NHẬT) OR CUBE (HÌNH LẬP PHƯƠNG)
      const bGeo = new THREE.PlaneGeometry(a, b);
      const bottomMesh = new THREE.Mesh(bGeo, bottomMat);
      bottomMesh.rotation.x = -Math.PI / 2;
      netContainer.add(bottomMesh);
      addWireframe(bottomMesh, a, b);

      boxFrontPivot = new THREE.Group();
      boxFrontPivot.position.set(0, 0, b / 2);
      const fGeo = new THREE.PlaneGeometry(a, h);
      const fMesh = new THREE.Mesh(fGeo, frontMat);
      fMesh.position.set(0, h / 2, 0);
      boxFrontPivot.add(fMesh);
      addWireframe(fMesh, a, h);
      netContainer.add(boxFrontPivot);

      boxBackPivot = new THREE.Group();
      boxBackPivot.position.set(0, 0, -b / 2);
      const bkGeo = new THREE.PlaneGeometry(a, h);
      const bkMesh = new THREE.Mesh(bkGeo, backMat);
      bkMesh.position.set(0, h / 2, 0);
      boxBackPivot.add(bkMesh);
      addWireframe(bkMesh, a, h);
      netContainer.add(boxBackPivot);

      boxTopPivot = new THREE.Group();
      boxTopPivot.position.set(0, h, 0);
      const tGeo = new THREE.PlaneGeometry(a, b);
      const tMesh = new THREE.Mesh(tGeo, topMat);
      tMesh.rotation.x = -Math.PI / 2;
      tMesh.position.set(0, 0, b / 2);
      boxTopPivot.add(tMesh);
      addWireframe(tMesh, a, b);
      boxBackPivot.add(boxTopPivot);

      boxLeftPivot = new THREE.Group();
      boxLeftPivot.position.set(-a / 2, 0, 0);
      const lGeo = new THREE.PlaneGeometry(b, h);
      const lMesh = new THREE.Mesh(lGeo, leftMat);
      lMesh.rotation.y = Math.PI / 2;
      lMesh.position.set(0, h / 2, 0);
      boxLeftPivot.add(lMesh);
      addWireframe(lMesh, b, h);
      netContainer.add(boxLeftPivot);

      boxRightPivot = new THREE.Group();
      boxRightPivot.position.set(a / 2, 0, 0);
      const rGeo = new THREE.PlaneGeometry(b, h);
      const rMesh = new THREE.Mesh(rGeo, rightMat);
      rMesh.rotation.y = -Math.PI / 2;
      rMesh.position.set(0, h / 2, 0);
      boxRightPivot.add(rMesh);
      addWireframe(rMesh, b, h);
      netContainer.add(boxRightPivot);

      // Dimension labels
      const title = shapeType === 'cube' ? 'Hình Lập Phương (6 mặt vuông bằng nhau)' : 'Hình Hộp Chữ Nhật (6 mặt chữ nhật • 8 đỉnh • 12 cạnh)';
      const titleLabel = createTextSprite(title, 'rgba(15, 23, 42, 0.9)', '#38bdf8', 22);
      titleLabel.position.set(0, h + 0.7, 0);
      labelsGroup.add(titleLabel);

      const dimALabel = createTextSprite(`a = ${Math.round(a * 5)} cm (dài)`, 'rgba(15, 23, 42, 0.85)', '#38bdf8', 20);
      dimALabel.position.set(0, -0.2, b / 2 + 0.4);
      labelsGroup.add(dimALabel);

      const dimBLabel = createTextSprite(`b = ${Math.round(b * 5)} cm (rộng)`, 'rgba(15, 23, 42, 0.85)', '#f59e0b', 20);
      dimBLabel.position.set(-a / 2 - 0.5, -0.2, 0);
      labelsGroup.add(dimBLabel);

      const dimHLabel = createTextSprite(`h = ${Math.round(h * 5)} cm (cao)`, 'rgba(15, 23, 42, 0.85)', '#10b981', 20);
      dimHLabel.position.set(a / 2 + 0.5, h / 2, -b / 2);
      labelsGroup.add(dimHLabel);
    }

    applyFold(unfoldProgress);
    rebuildVoxels();
  };

  const applyFold = (u: number) => {
    const angle90 = Math.PI / 2;

    if (shapeType === 'tri_prism') {
      const triH = (dimA * Math.sqrt(3)) / 2;
      // Dihedral angle of equilateral prism is 60°, so from 180° flat to 60° folded is 120°
      const angle120 = (2 * Math.PI) / 3;

      if (prismLeftPivot) prismLeftPivot.rotation.y = (1 - u) * angle120;
      if (prismRightPivot) prismRightPivot.rotation.y = -(1 - u) * angle120;
      if (prismBottomPivot) prismBottomPivot.rotation.x = -(1 - u) * angle90;
      if (prismTopPivot) prismTopPivot.rotation.x = (1 - u) * angle90;

      // When folded (u=0), center centroid at Z=0. As it unfolds (u->1), center flat net at Z=0 and lift slightly
      const foldedCentroidZ = -triH / 3;
      netContainer.position.z = (1 - u) * foldedCentroidZ;
      netContainer.position.y = 0.05 + u * 0.8;
      if (voxelGroup) voxelGroup.visible = false;
    } else {
      netContainer.position.set(0, 0.05, 0);
      if (boxFrontPivot) boxFrontPivot.rotation.x = u * angle90;
      if (boxBackPivot) boxBackPivot.rotation.x = -u * angle90;
      if (boxTopPivot) boxTopPivot.rotation.x = (1 - u) * angle90;
      if (boxLeftPivot) boxLeftPivot.rotation.z = u * angle90;
      if (boxRightPivot) boxRightPivot.rotation.z = -u * angle90;
      if (voxelGroup) voxelGroup.visible = showVoxels && u < 0.05;
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
    setShapeType: (type: 'box' | 'cube' | 'tri_prism') => {
      shapeType = type;
      if (shapeType === 'cube') {
        const side = 2.0;
        dimA = side;
        dimB = side;
        dimH = side;
      } else if (shapeType === 'tri_prism') {
        dimA = 2.2;
        dimB = 1.6;
        dimH = 2.2;
      }
      rebuildNet();
    },
    toggleVoxels: (show: boolean) => {
      showVoxels = show;
      rebuildVoxels();
    },
    update: (delta: number) => {
      netContainer.rotation.y += delta * 0.1;
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
