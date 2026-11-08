let canvas = document.querySelector('.effects');
if (!canvas) {
  canvas = document.createElement('canvas');
  canvas.className = 'effects';
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;';
  const hero = document.querySelector('.hero') || document.body;
  hero.appendChild(canvas);
}

const ctx = canvas.getContext('2d');
const season = document.body.dataset.season || 'spring';
const $ = (s) => document.querySelector(s);
const palettes = {
  spring: { accent: '#f4a8c0', color: '#f8b2c9' },
  summer: { accent: '#7fd7d2', color: '#d6efae' },
  autumn: { accent: '#e9aa68', color: '#f2b270' },
  winter: { accent: '#9fd5ef', color: '#f4fbff' },
};
const count = { spring: 34, summer: 18, autumn: 28, winter: 42 }[season] || 30;
const particles = Array.from({ length: count }, (_, i) => ({
  x: Math.random() * 1600,
  y: Math.random() * 900,
  s: 1.5 + Math.random() * 4,
  v: 0.18 + Math.random() * 0.55,
  r: Math.random() * 6,
  p: Math.random() * Math.PI * 2,
}));

function resize() {
  const r = canvas.getBoundingClientRect();
  const d = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = r.width * d;
  canvas.height = r.height * d;
  ctx.setTransform(canvas.width / 1600, 0, 0, canvas.height / 900, 0, 0);
}

function draw(now) {
  resize();
  ctx.clearRect(0, 0, 1600, 900);
  const t = now / 1000;
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = palettes[season].color;

  for (const p of particles) {
    p.y += p.v * (season === 'winter' ? 1.35 : 1);
    p.x += Math.sin(t * 0.7 + p.p) * 0.26;
    if (p.y > 930) {
      p.y = -20;
      p.x = Math.random() * 1600;
    }
    if (p.x > 1650) p.x = -20;

    ctx.save();
    ctx.translate(p.x, p.y);
    if (season === 'spring' || season === 'autumn') {
      ctx.rotate(Math.sin(t + p.p) * 0.7);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.s * 1.8, p.s * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (season === 'summer') {
      ctx.globalAlpha = 0.15;
      ctx.beginPath();
      ctx.arc(0, 0, p.s, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.globalAlpha = 0.48;
      ctx.beginPath();
      ctx.arc(0, 0, p.s * 0.65, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}

window.addEventListener('resize', resize);
resize();
requestAnimationFrame(draw);
