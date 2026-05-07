(() => {
  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function startAsh(canvas) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return () => {};

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;

    const countBase = 90;
    const parts = [];

    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.floor(countBase * clamp(w / 1200, 0.65, 1.25));
      while (parts.length < target) parts.push(spawn(true));
      while (parts.length > target) parts.pop();
    }

    function spawn(initial = false) {
      const size = 0.6 + Math.random() * 1.8;
      const x = Math.random() * (w || 1);
      const y = initial ? Math.random() * (h || 1) : (h || 1) + 20;
      const vx = (Math.random() - 0.5) * 0.35;
      const vy = -(0.25 + Math.random() * 0.75);
      const a = 0.28 + Math.random() * 0.55;
      const rot = Math.random() * Math.PI * 2;
      const vr = (Math.random() - 0.5) * 0.02;
      return { x, y, vx, vy, size, a, rot, vr };
    }

    function step() {
      if (!running) return;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.9)";

      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;

        // subtle drift
        p.vx += (Math.random() - 0.5) * 0.01;
        p.vx = clamp(p.vx, -0.55, 0.55);

        if (p.y < -30 || p.x < -40 || p.x > w + 40) {
          parts[i] = spawn(false);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.a;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillRect(-p.size * 0.5, -p.size * 2.2, p.size, p.size * 4.4);
        ctx.restore();
      }

      raf = requestAnimationFrame(step);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("resize", resize, { passive: true });
    resize();
    step();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
  }

  window.__startAshParticles = (root = document) => {
    const canvas = root.querySelector?.('[data-particles="canvas"]');
    if (!canvas) return () => {};
    return startAsh(canvas);
  };
})();

