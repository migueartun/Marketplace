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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

// ── Crimson key light ──
const key = new THREE.DirectionalLight(0xff4433, 5);
key.position.set(6, 8, 3);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
scene.add(key);

// ── Warm amber edge light ──
const amber = new THREE.DirectionalLight(0xff8833, 2.5);
amber.position.set(-5, 1, -4);
scene.add(amber);

// ── Cool fill ──
const fill = new THREE.DirectionalLight(0x4466aa, 0.6);
fill.position.set(-3, 2, 5);
scene.add(fill);

// ── Copper floor glow ──
const floorGlow = new THREE.PointLight(0xff6633, 0.4, 6);
floorGlow.position.set(0, -0.3, 0);
scene.add(floorGlow);

// ── Ruby accent from below ──
const rubyAccent = new THREE.PointLight(0xcc2244, 0.5, 4);
rubyAccent.position.set(1.5, -0.2, 1);
scene.add(rubyAccent);

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.ShadowMaterial({ opacity: 0.12, color: 0x000000 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.55;
floor.receiveShadow = true;
scene.add(floor);

// ── Warm copper floor spill ──
const spill = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 3),
    new THREE.MeshBasicMaterial({ color: 0xff6633, transparent: true, opacity: 0.04, depthWrite: false })
);
spill.rotation.x = -Math.PI / 2;
spill.position.y = -0.54;
scene.add(spill);

function buildMirrorlessCamera() {
    const g = new THREE.Group();

    const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0x16161a, metalness: 0.18, roughness: 0.5, clearcoat: 0.06 });
    const gripMat = new THREE.MeshPhysicalMaterial({ color: 0x0a0a0a, metalness: 0, roughness: 0.95, clearcoat: 0.02 });
    const metalMat = new THREE.MeshPhysicalMaterial({ color: 0x3e3e4e, metalness: 0.88, roughness: 0.12, envMapIntensity: 1.6 });
    const darkMetalMat = new THREE.MeshPhysicalMaterial({ color: 0x262636, metalness: 0.92, roughness: 0.08, envMapIntensity: 1.9 });
    const lensMat = new THREE.MeshPhysicalMaterial({ color: 0x18182a, metalness: 0.72, roughness: 0.22, envMapIntensity: 1.4 });
    const goldMat = new THREE.MeshPhysicalMaterial({ color: 0x8a7a4a, metalness: 0.6, roughness: 0.18, envMapIntensity: 1.3 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x1a3366, metalness: 0, roughness: 0, transparent: true, opacity: 0.10, envMapIntensity: 4, side: THREE.DoubleSide });
    const screenMat = new THREE.MeshPhysicalMaterial({ color: 0x0a0a0a, metalness: 0, roughness: 0.05 });

    function add(m, x, y, z) { m.position.set(x, y, z); g.add(m); return m; }

    const bodyY = 0.05;

    // ── Main body (slimmer, flat top) ──
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.62, 0.42), bodyMat);
    body.position.y = bodyY + 0.01;
    body.castShadow = true; body.receiveShadow = true;
    g.add(body);

    // ── Top plate (flat mirrorless profile) ──
    const topPlate = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.02, 0.38), darkMetalMat);
    topPlate.position.set(0, bodyY + 0.33, 0);
    g.add(topPlate);

    // ── Deep ergonomic grip (left side) ──
    const gripMain = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.52, 0.14), gripMat);
    gripMain.position.set(-0.72, bodyY, 0);
    g.add(gripMain);
    // Secondary grip texture layer
    const gripTex = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.44, 0.06), new THREE.MeshPhysicalMaterial({ color: 0x080808, metalness: 0, roughness: 0.98 }));
    gripTex.position.set(-0.7, bodyY, 0.03);
    g.add(gripTex);

    // Thumb grip (right side)
    const thumbGrip = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.04), gripMat);
    thumbGrip.position.set(0.72, bodyY + 0.08, 0);
    g.add(thumbGrip);

    // ── Bottom plate ──
    add(new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.025, 0.38), metalMat), 0, bodyY - 0.32, 0);
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.015, 12), darkMetalMat), 0, bodyY - 0.34, 0);

    // ── EVF / viewfinder bump (left side top) ──
    const evf = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.24), darkMetalMat);
    evf.position.set(-0.35, bodyY + 0.37, -0.08);
    g.add(evf);
    const evfTop = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.025, 0.18), metalMat);
    evfTop.position.set(-0.35, bodyY + 0.405, -0.08);
    g.add(evfTop);
    // Eyecup
    const eyecup = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.04, 0.05), gripMat);
    eyecup.position.set(-0.35, bodyY + 0.38, -0.2);
    g.add(eyecup);

    // ── Top status LCD screen ──
    const lcdBezel = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.01, 0.12), metalMat);
    lcdBezel.position.set(0.3, bodyY + 0.34, 0.16);
    g.add(lcdBezel);
    const lcdScreen = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.005, 0.09), new THREE.MeshPhysicalMaterial({ color: 0x111a22, metalness: 0, roughness: 0.05, emissive: 0x223355, emissiveIntensity: 0.03 }));
    lcdScreen.position.set(0.3, bodyY + 0.345, 0.16);
    g.add(lcdScreen);

    // ── Dials ──
    // Main mode dial (top left, near EVF)
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 0.03, 22), metalMat), -0.1, bodyY + 0.365, 0.16);
    add(new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.006, 6, 22), darkMetalMat), -0.1, bodyY + 0.365, 0.16);
    // Exposure dial (top right)
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.025, 20), metalMat), 0.55, bodyY + 0.36, 0.16);
    add(new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.005, 6, 20), darkMetalMat), 0.55, bodyY + 0.36, 0.16);
    // Rear dial (small, below)
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.018, 16), metalMat), 0.5, bodyY + 0.16, 0.22);

    // ── Shutter button ──
    const shutterBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.02, 14), darkMetalMat);
    shutterBtn.position.set(0.38, bodyY + 0.36, 0.18);
    g.add(shutterBtn);
    // Shutter surround
    add(new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.006, 6, 14), metalMat), 0.38, bodyY + 0.35, 0.18);

    // ── Hot shoe (smaller) ──
    add(new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.015, 0.06), metalMat), -0.05, bodyY + 0.4, -0.1);

    // ── Customizable button (Fn) ──
    add(new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.015, 0.015), darkMetalMat), -0.5, bodyY + 0.34, 0.18);

    // ── Lens mount (slightly larger relative to body) ──
    add(new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.02, 8, 28), darkMetalMat), 0, bodyY, 0.22);
    // Inner mount ring
    add(new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.012, 8, 28), metalMat), 0, bodyY, 0.235);

    const lensGroup = new THREE.Group();
    lensGroup.position.set(0, bodyY, 0.25);
    g.add(lensGroup);

    // ── Lens barrel segments (50mm f/1.2 GM / RF) ──
    // Mount base
    const lb1 = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.24, 0.06, 30), lensMat);
    lb1.rotation.x = Math.PI / 2; lensGroup.add(lb1);
    // Main barrel
    const lb2 = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.26, 30), lensMat);
    lb2.rotation.x = Math.PI / 2; lb2.position.z = 0.16; lensGroup.add(lb2);
    // Front barrel
    const lb3 = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.17, 0.05, 30), darkMetalMat);
    lb3.rotation.x = Math.PI / 2; lb3.position.z = 0.32; lensGroup.add(lb3);

    // ── Focus ring (wide, metallic) ──
    const frMat = new THREE.MeshPhysicalMaterial({ color: 0x2a2a30, metalness: 0.6, roughness: 0.35 });
    const fRing = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.18, 0.09, 30), frMat);
    fRing.rotation.x = Math.PI / 2; fRing.position.z = 0.07; lensGroup.add(fRing);
    // Focus ring ridges
    for (let i = 0; i < 20; i++) {
        const a = (i / 20) * Math.PI * 2;
        const rg = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.08, 0.017), darkMetalMat);
        rg.position.set(Math.cos(a) * 0.186, Math.sin(a) * 0.186, 0.07);
        rg.lookAt(0, 0, 0.07); lensGroup.add(rg);
    }

    // ── Gold ring ──
    add(new THREE.Mesh(new THREE.TorusGeometry(0.165, 0.006, 6, 28), goldMat), 0, bodyY, 0.36);

    // ── Crimson G-master / L-series ring ──
    const crimsonRingMat = new THREE.MeshPhysicalMaterial({ color: 0xcc2244, metalness: 0.25, roughness: 0.18, emissive: 0x881133, emissiveIntensity: 0.08 });
    add(new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.007, 6, 28), crimsonRingMat), 0, bodyY, 0.32);

    // ── Filter thread ──
    add(new THREE.Mesh(new THREE.TorusGeometry(0.175, 0.008, 6, 28), metalMat), 0, bodyY, 0.35);

    // ── Multi-coated front lens glass ──
    const frontGlass = new THREE.Mesh(new THREE.CircleGeometry(0.155, 36), glassMat);
    frontGlass.position.z = 0.36; lensGroup.add(frontGlass);

    // Inner glass (deeper reflection)
    const innerGlassMat = new THREE.MeshPhysicalMaterial({ color: 0x2244aa, metalness: 0, roughness: 0, transparent: true, opacity: 0.05, envMapIntensity: 6, side: THREE.DoubleSide });
    const innerGlass = new THREE.Mesh(new THREE.CircleGeometry(0.125, 32), innerGlassMat);
    innerGlass.position.z = 0.34; lensGroup.add(innerGlass);

    // Deepest glass layer (violet tint)
    const deepGlassMat = new THREE.MeshPhysicalMaterial({ color: 0x6622aa, metalness: 0, roughness: 0, transparent: true, opacity: 0.03, envMapIntensity: 4, side: THREE.DoubleSide });
    const deepGlass = new THREE.Mesh(new THREE.CircleGeometry(0.1, 28), deepGlassMat);
    deepGlass.position.z = 0.32; lensGroup.add(deepGlass);

    // ── Glass reflection highlights (multi-coated) ──
    // Blue reflection (large, top-right)
    const hBlue = new THREE.Mesh(new THREE.CircleGeometry(0.04, 16), new THREE.MeshBasicMaterial({ color: 0x4499ff, transparent: true, opacity: 0.2 }));
    hBlue.position.set(0.06, 0.055, 0.365); lensGroup.add(hBlue);
    // Crimson reflection (small, bottom-left)
    const hCrimson = new THREE.Mesh(new THREE.CircleGeometry(0.022, 12), new THREE.MeshBasicMaterial({ color: 0xff3366, transparent: true, opacity: 0.12 }));
    hCrimson.position.set(-0.045, -0.04, 0.365); lensGroup.add(hCrimson);
    // Violet reflection (medium, mid-right)
    const hViolet = new THREE.Mesh(new THREE.CircleGeometry(0.018, 10), new THREE.MeshBasicMaterial({ color: 0x8844ff, transparent: true, opacity: 0.09 }));
    hViolet.position.set(0.075, -0.015, 0.365); lensGroup.add(hViolet);
    // Amber reflection (tiny, bottom-right)
    const hAmber = new THREE.Mesh(new THREE.CircleGeometry(0.012, 8), new THREE.MeshBasicMaterial({ color: 0xff8844, transparent: true, opacity: 0.06 }));
    hAmber.position.set(0.035, -0.06, 0.365); lensGroup.add(hAmber);

    // ── Crimson glow ring on glass edge ──
    const glowRing = new THREE.Mesh(new THREE.RingGeometry(0.145, 0.155, 36), new THREE.MeshBasicMaterial({ color: 0xff2244, transparent: true, opacity: 0.07, side: THREE.DoubleSide, depthWrite: false }));
    glowRing.position.z = 0.361; lensGroup.add(glowRing);

    // ── Body details ──
    // AF assist light / sensor
    add(new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.01, 0.01), new THREE.MeshBasicMaterial({ color: 0x331111 })), -0.58, bodyY + 0.22, 0.22);
    // Brand text area (subtle bump)
    add(new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.008, 0.004), new THREE.MeshPhysicalMaterial({ color: 0x222228, metalness: 0.3, roughness: 0.4 })), 0.25, bodyY + 0.32, 0.22);
    // Strap lug (left)
    add(new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.008, 6, 10), darkMetalMat), -0.65, bodyY + 0.28, -0.2);
    // Strap lug (right)
    add(new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.008, 6, 10), darkMetalMat), 0.65, bodyY + 0.28, -0.2);
    // Front grip texture lines (subtle grooves)
    for (let i = 0; i < 4; i++) {
        const yy = bodyY - 0.08 + i * 0.05;
        add(new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.002, 0.1), new THREE.MeshPhysicalMaterial({ color: 0x050505, metalness: 0, roughness: 1 })), -0.58, yy, 0.15);
    }

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

// ── Typewriter effect (types, pauses, deletes, loops) ──
const tw = document.querySelector('.typewriter');
if (tw) {
    const text = tw.dataset.text || '';
    tw.textContent = '';
    let ti = 0, dir = 1;
    function twStep() {
        if (dir === 1) {
            tw.textContent += text[ti++];
            if (ti >= text.length) { dir = -1; setTimeout(twStep, 2200); return; }
        } else {
            tw.textContent = text.slice(0, --ti);
            if (ti <= 0) { dir = 1; setTimeout(twStep, 800); return; }
        }
        setTimeout(twStep, dir === 1 ? 70 : 35);
    }
    twStep();
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
