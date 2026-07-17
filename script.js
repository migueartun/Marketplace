import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const container = document.getElementById('canvas-container');
const loaderEl = document.getElementById('loader');
const w = window.innerWidth, h = window.innerHeight;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x08080a);

const cam = new THREE.PerspectiveCamera(30, w / h, 0.1, 100);
cam.position.set(4, 1.8, 5.2);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
renderer.setSize(w, h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.4;
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

// ── Crimson key light ──
const key = new THREE.DirectionalLight(0xff4433, 5);
key.position.set(6, 8, 3);
scene.add(key);

// ── Warm amber edge light ──
const amber = new THREE.DirectionalLight(0xff8833, 2.5);
amber.position.set(-5, 1, -4);
scene.add(amber);

// ── Cool fill ──
const fill = new THREE.DirectionalLight(0x4466aa, 0.6);
fill.position.set(-3, 2, 5);
scene.add(fill);

// ── Ruby accent from below ──
const rubyAccent = new THREE.PointLight(0xcc2244, 0.6, 5);
rubyAccent.position.set(1.2, -0.6, 1.5);
scene.add(rubyAccent);

function buildMirrorlessCamera() {
    const g = new THREE.Group();

    // Premium titanium / carbon fiber materials
    const tiMat = new THREE.MeshPhysicalMaterial({ color: 0x5a5a66, metalness: 0.55, roughness: 0.25, clearcoat: 0.08, envMapIntensity: 1.4 });
    const tiDarkMat = new THREE.MeshPhysicalMaterial({ color: 0x3a3a46, metalness: 0.5, roughness: 0.3, clearcoat: 0.05, envMapIntensity: 1.3 });
    const carbonMat = new THREE.MeshPhysicalMaterial({ color: 0x0d0d0d, metalness: 0.3, roughness: 0.7, clearcoat: 0.1 });
    const gripMat = new THREE.MeshPhysicalMaterial({ color: 0x080808, metalness: 0, roughness: 0.95 });
    const metalMat = new THREE.MeshPhysicalMaterial({ color: 0x6a6a78, metalness: 0.85, roughness: 0.12, envMapIntensity: 1.6 });
    const darkMetalMat = new THREE.MeshPhysicalMaterial({ color: 0x4a4a58, metalness: 0.88, roughness: 0.08, envMapIntensity: 1.8 });
    const lensMat = new THREE.MeshPhysicalMaterial({ color: 0x202034, metalness: 0.75, roughness: 0.2, envMapIntensity: 1.4 });
    const goldMat = new THREE.MeshPhysicalMaterial({ color: 0x8a7a4a, metalness: 0.55, roughness: 0.2, envMapIntensity: 1.3 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x1a3366, metalness: 0, roughness: 0, transparent: true, opacity: 0.10, envMapIntensity: 4, side: THREE.DoubleSide });
    const blackMat = new THREE.MeshPhysicalMaterial({ color: 0x0a0a0a, metalness: 0, roughness: 0.05 });

    function add(m, x, y, z) { m.position.set(x, y, z); g.add(m); return m; }

    const bodyY = 0.02;

    // ── Main body (rectangular, slim, titanium) ──
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.30, 0.54, 0.36), tiMat);
    body.position.y = bodyY;
    g.add(body);

    // ── Body chamfer / edge detail ──
    const chamfer = new THREE.Mesh(new THREE.BoxGeometry(1.26, 0.01, 0.34), tiDarkMat);
    chamfer.position.y = bodyY + 0.275;
    g.add(chamfer);
    const chamferB = new THREE.Mesh(new THREE.BoxGeometry(1.26, 0.01, 0.34), tiDarkMat);
    chamferB.position.y = bodyY - 0.275;
    g.add(chamferB);

    // ── Carbon fiber top plate ──
    const topCarbon = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.012, 0.30), carbonMat);
    topCarbon.position.set(0, bodyY + 0.28, -0.01);
    g.add(topCarbon);

    // ── Minimalist grip (right side from front, visible in 3/4) ──
    const gripMain = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.40, 0.10), gripMat);
    gripMain.position.set(0.68, bodyY - 0.02, 0);
    g.add(gripMain);
    // Carbon fiber grip accent
    const gripCarbon = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.32, 0.05), carbonMat);
    gripCarbon.position.set(0.66, bodyY - 0.02, 0.02);
    g.add(gripCarbon);

    // ── Left side thumb rest (subtle) ──
    const thumbRest = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.20, 0.04), gripMat);
    thumbRest.position.set(-0.66, bodyY + 0.06, 0);
    g.add(thumbRest);

    // ── Bottom plate ──
    add(new THREE.Mesh(new THREE.BoxGeometry(1.10, 0.018, 0.32), metalMat), 0, bodyY - 0.28, 0);
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.030, 0.040, 0.012, 12), darkMetalMat), 0, bodyY - 0.30, 0);

    // ── Flat minimalist top ──
    // Status LCD (minimalist strip)
    const lcdBezel = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.008, 0.10), metalMat);
    lcdBezel.position.set(0.28, bodyY + 0.295, 0.13);
    g.add(lcdBezel);
    const lcdScreen = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.003, 0.07), new THREE.MeshPhysicalMaterial({ color: 0x0a1520, metalness: 0, roughness: 0.05, emissive: 0x1a3050, emissiveIntensity: 0.04 }));
    lcdScreen.position.set(0.28, bodyY + 0.30, 0.13);
    g.add(lcdScreen);

    // ── Flush-fitting dials ──
    // Left dial (flush with top)
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.050, 0.055, 0.015, 24), metalMat), -0.15, bodyY + 0.295, 0.14);
    add(new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.004, 6, 24), darkMetalMat), -0.15, bodyY + 0.295, 0.14);
    // Right dial (exposure comp)
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.040, 0.045, 0.012, 20), metalMat), 0.55, bodyY + 0.295, 0.14);
    add(new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.003, 6, 20), darkMetalMat), 0.55, bodyY + 0.295, 0.14);

    // ── Shutter button (low profile) ──
    const shutterBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.033, 0.015, 14), darkMetalMat);
    shutterBtn.position.set(0.42, bodyY + 0.30, 0.15);
    g.add(shutterBtn);
    add(new THREE.Mesh(new THREE.TorusGeometry(0.030, 0.005, 6, 14), metalMat), 0.42, bodyY + 0.29, 0.15);

    // ── Power switch (small slider) ──
    add(new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.008, 0.015), metalMat), 0.48, bodyY + 0.295, 0.08);

    // ── Fn button (tiny) ──
    add(new THREE.Mesh(new THREE.BoxGeometry(0.020, 0.010, 0.012), darkMetalMat), -0.40, bodyY + 0.295, 0.15);

    // ── Small EVF bump (centered, minimal) ──
    const evf = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.18), tiDarkMat);
    evf.position.set(0, bodyY + 0.30, -0.10);
    g.add(evf);
    const evfGlass = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.015, 0.04), blackMat);
    evfGlass.position.set(0, bodyY + 0.30, -0.19);
    g.add(evfGlass);

    // ── Hot shoe (minimal) ──
    add(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.010, 0.05), metalMat), 0, bodyY + 0.32, -0.08);

    // ── Brand plate (small titanium badge) ──
    add(new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.006, 0.003), metalMat), 0, bodyY + 0.285, 0.16);

    // ── Lens mount ──
    add(new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.015, 8, 28), darkMetalMat), 0, bodyY, 0.19);
    add(new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.010, 8, 28), metalMat), 0, bodyY, 0.20);

    const lensGroup = new THREE.Group();
    lensGroup.position.set(0, bodyY, 0.21);
    g.add(lensGroup);

    // ── Premium 50mm f/1.2 lens ──
    // Mount base
    const lb1 = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.22, 0.05, 30), lensMat);
    lb1.rotation.x = Math.PI / 2; lensGroup.add(lb1);
    // Main barrel
    const lb2 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.24, 30), lensMat);
    lb2.rotation.x = Math.PI / 2; lb2.position.z = 0.15; lensGroup.add(lb2);
    // Front barrel
    const lb3 = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.15, 0.04, 30), darkMetalMat);
    lb3.rotation.x = Math.PI / 2; lb3.position.z = 0.28; lensGroup.add(lb3);

    // ── Sleek metallic focus ring ──
    const frMat = new THREE.MeshPhysicalMaterial({ color: 0x4a4a58, metalness: 0.75, roughness: 0.2 });
    const fRing = new THREE.Mesh(new THREE.CylinderGeometry(0.165, 0.16, 0.07, 30), frMat);
    fRing.rotation.x = Math.PI / 2; fRing.position.z = 0.06; lensGroup.add(fRing);
    // Focus ring ridges (fine)
    for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        const rg = new THREE.Mesh(new THREE.BoxGeometry(0.002, 0.06, 0.013), darkMetalMat);
        rg.position.set(Math.cos(a) * 0.166, Math.sin(a) * 0.166, 0.06);
        rg.lookAt(0, 0, 0.06); lensGroup.add(rg);
    }

    // ── Gold accent ring ──
    add(new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.005, 6, 28), goldMat), 0, bodyY, 0.31);

    // ── Crimson ring ──
    const crimsonRingMat = new THREE.MeshPhysicalMaterial({ color: 0xcc2244, metalness: 0.2, roughness: 0.15, emissive: 0x881133, emissiveIntensity: 0.10 });
    add(new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.006, 6, 28), crimsonRingMat), 0, bodyY, 0.28);

    // ── Filter thread ──
    add(new THREE.Mesh(new THREE.TorusGeometry(0.155, 0.007, 6, 28), metalMat), 0, bodyY, 0.30);

    // ── Multi-coated front glass ──
    const frontGlass = new THREE.Mesh(new THREE.CircleGeometry(0.14, 36), glassMat);
    frontGlass.position.z = 0.31; lensGroup.add(frontGlass);
    const innerGlassMat = new THREE.MeshPhysicalMaterial({ color: 0x2244aa, metalness: 0, roughness: 0, transparent: true, opacity: 0.04, envMapIntensity: 6, side: THREE.DoubleSide });
    const innerGlass = new THREE.Mesh(new THREE.CircleGeometry(0.11, 32), innerGlassMat);
    innerGlass.position.z = 0.29; lensGroup.add(innerGlass);
    const deepGlassMat = new THREE.MeshPhysicalMaterial({ color: 0x6622aa, metalness: 0, roughness: 0, transparent: true, opacity: 0.025, envMapIntensity: 5, side: THREE.DoubleSide });
    const deepGlass = new THREE.Mesh(new THREE.CircleGeometry(0.09, 28), deepGlassMat);
    deepGlass.position.z = 0.27; lensGroup.add(deepGlass);

    // ── Glass reflections ──
    const hBlue = new THREE.Mesh(new THREE.CircleGeometry(0.035, 16), new THREE.MeshBasicMaterial({ color: 0x4499ff, transparent: true, opacity: 0.22 }));
    hBlue.position.set(0.05, 0.05, 0.315); lensGroup.add(hBlue);
    const hCrimson = new THREE.Mesh(new THREE.CircleGeometry(0.020, 12), new THREE.MeshBasicMaterial({ color: 0xff3366, transparent: true, opacity: 0.14 }));
    hCrimson.position.set(-0.04, -0.035, 0.315); lensGroup.add(hCrimson);
    const hViolet = new THREE.Mesh(new THREE.CircleGeometry(0.016, 10), new THREE.MeshBasicMaterial({ color: 0x8844ff, transparent: true, opacity: 0.10 }));
    hViolet.position.set(0.065, -0.015, 0.315); lensGroup.add(hViolet);
    const hAmber = new THREE.Mesh(new THREE.CircleGeometry(0.010, 8), new THREE.MeshBasicMaterial({ color: 0xff8844, transparent: true, opacity: 0.07 }));
    hAmber.position.set(0.03, -0.055, 0.315); lensGroup.add(hAmber);

    // ── Crimson edge glow ring ──
    const glowRing = new THREE.Mesh(new THREE.RingGeometry(0.132, 0.142, 36), new THREE.MeshBasicMaterial({ color: 0xff2244, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false }));
    glowRing.position.z = 0.312; lensGroup.add(glowRing);

    // ── Body details ──
    // Strap lugs
    add(new THREE.Mesh(new THREE.TorusGeometry(0.015, 0.006, 6, 10), darkMetalMat), -0.60, bodyY + 0.18, -0.17);
    add(new THREE.Mesh(new THREE.TorusGeometry(0.015, 0.006, 6, 10), darkMetalMat), 0.60, bodyY + 0.18, -0.17);
    // AF assist
    add(new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.008, 0.008), new THREE.MeshBasicMaterial({ color: 0x331111 })), -0.55, bodyY + 0.20, 0.19);
    // Brand text plate
    add(new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.005, 0.003), new THREE.MeshPhysicalMaterial({ color: 0x4a4a56, metalness: 0.4, roughness: 0.3 })), 0.22, bodyY + 0.26, 0.18);

    return g;
}

const camModel = buildMirrorlessCamera();
camModel.position.y = 0.0;
camModel.rotation.y = -0.35;
scene.add(camModel);

// ── Bokeh city-lights background ──
const bokehCount = 300;
const bp = new Float32Array(bokehCount * 3);
const bc = new Float32Array(bokehCount * 3);
const bs = new Float32Array(bokehCount);
for (let i = 0; i < bokehCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 12 + Math.random() * 18;
    bp[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    bp[i * 3 + 1] = (Math.random() - 0.5) * 20;
    bp[i * 3 + 2] = -(8 + Math.random() * 25);
    const c = Math.random();
    if (c < 0.4) {
        bc[i * 3] = 0.7 + Math.random() * 0.3; bc[i * 3 + 1] = 0.3 + Math.random() * 0.2; bc[i * 3 + 2] = 0.05 + Math.random() * 0.1;
    } else if (c < 0.7) {
        bc[i * 3] = 0.7 + Math.random() * 0.3; bc[i * 3 + 1] = 0.05 + Math.random() * 0.1; bc[i * 3 + 2] = 0.05 + Math.random() * 0.1;
    } else {
        bc[i * 3] = 0.1 + Math.random() * 0.2; bc[i * 3 + 1] = 0.1 + Math.random() * 0.2; bc[i * 3 + 2] = 0.5 + Math.random() * 0.4;
    }
    bs[i] = 0.04 + Math.random() * 0.35;
}
const bokeh = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(bp, 3)).setAttribute('color', new THREE.BufferAttribute(bc, 3)).setAttribute('size', new THREE.BufferAttribute(bs, 1)),
    new THREE.PointsMaterial({ size: 0.2, vertexColors: true, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, sizeAttenuation: true, depthWrite: false })
);
scene.add(bokeh);

const controls = new OrbitControls(cam, renderer.domElement);
controls.target.set(0, 0.0, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.2;
controls.minDistance = 2.5;
controls.maxDistance = 8;
controls.update();

let vw = w, vh = h, mx = 0, my = 0, tx = 0, ty = 0;
document.addEventListener('mousemove', e => { mx = (e.clientX / vw) * 2 - 1; my = (e.clientY / vh) * 2 - 1; });
document.addEventListener('touchmove', e => { if (e.touches.length === 1) { mx = (e.touches[0].clientX / vw) * 2 - 1; my = (e.touches[0].clientY / vh) * 2 - 1; } }, { passive: true });

// ── Mobile menu ──
document.querySelector('.mobile-btn').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => document.querySelector('.nav-links').classList.remove('open'));
});

// ── Smooth scroll for hash links ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id === '#') return;
        const el = document.querySelector(id);
        if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
});

// ── Prevent form submits ──
document.querySelectorAll('.modal-form button, .auth-options .btn-primary').forEach(b => {
    b.addEventListener('click', e => e.preventDefault());
});

// ── Modals ──
document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        const id = btn.dataset.modal;
        const modal = document.getElementById('modal-' + id);
        if (modal) {
            modal.classList.add('active');
            const first = modal.querySelector('input, button, a');
            if (first) setTimeout(() => first.focus(), 100);
        }
    });
});
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal-overlay').classList.remove('active');
    });
});
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('active');
    });
});

// ── Stats counter ──
function animateCounters() {
    document.querySelectorAll('.stat-num').forEach(el => {
        const target = parseInt(el.dataset.target);
        if (target <= 0) return;
        let current = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = current + (target === 98 ? '%' : '+');
        }, 30);
    });
}

// ── Focus trap in modals ──
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('keydown', e => {
        if (e.key !== 'Tab') return;
        const focusable = overlay.querySelectorAll('input, button, a, textarea, select');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
});

// ── Close modal on Escape ──
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
});

// ── Prevent body scroll when modal open ──
const body = document.body;
const modalObserver = new MutationObserver(() => {
    body.style.overflow = document.querySelector('.modal-overlay.active') ? 'hidden' : '';
});
document.querySelectorAll('.modal-overlay').forEach(m => modalObserver.observe(m, { attributes: true, attributeFilter: ['class'] }));

// ── Scroll reveal ──
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Typewriter effect (smooth rAF-based, types, pauses, deletes, loops) ──
const tw = document.querySelector('.typewriter');
if (tw) {
    const text = tw.dataset.text || '';
    tw.textContent = '';
    let pos = 0, dir = 1, lastTime = 0;
    function twStep(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const delta = timestamp - lastTime;
        if (dir === 1) {
            const n = Math.min(pos + Math.max(1, Math.floor(delta / 55)), text.length);
            tw.textContent = text.slice(0, n);
            pos = n;
            lastTime = timestamp;
            if (pos >= text.length) { dir = -1; lastTime = 0; setTimeout(() => requestAnimationFrame(twStep), 2400); return; }
        } else {
            const n = Math.max(pos - Math.max(1, Math.floor(delta / 35)), 0);
            tw.textContent = text.slice(0, n);
            pos = n;
            lastTime = timestamp;
            if (pos <= 0) { dir = 1; lastTime = 0; setTimeout(() => requestAnimationFrame(twStep), 700); return; }
        }
        requestAnimationFrame(twStep);
    }
    requestAnimationFrame(twStep);
}

// ── Carousel click to pause/resume ──
const carouselInner = document.querySelector('.inner');
if (carouselInner) {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            carouselInner.classList.toggle('paused');
        });
    });
}

// ── Objective cards: click to reveal info ──
document.querySelectorAll('.paper-emulsion').forEach(el => {
    el.addEventListener('click', (e) => {
        const card = el.closest('.objective-card');
        if (card) {
            card.classList.toggle('expanded');
        }
    });
});

// ── Image fallback ──
document.querySelectorAll('[style*="background-image"]').forEach(el => {
    const url = (el.style.backgroundImage.match(/url\("?(.+?)"?\)/) || [])[1];
    if (!url) return;
    const img = new Image();
    img.onerror = () => { el.style.backgroundImage = ''; el.style.background = 'linear-gradient(135deg, #1a1a1a, #111111)'; };
    img.src = url;
});

// ── Professional camera shutter ──
const cameraBtn = document.getElementById('cameraBtn');
const cameraOverlay = document.getElementById('cameraOverlay');
const cameraFlash = document.getElementById('cameraFlash');
const shutterTop = document.getElementById('shutterTop');
const shutterBottom = document.getElementById('shutterBottom');
const cameraAperture = document.getElementById('cameraAperture');
const vfFocusBox = document.getElementById('vfFocusBox');
const vfInfoLeft = document.getElementById('vfInfoLeft');
const vfInfoRight = document.getElementById('vfInfoRight');
const progressText = document.getElementById('progressText');
const galleryGrid = document.getElementById('galleryGrid');
const galleryPlaceholder = document.getElementById('galleryPlaceholder');
const vfVideo = document.getElementById('vfVideo');
const vfCanvas = document.getElementById('vfCanvas');

if (cameraBtn && cameraOverlay) {
    let shooting = false;
    let cameraStream = null;
    let photoIndex = 0;

    function stopCamera() {
        if (cameraStream) {
            cameraStream.getTracks().forEach(t => t.stop());
            cameraStream = null;
        }
        vfVideo.classList.remove('active');
    }

    function capturePhoto() {
        if (!cameraStream) return;
        vfCanvas.width = vfVideo.videoWidth || 640;
        vfCanvas.height = vfVideo.videoHeight || 480;
        const ctx = vfCanvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(vfVideo, 0, 0, vfCanvas.width, vfCanvas.height);
        const dataUrl = vfCanvas.toDataURL('image/jpeg', 0.85);

        // Create gallery item dynamically
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = '<div class="gallery-img"><img src="' + dataUrl + '" alt=""></div>';
        galleryGrid.insertBefore(item, galleryPlaceholder);
    }

    cameraBtn.addEventListener('click', () => {
        if (shooting) return;
        shooting = true;

        // Request camera
        const startCamera = new Promise((resolve) => {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
                    .then(stream => {
                        cameraStream = stream;
                        vfVideo.srcObject = stream;
                        vfVideo.play();
                        vfVideo.classList.add('active');
                        resolve(true);
                    })
                    .catch(() => resolve(false));
            } else {
                resolve(false);
            }
        });

        startCamera.then(hasCamera => {
            // Reset
            shutterTop.classList.remove('active');
            shutterBottom.classList.remove('active');
            cameraFlash.classList.remove('active');
            vfFocusBox.classList.remove('locked');
            cameraAperture.classList.remove('active');
            cameraOverlay.classList.remove('done');
            cameraOverlay.classList.add('active');

            // Phase 1 — Viewfinder info dance
            const phases = ['AF', 'MF', 'AF'];
            let pi = 0;
            const infoInterval = setInterval(() => {
                vfInfoLeft.textContent = phases[pi++ % 3];
            }, 200);

            // Phase 2 — Focus box search
            setTimeout(() => {
                vfFocusBox.classList.add('active');
                progressText.textContent = 'ENFOCANDO';
            }, 400);

            // Phase 3 — Focus locked
            setTimeout(() => {
                clearInterval(infoInterval);
                vfInfoLeft.textContent = 'AF';
                vfInfoRight.textContent = 'ISO 400';
                vfFocusBox.classList.remove('active');
                vfFocusBox.classList.add('locked');
                progressText.textContent = 'BLOQUEADO';
            }, 1200);

            // Phase 4 — Aperture closes
            setTimeout(() => {
                cameraAperture.classList.add('active');
                progressText.textContent = 'F/2.8';
            }, 1800);

            // Phase 5 — Shutter fires + capture
            setTimeout(() => {
                cameraAperture.classList.remove('active');
                shutterTop.classList.add('active');
                shutterBottom.classList.add('active');
                progressText.textContent = 'CAPTURANDO';
                if (hasCamera) capturePhoto();
            }, 2100);

            // Phase 6 — Flash + reveal
            setTimeout(() => {
                cameraFlash.classList.add('active');
                shutterTop.classList.remove('active');
                shutterBottom.classList.remove('active');
                progressText.textContent = '\u2713 LISTO';
                stopCamera();
            }, 2350);

            setTimeout(() => {
                cameraFlash.classList.remove('active');
            }, 2600);

            setTimeout(() => {
                cameraOverlay.classList.remove('active');
                cameraOverlay.classList.add('done');
                galleryGrid.classList.add('shot');
                setTimeout(() => galleryGrid.classList.add('flash'), 100);
                setTimeout(() => galleryGrid.classList.remove('flash'), 900);
                shooting = false;
            }, 2900);
        });
    });
}

// ── Stats observer ──
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) { animateCounters(); statsObserver.unobserve(entry.target); }
    });
}, { threshold: 0.5 });
const statsEl = document.querySelector('.stats');
if (statsEl) statsObserver.observe(statsEl);

let fc = 0;
function animate() {
    requestAnimationFrame(animate);
    tx += (mx - tx) * 0.04;
    ty += (my - ty) * 0.04;
    if (camModel.parent) {
        camModel.rotation.y += tx * 0.005;
        camModel.rotation.x += ty * 0.003;
    }
    const t = Date.now() * 0.001;
    const pp = bokeh.geometry.attributes.position.array;
    for (let i = 0; i < bokehCount; i++) {
        pp[i * 3 + 1] += Math.sin(t * 0.1 + i * 0.02) * 0.0002;
        pp[i * 3] += Math.cos(t * 0.08 + i * 0.015) * 0.00015;
    }
    bokeh.geometry.attributes.position.needsUpdate = true;
    controls.update();
    renderer.render(scene, cam);
    if (++fc === 5) loaderEl.classList.add('hidden');
}
animate();

window.addEventListener('resize', () => {
    vw = window.innerWidth; vh = window.innerHeight;
    cam.aspect = vw / vh;
    cam.updateProjectionMatrix();
    renderer.setSize(vw, vh);
});
