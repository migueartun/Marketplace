import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const container = document.getElementById('canvas-container');
const loaderEl = document.getElementById('loader');
const w = window.innerWidth, h = window.innerHeight;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

const cam = new THREE.PerspectiveCamera(30, w / h, 0.1, 100);
cam.position.set(4, 1.8, 5.2);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
renderer.setSize(w, h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

scene.add(new THREE.HemisphereLight(0x7c5cfc, 0x14141f, 0.6));
const key = new THREE.DirectionalLight(0xffeedd, 4);
key.position.set(5, 7, 4);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
scene.add(key);
const fill = new THREE.DirectionalLight(0x7c5cfc, 0.8);
fill.position.set(-4, 1, 3);
scene.add(fill);
const rim = new THREE.DirectionalLight(0x00d4aa, 0.3);
rim.position.set(0, -2, -5);
scene.add(rim);

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.ShadowMaterial({ opacity: 0.08, color: 0x000000 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.55;
floor.receiveShadow = true;
scene.add(floor);

function buildCamera() {
    const g = new THREE.Group();
    const mat = (c, m, r) => new THREE.MeshPhysicalMaterial({ color: c, metalness: m, roughness: r, envMapIntensity: 1.3 });
    function add(m, x, y, z) { m.position.set(x, y, z); g.add(m); return m; }
    function addR(m, x, y, z, rx, ry, rz) { m.position.set(x, y, z); m.rotation.set(rx, ry, rz); g.add(m); return m; }

    const body = add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.7, 0.7), mat(0x36364d, 0.4, 0.4)), 0, 0, 0);
    body.castShadow = true;
    add(new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.12, 0.35), mat(0x26263a, 0.35, 0.45)), 0, -0.08, -0.37);
    add(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.45), mat(0x1c1c2a, 0.05, 0.9)), 0.52, 0, -0.02);

    for (let i = 0; i < 5; i++)
        add(new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.35, 0.38), mat(0x14141f, 0.1, 0.8)), 0.68, 0.04, -0.03 + (i - 2) * 0.08);

    add(new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.04, 0.6), mat(0x5a5a7a, 0.5, 0.3)), 0, 0.33, 0);
    add(new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.26, 0.36), mat(0x36364d, 0.35, 0.45)), -0.2, 0.46, 0.02);
    add(new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.1, 0.04), mat(0x36364d, 0.35, 0.45)), -0.2, 0.39, -0.19);
    add(new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.1, 0.04), mat(0x36364d, 0.35, 0.45)), -0.2, 0.39, 0.23);
    add(new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.035, 0.09), mat(0x7a7a9a, 0.6, 0.25)), -0.2, 0.62, 0.02);
    add(new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.02, 0.05), mat(0xa0a0b8, 0.7, 0.2)), -0.2, 0.65, 0.02);
    add(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.07), mat(0x26263a, 0.35, 0.45)), -0.2, 0.47, 0.23);

    add(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.04, 24), mat(0x5a5a7a, 0.5, 0.3)), -0.43, 0.38, 0.17);
    add(new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.012, 6, 22), mat(0x7a7a9a, 0.6, 0.25)), -0.43, 0.375, 0.17);
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.02, 18), mat(0x5a5a7a, 0.5, 0.3)), 0.42, 0.37, 0.19);
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.065, 0.03, 18), mat(0x7a7a9a, 0.6, 0.2)), 0.42, 0.395, 0.19);
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.07, 0.035, 18), mat(0x5a5a7a, 0.5, 0.3)), 0.32, 0.37, 0.21);
    add(new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.015, 0.12), mat(0x14141f, 0, 0.1)), 0.15, 0.345, 0.19);
    add(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.018, 0.1), mat(0x26263a, 0.35, 0.35)), 0.24, 0.35, 0.02);

    addR(new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.035, 36), mat(0x26263a, 0.6, 0.25)), -0.18, 0, -0.37, Math.PI / 2, 0, 0);
    addR(new THREE.Mesh(new THREE.RingGeometry(0.26, 0.4, 36), mat(0x1c1c2a, 0.7, 0.2)), -0.18, 0, -0.35, -Math.PI / 2, 0, 0);

    const lens = new THREE.Group();
    lens.position.set(-0.18, 0, -0.35);
    function la(m, pz) { m.position.z = pz; lens.add(m); return m; }
    function lar(m, pz) { m.rotation.x = Math.PI / 2; m.position.z = pz; lens.add(m); return m; }
    lar(new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.4, 0.14, 32), mat(0x26263a, 0.35, 0.45)), -0.07);
    lar(new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.36, 0.22, 32), mat(0x1c1c2a, 0.3, 0.5)), -0.25);
    lar(new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.32, 0.16, 32), mat(0x26263a, 0.25, 0.55)), -0.44);
    la(new THREE.Mesh(new THREE.TorusGeometry(0.37, 0.03, 8, 36), mat(0x5a5a7a, 0.4, 0.4)), -0.12);

    for (let i = 0; i < 20; i++) {
        const a = (i / 20) * Math.PI * 2;
        const rib = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.03, 0.035), mat(0x5a5a7a, 0.4, 0.4));
        rib.position.set(Math.cos(a) * 0.385, Math.sin(a) * 0.385, -0.12);
        rib.lookAt(0, 0, -0.12); lens.add(rib);
    }
    la(new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.02, 8, 34), mat(0x36364d, 0.35, 0.45)), -0.34);
    for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2;
        const bp = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 6), mat(0x36364d, 0.35, 0.45));
        bp.position.set(Math.cos(a) * 0.345, Math.sin(a) * 0.345, -0.34); lens.add(bp);
    }
    la(new THREE.Mesh(new THREE.TorusGeometry(0.275, 0.008, 6, 28), mat(0x5a5a7a, 0.5, 0.25)), -0.52);
    const gr = la(new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.018, 6, 28), mat(0x7c5cfc, 0.7, 0.15)), -0.53);
    gr.material.emissive = new THREE.Color(0x7c5cfc); gr.material.emissiveIntensity = 0.2;

    const fg = new THREE.MeshPhysicalMaterial({ color: 0x00d4aa, metalness: 0, roughness: 0, transparent: true, opacity: 0.15, envMapIntensity: 2, side: THREE.DoubleSide });
    la(new THREE.Mesh(new THREE.CircleGeometry(0.2, 32), fg), -0.55);
    la(new THREE.Mesh(new THREE.CircleGeometry(0.16, 28), new THREE.MeshPhysicalMaterial({ color: 0x14141f, metalness: 0.35, roughness: 0.3, side: THREE.DoubleSide })), -0.545);
    la(new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.01, 6, 28), mat(0x5a5a7a, 0.6, 0.2)), -0.54);
    const rd = new THREE.Mesh(new THREE.CircleGeometry(0.035, 12), new THREE.MeshBasicMaterial({ color: 0x7c5cfc, transparent: true, opacity: 0.3 }));
    rd.position.set(0.05, 0.05, -0.548); lens.add(rd);
    g.add(lens);

    add(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.018, 0.018), mat(0x5a5a7a, 0.5, 0.25)), -0.53, 0.17, -0.37);
    add(new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.018, 0.018), mat(0xff6b9d, 0.25, 0.3)), 0.33, -0.06, -0.37);
    add(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.015), mat(0x14141f, 0, 0.05)), -0.05, 0.04, 0.37);
    add(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.015, 0.015), mat(0x00d4aa, 0.5, 0.2)), -0.53, 0.29, -0.27);
    add(new THREE.Mesh(new THREE.CircleGeometry(0.012, 10), new THREE.MeshBasicMaterial({ color: 0x7c5cfc })), -0.58, 0.24, -0.26);

    return g;
}

const camModel = buildCamera();
camModel.position.y = 0.15;
camModel.rotation.y = 0.3;
scene.add(camModel);

const pCount = 500;
const pos = new Float32Array(pCount * 3);
for (let i = 0; i < pCount * 3; i++) pos[i] = (Math.random() - 0.5) * 12;
const particles = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pos, 3)),
    new THREE.PointsMaterial({ color: 0x7c5cfc, size: 0.008, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, sizeAttenuation: true })
);
scene.add(particles);

const controls = new OrbitControls(cam, renderer.domElement);
controls.target.set(0, 0.08, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.2;
controls.minDistance = 2.5;
controls.maxDistance = 8;
controls.update();

const gltfLoader = new GLTFLoader();
gltfLoader.load(
    'https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models@master/2.0/VintageCamera/glTF-Binary/VintageCamera.glb',
    (gltf) => {
        const m = gltf.scene;
        m.scale.set(1.6, 1.6, 1.6);
        m.traverse(n => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } });
        const box = new THREE.Box3().setFromObject(m);
        const c = box.getCenter(new THREE.Vector3());
        m.position.sub(c);
        m.position.y = 0.12;
        scene.remove(camModel);
        scene.add(m);
    },
    undefined,
    () => {}
);

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

if (cameraBtn && cameraOverlay) {
    let shooting = false;

    cameraBtn.addEventListener('click', () => {
        if (shooting) return;
        shooting = true;

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

        // Phase 5 — Shutter fires
        setTimeout(() => {
            cameraAperture.classList.remove('active');
            shutterTop.classList.add('active');
            shutterBottom.classList.add('active');
            progressText.textContent = 'CAPTURANDO';
        }, 2100);

        // Phase 6 — Flash + reveal
        setTimeout(() => {
            cameraFlash.classList.add('active');
            shutterTop.classList.remove('active');
            shutterBottom.classList.remove('active');
            progressText.textContent = '\u2713 LISTO';
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
    const pp = particles.geometry.attributes.position.array;
    for (let i = 0; i < pCount; i++) {
        pp[i * 3 + 1] += Math.sin(t * 0.2 + i * 0.01) * 0.0003;
        pp[i * 3] += Math.cos(t * 0.15 + i * 0.015) * 0.0002;
    }
    particles.geometry.attributes.position.needsUpdate = true;
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
