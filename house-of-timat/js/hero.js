/* 3D tailor's dress form, built from primitives (no model files needed) */
(() => {
  const cv = document.getElementById('hero3d');
  if (!cv || !window.THREE) { if (cv) cv.remove(); return; }
  const T = THREE, hero = cv.parentElement;
  const r = new T.WebGLRenderer({canvas: cv, alpha: true, antialias: true});
  r.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  const s = new T.Scene(), cam = new T.PerspectiveCamera(40, 1, .1, 50);
  cam.position.set(0, .6, 9);
  s.add(new T.AmbientLight(0xffffff, .55));
  const key = new T.DirectionalLight(0xffe6c0, 1.7); key.position.set(4, 6, 5); s.add(key);
  const rim = new T.PointLight(0xb08d57, 3, 20); rim.position.set(-4, 2, -3); s.add(rim);
  const ivory = new T.MeshStandardMaterial({color: 0xeadfce, roughness: .55, metalness: .05});
  const brass = new T.MeshStandardMaterial({color: 0xb08d57, roughness: .3, metalness: .9});

  const M = new T.Group();
  const prof = [[.001,0],[.8,.05],[.95,.5],[.75,1],[.8,1.5],[1.05,2.1],[1,2.5],[.7,2.85],[.3,3.05],[.001,3.1]].map(p => new T.Vector2(p[0], p[1]));
  const torso = new T.Mesh(new T.LatheGeometry(prof, 48), ivory); torso.scale.z = .65;
  const cap = new T.Mesh(new T.SphereGeometry(.12, 16, 16), brass); cap.position.y = 3.2;
  const pole = new T.Mesh(new T.CylinderGeometry(.07, .07, 2.3, 12), brass); pole.position.y = -1.15;
  const base = new T.Mesh(new T.CylinderGeometry(1.1, 1.2, .08, 40), brass); base.position.y = -2.3;
  const tape = new T.Mesh(new T.TorusGeometry(.8, .03, 8, 64), new T.MeshStandardMaterial({color: 0xe8c77a, roughness: .5}));
  tape.rotation.x = Math.PI / 2; tape.position.y = 1; tape.scale.y = .65;
  M.add(torso, cap, pole, base, tape); s.add(M);

  const fl = [], mk = (g, m, n) => { for (let i = 0; i < n; i++) {
    const o = new T.Mesh(g, m); o.position.set((Math.random() - .5) * 13, (Math.random() - .5) * 7, (Math.random() - .5) * 4 - 1);
    o.userData = {o: Math.random() * 6, v: .3 + Math.random() * .5}; fl.push(o); s.add(o); } };
  const btn = new T.CylinderGeometry(.16, .16, .05, 20); btn.rotateX(Math.PI / 2);
  mk(btn, brass, 8); mk(new T.CylinderGeometry(.012, .012, 1.1, 6), brass, 7); mk(new T.CylinderGeometry(.18, .18, .32, 16), ivory, 3);

  const N = 350, pa = new Float32Array(N * 3).map(() => (Math.random() - .5) * 16);
  const pg = new T.BufferGeometry(); pg.setAttribute('position', new T.BufferAttribute(pa, 3));
  s.add(new T.Points(pg, new T.PointsMaterial({color: 0xd9b97a, size: .035, transparent: true, opacity: .7})));

  function size() {
    const w = hero.clientWidth, h = hero.clientHeight; r.setSize(w, h, false);
    cam.aspect = w / h; cam.updateProjectionMatrix();
    const wide = w > 860; M.position.x = wide ? 3 : 0; M.scale.setScalar(wide ? .9 : .6); M.position.y = wide ? -.95 : -.2;
  }
  addEventListener('resize', size); size();
  let mx = 0, on = true, t0 = performance.now();
  addEventListener('pointermove', e => mx = e.clientX / innerWidth - .5);
  const still = matchMedia('(prefers-reduced-motion:reduce)').matches;
  function loop() {
    if (!on) return;
    const t = (performance.now() - t0) / 1000;
    M.rotation.y += (t * .4 + mx * .8 - M.rotation.y) * .05;
    fl.forEach(o => { o.rotation.x = t * o.userData.v; o.rotation.y = t * o.userData.v * .7; o.position.y += Math.sin(t * o.userData.v + o.userData.o) * .002; });
    r.render(s, cam);
    if (!still) requestAnimationFrame(loop);
  }
  new IntersectionObserver(e => { const was = on; on = e[0].isIntersecting; if (on && !was && !still) loop(); }).observe(hero);
  loop();
})();
