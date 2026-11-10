import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SubjectId } from '../types';
import { createCellScene, CellSceneController } from './scenes/CellScene';
import { createPhysicsSpringScene, SpringSceneController } from './scenes/PhysicsSpringScene';
import { createAtomMatterScene, AtomMatterController } from './scenes/AtomMatterScene';
import { createMathGeometryScene, MathGeometryController } from './scenes/MathGeometryScene';
import { createEarthOrbitScene, EarthSceneController } from './scenes/EarthOrbitScene';

export interface SceneControlsRef {
  // Cell
  setCellExploded: (f: number) => void;
  setCellType: (type: 'plant' | 'animal') => void;
  setSelectedOrganelle: (id: string | null) => void;
  // Physics
  setSpringMass: (g: number) => void;
  setSpringConstant: (k: number) => void;
  setSpringGravity: (g: number) => void;
  triggerSpringPerturb: () => void;
  getSpringExtensionCm: () => number;
  // Atom & Matter
  setChemMode: (m: 'atom' | 'matter') => void;
  setChemElement: (symbol: string) => void;
  setChemTemperature: (t: number) => void;
  // Math
  setBoxDimensions: (a: number, b: number, h: number) => void;
  setBoxUnfold: (u: number) => void;
  setBoxShape: (type: 'box' | 'cube') => void;
  // Earth
  setEarthSeason: (s: 'summer' | 'winter' | 'equinox') => void;
  setEarthRotateSpeed: (sp: number) => void;
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
    earth?: EarthSceneController;
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
    renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(renderer.domElement);

    // Scene & Environment
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1120); // Deep rich slate void
    scene.fog = new THREE.FogExp2(0x0b1120, 0.025);

    // Studio Environment Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio Lighting Rig
    const warmKeyLight = new THREE.DirectionalLight(0xffedd5, 2.2);
    warmKeyLight.position.set(5, 8, 5);
    warmKeyLight.castShadow = !isSoftwareGl;
    if (warmKeyLight.castShadow) {
      warmKeyLight.shadow.mapSize.width = 1024;
      warmKeyLight.shadow.mapSize.height = 1024;
      warmKeyLight.shadow.bias = -0.0005;
      warmKeyLight.shadow.normalBias = 0.02;
    }
    scene.add(warmKeyLight);

    const coolFillLight = new THREE.HemisphereLight(0x38bdf8, 0x1e293b, 1.2);
    scene.add(coolFillLight);

    const rimLight = new THREE.DirectionalLight(0xa78bfa, 0.8);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 3.2, 7.5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.minDistance = 2.0;
    controls.maxDistance = 25.0;
    controls.target.set(0, 1.5, 0);
    controls.update();

    cameraControlsRef.current = { controls, camera };

    // Subject Root Group
    const subjectRoot = new THREE.Group();
    scene.add(subjectRoot);

    // Load Scene by Subject
    let cellCtrl: CellSceneController | undefined;
    let springCtrl: SpringSceneController | undefined;
    let chemCtrl: AtomMatterController | undefined;
    let mathCtrl: MathGeometryController | undefined;
    let earthCtrl: EarthSceneController | undefined;

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
    } else if (currentSubject === 'geography') {
      earthCtrl = createEarthOrbitScene();
      subjectRoot.add(earthCtrl.group);
      camera.position.set(0, 2.8, 7.2);
      controls.target.set(0, 1.8, 0);
    }
    controls.update();

    activeControllersRef.current = {
      cell: cellCtrl,
      spring: springCtrl,
      chem: chemCtrl,
      math: mathCtrl,
      earth: earthCtrl,
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
      setSpringMass: (g) => springCtrl?.setMass(g),
      setSpringConstant: (k) => springCtrl?.setSpringConstant(k),
      setSpringGravity: (g) => springCtrl?.setGravity(g),
      triggerSpringPerturb: () => springCtrl?.triggerPerturbation(),
      getSpringExtensionCm: () => springCtrl?.getCurrentExtensionCm() || 0,
      setChemMode: (m) => chemCtrl?.setMode(m),
      setChemElement: (s) => chemCtrl?.setElement(s),
      setChemTemperature: (t) => chemCtrl?.setTemperature(t),
      setBoxDimensions: (a, b, h) => mathCtrl?.setDimensions(a, b, h),
      setBoxUnfold: (u) => mathCtrl?.setUnfoldProgress(u),
      setBoxShape: (type) => mathCtrl?.setShapeType(type),
      setEarthSeason: (s) => earthCtrl?.setSeason(s),
      setEarthRotateSpeed: (sp) => earthCtrl?.setRotateSpeed(sp),
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
        } else {
          camera.position.set(0, 2.8, 7.2);
          controls.target.set(0, 1.8, 0);
        }
        controls.update();
      },
      toggleAutoRotate: () => {
        controls.autoRotate = !controls.autoRotate;
        controls.autoRotateSpeed = 1.5;
        return controls.autoRotate;
      },
    };

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
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
      earthCtrl?.update(delta);

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
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      if (isSoftwareGl) clearTimeout(animId);
      else cancelAnimationFrame(animId);

      cellCtrl?.dispose();
      springCtrl?.dispose();
      chemCtrl?.dispose();
      mathCtrl?.dispose();
      earthCtrl?.dispose();

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
