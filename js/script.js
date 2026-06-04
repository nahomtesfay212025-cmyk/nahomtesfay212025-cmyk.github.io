/* ============================================================
   NAHOM TESFAY — PORTFOLIO JAVASCRIPT
   ============================================================ */

const navToggle = document.getElementById("navToggle");
const navLinks  = document.getElementById("navLinks");
const navbar    = document.getElementById("navbar");

/* ---------- 1. MOBILE MENU ---------- */
navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  navToggle.classList.toggle("active");
  navToggle.setAttribute("aria-expanded", navLinks.classList.contains("open"));
});
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("active");
  });
});

/* ---------- 2. NAVBAR SHADOW ---------- */
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
});

/* ---------- 3. SCROLL REVEAL ---------- */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  observer.observe(el);
});

/* ---------- 4. FOOTER YEAR ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- 5. 3D ANIMATED SCENE: developer at a workstation ----------
   An artistic, stylized over-the-shoulder scene — a seated developer
   (dark curly hair, warm skin tone, dark blazer) typing at a 3-monitor
   setup with live scrolling code, neon lighting and floating bokeh.   */
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const W = () => window.innerWidth;
  const H = () => window.innerHeight;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x070b16, 0.045);

  const camera = new THREE.PerspectiveCamera(58, W() / H(), 0.1, 120);
  camera.position.set(0, 1.6, 6.2);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W(), H());
  renderer.setClearColor(0x000000, 0);

  /* ----- Colors (referenced from the photo, stylized) ----- */
  const SKIN  = 0x9c6b48;
  const HAIR  = 0x130d09;
  const SUIT  = 0x14161f;
  const SHIRT = 0xe9edf5;

  /* ----- Animated code screen (canvas texture) ----- */
  function makeCodeScreen() {
    const cv = document.createElement("canvas");
    cv.width = 256; cv.height = 320;
    const cx = cv.getContext("2d");
    const palette = ["#7c9cff", "#38e8c6", "#b478ff", "#ff7eb6", "#e6edf6", "#5fd17a"];
    const lineH = 14;
    const lines = [];
    function genLine() {
      const indent = (Math.random() * 5) | 0;
      const toks = [];
      let x = 8 + indent * 11;
      const segs = 1 + ((Math.random() * 4) | 0);
      for (let s = 0; s < segs; s++) {
        const w = 14 + Math.random() * 52;
        if (x + w > cv.width - 12) break;
        toks.push({ x, w, c: palette[(Math.random() * palette.length) | 0] });
        x += w + 9;
      }
      return toks;
    }
    for (let i = 0; i < 30; i++) lines.push(genLine());
    let scroll = 0;
    const tex = new THREE.CanvasTexture(cv);
    function update(dt) {
      scroll += dt * 26;
      while (scroll >= lineH) { scroll -= lineH; lines.push(genLine()); lines.shift(); }
      cx.fillStyle = "#0a0f1e"; cx.fillRect(0, 0, cv.width, cv.height);
      cx.fillStyle = "#10182c"; cx.fillRect(0, 0, cv.width, 16);
      const dots = ["#ff5f56", "#ffbd2e", "#27c93f"];
      dots.forEach((d, i) => { cx.fillStyle = d; cx.beginPath(); cx.arc(11 + i * 12, 8, 3, 0, 7); cx.fill(); });
      for (let i = 0; i < lines.length; i++) {
        const y = 26 + i * lineH - scroll;
        if (y < 20 || y > cv.height - 4) continue;
        for (const t of lines[i]) { cx.fillStyle = t.c; cx.fillRect(t.x, y, t.w, 5); }
      }
      tex.needsUpdate = true;
    }
    update(0);
    return { tex, update };
  }

  /* ----- Monitor builder ----- */
  const codeScreens = [];
  function makeMonitor(x, y, z, ry, sw, sh) {
    const g = new THREE.Group();
    const bezel = new THREE.Mesh(
      new THREE.BoxGeometry(sw + 0.18, sh + 0.18, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x0a0c12, roughness: 0.5, metalness: 0.4 })
    );
    g.add(bezel);
    const cs = makeCodeScreen();
    codeScreens.push(cs);
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(sw, sh),
      new THREE.MeshBasicMaterial({ map: cs.tex })
    );
    screen.position.z = 0.07;
    g.add(screen);
    const stand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.07, y - 0.05, 10),
      new THREE.MeshStandardMaterial({ color: 0x0a0c12, roughness: 0.5, metalness: 0.5 })
    );
    stand.position.y = -(sh / 2) - (y - 0.05) / 2 + 0.02;
    g.add(stand);
    g.position.set(x, y, z);
    g.rotation.y = ry;
    scene.add(g);
  }
  makeMonitor(0,    1.15, -1.5,  0.00, 2.5, 1.5);
  makeMonitor(-2.85, 1.05, -0.95, 0.42, 2.2, 1.35);
  makeMonitor(2.85,  1.05, -0.95, -0.42, 2.2, 1.35);

  /* ----- Desk ----- */
  const desk = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.28, 3.2),
    new THREE.MeshStandardMaterial({ color: 0x171a24, roughness: 0.7, metalness: 0.2 })
  );
  desk.position.set(0, -0.05, -0.2);
  scene.add(desk);

  /* ----- Keyboard ----- */
  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.06, 0.66),
    new THREE.MeshStandardMaterial({ color: 0x0e1016, roughness: 0.6, metalness: 0.3 })
  );
  keyboard.position.set(0, 0.12, 0.55);
  scene.add(keyboard);

  /* ----- Developer (over-the-shoulder, original stylized character) ----- */
  const dev = new THREE.Group();
  dev.position.set(0, 0, 1.75);

  const matSkin  = new THREE.MeshStandardMaterial({ color: SKIN, roughness: 0.65 });
  const matHair  = new THREE.MeshStandardMaterial({ color: HAIR, roughness: 0.9 });
  const matSuit  = new THREE.MeshStandardMaterial({ color: SUIT, roughness: 0.7, metalness: 0.1 });
  const matShirt = new THREE.MeshStandardMaterial({ color: SHIRT, roughness: 0.8 });

  // torso (slightly hunched forward toward keyboard)
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.78, 1.35, 18), matSuit);
  torso.position.set(0, 0.55, 0);
  torso.rotation.x = -0.14;
  dev.add(torso);

  // collar / shirt hint at the neckline
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.22, 14), matShirt);
  collar.position.set(0, 1.18, -0.05);
  dev.add(collar);

  // neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.2, 0.3, 12), matSkin);
  neck.position.set(0, 1.3, -0.03);
  dev.add(neck);

  // head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 24), matSkin);
  head.position.set(0, 1.68, -0.02);
  dev.add(head);

  // curly hair: many small clustered spheres over the back/top of the head
  const hairBall = new THREE.SphereGeometry(0.12, 8, 8);
  const hc = new THREE.Vector3(0, 1.7, -0.04);
  for (let i = 0; i < 60; i++) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI * 0.62; // upper hemisphere
    const r = 0.4;
    const px = Math.sin(v) * Math.cos(u) * r;
    const py = Math.cos(v) * r;
    const pz = Math.sin(v) * Math.sin(u) * r;
    if (pz > 0.18) continue; // leave the face (front) bare
    const curl = new THREE.Mesh(hairBall, matHair);
    curl.position.set(hc.x + px, hc.y + py * 0.95, hc.z + pz);
    const s = 0.7 + Math.random() * 0.7;
    curl.scale.setScalar(s);
    dev.add(curl);
  }

  // shoulders + arms reaching to the keyboard
  const arms = [];
  [-1, 1].forEach((side) => {
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 12), matSuit);
    shoulder.position.set(side * 0.6, 0.95, 0);
    dev.add(shoulder);

    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 1.25, 12), matSuit);
    arm.position.set(side * 0.66, 0.5, -0.62);
    arm.rotation.x = -1.15; // angle forward-down toward desk
    dev.add(arm);

    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.32), matSkin);
    hand.position.set(side * 0.45, 0.2, -1.18);
    dev.add(hand);
    arms.push(hand);
  });

  // chair back
  const chair = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.7, 0.22),
    new THREE.MeshStandardMaterial({ color: 0x0c0e15, roughness: 0.8 })
  );
  chair.position.set(0, 0.65, 0.62);
  dev.add(chair);

  scene.add(dev);

  /* ----- Floor grid ----- */
  const grid = new THREE.GridHelper(60, 60, 0x2a4f7a, 0x16233c);
  grid.position.y = -1.0;
  grid.material.transparent = true;
  grid.material.opacity = 0.25;
  scene.add(grid);

  /* ----- Floating bokeh particles ----- */
  const bokeh = [];
  [0x6ea8ff, 0x38e8c6, 0xb478ff, 0xff7eb6].forEach((c) => {
    const n = 70;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = Math.random() * 16 - 2;
      pos[i * 3 + 2] = -Math.random() * 30 - 2;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: c, size: 0.5, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);
    bokeh.push(pts);
  });

  /* ----- Lighting ----- */
  scene.add(new THREE.AmbientLight(0x35425e, 0.7));
  const screenGlow = new THREE.PointLight(0x7fa8ff, 1.8, 16, 2);
  screenGlow.position.set(0, 1.3, -0.4);
  scene.add(screenGlow);
  const tealL = new THREE.PointLight(0x38e8c6, 0.8, 18, 2); tealL.position.set(-4, 1.6, 1.5); scene.add(tealL);
  const purpL = new THREE.PointLight(0xb478ff, 0.8, 18, 2); purpL.position.set(4, 1.8, 1.5); scene.add(purpL);
  const rimL  = new THREE.PointLight(0xff7eb6, 0.7, 16, 2); rimL.position.set(0, 2.4, 3.4); scene.add(rimL);
  const topL  = new THREE.DirectionalLight(0xbfd0ff, 0.4); topL.position.set(0, 6, 4); scene.add(topL);

  /* ----- Mouse parallax ----- */
  let mx = 0, my = 0;
  window.addEventListener("mousemove", (e) => { mx = e.clientX / W() - 0.5; my = e.clientY / H() - 0.5; });

  /* ----- Animate ----- */
  const clock = new THREE.Clock();
  function animate() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    codeScreens.forEach((cs) => cs.update(dt));

    // typing hands
    arms.forEach((hand, i) => { hand.position.y = 0.2 + Math.abs(Math.sin(t * 7 + i * 1.7)) * 0.05; });
    // subtle breathing
    dev.position.y = Math.sin(t * 1.1) * 0.015;
    head.rotation.y = Math.sin(t * 0.5) * 0.08;

    // bokeh drift + twinkle
    bokeh.forEach((b, i) => {
      b.rotation.y = t * 0.03 * (i % 2 ? 1 : -1);
      b.material.opacity = 0.35 + Math.sin(t * 1.3 + i) * 0.2;
    });

    // screen light flicker (like changing code)
    screenGlow.intensity = 1.7 + Math.sin(t * 9) * 0.18;

    // camera gentle sway + mouse parallax (kept subtle to hold the framing)
    const tx = mx * 1.1 + Math.sin(t * 0.25) * 0.4;
    const ty = 1.6 - my * 0.7 + Math.cos(t * 0.2) * 0.15;
    camera.position.x += (tx - camera.position.x) * 0.04;
    camera.position.y += (ty - camera.position.y) * 0.04;
    camera.lookAt(0, 0.75, -1);

    renderer.render(scene, camera);
    if (!reduced) requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = W() / H();
    camera.updateProjectionMatrix();
    renderer.setSize(W(), H());
  });
})();
