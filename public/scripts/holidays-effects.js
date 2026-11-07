/* All moving overlays are procedural: no character cutting or warping. */
(function(root){'use strict';const TAU=Math.PI*2,hash=n=>{let v=Math.sin(n*127.1+9.17)*43758.5453;return v-Math.floor(v)},mod=(n,m)=>(n%m+m)%m;
const motifs={
clock:'<circle cx="60" cy="74" r="36"/><circle cx="60" cy="74" r="30"/><path d="M60 49v26l17 12M60 33V0M40 112l-6 10m46-10 6 10"/>',
carp:'<path d="M22 63Q45 15 82 57Q97 43 109 47L99 70l12 22-31-8Q46 116 22 63Z"/><path d="M41 45q-4 26 0 43m12-49q-5 28 0 50m12-45q-5 22 0 40M30 60l-14-9m15 20-16 8"/><circle cx="31" cy="60" r="2" fill="currentColor"/>',
blossom:'<path d="M15 121Q54 73 75 29M49 83l-26-30m38 1 34-10M60 67l41 12"/><g fill="currentColor" fill-opacity=".3"><path d="M30 43c-16-18-32 7-11 12-23 11-2 30 9 13 5 24 29 5 10-7 23-1 17-27 1-16 2-20-17-21-9-2Z"/><path d="M80 21c-12-15-26 4-10 10-19 8-2 25 8 11 4 18 22 5 8-6 19 0 15-21 2-15 3-16-13-19-8 0Z"/></g>',
heart:'<path d="M60 0v25M60 106C-19 56 26 17 60 49c34-32 79 7 0 57Z" fill="currentColor" fill-opacity=".12"/><path d="M60 115v14m-7 0 7 9 7-9"/>',
lantern:'<path d="M60 0v33M39 36h42v8H39zM36 46Q13 75 37 106h46q25-31 1-60Z" fill="currentColor" fill-opacity=".12"/><path d="M47 47q-12 28 0 58m26-58q12 29 0 58M60 46v59M39 108h42m-31 4-3 20m13-20v27m10-27 3 20"/>',
butterfly:'<path d="M60 66C4-6-16 85 54 83 10 91 31 136 59 89c28 47 49 2 6-6 70 2 50-89-5-17ZM60 66v31m-1-33-7-15m9 15 8-15" fill="currentColor" fill-opacity=".12"/>',
dumpling:'<ellipse cx="60" cy="95" rx="49" ry="22"/><ellipse cx="60" cy="90" rx="45" ry="16"/><g fill="currentColor" fill-opacity=".2"><circle cx="42" cy="79" r="16"/><circle cx="76" cy="82" r="17"/><circle cx="60" cy="60" r="16"/></g><path d="M27 34q-9-11 0-20m26 22q-9-11 0-20m27 20q-9-11 0-20"/>',
drum:'<circle cx="60" cy="70" r="44"/><circle cx="60" cy="70" r="36"/><circle cx="60" cy="70" r="26"/><path d="m60 47 6 15 16-4-9 13 10 14-18-3-5 17-5-17-18 3 10-14-9-13 16 4Z" fill="currentColor" fill-opacity=".2"/>',
flag:'<path d="M26 132V17m1 8c25-22 49 19 76-1v65c-27 20-51-21-76 1"/><path d="m65 40 5 13 14 1-11 9 3 14-11-8-12 7 3-14-10-9 14-1Z" fill="currentColor"/>',
gear:'<path d="m51 25 3-12h13l3 12 12 5 11-6 9 10-5 11 4 12 12 3v13l-12 3-5 12 6 11-10 9-11-6-12 5-3 12H53l-3-12-12-5-11 6-9-10 5-11-4-12-12-3V59l12-3 5-12-6-11 10-9 11 6Z"/><circle cx="60" cy="66" r="22"/>',
lotus:'<path d="M60 105C23 77 39 41 60 26c21 15 37 51 0 79ZM60 105C9 111 7 78 9 58c29-1 52 18 51 47ZM60 105c51 6 53-27 51-47-29-1-52 18-51 47Z" fill="currentColor" fill-opacity=".13"/><path d="M26 118q34 12 69 0"/>',
balloon:'<ellipse cx="60" cy="50" rx="30" ry="39" fill="currentColor" fill-opacity=".15"/><path d="m56 89 4 7 4-7m-4 7c-20 12 19 27-1 42M41 33q-6 10-3 19"/>',
leaf:'<path d="M28 111Q4 34 99 20q8 75-71 91ZM25 125l59-89M42 94l-11-26m24 11 24-1m-14-14-4-19" fill="currentColor" fill-opacity=".12"/>',
home:'<path d="m11 64 49-42 49 42M24 54v64h73V54M49 118V86h23v32M33 64h12v13H33zm43 0h12v13H76z"/><path d="M60 17C35-2 40-18 60-4c20-14 25 2 0 21Z" fill="currentColor" fill-opacity=".3"/>',
star:'<path d="M60 0v34m0 79v24M60 33l11 26 29 3-22 20 6 29-24-15-25 15 7-29-22-20 29-3Z" fill="currentColor" fill-opacity=".16"/>',
rose:'<path d="M61 83v51m0-19c-30 7-30-22-30-22 21-5 31 12 30 22Zm0-14c30 7 30-22 30-22-21-5-31 12-30 22Z"/><path d="M61 80C16 84 18 33 41 35c0-29 41-26 40 0 29-4 26 49-20 45Z" fill="currentColor" fill-opacity=".12"/><path d="M42 37q36-15 36 16Q48 75 39 53q0-21 24-12l8 17"/>',
rabbit:'<path d="M39 79C14-9 53-17 57 60 63-19 101 1 79 75c30 45-43 68-53 27-3-10 3-18 13-23Z" fill="currentColor" fill-opacity=".2"/><path d="M45 89h1m29 0h1m-20 9 5 4 5-4"/><circle cx="18" cy="101" r="12"/>',
pumpkin:'<path d="M60 40q-11-20 8-29m-8 27C-2 12-8 121 60 116c68 5 62-104 0-78Z" fill="currentColor" fill-opacity=".15"/><path d="M42 44q-20 36 1 65m35-65q20 36-1 65m-33-47-9 15h19zm32 0-9 15h19zM39 92l12 8 8-5 9 5 13-8"/>',
book:'<path d="M60 48Q38 29 8 38v72q31-9 52 9 21-18 52-9V38q-30-9-52 10Zv71M21 55q16-2 27 5M21 71q16-2 27 5M21 88q16-2 27 5M73 60q11-7 25-5M73 76q11-7 25-5M73 93q11-7 25-5"/>',
bell:'<path d="M60 0v27m-6 0h12v10H54zM29 97c13-18 2-54 31-54s18 36 31 54l10 10H19ZM48 115q12 19 24 0" fill="currentColor" fill-opacity=".12"/>',
shield:'<path d="M60 20 103 37v36c0 29-43 50-43 50S17 102 17 73V37Z" fill="currentColor" fill-opacity=".12"/><path d="m38 69 16 17 29-34M60 0v13m-52 0 14 14m90-14L98 27"/>'};
function svg(name){return `<svg viewBox="0 0 120 145" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">${motifs[name]||motifs.star}</svg>`}
/* Scene coordinates follow the 1600 × 900 illustration. Times are seconds. */
const WIDTH = 1600;
const HEIGHT = 900;
const clamp = (x, min = 0, max = 1) => Math.min(max, Math.max(min, x));
const smooth = (x) => {
  const u = clamp(x);
  return u * u * (3 - 2 * u);
};
const fade = (p, edge = .16) => smooth(p / edge) * smooth((1 - p) / edge);
const mix = (a, b, p) => a + (b - a) * p;

function at(c, x, y, angle, sx, sy, opacity, draw) {
  c.save();
  c.translate(x, y);
  c.rotate(angle);
  c.scale(sx, sy);
  c.globalAlpha *= clamp(opacity);
  draw(c);
  c.restore();
}

function glow(c, x, y, radius, color, alpha) {
  if (alpha <= .002) return;
  c.save();
  c.globalAlpha *= clamp(alpha);
  const gradient = c.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(.26, color + '8a');
  gradient.addColorStop(1, color + '00');
  c.fillStyle = gradient;
  c.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  c.restore();
}

function ellipse(c, x, y, rx, ry, color) {
  c.fillStyle = color;
  c.beginPath();
  c.ellipse(x, y, rx, ry, 0, 0, TAU);
  c.fill();
}

function candlelight(c, t, anchors) {
  for (const [x, y, radius, strength = .23, color = '#ffc477'] of anchors) {
    const flicker = .72 + .13 * Math.sin(t * 4.3 + x) + .11 * Math.sin(t * 8.1 + y);
    glow(c, x, y, radius, color, strength * flicker);
  }
}

function mist(c, t, x, y, width, height, color, opacity) {
  for (let i = 0; i < 4; i++) {
    const drift = Math.sin(t * (.13 + i * .024) + i * 1.9);
    at(c, x + drift * 56 + (i - 1.5) * width * .21, y + 10 * Math.sin(t * .22 + i),
      0, 1, height / width, opacity * (.52 + i * .12),
      () => glow(c, 0, 0, width * (.48 + i * .06), color, 1));
  }
}

function glint(c, x, y, radius, color, opacity) {
  if (opacity <= .01) return;
  glow(c, x, y, radius * 4.5, color, opacity * .38);
  at(c, x, y, 0, radius, radius, opacity, () => {
    c.fillStyle = color;
    c.beginPath();
    c.moveTo(0, -2.5);
    c.quadraticCurveTo(.26, -.25, 1.7, 0);
    c.quadraticCurveTo(.26, .25, 0, 2.5);
    c.quadraticCurveTo(-.26, .25, -1.7, 0);
    c.quadraticCurveTo(-.26, -.25, 0, -2.5);
    c.fill();
  });
}

function starlight(c, t, { x, y, width, height, count, color, seed }) {
  for (let i = 0; i < count; i++) {
    const n = seed + i * 17;
    const p = mod(t / mix(2.7, 5.3, hash(n)) + hash(n + 2), 1);
    const pulse = smooth(p / .24) * (1 - smooth((p - .31) / .55));
    const px = x + hash(n + 3) * width + 9 * Math.sin(t * .52 + n);
    const py = y + hash(n + 4) * height + 7 * Math.sin(t * .36 + i);
    glint(c, px, py, mix(.85, 2.6, hash(n + 5)), color, pulse * .78);
  }
}

function surfaceShimmer(c, t, { x, y, width, height, color, count, seed }) {
  const opacity = c.globalAlpha;
  c.fillStyle = color;
  for (let i = 0; i < count; i++) {
    const n = seed + i * 13;
    const depth = hash(n);
    const length = mix(5, 29, depth) * mix(.5, 1.25, hash(n + 1));
    const pulse = .18 + .82 * Math.sin(t * mix(.7, 1.8, hash(n + 2)) + n) ** 2;
    c.globalAlpha = opacity * pulse * mix(.11, .42, depth);
    c.fillRect(x + width * hash(n + 3) + 9 * Math.sin(t * .8 + n),
      y + height * depth + 1.3 * Math.sin(t + i), length, mix(.55, 1.8, depth));
  }
  c.globalAlpha = opacity;
}

function floatingLanterns(c, t, { count, x, width, bottom, top, seed, color }) {
  for (let i = 0; i < count; i++) {
    const n = seed + 17 * i;
    const depth = hash(n);
    const p = mod(t / mix(13, 20, depth) + hash(n + 1), 1);
    const px = x + hash(n + 2) * width + p * 58 + Math.sin(t * .65 + n) * 19;
    const py = mix(bottom, top, p);
    const size = mix(.35, 1.1, depth);
    const alpha = fade(p, .18);
    at(c, px, py, .12 * Math.sin(t * 1.1 + n), size, size, alpha, () => {
      glow(c, 0, -3, 42, color, .48 + .12 * Math.sin(t * 4.7 + n));
      const paper = c.createLinearGradient(-12, 0, 13, 0);
      paper.addColorStop(0, '#9e4a37');
      paper.addColorStop(.36, color);
      paper.addColorStop(.57, '#ffe8aa');
      paper.addColorStop(1, '#a2483a');
      c.beginPath();
      c.moveTo(-9, -15);
      c.quadraticCurveTo(0, -19, 9, -15);
      c.quadraticCurveTo(14, -5, 9, 12);
      c.quadraticCurveTo(0, 15, -9, 12);
      c.quadraticCurveTo(-14, -5, -9, -15);
      c.fillStyle = paper;
      c.fill();
      c.strokeStyle = '#743529b0';
      c.lineWidth = .85;
      for (const rib of [-5, 0, 5]) {
        c.beginPath();
        c.moveTo(rib * .7, -15);
        c.quadraticCurveTo(rib * 1.6, -3, rib, 12);
        c.stroke();
      }
      c.fillStyle = '#72372e';
      c.fillRect(-9, 11, 18, 2);
      ellipse(c, 0, 10, 3.7, 1.6, '#fff1bb');
    });
  }
}

function embers(c, t, { x, y, width, height, count, seed, color = '#ffbc69' }) {
  for (let i = 0; i < count; i++) {
    const n = seed + 21 * i;
    const p = mod(t / mix(2.2, 5.4, hash(n)) + hash(n + 1), 1);
    const px = x + hash(n + 2) * width + p * mix(-32, 68, hash(n + 3));
    const py = y - p * height + 5 * Math.sin(t * 2.1 + n);
    const size = mix(.7, 2.35, hash(n + 4)) * mix(1, .48, p);
    const alpha = fade(p, .24);
    glow(c, px, py, size * 5, color, alpha * .46);
    at(c, px, py, -.34, size, size, alpha * .79,
      () => ellipse(c, 0, 0, .7, 1.7, color));
  }
}

function fountain(c, t, x, y) {
  c.save();
  const opacity = c.globalAlpha;
  c.strokeStyle = '#ffd891';
  c.lineCap = 'round';
  for (let jet = -5; jet <= 5; jet++) {
    for (let i = 0; i < 5; i++) {
      const p = mod(t * .93 + i / 5 + jet * .09, 1);
      const arcHeight = 32 + 48 * (1 - Math.abs(jet) / 6);
      const px = x + jet * 13 * p;
      const py = y - 4 * arcHeight * p * (1 - p);
      c.globalAlpha = opacity * fade(p, .14) * .79;
      c.lineWidth = 1.15;
      c.beginPath();
      c.moveTo(px, py);
      c.lineTo(px - jet * .38, py + (1 - p * 2) * arcHeight * .10);
      c.stroke();
    }
  }
  c.restore();
}

function salute(c, t, x, y, color, offset) {
  const age = mod(t + offset, 6.8);
  if (age > 2.6) return;
  const opacity = c.globalAlpha;
  c.save();
  c.strokeStyle = color;
  c.lineCap = 'round';
  for (let i = 0; i < 44; i++) {
    const angle = i * 2.39996;
    const speed = mix(37, 78, hash(i + offset));
    const radius = (1 - Math.exp(-age * .95)) * speed;
    const x1 = x + Math.cos(angle) * radius;
    const y1 = y + Math.sin(angle) * radius + age * age * 7;
    c.globalAlpha = opacity * fade(age / 2.6, .23) * mix(.37, .86, hash(i + 41));
    c.lineWidth = 1.1;
    c.beginPath();
    c.moveTo(x1 - Math.cos(angle) * 6, y1 - Math.sin(angle) * 6 - age * 3.5);
    c.lineTo(x1, y1);
    c.stroke();
  }
  c.restore();
}

function moonlitClouds(c, t, x, y, color) {
  mist(c, t, x, y, 405, 65, color, .24);
  mist(c, t + 5, x + 175, y + 46, 335, 37, color, .18);
}

function petalShape(c, color, pale, pointed) {
  const shading = c.createLinearGradient(-8, -6, 7, 5);
  shading.addColorStop(0, pale);
  shading.addColorStop(1, color);
  c.fillStyle = shading;
  c.beginPath();
  c.moveTo(-8, 1);
  c.bezierCurveTo(-6, -7, 2, -8, 9, pointed ? -3 : -4);
  c.quadraticCurveTo(pointed ? 7 : 5, -1, 8, 2);
  c.bezierCurveTo(4, 7, -4, 7, -8, 1);
  c.fill();
  c.strokeStyle = pale + '8a';
  c.lineWidth = .55;
  c.beginPath();
  c.moveTo(-6, 1);
  c.quadraticCurveTo(0, -1, 5, -2);
  c.stroke();
}

function driftPetals(c, t, { seed, count, sources, colors, speed = 1, pointed = false, scale = 1 }) {
  for (let i = 0; i < count; i++) {
    const n = seed + i * 19;
    const depth = hash(n);
    const [originX, originY, range] = sources[i % sources.length];
    const cycle = mix(16, 9, depth) / speed;
    const p = mod(t / cycle + hash(n + 1), 1);
    const x = originX + (hash(n + 2) - .5) * range + p * 77 + 25 * Math.sin(p * 7 + n);
    const y = originY + p * (HEIGHT - originY + 38);
    const angle = n + p * mix(5, 13, depth) + .26 * Math.sin(t + n);
    const roll = Math.cos(p * 15 + n);
    const size = scale * mix(.34, 1.16, depth);
    const [color, pale] = colors[i % colors.length];
    at(c, x, y, angle, size, size * (.19 + .81 * Math.abs(roll)),
      fade(p, .12) * mix(.42, .85, depth), () => petalShape(c, color, pale, pointed));
  }
}

function ripples(c, x, y, size, t, hue) {
  c.save();
  const opacity = c.globalAlpha;
  c.strokeStyle = hue;
  for (let i = 0; i < 3; i++) {
    const p = mod(t * .38 + i / 3, 1);
    c.globalAlpha = opacity * .19 * (1 - p);
    c.lineWidth = .9;
    c.beginPath();
    c.ellipse(x, y, size * (1 + p * 1.8), size * (.11 + p * .26), 0, .14, Math.PI - .14);
    c.stroke();
  }
  c.restore();
}

function waterLight(c, x, y, size, t, color) {
  c.save();
  const opacity = c.globalAlpha;
  c.fillStyle = color;
  for (let i = 0; i < 8; i++) {
    const age = i / 8;
    const width = size * (.44 + .8 * hash(i + 10)) * (1 + age * .48);
    const shimmer = .48 + .52 * Math.sin(t * (1.1 + i * .15) + i * 1.7) ** 2;
    c.globalAlpha = opacity * .27 * (1 - age) * shimmer;
    c.fillRect(x - width / 2 + Math.sin(t * 1.2 + i) * size * .35,
      y + 3 + age * size * 2.6, width, mix(2.3, .6, age));
  }
  c.restore();
}

function lotusLamp(c, x, y, size, t, color, opacity) {
  c.save();
  c.globalAlpha *= opacity;
  waterLight(c, x, y + 4, size * 14, t, '#ffc879');
  ripples(c, x, y + 3, size * 14, t, '#f9b585');
  glow(c, x, y - 9 * size, 38 * size, '#ffbc73', .49);
  at(c, x, y, Math.sin(t * 1.9) * .06, size, size, 1, () => {
    ellipse(c, 0, 0, 14, 3.4, '#302237');
    // Folded petals fan around a recessed flame, matching the painted offerings.
    for (const angle of [-.96, .96, -.55, .55, 0]) {
      c.save();
      c.translate(Math.sin(angle) * 4, -1);
      c.rotate(angle);
      const petal = c.createLinearGradient(0, -15, 0, 1);
      petal.addColorStop(0, color);
      petal.addColorStop(.72, '#ffd39d');
      petal.addColorStop(1, '#b66d55');
      c.fillStyle = petal;
      c.strokeStyle = '#ffc49f8a';
      c.lineWidth = .48;
      c.beginPath();
      c.moveTo(0, 0);
      c.quadraticCurveTo(-8, -5, 0, -15);
      c.quadraticCurveTo(8, -5, 0, 0);
      c.fill();
      c.stroke();
      c.restore();
    }
    const lean = Math.sin(t * 7.3) * 1.8;
    c.fillStyle = '#fff4c7';
    c.beginPath();
    c.moveTo(0, -10);
    c.quadraticCurveTo(-4, -11, lean, -18);
    c.quadraticCurveTo(4, -11, 0, -10);
    c.fill();
  });
  c.restore();
}

function floatingOfferings(c, t, { x, y, count, distance, depth, color, seed }) {
  for (let i = 0; i < count; i++) {
    const p = mod(t / (19 + i * 2.3) + hash(seed + i), 1);
    const size = mix(.53, 1.4, (i + .5) / count);
    lotusLamp(c, x + distance * p + 8 * Math.sin(t * .37 + i),
      y + i * depth + 2 * Math.sin(t * .94 + i), size, t + i, color, fade(p, .12) * .86);
  }
}

function bat(c, t, x, y, size, bank, phase, opacity) {
  at(c, x, y, bank, size, size, opacity, () => {
    const flap = Math.sin(t * TAU * 2.65 + phase);
    for (const side of [-1, 1]) {
      c.save();
      c.scale(side, 1);
      // Shoulder and wrist travel at different amplitudes. Three scallops
      // remain visible through the downstroke and the partially folded upstroke.
      const shoulder = -3 - flap * 3;
      const wrist = -10 - flap * 8;
      const tip = -3 - flap * 11;
      const span = 23 + flap * 2;
      c.beginPath();
      c.moveTo(2, shoulder);
      c.bezierCurveTo(7, -3, 7, wrist + 2, 11, wrist);
      c.quadraticCurveTo(16, wrist - 1, span, tip);
      c.quadraticCurveTo(19, tip - 1, 17, 8 - flap * 5);
      c.quadraticCurveTo(13, 4 - flap * 3, 11, 11 - flap * 3);
      c.quadraticCurveTo(8, 7, 6, 12);
      c.quadraticCurveTo(5, 7, 2, 6);
      c.closePath();
      c.fillStyle = side === 1 ? '#1c122e' : '#241535';
      c.strokeStyle = '#bd8ec692';
      c.lineWidth = .72;
      c.fill();
      c.stroke();
      c.strokeStyle = '#80558d99';
      c.lineWidth = .52;
      c.beginPath();
      c.moveTo(3, 1);
      c.quadraticCurveTo(9, wrist + 4, 11, wrist);
      c.lineTo(17, 8 - flap * 5);
      c.moveTo(11, wrist);
      c.quadraticCurveTo(11, 0, 11, 11 - flap * 3);
      c.stroke();
      c.restore();
    }
    c.fillStyle = '#170f25';
    c.beginPath();
    c.moveTo(-3.6, -1);
    c.lineTo(-4.7, -7.5);
    c.quadraticCurveTo(-2.5, -7, -1.3, -4.7);
    c.lineTo(1.4, -4.7);
    c.quadraticCurveTo(2.8, -7, 4.7, -7.5);
    c.lineTo(3.6, -1);
    c.bezierCurveTo(4, 4, 3, 8, 0, 10);
    c.bezierCurveTo(-3, 8, -4, 4, -3.6, -1);
    c.fill();
  });
}

function halloween(c, t, _fireworks, viewport) {
  mist(c, t, 1080, 708, 460, 78, '#9a77cd', .25);
  mist(c, t + 3, 925, 812, 610, 48, '#b98ade', .19);
  candlelight(c, t, [[1474, 633, 100, .31], [1382, 734, 61, .27],
    [1257, 672, 32, .38], [1575, 650, 34, .4], [84, 145, 64, .27]]);
  const compact = viewport.width < 720;
  const start = compact ? viewport.right - 10 : 1480;
  const end = compact ? viewport.left + 16 : 1010;
  const formation = [
    [0, 0, 1.65, 0], [58, -54, 1.12, 1.2], [83, 57, .96, 3.8],
    [145, -94, .8, 2.7], [155, 89, .71, 4.9],
    [410, -30, .92, 4.2], [461, 38, .76, 2.3], [520, -77, .69, 1.6],
  ];
  for (const [lag, lift, scale, phase] of formation) {
    const p = mod((t + 1.35 - lag / 137) / 8.7, 1);
    const x = mix(start, end, p) + 12 * Math.sin(p * 8 + phase);
    const y = compact
      ? 245 + lift * .54 + 19 * Math.sin(p * 7 + phase)
      : 261 + lift + 105 * (p - .39) ** 2 + 15 * Math.sin(p * 7.2 + phase);
    const bank = .26 * Math.cos(p * 7.2 + phase) - .16;
    bat(c, t, x, y, scale * (compact ? .64 : 1), bank, phase, fade(p, .19) * .97);
  }
  driftPetals(c, t, { seed: 20, count: 22, sources: [[328, 11, 310], [1010, 4, 200], [1430, 25, 240]],
    colors: [['#9a4c32', '#e7a360'], ['#ae6244', '#f4b171']], speed: .86, pointed: true, scale: 1.22 });
  embers(c, t, { x: 1184, y: 765, width: 400, height: 187, count: 28, seed: 205 });
}

function butterflies(c, t) {
  for (let i = 0; i < 8; i++) {
    const orbit = t * (.42 + i * .043) + i * 1.9;
    const x = 1010 + (i % 4) * 144 + 81 * Math.cos(orbit);
    const y = 462 - (i % 4) * 82 + Math.floor(i / 4) * 111 + 46 * Math.sin(orbit * 1.43 + i);
    const flap = Math.cos(t * (18 + i * 2) + i);
    const size = mix(.72, 1.32, hash(87 + i));
    at(c, x, y, Math.sin(orbit) * .42, size, size, .89, () => {
      for (const side of [-1, 1]) {
        c.save();
        c.scale(side * (.16 + .84 * Math.abs(flap)), 1);
        const paint = c.createLinearGradient(0, 0, 19, -10);
        paint.addColorStop(0, '#94629e');
        paint.addColorStop(.58, '#ddafd8');
        paint.addColorStop(1, '#ffebf8');
        c.fillStyle = paint;
        c.strokeStyle = '#584167';
        c.lineWidth = .78;
        c.beginPath();
        c.moveTo(1, 2);
        c.bezierCurveTo(5, -13, 20, -18, 21, -9);
        c.quadraticCurveTo(22, -3, 12, 2);
        c.bezierCurveTo(20, 9, 10, 16, 5, 10);
        c.closePath();
        c.fill();
        c.stroke();
        c.strokeStyle = '#fff2fb9c';
        c.beginPath();
        c.moveTo(2, 2);
        c.quadraticCurveTo(9, -4, 16, -9);
        c.moveTo(3, 3);
        c.lineTo(11, 8);
        c.stroke();
        c.restore();
      }
      ellipse(c, 0, 1, 1.5, 6, '#5c426b');
    });
  }
}

function balloons(c, t) {
  const colors = [['#dd6d9f', '#ffd2db'], ['#59a8d8', '#c6f2ff'],
    ['#e2a645', '#fff1a8'], ['#9864bd', '#eac9ff']];
  for (let i = 0; i < 11; i++) {
    const p = mod(t / (12 + i) + hash(i + 44), 1);
    const x = 1015 + i * 49 + Math.sin(p * 7 + i) * 31 + p * 55;
    const y = mix(572, -48, p);
    const scale = mix(.72, 1.46, hash(i + 19));
    const [dark, light] = colors[i % colors.length];
    at(c, x, y, .16 * Math.sin(t * .8 + i), scale, scale, fade(p, .14), () => {
      const paint = c.createRadialGradient(-6, -11, 1, 0, 0, 24);
      paint.addColorStop(0, light);
      paint.addColorStop(1, dark);
      ellipse(c, 0, 0, 15, 20, paint);
      ellipse(c, -6, -9, 2, 5, '#fff8ef8a');
      c.strokeStyle = '#ffead0b0';
      c.lineWidth = .7;
      c.beginPath();
      c.moveTo(0, 20);
      c.bezierCurveTo(-7 + Math.sin(t + i) * 6, 32, 11, 39, Math.sin(t * .8 + i) * 10, 51);
      c.stroke();
      c.fillStyle = dark;
      c.beginPath();
      c.moveTo(0, 18);
      c.lineTo(-3, 23);
      c.lineTo(3, 23);
      c.fill();
    });
  }
}

function lacBird(c, t, x, y, size, phase, opacity) {
  at(c, x, y, -.1, size, size, opacity, () => {
    const lift = 13 * Math.sin(t * 5.4 + phase);
    c.fillStyle = '#e9b767';
    c.beginPath();
    c.moveTo(-14, 4);
    c.quadraticCurveTo(-5, -4, 5, -3);
    c.quadraticCurveTo(13, -7, 17, -12);
    c.lineTo(25, -13);
    c.lineTo(17, -8);
    c.quadraticCurveTo(13, -1, 6, 3);
    c.lineTo(-8, 7);
    c.lineTo(-23, 12);
    c.lineTo(-17, 7);
    c.closePath();
    c.fill();
    c.fillStyle = '#f9d891';
    c.beginPath();
    c.moveTo(1, 0);
    c.quadraticCurveTo(-1, -9, -10, -10 - lift);
    c.lineTo(-26, -7 - lift * .8);
    c.lineTo(-17, -1 - lift * .45);
    c.lineTo(-23, 1 - lift * .4);
    c.lineTo(-7, 4);
    c.fill();
    c.strokeStyle = '#f4cb80';
    c.lineWidth = .7;
    c.beginPath();
    c.moveTo(-6, 5);
    c.lineTo(-19, 14);
    c.moveTo(-5, 6);
    c.lineTo(-15, 15);
    c.stroke();
  });
}

function fireflies(c, t, x, y, width, height, count, seed, color = '#ffe29b') {
  for (let i = 0; i < count; i++) {
    const n = seed + i * 23;
    const px = x + width * hash(n) + 19 * Math.sin(t * (.44 + hash(n + 1)) + n);
    const py = y + height * hash(n + 2) + 11 * Math.sin(t * (.7 + hash(n + 3)) + i);
    const p = mod(t / (2.7 + hash(n + 4) * 2.8) + hash(n + 5), 1);
    const pulse = smooth(p / .19) * (1 - smooth((p - .25) / .42));
    glow(c, px, py, 6 + 5 * hash(n + 6), color, pulse * .61);
    if (pulse > .13) ellipse(c, px, py, .9 + pulse * .5, .9 + pulse * .5, color + 'b0');
  }
}

function meteor(c, t, start, span, seed) {
  const p = mod((t + seed) / 6.6, 1);
  if (p > .43) return;
  const u = p / .43;
  const x = start[0] + span[0] * u;
  const y = start[1] + span[1] * u;
  const angle = Math.atan2(span[1], span[0]);
  at(c, x, y, angle, 1, 1, fade(u, .24), () => {
    const trail = 105 + 72 * Math.sin(u * Math.PI);
    const paint = c.createLinearGradient(-trail, 0, 1, 0);
    paint.addColorStop(0, '#b5a0ff00');
    paint.addColorStop(.58, '#c5adf77a');
    paint.addColorStop(1, '#fff2ff');
    c.fillStyle = paint;
    c.beginPath();
    c.moveTo(-trail, 0);
    c.quadraticCurveTo(-26, -3.4, 1, -1.7);
    c.lineTo(2, 1);
    c.quadraticCurveTo(-26, 3.1, -trail, 0);
    c.fill();
    glow(c, 0, 0, 15, '#f9e6ff', .77);
  });
}

function foldedPaper(c, t, x, y, scale, alpha) {
  const turn = .22 + .78 * Math.abs(Math.cos(t * 1.8));
  at(c, x, y, Math.sin(t * 1.2) * .55, scale * turn, scale, alpha, () => {
    c.fillStyle = '#e9d7b4';
    c.beginPath();
    c.moveTo(-9, -13);
    c.quadraticCurveTo(0, -10, 9, -14);
    c.quadraticCurveTo(5, -2, 9, 12);
    c.quadraticCurveTo(-1, 15, -9, 12);
    c.quadraticCurveTo(-5, -3, -9, -13);
    c.fill();
    c.strokeStyle = '#9e7e5e';
    c.lineWidth = .64;
    for (const row of [-6, -2, 2, 6]) {
      c.beginPath();
      c.moveTo(-4, row);
      c.quadraticCurveTo(0, row + 1, 4, row - .6);
      c.stroke();
    }
  });
}

function snow(c, t) {
  const layers = [[65, .94, 24, .49], [58, 1.85, 44, .66], [24, 3.55, 65, .82]];
  for (const [count, size, speed, opacity] of layers) {
    for (let i = 0; i < count; i++) {
      const n = i * 31 + size * 71;
      const p = mod((t * (speed + hash(n) * 13) + hash(n + 1) * 990) / 990, 1);
      const x = mod(hash(n + 2) * 1660 + t * (speed * .36)
        + 19 * Math.sin(t * .55 + n), 1660) - 30;
      const y = p * 990 - 45;
      const a = opacity * fade(p, .08);
      at(c, x, y, t * .32 + n, size, size, a, () => {
        if (size < 2) {
          ellipse(c, 0, 0, 1, 1, '#f5f2ef');
          return;
        }
        c.strokeStyle = '#fff8ef';
        c.lineWidth = .31;
        c.beginPath();
        for (let arm = 0; arm < 6; arm++) {
          const angle = arm * TAU / 6;
          c.moveTo(0, 0);
          c.lineTo(Math.cos(angle) * 1.4, Math.sin(angle) * 1.4);
        }
        c.stroke();
      });
    }
  }
}

function circuit(c, t, points, color, rate, offset) {
  const lengths = points.slice(1).map(([x, y], i) => Math.hypot(x - points[i][0], y - points[i][1]));
  const total = lengths.reduce((a, b) => a + b, 0);
  function location(distance) {
    let index = 0;
    let remaining = clamp(distance, 0, total);
    while (index < lengths.length - 1 && remaining > lengths[index]) {
      remaining -= lengths[index++];
    }
    const p = remaining / lengths[index];
    return [mix(points[index][0], points[index + 1][0], p),
      mix(points[index][1], points[index + 1][1], p)];
  }
  const distance = mod(t * rate + offset, total + 48);
  if (distance > total) return;
  c.save();
  const opacity = c.globalAlpha;
  c.strokeStyle = color;
  c.lineCap = 'round';
  for (let i = 5; i >= 0; i--) {
    const from = distance - (i + 1) * 7;
    const to = distance - i * 7;
    if (to <= 0) continue;
    c.globalAlpha = opacity * .76 * (1 - i / 6);
    c.lineWidth = mix(1.1, 3.3, i / 5);
    c.beginPath();
    c.moveTo(...location(from));
    for (let step = 1; step <= 7; step++) c.lineTo(...location(from + step));
    c.stroke();
  }
  c.globalAlpha = opacity;
  const [x, y] = location(distance);
  glow(c, x, y, 9, color, .78);
  ellipse(c, x, y, 1.3, 1.3, '#e9ffff');
  c.restore();
}

function cyber(c, t) {
  const paths = [
    [[1126, 830], [1151, 851], [1221, 868], [1328, 881], [1449, 882]],
    [[1250, 588], [1295, 570], [1367, 554], [1450, 541], [1547, 538]],
    [[1290, 463], [1308, 451], [1368, 432], [1449, 419], [1530, 417]],
  ];
  paths.forEach((points, i) => circuit(c, t, points, '#75f6ff', 155 + i * 31, i * 47));
  const shield = [[1317, 255], [1416, 184], [1568, 207], [1536, 380],
    [1432, 514], [1349, 416], [1317, 255]];
  for (const offset of [80, 350, 625]) circuit(c, t, shield, '#b4ffff', 225, offset);
  c.save();
  c.beginPath();
  shield.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y));
  c.closePath();
  c.clip();
  const scanY = 189 + mod(t / 2.85, 1) * 325;
  const scan = c.createLinearGradient(0, scanY - 62, 0, scanY + 3);
  scan.addColorStop(0, '#53defa00');
  scan.addColorStop(.8, '#53defa43');
  scan.addColorStop(.96, '#8effff9a');
  scan.addColorStop(1, '#e2ffff00');
  c.fillStyle = scan;
  c.fillRect(1300, scanY - 62, 280, 66);
  c.restore();
  glow(c, 1430, 340, 138, '#54e9ff', .12 + .11 * Math.sin(t * 1.5) ** 2);
  starlight(c, t, { x: 1015, y: 440, width: 525, height: 409, count: 19, color: '#7bf0ff', seed: 241 });
  surfaceShimmer(c, t, { x: 665, y: 750, width: 625, height: 113, color: '#a38bf8', count: 24, seed: 242 });
  circuit(c, t, [[745, 797], [859, 797], [881, 817], [1078, 817]], '#94c6ff', 124, 72);
}

const spring = [['#d57d9e', '#ffe2e6'], ['#d7a45c', '#ffeab1'], ['#bb527e', '#f8b6cc']];
const lotus = [['#cf8eaa', '#ffe6ee'], ['#edd4c4', '#fff4e6']];

const scenes = {
  2(c, t) {
    moonlitClouds(c, t, 1140, 374, '#bba8ef');
    mist(c, t + 4, 1410, 551, 360, 80, '#f5a695', .23);
    fireflies(c, t, 920, 215, 642, 415, 32, 24, '#ffdaa1');
    starlight(c, t, { x: 875, y: 164, width: 645, height: 407, count: 24, color: '#ffe3ac', seed: 26 });
  },
  3(c, t) {
    driftPetals(c, t, { seed: 33, count: 52, sources: [[275, -20, 260], [1050, -16, 245], [1380, 10, 310]],
      colors: spring, speed: 1.18, scale: 1.22 });
    candlelight(c, t, [[1234, 141, 82, .33], [1398, 219, 84, .32]]);
    starlight(c, t, { x: 1085, y: 260, width: 455, height: 453, count: 18, color: '#ffe1a2', seed: 37 });
  },
  4(c, t) {
    driftPetals(c, t, { seed: 43, count: 40, sources: [[359, 15, 174], [1055, -14, 218], [1355, -10, 385]],
      colors: [['#a83059', '#f997ac'], ['#c45271', '#ffb9bb']], speed: .96, scale: 1.28 });
    candlelight(c, t, [[80, 172, 78, .32], [1362, 624, 76, .26, '#ff7e9f']]);
    fireflies(c, t, 1015, 113, 520, 450, 26, 44, '#fbb8c7');
    starlight(c, t, { x: 1070, y: 119, width: 450, height: 525, count: 16, color: '#ffc1da', seed: 46 });
  },
  5(c, t) {
    floatingOfferings(c, t, { x: 805, y: 671, count: 8, distance: 322,
      depth: 25, color: '#e39c81', seed: 52 });
    waterLight(c, 1172, 754, 62, t, '#ffbd76');
    surfaceShimmer(c, t, { x: 618, y: 708, width: 694, height: 152, color: '#f6c087', count: 37, seed: 54 });
    floatingLanterns(c, t, { count: 8, x: 846, width: 580, bottom: 475, top: -22, seed: 57, color: '#ffcc8c' });
    candlelight(c, t, [[441, 311, 74, .33], [197, 155, 85, .29]]);
  },
  6(c, t) {
    butterflies(c, t);
    driftPetals(c, t, { seed: 62, count: 32, sources: [[325, -20, 195], [1082, -15, 200], [1380, -10, 285]],
      colors: [['#9f83cc', '#efd7ff'], ['#cc92be', '#fce4f5']], speed: .82, scale: 1.22 });
    starlight(c, t, { x: 990, y: 174, width: 548, height: 547, count: 17, color: '#edd2ff', seed: 68 });
  },
  7(c, t) {
    driftPetals(c, t, { seed: 75, count: 34, sources: [[318, 10, 270], [1015, 5, 200], [1350, 34, 290]],
      colors: lotus, speed: .84, scale: 1.29 });
    candlelight(c, t, [[83, 81, 69, .31], [1141, 116, 69, .32]]);
    fireflies(c, t, 985, 407, 555, 364, 26, 78, '#f9d8ac');
  },
  8(c, t) {
    mist(c, t, 1265, 568, 478, 100, '#9fbfc4', .27);
    mist(c, t + 3, 1022, 674, 570, 61, '#c3c7bc', .19);
    for (let i = 0; i < 7; i++) {
      const p = mod((t + i * .73) / 10.4, 1);
      lacBird(c, t, 945 + p * 667, 299 - 108 * Math.sin(p * Math.PI) + (i % 4) * 22,
        1.29 - i * .10, i * .82, fade(p) * .91);
    }
    starlight(c, t, { x: 1006, y: 454, width: 534, height: 331, count: 21, color: '#ffdf9a', seed: 85 });
  },
  9(c, t, fireworks) {
    at(c, 283, 25, 0, .79, .76, .87, () => fireworks(t + .53));
    mist(c, t, 1290, 477, 410, 66, '#e79b73', .17);
    embers(c, t, { x: 1005, y: 465, width: 545, height: 275, count: 42, seed: 93, color: '#ffcd8f' });
    starlight(c, t, { x: 1050, y: 114, width: 496, height: 367, count: 20, color: '#ffcf93', seed: 94 });
    fountain(c, t, 1200, 749);
  },
  10(c, t) {
    const rims = [
      [1434, 502, 158, 185, -2.86, -1.12, 0],
      [1225, 682, 82, 99, -.58, -3.23, 1.6],
    ];
    for (const [x, y, rx, ry, from, to, phase] of rims) {
      for (const delay of [0, 1.93, 3.86]) {
        const p = mod((t + phase + delay) / 5.8, 1);
        const angle = mix(from, to, smooth(p));
        glint(c, x + Math.cos(angle) * rx, y + Math.sin(angle) * ry, 4.3,
          '#ffe5a1', fade(p, .2) * .89);
      }
    }
    embers(c, t, { x: 1050, y: 759, width: 516, height: 345, count: 40, seed: 107, color: '#ffe2a0' });
    starlight(c, t, { x: 1040, y: 440, width: 501, height: 419, count: 19, color: '#ffda8d', seed: 108 });
  },
  11(c, t) {
    floatingOfferings(c, t, { x: 756, y: 682, count: 8, distance: 337,
      depth: 24, color: '#e5a3c0', seed: 111 });
    surfaceShimmer(c, t, { x: 650, y: 705, width: 805, height: 156, color: '#ffc79c', count: 39, seed: 112 });
    candlelight(c, t, [[1353, 122, 87, .32], [1489, 93, 79, .31], [1489, 343, 102, .23]]);
    driftPetals(c, t, { seed: 113, count: 23, sources: [[294, 10, 210], [1180, 16, 384]],
      colors: lotus, speed: .69, scale: 1.17 });
  },
  12(c, t) {
    balloons(c, t);
    fireflies(c, t, 1000, 104, 550, 457, 22, 126, '#ffe9a5');
    starlight(c, t, { x: 1006, y: 59, width: 549, height: 584, count: 34, color: '#ffeaba', seed: 127 });
    starlight(c, t, { x: 535, y: 115, width: 480, height: 140, count: 10, color: '#acddff', seed: 128 });
  },
  13(c, t) {
    driftPetals(c, t, { seed: 136, count: 39, sources: [[298, -20, 250], [1005, -20, 244], [1420, 10, 250]],
      colors: [['#547748', '#c5d786'], ['#668a46', '#e1db98']], speed: 1.04, pointed: true, scale: 1.33 });
    candlelight(c, t, [[101, 165, 75, .32]]);
    fireflies(c, t, 945, 415, 582, 372, 28, 138, '#e5edaf');
  },
  14(c, t) {
    candlelight(c, t, [[1373, 298, 104, .36], [1505, 457, 92, .39]]);
    fireflies(c, t, 872, 474, 667, 338, 44, 142);
    driftPetals(c, t, { seed: 144, count: 21, sources: [[335, -12, 175], [1072, -15, 220], [1350, 9, 250]],
      colors: [['#a08d4f', '#e5cc88']], speed: .76, pointed: true, scale: 1.23 });
    starlight(c, t, { x: 1060, y: 497, width: 500, height: 340, count: 13, color: '#ffe9b7', seed: 146 });
  },
  15(c, t) {
    meteor(c, t, [1540, 82], [-518, 282], .15);
    meteor(c, t, [1272, 41], [-395, 169], 2.4);
    meteor(c, t, [1544, 173], [-472, 207], 4.52);
    meteor(c, t, [1021, 21], [-411, 176], 5.54);
    mist(c, t, 1235, 344, 410, 69, '#b198f7', .20);
    fireflies(c, t, 960, 45, 596, 424, 29, 152, '#dbc6ff');
    starlight(c, t, { x: 709, y: 62, width: 853, height: 505, count: 40, color: '#e7ccff', seed: 155 });
  },
  16(c, t) {
    floatingOfferings(c, t, { x: 766, y: 689, count: 8, distance: 341,
      depth: 25, color: '#df8095', seed: 162 });
    waterLight(c, 1384, 825, 64, t + 1, '#e9a86c');
    surfaceShimmer(c, t, { x: 660, y: 719, width: 809, height: 154, color: '#efb47f', count: 44, seed: 164 });
    fireflies(c, t, 1030, 528, 507, 219, 24, 165, '#ffcfa1');
    candlelight(c, t, [[170, 122, 92, .30], [1510, 462, 78, .25]]);
  },
  17(c, t, fireworks) {
    at(c, 187, 14, 0, .88, .81, .88, () => fireworks(t + 1.22));
    salute(c, t, 1168, 329, '#fbe39d', 3.35);
    salute(c, t, 1320, 159, '#ffc88d', .48);
    waterLight(c, 1364, 744, 85, t * .65, '#f8b878');
    surfaceShimmer(c, t, { x: 946, y: 744, width: 534, height: 119, color: '#ffc786', count: 33, seed: 173 });
    embers(c, t, { x: 970, y: 439, width: 546, height: 248, count: 37, seed: 174, color: '#ffcf94' });
    starlight(c, t, { x: 1070, y: 85, width: 468, height: 325, count: 16, color: '#ffdeac', seed: 175 });
  },
  18(c, t) {
    candlelight(c, t, [[1400, 224, 125, .39], [1544, 687, 100, .31],
      [1229, 92, 127, .17, '#ffe0a6']]);
    floatingLanterns(c, t, { count: 13, x: 806, width: 626, bottom: 572, top: -30, seed: 183, color: '#ffd494' });
    fireflies(c, t, 925, 263, 626, 413, 43, 186);
    waterLight(c, 1042, 746, 41, t, '#ffb476');
    waterLight(c, 1176, 761, 31, t + 2, '#f5c58f');
    surfaceShimmer(c, t, { x: 701, y: 745, width: 543, height: 116, color: '#ffc294', count: 31, seed: 188 });
  },
  19(c, t) {
    driftPetals(c, t, { seed: 194, count: 44, sources: [[298, -11, 246], [1050, 0, 247], [1450, 160, 280]],
      colors: [['#b65f94', '#f8bbd6'], ['#dc9aaf', '#ffe4dd']], speed: .94, scale: 1.28 });
    candlelight(c, t, [[1390, 247, 83, .31, '#f3ad99'], [1500, 179, 86, .28, '#ffbf9f']]);
    starlight(c, t, { x: 1005, y: 200, width: 540, height: 532, count: 20, color: '#ffcadc', seed: 195 });
    surfaceShimmer(c, t, { x: 665, y: 733, width: 601, height: 127, color: '#edaaa9', count: 21, seed: 196 });
  },
  20: halloween,
  21(c, t) {
    candlelight(c, t, [[94, 550, 86, .30], [1310, 506, 66, .34]]);
    for (let i = 0; i < 9; i++) {
      const p = mod((t + i * 1.05) / 9.5, 1);
      foldedPaper(c, t + i, 1438 - p * 430 + Math.sin(t * .85 + i) * 35,
        598 - p * 223 + (i % 4) * 33, .78 + .43 * hash(i + 215), fade(p) * .85);
    }
    starlight(c, t, { x: 987, y: 300, width: 573, height: 403, count: 24, color: '#ffe2ae', seed: 218 });
    waterLight(c, 1321, 678, 46, t, '#e9b474');
    surfaceShimmer(c, t, { x: 685, y: 704, width: 696, height: 150, color: '#f0c695', count: 32, seed: 219 });
  },
  22(c, t) {
    mist(c, t, 1228, 575, 480, 105, '#afc9b8', .25);
    mist(c, t + 4, 1123, 660, 560, 60, '#c5d7c9', .20);
    fireflies(c, t, 874, 596, 655, 222, 43, 224, '#ffd797');
    starlight(c, t, { x: 1030, y: 520, width: 525, height: 289, count: 24, color: '#ffdd98', seed: 225 });
    glow(c, 1460, 628, 90, '#f9cc7d', .16 + .14 * Math.sin(t * .8) ** 2);
    glint(c, 1458, 605, 8, '#ffecaf', .34 + .58 * Math.sin(t * 1.2) ** 2);
  },
  23(c, t) {
    snow(c, t);
    candlelight(c, t, [[1425, 421, 99, .32], [1508, 651, 109, .33], [80, 133, 66, .32]]);
    starlight(c, t, { x: 1193, y: 182, width: 342, height: 574, count: 43, color: '#ffe4a6', seed: 235 });
    starlight(c, t, { x: 665, y: 105, width: 540, height: 145, count: 12, color: '#ffecc6', seed: 236 });
  },
  24: cyber,
};


function newYearSparkles(c, t, amount) {
  for (let i = 0; i < 28; i++) {
    const seed = i + 113;
    const random = hash(seed);
    const p = mod(t * (.018 + hash(seed + 3) * .026) + hash(seed + 9), 1);
    const x = random * WIDTH + Math.sin(t * .5 + i) * 18;
    const y = p * 1050 - 80;
    if (x > 555 && x < 1045 && y > 165 && y < 790) continue;
    c.globalAlpha = Math.sin(p * Math.PI) * amount * (.2 + .5 * Math.sin(t + i) ** 2);
    c.strokeStyle = '#edc882';
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(x - 4, y);
    c.lineTo(x + 4, y);
    c.moveTo(x, y - 4);
    c.lineTo(x, y + 4);
    c.stroke();
  }
}

class Effects {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.amount = .75;
    this.theme = null;
    this.viewport = { width: WIDTH, left: 0, right: WIDTH };
    this.fireworkContext = { amount: 1, light: root.AnimeRig.Scene.prototype.light };
    this.drawFireworks = (t) => {
      this.fireworkContext.amount = this.amount;
      root.AnimeRig.Scene.prototype.fireworks.call(this.fireworkContext, this.ctx, t);
    };
  }

  setTheme(theme) {
    this.theme = theme;
  }

  draw(t) {
    const c = this.ctx;
    c.save();
    c.resetTransform();
    c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    c.restore();
    if (!this.theme || this.amount <= 0) return;
    c.save();
    if (this.theme.id === 1) {
      this.drawFireworks(t);
      newYearSparkles(c, t, this.amount);
    } else {
      c.globalAlpha = this.amount;
      scenes[this.theme.id]?.(c, t, this.drawFireworks, this.viewport);
    }
    c.restore();
  }
}

root.HolidayEffects = { Effects, svg };
})(typeof globalThis !== 'undefined' ? globalThis : this);
