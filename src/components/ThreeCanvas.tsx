import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SubjectId } from '../types';
import { createCellScene, CellSceneController } from './scenes/CellScene';
import { createPhysicsSpringScene, SpringSceneController } from './scenes/PhysicsSpringScene';
import { createAtomMatterScene, AtomMatterController } from './scenes/AtomMatterScene';
import { createMathGeometryScene, MathGeometryController } from './scenes/MathGeometryScene';

export interface SceneControlsRef {
  // Cell
  setCellExploded: (f: number) => void;
  setCellType: (type: 'plant' | 'animal') => void;
  setSelectedOrganelle: (id: string | null) => void;
  // Physics
  setPhysicsMode: (m: 'spring' | 'lever') => void;
  setSpringMass: (g: number) => void;
  setSpringConstant: (k: number) => void;
  setSpringGravity: (g: number) => void;
  triggerSpringPerturb: () => void;
  getSpringExtensionCm: () => number;
  setLeverLeft: (mG: number, dCm: number) => void;
  setLeverRight: (mG: number, dCm: number) => void;
  // Atom, Molecules & Matter
  setChemMode: (m: 'atom' | 'molecule' | 'matter') => void;
  setChemElement: (symbol: string) => void;
  setChemMolecule: (id: string) => void;
  setChemTemperature: (t: number) => void;
  // Math
  setBoxDimensions: (a: number, b: number, h: number) => void;
  setBoxUnfold: (u: number) => void;
  setBoxShape: (type: 'box' | 'cube' | 'tri_prism') => void;
  toggleBoxVoxels: (show: boolean) => void;
  // Common
  resetCamera: () => void;
  toggleAutoRotate: () => boolean;
}

interface ThreeCanvasProps {
  currentSubject: SubjectId;
  controlsRef: React.MutableRefObject<SceneControlsRef | null>;
  onSelectOrganelle?: (id: string) => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  currentSubject,
  controlsRef,
  onSelectOrganelle,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Active scene controllers
  const activeControllersRef = useRef<{
    cell?: CellSceneController;
    spring?: SpringSceneController;
    chem?: AtomMatterController;
    math?: MathGeometryController;
  }>({});

  const cameraControlsRef = useRef<{
    controls?: OrbitControls;
    camera?: THREE.PerspectiveCamera;
  }>({});

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Initialize Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Container dimensions safety check
    const containerW = Math.max(container.clientWidth || window.innerWidth, 320);
    const containerH = Math.max(container.clientHeight || window.innerHeight, 240);
    renderer.setSize(containerW, containerH);

    container.appendChild(renderer.domElement);

    // Scene & Environment
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070b14); // Ultra-deep slate midnight
    scene.fog = new THREE.FogExp2(0x070b14, 0.022);

    // Studio Environment Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio Lighting Rig
    const warmKeyLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
    warmKeyLight.position.set(6, 9, 6);
    warmKeyLight.castShadow = !isSoftwareGl;
    if (warmKeyLight.castShadow) {
      warmKeyLight.shadow.mapSize.width = 1024;
      warmKeyLight.shadow.mapSize.height = 1024;
      warmKeyLight.shadow.bias = -0.0005;
      warmKeyLight.shadow.normalBias = 0.02;
    }
    scene.add(warmKeyLight);

    const coolFillLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 1.25);
    scene.add(coolFillLight);

    const rimLight = new THREE.DirectionalLight(0x818cf8, 1.0);
    rimLight.position.set(-7, 5, -6);
    scene.add(rimLight);

    // Science Laboratory Floor & Pedestal Rig
    const labBaseGroup = new THREE.Group();
    scene.add(labBaseGroup);

    // Pedestal stage disc
    const stageGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.12, 48);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.3,
    });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.set(0, -0.06, 0);
    stage.receiveShadow = !isSoftwareGl;
    labBaseGroup.add(stage);

    // Subtle glowing cyan accent ring on stage rim
    const ringGeo = new THREE.TorusGeometry(3.62, 0.025, 8, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 });
    const accentRing = new THREE.Mesh(ringGeo, ringMat);
    accentRing.rotation.x = Math.PI / 2;
    accentRing.position.y = -0.01;
    labBaseGroup.add(accentRing);

    // Subtle floating dust/star ambient particles in the background
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = Math.random() * 8 + 0.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.04,
      transparent: true,
      opacity: 0.4,
    });
    const ambientDust = new THREE.Points(particleGeo, particleMat);
    scene.add(ambientDust);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerW / containerH,
      0.1,
      100
    );
    camera.position.set(0, 3.2, 7.5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.minDistance = 2.0;
    controls.maxDistance = 20.0;
    controls.target.set(0, 1.5, 0);
    controls.update();

    cameraControlsRef.current = { controls, camera };

    // Subject Root Group
    const subjectRoot = new THREE.Group();
    scene.add(subjectRoot);

    // Load Scene by Subject (4 Core Subjects)
    let cellCtrl: CellSceneController | undefined;
    let springCtrl: SpringSceneController | undefined;
    let chemCtrl: AtomMatterController | undefined;
    let mathCtrl: MathGeometryController | undefined;

    if (currentSubject === 'khtn_bio') {
      cellCtrl = createCellScene((id) => onSelectOrganelle?.(id));
      subjectRoot.add(cellCtrl.group);
      camera.position.set(0, 2.8, 6.5);
      controls.target.set(0, 1.0, 0);
    } else if (currentSubject === 'khtn_physics') {
      springCtrl = createPhysicsSpringScene();
      subjectRoot.add(springCtrl.group);
      camera.position.set(0, 2.4, 6.8);
      controls.target.set(0, 2.0, 0);
    } else if (currentSubject === 'khtn_chem') {
      chemCtrl = createAtomMatterScene();
      subjectRoot.add(chemCtrl.group);
      camera.position.set(0, 2.0, 6.2);
      controls.target.set(0, 1.5, 0);
    } else if (currentSubject === 'math') {
      mathCtrl = createMathGeometryScene();
      subjectRoot.add(mathCtrl.group);
      camera.position.set(0, 3.5, 6.5);
      controls.target.set(0, 0.8, 0);
    }
    controls.update();

    activeControllersRef.current = {
      cell: cellCtrl,
      spring: springCtrl,
      chem: chemCtrl,
      math: mathCtrl,
    };

    // Raycaster for interactive object selection (e.g. click organelles)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      if (!cellCtrl) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const interactives = cellCtrl.getInteractiveObjects();
      const intersects = raycaster.intersectObjects(interactives, true);
      if (intersects.length > 0) {
        let cur: THREE.Object3D | null = intersects[0].object;
        while (cur && !cur.userData?.organelleId && cur !== subjectRoot) {
          cur = cur.parent;
        }
        if (cur?.userData?.organelleId) {
          const id = cur.userData.organelleId as string;
          cellCtrl.setSelectedOrganelle(id);
          onSelectOrganelle?.(id);
        }
      }
    };
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // Expose Controls Ref to Parent React Component
    controlsRef.current = {
      setCellExploded: (f) => cellCtrl?.setExploded(f),
      setCellType: (t) => cellCtrl?.setCellType(t),
      setSelectedOrganelle: (id) => cellCtrl?.setSelectedOrganelle(id),
      setPhysicsMode: (m) => springCtrl?.setMode(m),
      setSpringMass: (g) => springCtrl?.setMass(g),
      setSpringConstant: (k) => springCtrl?.setSpringConstant(k),
      setSpringGravity: (g) => springCtrl?.setGravity(g),
      triggerSpringPerturb: () => springCtrl?.triggerPerturbation(),
      getSpringExtensionCm: () => springCtrl?.getCurrentExtensionCm() || 0,
      setLeverLeft: (mG, dCm) => springCtrl?.setLeverLeft(mG, dCm),
      setLeverRight: (mG, dCm) => springCtrl?.setLeverRight(mG, dCm),
      setChemMode: (m) => chemCtrl?.setMode(m),
      setChemElement: (s) => chemCtrl?.setElement(s),
      setChemMolecule: (id) => chemCtrl?.setMolecule(id),
      setChemTemperature: (t) => chemCtrl?.setTemperature(t),
      setBoxDimensions: (a, b, h) => mathCtrl?.setDimensions(a, b, h),
      setBoxUnfold: (u) => mathCtrl?.setUnfoldProgress(u),
      setBoxShape: (type) => mathCtrl?.setShapeType(type),
      toggleBoxVoxels: (show) => mathCtrl?.toggleVoxels(show),
      resetCamera: () => {
        if (currentSubject === 'khtn_bio') {
          camera.position.set(0, 2.8, 6.5);
          controls.target.set(0, 1.0, 0);
        } else if (currentSubject === 'khtn_physics') {
          camera.position.set(0, 2.4, 6.8);
          controls.target.set(0, 2.0, 0);
        } else if (currentSubject === 'khtn_chem') {
          camera.position.set(0, 2.0, 6.2);
          controls.target.set(0, 1.5, 0);
        } else if (currentSubject === 'math') {
          camera.position.set(0, 3.5, 6.5);
          controls.target.set(0, 0.8, 0);
        }
        controls.update();
      },
      toggleAutoRotate: () => {
        controls.autoRotate = !controls.autoRotate;
        controls.autoRotateSpeed = 1.5;
        return controls.autoRotate;
      },
    };

    // Resize Observer for reliable dimensions
    const handleResize = () => {
      if (!container) return;
      const w = Math.max(container.clientWidth || window.innerWidth, 320);
      const h = Math.max(container.clientHeight || window.innerHeight, 240);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);
    const ro = new ResizeObserver(() => handleResize());
    ro.observe(container);

    // Animation Loop
    let animId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        animId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      if (!sync) {
        animId = window.setTimeout(cb, 80);
        return;
      }
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          animId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          animId = window.setTimeout(cb, 80);
        }
      };
      animId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      const delta = clock.getDelta();
      controls.update();

      // Update active controllers
      cellCtrl?.update(delta);
      springCtrl?.update(delta);
      chemCtrl?.update(delta);
      mathCtrl?.update(delta);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        animId = requestAnimationFrame(tick);
      }
    };
    tick();

    // Clean up
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      if (isSoftwareGl) clearTimeout(animId);
      else cancelAnimationFrame(animId);

      cellCtrl?.dispose();
      springCtrl?.dispose();
      chemCtrl?.dispose();
      mathCtrl?.dispose();

      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [currentSubject, onSelectOrganelle, controlsRef]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-slate-950">
      {/* Three.js canvas mount container - isolated from React HUD overlays */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
