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
renderer.toneMappingExposure = 1.3;
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

function buildDSLRCamera() {
    const g = new THREE.Group();

    const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0x1a1a1a, metalness: 0.15, roughness: 0.55, clearcoat: 0.05 });
    const gripMat = new THREE.MeshPhysicalMaterial({ color: 0x0d0d0d, metalness: 0, roughness: 0.95 });
    const metalMat = new THREE.MeshPhysicalMaterial({ color: 0x444455, metalness: 0.85, roughness: 0.15, envMapIntensity: 1.5 });
    const darkMetalMat = new THREE.MeshPhysicalMaterial({ color: 0x2a2a3a, metalness: 0.9, roughness: 0.1, envMapIntensity: 1.8 });
    const lensMat = new THREE.MeshPhysicalMaterial({ color: 0x1a1a2a, metalness: 0.7, roughness: 0.25, envMapIntensity: 1.3 });
    const goldMat = new THREE.MeshPhysicalMaterial({ color: 0x8a7a4a, metalness: 0.6, roughness: 0.2, envMapIntensity: 1.2 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x2244aa, metalness: 0, roughness: 0, transparent: true, opacity: 0.12, envMapIntensity: 3, side: THREE.DoubleSide });

    function add(m, x, y, z) { m.position.set(x, y, z); g.add(m); return m; }

    // ── Main body ──
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.72, 0.55), bodyMat);
    body.position.y = 0.05;
    body.castShadow = true; body.receiveShadow = true;
    g.add(body);

    // ── Pentaprism hump ──
    const prism = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.12, 0.28), darkMetalMat);
    prism.position.set(0, 0.8, -0.1);
    g.add(prism);
    const prismTop = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.22), metalMat);
    prismTop.position.set(0, 0.86, -0.1);
    g.add(prismTop);

    // ── Rubber grip (left side for 3/4 view) ──
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.08), gripMat);
    grip.position.set(-0.72, 0.05, 0);
    g.add(grip);
    const gripR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.4, 0.05), gripMat);
    gripR.position.set(0.72, 0.08, 0);
    g.add(gripR);

    // ── Bottom plate ──
    add(new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.03, 0.5), metalMat), 0, -0.31, 0);
    // Tripod mount
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.02, 12), darkMetalMat), 0, -0.33, 0);

    // ── Top dials ──
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.035, 20), metalMat), -0.4, 0.84, 0.15);
    add(new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.007, 6, 20), darkMetalMat), -0.4, 0.84, 0.15);
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.025, 18), metalMat), 0.45, 0.84, 0.12);
    // Shutter button
    add(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.025, 14), darkMetalMat), 0.35, 0.84, 0.12);

    // ── Hot shoe ──
    add(new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.02, 0.08), metalMat), 0, 0.88, -0.15);

    // ── Viewfinder ──
    add(new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.035, 0.05), new THREE.MeshPhysicalMaterial({ color: 0x050505, metalness: 0, roughness: 0.1 })), 0, 0.85, -0.27);

    // ── Body bevels / edges ──
    add(new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.01, 0.52), new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.2, roughness: 0.6 })), 0, 0.41, 0);

    // ── Lens mount ──
    add(new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.02, 8, 28), darkMetalMat), 0, 0.05, 0.28);
    const lensGroup = new THREE.Group();
    lensGroup.position.set(0, 0.05, 0.3);
    g.add(lensGroup);

    // ── Lens barrel segments ──
    const lb1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.23, 0.07, 28), lensMat);
    lb1.rotation.x = Math.PI / 2; lensGroup.add(lb1);
    const lb2 = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.28, 28), lensMat);
    lb2.rotation.x = Math.PI / 2; lb2.position.z = 0.18; lensGroup.add(lb2);
    const lb3 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.16, 0.05, 28), darkMetalMat);
    lb3.rotation.x = Math.PI / 2; lb3.position.z = 0.34; lensGroup.add(lb3);

    // ── Focus ring (ridged rubber) ──
    const frMat = new THREE.MeshPhysicalMaterial({ color: 0x2a2a2a, metalness: 0.05, roughness: 0.85 });
    const fRing = new THREE.Mesh(new THREE.CylinderGeometry(0.175, 0.17, 0.08, 28), frMat);
    fRing.rotation.x = Math.PI / 2; fRing.position.z = 0.08; lensGroup.add(fRing);
    for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2;
        const rg = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.07, 0.015), darkMetalMat);
        rg.position.set(Math.cos(a) * 0.176, Math.sin(a) * 0.176, 0.08);
        rg.lookAt(0, 0, 0.08); lensGroup.add(rg);
    }

    // ── Gold accent ring ──
    add(new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.007, 6, 28), goldMat), 0, 0.05, 0.38);

    // ── Crimson L-series ring ──
    const crimsonRingMat = new THREE.MeshPhysicalMaterial({ color: 0xcc2244, metalness: 0.3, roughness: 0.2, emissive: 0x881133, emissiveIntensity: 0.05 });
    add(new THREE.Mesh(new THREE.TorusGeometry(0.185, 0.008, 6, 28), crimsonRingMat), 0, 0.05, 0.34);

    // ── Filter thread ──
    add(new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.009, 6, 28), metalMat), 0, 0.05, 0.37);

    // ── Front lens glass (multi-coated) ──
    const frontGlass = new THREE.Mesh(new THREE.CircleGeometry(0.15, 32), glassMat);
    frontGlass.position.z = 0.38; lensGroup.add(frontGlass);

    // Inner glass with deeper reflection
    const innerGlassMat = new THREE.MeshPhysicalMaterial({ color: 0x3355bb, metalness: 0, roughness: 0, transparent: true, opacity: 0.06, envMapIntensity: 5, side: THREE.DoubleSide });
    const innerGlass = new THREE.Mesh(new THREE.CircleGeometry(0.12, 32), innerGlassMat);
    innerGlass.position.z = 0.36; lensGroup.add(innerGlass);

    // ── Glass reflection highlights ──
    const h1 = new THREE.Mesh(new THREE.CircleGeometry(0.035, 16), new THREE.MeshBasicMaterial({ color: 0x4488ff, transparent: true, opacity: 0.18 }));
    h1.position.set(0.05, 0.05, 0.39); lensGroup.add(h1);
    const h2 = new THREE.Mesh(new THREE.CircleGeometry(0.02, 12), new THREE.MeshBasicMaterial({ color: 0xff4488, transparent: true, opacity: 0.1 }));
    h2.position.set(-0.04, -0.035, 0.39); lensGroup.add(h2);
    const h3 = new THREE.Mesh(new THREE.CircleGeometry(0.015, 10), new THREE.MeshBasicMaterial({ color: 0x8844ff, transparent: true, opacity: 0.08 }));
    h3.position.set(0.07, -0.02, 0.39); lensGroup.add(h3);

    // ── Small details ──
    // AF assist / brand area
    add(new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.012, 0.01), new THREE.MeshBasicMaterial({ color: 0x441a1a })), -0.62, 0.25, 0.28);
    add(new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.012, 0.005), new THREE.MeshPhysicalMaterial({ color: 0x2a2a2a, metalness: 0.4, roughness: 0.3 })), 0.3, 0.25, 0.28);
    // Flash sync port
    add(new THREE.Mesh(new THREE.CircleGeometry(0.02, 12), new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.6, roughness: 0.2 })), -0.35, 0.22, 0.28);

    return g;
}

const camModel = buildDSLRCamera();
camModel.position.y = 0.05;
camModel.rotation.y = -0.3;
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
controls.target.set(0, 0.08, 0);
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
