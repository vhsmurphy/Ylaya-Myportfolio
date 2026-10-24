document.documentElement.classList.add('js');
// 1. Intro monogram, then reveal
window.addEventListener('load', () => setTimeout(() => document.getElementById('intro').classList.add('hide'), 2200));

// 2. Name: letters resolve from blur to sharp, one by one
let idx = 0;
document.querySelectorAll('.ln').forEach(l => {
  [...l.dataset.text].forEach(c => {
    const s = document.createElement('span'); s.className = 'ch'; s.style.setProperty('--i', idx++);
    s.textContent = c; l.appendChild(s);
  });
});

// 3. Objective: words come into focus as you scroll
const q = document.getElementById('quote');
q.innerHTML = q.textContent.split(' ').map(w => `<span class="w">${w}</span>`).join(' ');
const wEls = [...q.querySelectorAll('.w')];

// 4. Reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 3) * 120 + 'ms'; io.observe(el); });

// 5. Scroll: left gold spine + objective focus
const spine = document.getElementById('spine');
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  spine.style.height = scrollY / max * 100 + '%';
  const r = q.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (r.height + innerHeight * .25)));
  wEls.forEach((w, i) => w.classList.toggle('on', i / wEls.length < p));
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();

// 6. Ring cursor
const ring = document.getElementById('ring');
addEventListener('mousemove', e => { ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px'; });
document.querySelectorAll('a,.rows li,.index li,.folio,.photo,.rec,.why-list p').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('big'));
  el.addEventListener('mouseleave', () => ring.classList.remove('big'));
});

// 7. Magnetic icons
document.querySelectorAll('.magnetic').forEach(m => {
  m.addEventListener('mousemove', e => { const b = m.getBoundingClientRect(); m.style.transform = `translate(${(e.clientX - b.left - b.width / 2) * .35}px,${(e.clientY - b.top - b.height / 2) * .35}px)`; });
  m.addEventListener('mouseleave', () => m.style.transform = '');
});

// 8. 3D tilt on academic folios
document.querySelectorAll('.tilt').forEach(c => {
  c.addEventListener('mousemove', e => {
    const b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
    c.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  });
  c.addEventListener('mouseleave', () => c.style.transform = '');
});

// 9. Hero parallax: name and portrait drift apart slightly
const hl = document.querySelector('.h-name.l'), hr = document.querySelector('.h-name.r'), cam = document.querySelector('.cameo');
addEventListener('scroll', () => {
  const y = Math.min(scrollY, innerHeight);
  hl.style.transform = `translateX(${-y * .15}px)`; hr.style.transform = `translateX(${y * .15}px)`; cam.style.transform = `translateY(${y * .12}px)`;
}, { passive: true });

// 10. Spotlight that follows the cursor on dark sections
document.querySelectorAll('.green,.ink').forEach(s => s.addEventListener('mousemove', e => {
  const b = s.getBoundingClientRect(); s.style.setProperty('--mx', e.clientX - b.left + 'px'); s.style.setProperty('--my', e.clientY - b.top + 'px');
}));

// 11. Floating gold dust in the hero (reacts to the mouse)
const cv = document.getElementById('dust'), cx = cv.getContext('2d'), hero = document.getElementById('home');
let W, H, mx = -999, my = -999; const dust = [];
function fit() { W = cv.width = hero.offsetWidth; H = cv.height = hero.offsetHeight; }
fit(); addEventListener('resize', fit);
hero.addEventListener('mousemove', e => { const b = hero.getBoundingClientRect(); mx = e.clientX - b.left; my = e.clientY - b.top; });
for (let i = 0; i < 70; i++) dust.push({ x: Math.random() * 1600, y: Math.random() * 900, r: Math.random() * 1.8 + .4, v: Math.random() * .35 + .1, a: Math.random() * .5 + .2 });
(function loop() {
  cx.clearRect(0, 0, W, H);
  dust.forEach(d => {
    d.y -= d.v; if (d.y < -5) { d.y = H + 5; d.x = Math.random() * W; }
    const dx = d.x - mx, dy = d.y - my, dist = Math.hypot(dx, dy);
    if (dist < 110) { d.x += dx / dist * 1.6; d.y += dy / dist * 1.6; }
    cx.beginPath(); cx.arc(d.x, d.y, d.r, 0, 7); cx.fillStyle = `rgba(227,210,172,${d.a})`; cx.shadowBlur = 8; cx.shadowColor = '#B08D57'; cx.fill();
  });
  requestAnimationFrame(loop);
})();

// 12. Education record: reveal when it scrolls into view
const rec = document.getElementById('record');
function checkRec() { if (rec.getBoundingClientRect().top < innerHeight * .85) { rec.classList.add('go'); removeEventListener('scroll', checkRec); } }
addEventListener('scroll', checkRec, { passive: true }); addEventListener('load', checkRec); checkRec();