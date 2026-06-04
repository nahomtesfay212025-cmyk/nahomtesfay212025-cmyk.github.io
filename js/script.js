/* ============================================================
   NAHOM TESFAY — PORTFOLIO JAVASCRIPT
   Runs after the page loads. Each block is one small feature.
   ============================================================ */

// Grab the elements we need from the page by their id
const navToggle = document.getElementById("navToggle");
const navLinks  = document.getElementById("navLinks");
const navbar    = document.getElementById("navbar");

/* ---------- 1. MOBILE MENU: open/close on tap ---------- */
navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");     // show/hide the menu
  navToggle.classList.toggle("active");  // animate hamburger into an X
  const isOpen = navLinks.classList.contains("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

// Close the menu after clicking a link (nice on phones)
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("active");
  });
});

/* ---------- 2. NAVBAR SHADOW after scrolling down ---------- */
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 20);
});

/* ---------- 3. SCROLL REVEAL animations ----------
   IntersectionObserver watches each ".reveal" element and adds
   the "visible" class the moment it scrolls into view. */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // animate once, then stop watching
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 80}ms`; // slight stagger for a nicer effect
  observer.observe(el);
});

/* ---------- 4. AUTO-UPDATE the year in the footer ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- 5. ANIMATED TECH BACKGROUND (glowing particle network) ----------
   Draws drifting dots that connect with glowing lines and react to the mouse.
   Wrapped in its own function so its variables don't leak into the page. */
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Respect users who prefer less motion (accessibility)
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let w, h, particles;
  const mouse = { x: null, y: null };

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  // Create dots — more on big screens, fewer on phones (keeps it fast)
  function makeParticles() {
    const count = Math.min(90, Math.floor((w * h) / 16000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 1.8 + 0.6,
    }));
  }

  function render() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // move the dot (skip if user prefers reduced motion)
      if (!reduced) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }

      // glowing line to nearby dots
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 130) {
          ctx.strokeStyle = `rgba(79,140,255,${(1 - dist / 130) * 0.18})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }

      // teal line toward the mouse (interactive, gaming feel)
      if (mouse.x !== null) {
        const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (dist < 170) {
          ctx.strokeStyle = `rgba(56,232,198,${(1 - dist / 170) * 0.4})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }

      // the glowing dot itself
      ctx.beginPath();
      ctx.fillStyle = "rgba(130,185,255,0.9)";
      ctx.shadowColor = "rgba(79,140,255,0.9)";
      ctx.shadowBlur = 8;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    if (!reduced) requestAnimationFrame(render);
  }

  resize();
  makeParticles();
  render(); // animates continuously, or draws one static frame if reduced-motion

  window.addEventListener("resize", () => { resize(); makeParticles(); });
  window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener("mouseout", () => { mouse.x = mouse.y = null; });
})();
