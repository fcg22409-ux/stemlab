import * as THREE from 'three';
import { CHEMICAL_ELEMENTS } from '../../data/curriculumData';
import { ChemicalElement } from '../../types';
import { createContactShadow, createTextSprite } from '../../utils/threeHelpers';

export interface AtomMatterController {
  group: THREE.Group;
  setMode: (mode: 'atom' | 'matter') => void;
  setElement: (symbol: string) => void;
  setTemperature: (tempC: number) => void;
  update: (delta: number) => void;
  dispose: () => void;
}

export function createAtomMatterScene(): AtomMatterController {
  const group = new THREE.Group();
  group.add(createContactShadow(3.5, 0.45));

  let currentMode: 'atom' | 'matter' = 'atom';
  let currentElement: ChemicalElement = CHEMICAL_ELEMENTS.find((e) => e.symbol === 'C') || CHEMICAL_ELEMENTS[0];
  let temperatureC = 25; // 25°C default liquid/room temp

  // 1. ATOM SUBGROUP
  const atomGroup = new THREE.Group();
  group.add(atomGroup);

  // Nucleus & electrons
  const nucleusGroup = new THREE.Group();
  atomGroup.add(nucleusGroup);

  const electronGroup = new THREE.Group();
  atomGroup.add(electronGroup);

  const protonMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.25,
    metalness: 0.3,
  });
  const neutronMat = new THREE.MeshStandardMaterial({
    color: 0xeab308,
    roughness: 0.3,
    metalness: 0.2,
  });
  const electronMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.8,
    roughness: 0.1,
    metalness: 0.5,
  });
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x60a5fa,
    transparent: true,
    opacity: 0.4,
  });

  interface ElectronOrbit {
    mesh: THREE.Mesh;
    radius: number;
    angle: number;
    speed: number;
    inclination: THREE.Euler;
  }
  let activeOrbits: ElectronOrbit[] = [];

  const rebuildAtom = (el: ChemicalElement) => {
    // Clear nucleus
    while (nucleusGroup.children.length > 0) {
      const obj = nucleusGroup.children[0];
      if (obj instanceof THREE.Mesh) obj.geometry.dispose();
      nucleusGroup.remove(obj);
    }
    // Clear electrons & rings
    while (electronGroup.children.length > 0) {
      const obj = electronGroup.children[0];
      if (obj instanceof THREE.Mesh) obj.geometry.dispose();
      electronGroup.remove(obj);
    }
    activeOrbits = [];

    // Create close-packed nucleus with protons & neutrons
    const totalNucleons = el.protons + el.neutrons;
    const nucleonRadius = 0.16;
    const sphereGeo = new THREE.SphereGeometry(nucleonRadius, 16, 16);

    for (let i = 0; i < totalNucleons; i++) {
      const isProton = i < el.protons;
      const mesh = new THREE.Mesh(sphereGeo, isProton ? protonMat : neutronMat);

      // Fibonacci sphere packing for nucleus cluster
      const phi = Math.acos(1 - (2 * (i + 0.5)) / totalNucleons);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      const r = Math.pow((i + 1) / totalNucleons, 0.4) * (0.35 + Math.min(0.25, totalNucleons * 0.02));

      mesh.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        1.5 + r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      nucleusGroup.add(mesh);
    }

    // Create electron shells (K, L, M)
    const shellRadii = [1.2, 1.9, 2.6];
    const eRadius = 0.09;
    const eGeo = new THREE.SphereGeometry(eRadius, 14, 14);

    el.shells.forEach((count, shellIdx) => {
      const r = shellRadii[shellIdx] || 1.2 + shellIdx * 0.7;

      // Draw orbit ring
      const ringGeo = new THREE.TorusGeometry(r, 0.015, 8, 80);
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(0, 1.5, 0);
      // Give ring a slight characteristic tilt
      const tiltAngle = (shellIdx * Math.PI) / 4 + 0.2;
      ringMesh.rotation.x = Math.PI / 2 + 0.2 * shellIdx;
      ringMesh.rotation.y = tiltAngle;
      electronGroup.add(ringMesh);

      // Add electrons on this shell
      for (let j = 0; j < count; j++) {
        const eMesh = new THREE.Mesh(eGeo, electronMat);
        electronGroup.add(eMesh);
        const baseAngle = (j / count) * Math.PI * 2;
        activeOrbits.push({
          mesh: eMesh,
          radius: r,
          angle: baseAngle,
          speed: 1.5 / Math.sqrt(shellIdx + 1),
          inclination: ringMesh.rotation,
        });
      }
    });
  };
  rebuildAtom(currentElement);

  // 2. STATES OF MATTER SUBGROUP
  const matterGroup = new THREE.Group();
  matterGroup.visible = false;
  group.add(matterGroup);

  // Glass chamber
  const chamberMat = new THREE.MeshPhysicalMaterial({
    color: 0x93c5fd,
    transparent: true,
    opacity: 0.3,
    roughness: 0.1,
    metalness: 0.1,
  });
  const chamberGeo = new THREE.CylinderGeometry(1.6, 1.6, 2.8, 32, 1, true);
  const chamber = new THREE.Mesh(chamberGeo, chamberMat);
  chamber.position.set(0, 1.5, 0);
  matterGroup.add(chamber);

  const baseGlassGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.1, 32);
  const baseGlass = new THREE.Mesh(baseGlassGeo, chamberMat);
  baseGlass.position.set(0, 0.15, 0);
  matterGroup.add(baseGlass);

  // Matter particles (Water / H2O representation)
  const particleMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    roughness: 0.2,
    metalness: 0.2,
  });
  const particleCount = 48;
  interface MatterParticle {
    mesh: THREE.Mesh;
    basePos: THREE.Vector3;
    pos: THREE.Vector3;
    vel: THREE.Vector3;
  }
  const particles: MatterParticle[] = [];
  const partGeo = new THREE.SphereGeometry(0.14, 14, 14);

  // Initial cubic grid
  const cols = 4;
  const rows = 3;
  const layers = 4;
  for (let i = 0; i < particleCount; i++) {
    const pMesh = new THREE.Mesh(partGeo, particleMat);
    matterGroup.add(pMesh);

    const cx = (i % cols) - (cols - 1) / 2;
    const cy = Math.floor((i % (cols * rows)) / cols);
    const cz = Math.floor(i / (cols * rows)) - (layers - 1) / 2;

    const base = new THREE.Vector3(cx * 0.45, 0.45 + cy * 0.45, cz * 0.45);
    particles.push({
      mesh: pMesh,
      basePos: base.clone(),
      pos: base.clone(),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5
      ),
    });
  }

  return {
    group,
    setMode: (mode: 'atom' | 'matter') => {
      currentMode = mode;
      atomGroup.visible = currentMode === 'atom';
      matterGroup.visible = currentMode === 'matter';
    },
    setElement: (symbol: string) => {
      const found = CHEMICAL_ELEMENTS.find((e) => e.symbol === symbol);
      if (found) {
        currentElement = found;
        rebuildAtom(currentElement);
      }
    },
    setTemperature: (tempC: number) => {
      temperatureC = tempC;
      // Adjust particle color according to temperature
      if (temperatureC < 0) {
        particleMat.color.setHex(0x93c5fd); // Ice blue
      } else if (temperatureC < 100) {
        particleMat.color.setHex(0x0284c7); // Water blue
      } else {
        particleMat.color.setHex(0xf97316); // Hot steam orange
      }
    },
    update: (delta: number) => {
      if (currentMode === 'atom') {
        // Rotate nucleus slowly
        nucleusGroup.rotation.y += delta * 0.3;
        nucleusGroup.rotation.x += delta * 0.15;

        // Animate orbiting electrons
        activeOrbits.forEach((orb) => {
          orb.angle += delta * orb.speed * 2.5;
          const x = Math.cos(orb.angle) * orb.radius;
          const z = Math.sin(orb.angle) * orb.radius;

          const p = new THREE.Vector3(x, 0, z);
          p.applyEuler(orb.inclination);
          p.y += 1.5;
          orb.mesh.position.copy(p);
        });
      } else {
        // Matter kinematics according to temperature
        const isSolid = temperatureC < 0;
        const isGas = temperatureC > 100;
        const isLiquid = !isSolid && !isGas;

        const chamberR = 1.4;
        const chamberBottom = 0.3;
        const chamberTop = 2.7;

        particles.forEach((p, idx) => {
          if (isSolid) {
            // High order, low vibration around lattice
            const vibSpeed = 12;
            const vibAmp = 0.04 + Math.max(0, (temperatureC + 20) * 0.003);
            p.pos.x = p.basePos.x + Math.sin(Date.now() * 0.008 * vibSpeed + idx) * vibAmp;
            p.pos.y = p.basePos.y + Math.cos(Date.now() * 0.007 * vibSpeed + idx * 2) * vibAmp;
            p.pos.z = p.basePos.z + Math.sin(Date.now() * 0.009 * vibSpeed + idx * 3) * vibAmp;
          } else if (isLiquid) {
            // Fluid motion staying in bottom half of cylinder
            const fluidSpeed = 0.8 + (temperatureC / 100) * 0.8;
            p.pos.addScaledVector(p.vel, delta * fluidSpeed);

            // Bounds
            const distXZ = Math.sqrt(p.pos.x * p.pos.x + p.pos.z * p.pos.z);
            if (distXZ > chamberR - 0.15) {
              p.vel.x *= -1;
              p.vel.z *= -1;
            }
            if (p.pos.y < chamberBottom) {
              p.pos.y = chamberBottom;
              p.vel.y = Math.abs(p.vel.y);
            }
            // Liquid surface barrier
            const liquidLevel = 1.4;
            if (p.pos.y > liquidLevel) {
              p.pos.y = liquidLevel;
              p.vel.y = -Math.abs(p.vel.y);
            }
            // Gravity bias
            p.vel.y -= 1.8 * delta;
          } else {
            // Gas: fast chaotic bouncing filling full chamber
            const gasSpeed = 2.5 + ((temperatureC - 100) / 50) * 1.5;
            p.pos.addScaledVector(p.vel, delta * gasSpeed);

            const distXZ = Math.sqrt(p.pos.x * p.pos.x + p.pos.z * p.pos.z);
            if (distXZ > chamberR - 0.15) {
              p.vel.x *= -1;
              p.vel.z *= -1;
            }
            if (p.pos.y < chamberBottom) {
              p.pos.y = chamberBottom;
              p.vel.y = Math.abs(p.vel.y);
            }
            if (p.pos.y > chamberTop) {
              p.pos.y = chamberTop;
              p.vel.y = -Math.abs(p.vel.y);
            }
          }
          p.mesh.position.copy(p.pos);
        });
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
