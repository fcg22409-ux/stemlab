import * as THREE from 'three';
import { createContactShadow, createProceduralEarthTexture, createTextSprite } from '../../utils/threeHelpers';

export interface EarthSceneController {
  group: THREE.Group;
  setSeason: (season: 'summer' | 'winter' | 'equinox') => void;
  setRotateSpeed: (speed: number) => void;
  toggleGrid: (visible: boolean) => void;
  update: (delta: number) => void;
  dispose: () => void;
}

export function createEarthOrbitScene(): EarthSceneController {
  const group = new THREE.Group();
  group.add(createContactShadow(3.8, 0.45));

  let rotateSpeed = 0.4;
  const earthRadius = 1.8;
  const tiltRad = (23.5 * Math.PI) / 180; // 23.5 degrees axial tilt

  // 1. Tilted Axis Rig
  // The tilt parent holds the 23.5° inclination
  const tiltHolder = new THREE.Group();
  tiltHolder.position.set(0, 2.2, 0);
  tiltHolder.rotation.z = -tiltRad; // Tilt North pole toward right (+X)
  group.add(tiltHolder);

  // Stand hardware (brass/steel arm holding the globe axis)
  const standGroup = new THREE.Group();
  const standMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    metalness: 0.8,
    roughness: 0.25,
  });
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.85,
    roughness: 0.2,
  });

  // Base dish
  const baseGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.2, 32);
  const baseMesh = new THREE.Mesh(baseGeo, standMat);
  baseMesh.position.set(0, 0.1, 0);
  standGroup.add(baseMesh);

  // Vertical stem
  const stemGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.4, 16);
  const stemMesh = new THREE.Mesh(stemGeo, standMat);
  stemMesh.position.set(0, 0.8, 0);
  standGroup.add(stemMesh);

  // Curved C-arm holding globe poles
  const armCurve = new THREE.TorusGeometry(2.1, 0.07, 16, 48, Math.PI * 1.05);
  const armMesh = new THREE.Mesh(armCurve, goldMat);
  armMesh.rotation.y = Math.PI / 2;
  armMesh.position.set(0, 2.2, 0);
  standGroup.add(armMesh);

  group.add(standGroup);

  // 2. GLOBE SPHERE (Rotates on its tilted axis)
  const globeGroup = new THREE.Group();
  tiltHolder.add(globeGroup);

  const earthTex = createProceduralEarthTexture();
  const earthMat = new THREE.MeshStandardMaterial({
    map: earthTex,
    roughness: 0.5,
    metalness: 0.1,
  });
  const globeGeo = new THREE.SphereGeometry(earthRadius, 48, 48);
  const globeMesh = new THREE.Mesh(globeGeo, earthMat);
  globeGroup.add(globeMesh);

  // Central Axis Pin passing through North & South poles
  const axisPinGeo = new THREE.CylinderGeometry(0.04, 0.04, earthRadius * 2.6, 16);
  const axisPin = new THREE.Mesh(axisPinGeo, goldMat);
  globeGroup.add(axisPin);

  // Equator Guide Ring (3D outer ring)
  const equatorRingGeo = new THREE.TorusGeometry(earthRadius * 1.015, 0.02, 8, 64);
  const equatorRingMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
  const equatorRing = new THREE.Mesh(equatorRingGeo, equatorRingMat);
  equatorRing.rotation.x = Math.PI / 2;
  globeGroup.add(equatorRing);

  // Vietnam Location Beacon (lat ~16°N, lon ~105°E)
  const latRad = (16 * Math.PI) / 180;
  const lonRad = (105 * Math.PI) / 180;
  const vnx = earthRadius * Math.cos(latRad) * Math.sin(lonRad);
  const vny = earthRadius * Math.sin(latRad);
  const vnz = earthRadius * Math.cos(latRad) * Math.cos(lonRad);

  const beaconGroup = new THREE.Group();
  beaconGroup.position.set(vnx, vny, vnz);
  const pinGeo = new THREE.ConeGeometry(0.06, 0.3, 16);
  const pinMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  const pinMesh = new THREE.Mesh(pinGeo, pinMat);
  pinMesh.rotation.x = Math.PI / 2;
  beaconGroup.add(pinMesh);

  const vnLabel = createTextSprite('Việt Nam (GMT+7)', 'rgba(239, 68, 68, 0.9)', '#ffffff', 20);
  vnLabel.position.set(0, 0.35, 0);
  beaconGroup.add(vnLabel);
  globeGroup.add(beaconGroup);

  // North / South pole labels
  const npLabel = createTextSprite('Cực Bắc (90°B)', 'rgba(15, 23, 42, 0.85)', '#38bdf8', 22);
  npLabel.position.set(0, earthRadius + 0.45, 0);
  tiltHolder.add(npLabel);

  const spLabel = createTextSprite('Cực Nam (90°N)', 'rgba(15, 23, 42, 0.85)', '#38bdf8', 22);
  spLabel.position.set(0, -earthRadius - 0.45, 0);
  tiltHolder.add(spLabel);

  const tiltLabel = createTextSprite('Trục nghiêng 23.5°', 'rgba(217, 119, 6, 0.9)', '#ffffff', 22);
  tiltLabel.position.set(1.5, 3.8, 0);
  group.add(tiltLabel);

  // 3. SOLAR ILLUMINATION LIGHT (Sunlight directional)
  // We can position the key sunlight according to season
  const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.5);
  sunLight.position.set(8, 2.2, 2);
  sunLight.castShadow = true;
  group.add(sunLight);

  return {
    group,
    setSeason: (season: 'summer' | 'winter' | 'equinox') => {
      // Rotate tilt holder so either North Pole faces Sun (Summer / Hạ chí)
      // or South Pole faces Sun (Winter / Đông chí)
      // or Equator directly illuminated (Equinox / Phân)
      if (season === 'summer') {
        // North tilted towards Sun (+X)
        tiltHolder.rotation.y = 0;
        sunLight.position.set(8, 2.2, 0);
      } else if (season === 'winter') {
        // North tilted away from Sun
        tiltHolder.rotation.y = Math.PI;
        sunLight.position.set(8, 2.2, 0);
      } else {
        // Equinox: Sun shines perpendicular to tilt direction
        tiltHolder.rotation.y = Math.PI / 2;
        sunLight.position.set(8, 2.2, 0);
      }
    },
    setRotateSpeed: (speed: number) => {
      rotateSpeed = speed;
    },
    toggleGrid: (visible: boolean) => {
      equatorRing.visible = visible;
    },
    update: (delta: number) => {
      // Rotate Earth on its internal axis (Day & Night progression)
      globeGroup.rotation.y += delta * rotateSpeed;
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
