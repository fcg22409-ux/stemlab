import * as THREE from 'three';

// Procedural Earth Texture (Continents, Oceans, Grids, Equator, Tropics)
export function createProceduralEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep ocean gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
  oceanGrad.addColorStop(0, '#0c4a6e');
  oceanGrad.addColorStop(0.5, '#0369a1');
  oceanGrad.addColorStop(1, '#0c4a6e');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Stylized continent landmasses (Eurasia, Africa, Americas, Australia, Antarctica)
  ctx.fillStyle = '#15803d'; // Rich continent green
  // Eurasia / Africa block
  ctx.beginPath();
  ctx.ellipse(560, 200, 160, 80, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(520, 280, 70, 100, 0.2, 0, Math.PI * 2);
  ctx.fill();
  // Americas block
  ctx.beginPath();
  ctx.ellipse(250, 180, 90, 70, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(310, 320, 60, 110, 0.1, 0, Math.PI * 2);
  ctx.fill();
  // Australia
  ctx.beginPath();
  ctx.ellipse(780, 350, 60, 45, 0, 0, Math.PI * 2);
  ctx.fill();
  // Antarctica (Ice caps)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 1024, 25);
  ctx.fillRect(0, 485, 1024, 27);

  // Vietnam marker highlight (approx coords: lon ~105°E -> x = (180+105)/360 * 1024 ≈ 810, lat ~16°N -> y = (90-16)/180 * 512 ≈ 210)
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(680, 230, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw Latitude parallels (Vĩ tuyến)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1;
  for (let lat = -75; lat <= 75; lat += 15) {
    const y = ((90 - lat) / 180) * 512;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Draw Longitude meridians (Kinh tuyến)
  for (let lon = -180; lon <= 180; lon += 15) {
    const x = ((lon + 180) / 360) * 1024;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }

  // Highlight Equator (Đường Xích đạo - 0°) in glowing amber
  const equatorY = 256;
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, equatorY);
  ctx.lineTo(1024, equatorY);
  ctx.stroke();

  // Highlight Tropic of Cancer (23.5° N) & Tropic of Capricorn (23.5° S)
  ctx.strokeStyle = 'rgba(249, 115, 22, 0.8)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  const tropicNY = ((90 - 23.5) / 180) * 512;
  const tropicSY = ((90 + 23.5) / 180) * 512;
  ctx.beginPath();
  ctx.moveTo(0, tropicNY);
  ctx.lineTo(1024, tropicNY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, tropicSY);
  ctx.lineTo(1024, tropicSY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Prime Meridian (Greenwich 0°)
  const primeX = 512;
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(primeX, 0);
  ctx.lineTo(primeX, 512);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Procedural Spring Geometry (Hooke's Law physical helical spring)
export function createHelicalSpringGeometry(
  radius: number = 0.35,
  coils: number = 10,
  length: number = 2.5,
  tubeRadius: number = 0.05,
  radialSegments: number = 8,
  tubularSegments: number = 250
): THREE.BufferGeometry {
  class HelicalCurve extends THREE.Curve<THREE.Vector3> {
    r: number;
    c: number;
    l: number;
    constructor(r: number, c: number, l: number) {
      super();
      this.r = r;
      this.c = c;
      this.l = l;
    }
    getPoint(t: number, optionalTarget = new THREE.Vector3()) {
      const angle = t * Math.PI * 2 * this.c;
      const x = Math.cos(angle) * this.r;
      const z = Math.sin(angle) * this.r;
      // Start top hook, spiral down, end bottom hook
      const y = -t * this.l;
      return optionalTarget.set(x, y, z);
    }
  }

  const path = new HelicalCurve(radius, coils, length);
  return new THREE.TubeGeometry(path, tubularSegments, tubeRadius, radialSegments, false);
}

// Procedural Ruler Texture (Đo độ dãn lò xo - vạch chia mm và cm rõ nét)
export function createRulerTexture(maxCm: number = 30): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Background plastic ruler
  ctx.fillStyle = '#fef3c7'; // Ivory / light amber
  ctx.fillRect(0, 0, 128, 1024);

  // Ruler border
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, 124, 1020);

  // Markings
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 22px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  const pxPerCm = (1024 - 40) / maxCm;
  const startY = 20;

  for (let mm = 0; mm <= maxCm * 10; mm++) {
    const y = startY + (mm / 10) * pxPerCm;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#334155';

    if (mm % 10 === 0) {
      // Major cm tick
      const cmVal = mm / 10;
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(45, y);
      ctx.stroke();

      ctx.fillText(`${cmVal}`, 115, y);
    } else if (mm % 5 === 0) {
      // 5mm half-tick
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(30, y);
      ctx.stroke();
    } else {
      // 1mm tick
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(18, y);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Procedural Text Sprite for 3D Annotations (e.g., organelle labels, vertex names, dimensions)
export function createTextSprite(
  text: string,
  bgColor = 'rgba(15, 23, 42, 0.85)',
  textColor = '#ffffff',
  fontSize = 28
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 96;
  const ctx = canvas.getContext('2d')!;

  // Pill rounded background
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.roundRect(8, 8, 368, 80, 20);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Text
  ctx.fillStyle = textColor;
  ctx.font = `bold ${fontSize}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 192, 48);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.5, 0.375, 1);
  return sprite;
}

// Procedural Ground Contact Shadow Plane
export function createContactShadow(radius = 3, opacity = 0.4): THREE.Mesh {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 120);
  grad.addColorStop(0, `rgba(0, 0, 0, ${opacity})`);
  grad.addColorStop(0.5, `rgba(0, 0, 0, ${opacity * 0.4})`);
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  const geo = new THREE.PlaneGeometry(radius * 2, radius * 2);
  const mat = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });
  const plane = new THREE.Mesh(geo, mat);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -0.01;
  return plane;
}
