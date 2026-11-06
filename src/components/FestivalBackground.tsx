import React, { useEffect, useRef } from "react";
import "../styles/festival-themes.css";

export type FestivalThemeType = "tet" | "gio-to" | "trung-thu" | "halloween" | "giang-sinh" | "phu-nu";

interface FestivalBackgroundProps {
  theme: FestivalThemeType;
}

export const FestivalBackground: React.FC<FestivalBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Cập nhật thuộc tính data-theme trên html tag
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Canvas Particle Engine 60fps từ fx.js của Master
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      initParticles();
    };
    window.addEventListener("resize", handleResize);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    let particles: any[] = [];

    const initParticles = () => {
      particles = [];
      const count = window.innerWidth < 768 ? 26 : 50;

      for (let i = 0; i < count; i++) {
        if (theme === "tet") {
          // Hoa mai vàng lật 3D
          particles.push({
            type: "petal",
            x: rand(0, W),
            y: rand(-50, H),
            s: rand(8, 14),
            vx: rand(-0.8, 1.2),
            vy: rand(1.2, 2.4),
            rot: rand(0, 360),
            vrot: rand(0.8, 2.2),
            flip: rand(0, Math.PI),
            vflip: rand(0.02, 0.05),
            colorA: "#ffe35a",
            colorB: "#f0a000",
          });
        } else if (theme === "gio-to") {
          // Bụi vàng Đông Sơn bay lên
          particles.push({
            type: "rise",
            x: rand(0, W),
            y: rand(0, H),
            r: rand(1.5, 3.2),
            vx: rand(-0.3, 0.3),
            vy: rand(-0.8, -1.8),
            alpha: rand(0.2, 0.8),
            dAlpha: rand(0.005, 0.015),
            rgb: "240, 190, 90",
          });
        } else if (theme === "trung-thu") {
          // Đom đóm rằm
          particles.push({
            type: "firefly",
            x: rand(0, W),
            y: rand(0, H),
            r: rand(2, 4),
            vx: rand(-0.4, 0.4),
            vy: rand(-0.3, 0.3),
            alpha: rand(0.1, 0.9),
            pulse: rand(0.02, 0.04),
            pulseDir: 1,
            rgb: "255, 230, 130",
          });
        } else if (theme === "halloween") {
          // Dơi bay chao liệng
          particles.push({
            type: "bat",
            x: rand(0, W),
            y: rand(0, H * 0.7),
            s: rand(11, 20),
            vx: rand(1.5, 3.2),
            vy: rand(-0.8, 0.8),
            wing: 0,
            vwing: rand(0.18, 0.28),
          });
        } else if (theme === "giang-sinh") {
          // Tuyết rơi đa tầng
          particles.push({
            type: "snow",
            x: rand(0, W),
            y: rand(0, H),
            r: rand(1.8, 4.2),
            vx: rand(-0.5, 0.8),
            vy: rand(1.2, 2.6),
            alpha: rand(0.4, 0.9),
          });
        } else if (theme === "phu-nu") {
          // Cánh hoa hồng
          particles.push({
            type: "rose",
            x: rand(0, W),
            y: rand(-50, H),
            s: rand(7, 12),
            vx: rand(-0.6, 1.0),
            vy: rand(1.0, 2.0),
            rot: rand(0, 360),
            vrot: rand(0.6, 1.8),
            flip: rand(0, Math.PI),
            vflip: rand(0.015, 0.04),
            colorA: "#ff85b3",
            colorB: "#d94179",
          });
        }
      }
    };

    initParticles();
    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.type === "petal" || p.type === "rose") {
          p.x += p.vx + Math.sin(p.flip) * 0.6;
          p.y += p.vy;
          p.rot += p.vrot;
          p.flip += p.vflip;

          if (p.y > H + 20) { p.y = -20; p.x = rand(0, W); }
          if (p.x > W + 20) p.x = -20;
          if (p.x < -20) p.x = W + 20;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rot * Math.PI) / 180);
          ctx.scale(1, Math.cos(p.flip));

          const grad = ctx.createLinearGradient(0, -p.s, 0, p.s);
          grad.addColorStop(0, p.colorA);
          grad.addColorStop(1, p.colorB);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(0, -p.s);
          ctx.bezierCurveTo(p.s * 0.8, -p.s * 0.5, p.s * 0.8, p.s * 0.6, 0, p.s);
          ctx.bezierCurveTo(-p.s * 0.8, p.s * 0.6, -p.s * 0.8, -p.s * 0.5, 0, -p.s);
          ctx.fill();
          ctx.restore();

        } else if (p.type === "rise") {
          p.y += p.vy;
          p.x += p.vx;
          p.alpha += p.dAlpha;
          if (p.alpha > 0.85 || p.alpha < 0.15) p.dAlpha = -p.dAlpha;

          if (p.y < -20) { p.y = H + 10; p.x = rand(0, W); }

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.rgb}, ${p.alpha})`;
          ctx.shadowColor = `rgba(${p.rgb}, 0.8)`;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.restore();

        } else if (p.type === "firefly") {
          p.x += p.vx + Math.sin(Date.now() * 0.001 + p.y) * 0.4;
          p.y += p.vy + Math.cos(Date.now() * 0.001 + p.x) * 0.4;
          p.alpha += p.pulse * p.pulseDir;
          if (p.alpha > 0.95) { p.alpha = 0.95; p.pulseDir = -1; }
          if (p.alpha < 0.1) { p.alpha = 0.1; p.pulseDir = 1; }

          if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.rgb}, ${p.alpha})`;
          ctx.shadowColor = `rgba(${p.rgb}, 0.9)`;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.restore();

        } else if (p.type === "bat") {
          p.x += p.vx;
          p.y += p.vy + Math.sin(p.x * 0.05) * 0.8;
          p.wing += p.vwing;

          if (p.x > W + 40) { p.x = -40; p.y = rand(40, H * 0.7); }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.fillStyle = "#0f0518";
          ctx.shadowColor = "rgba(255, 117, 24, 0.4)";
          ctx.shadowBlur = 6;
          const wSpan = Math.sin(p.wing) * p.s;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(-p.s * 0.5, -wSpan, -p.s, -wSpan * 0.4);
          ctx.quadraticCurveTo(-p.s * 0.5, 0, 0, p.s * 0.4);
          ctx.quadraticCurveTo(p.s * 0.5, 0, p.s, -wSpan * 0.4);
          ctx.quadraticCurveTo(p.s * 0.5, -wSpan, 0, 0);
          ctx.fill();
          ctx.restore();

        } else if (p.type === "snow") {
          p.y += p.vy;
          p.x += p.vx + Math.sin(p.y * 0.02) * 0.5;

          if (p.y > H + 10) { p.y = -10; p.x = rand(0, W); }

          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
          ctx.shadowBlur = 5;
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  return (
    <>
      {/* SVG DEFINITIONS TỪ MASTER */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <radialGradient id="lb" cx="50%" cy="48%" r="62%">
            <stop offset="0" style={{ stopColor: "var(--lan-a)" }} />
            <stop offset=".78" style={{ stopColor: "var(--lan-b)" }} />
          </radialGradient>
          <linearGradient id="gold" x1="0" x2="1">
            <stop offset="0" stopColor="#8a5a12" />
            <stop offset=".35" stopColor="#f3d27a" />
            <stop offset=".7" stopColor="#c9972b" />
            <stop offset="1" stopColor="#7a4d0e" />
          </linearGradient>
          <radialGradient id="li" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#fff6c8" stopOpacity=".95" />
            <stop offset="1" stopColor="#ffd27a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sh" x1="0" x2="1">
            <stop offset="0" stopColor="#000" stopOpacity=".38" />
            <stop offset=".3" stopColor="#000" stopOpacity="0" />
            <stop offset=".72" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity=".42" />
          </linearGradient>
          <symbol id="lantern" viewBox="0 0 64 132">
            <path d="M32 0V12" stroke="#c9972b" strokeWidth="2" />
            <circle cx="32" cy="4" r="3" fill="none" stroke="#c9972b" strokeWidth="1.5" />
            <rect x="19" y="12" width="26" height="8" rx="2" fill="url(#gold)" />
            <path d="M18 20C2 40 2 82 18 100H46C62 82 62 40 46 20Z" fill="url(#lb)" />
            <ellipse cx="32" cy="60" rx="17" ry="30" fill="url(#li)" />
            <path
              d="M32 20V100M25 20C15 42 15 78 25 100M39 20C49 42 49 78 39 100M20 20C6 44 6 76 20 100M44 20C58 44 58 76 44 100"
              fill="none"
              stroke="#5a0a0a"
              strokeOpacity=".3"
              strokeWidth="1"
            />
            <path d="M18 20C2 40 2 82 18 100H46C62 82 62 40 46 20Z" fill="url(#sh)" />
            <path d="M14 36C9 52 10 70 15 84" fill="none" stroke="#fff" strokeOpacity=".38" strokeWidth="3" strokeLinecap="round" />
            <rect x="20" y="100" width="24" height="8" rx="2" fill="url(#gold)" />
            <path d="M32 108V114" stroke="#c9972b" strokeWidth="2" />
            <g stroke="#e0b040" strokeWidth="1.1" strokeLinecap="round">
              <path d="M32 114L26 131M32 114L29 132M32 114L32 133M32 114L35 132M32 114L38 131" />
            </g>
            <circle cx="32" cy="114" r="2.6" fill="url(#gold)" />
          </symbol>
        </defs>
      </svg>

      {/* CANVAS HẠT */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* MẶT TRĂNG 3D SVG */}
      <svg className="festival-moon" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <clipPath id="mc">
            <circle cx="100" cy="100" r="99" />
          </clipPath>
          <radialGradient id="mg" cx="38%" cy="34%" r="75%">
            <stop offset="0" style={{ stopColor: "var(--moon-a, #fff)" }} />
            <stop offset="1" style={{ stopColor: "var(--moon-b, #ddd)" }} />
          </radialGradient>
          <radialGradient id="ms" cx="50%" cy="50%" r="50%">
            <stop offset=".7" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity=".4" />
          </radialGradient>
          <filter id="mf" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency=".02 .028" numOctaves={5} seed={11} />
            <feDiffuseLighting surfaceScale={6} diffuseConstant={1.05} lightingColor="#fff">
              <feDistantLight azimuth={235} elevation={55} />
            </feDiffuseLighting>
          </filter>
          <filter id="mb">
            <feGaussianBlur stdDeviation={5} />
          </filter>
        </defs>
        <g clipPath="url(#mc)">
          <circle cx="100" cy="100" r="99" fill="url(#mg)" />
          <g filter="url(#mb)" fill="#7a6430" opacity=".24">
            <ellipse cx="72" cy="78" rx="26" ry="20" />
            <ellipse cx="120" cy="62" rx="18" ry="14" />
            <ellipse cx="112" cy="124" rx="30" ry="22" />
            <ellipse cx="66" cy="128" rx="12" ry="10" />
          </g>
          <rect width="200" height="200" filter="url(#mf)" style={{ mixBlendMode: "multiply" }} opacity=".5" />
          <circle cx="100" cy="100" r="99" fill="url(#ms)" />
        </g>
      </svg>

      {/* DÀN ĐÈN LỒNG */}
      <div className="festival-lanterns" aria-hidden="true">
        <i style={{ ["--x" as any]: "4%", ["--len" as any]: "22px", ["--s" as any]: 0.85, ["--d" as any]: "5.4s", ["--dl" as any]: ".2s" }}>
          <svg><use href="#lantern" /></svg>
        </i>
        <i style={{ ["--x" as any]: "12%", ["--len" as any]: "34px", ["--s" as any]: 0.95, ["--d" as any]: "6.7s", ["--dl" as any]: ".45s" }}>
          <svg><use href="#lantern" /></svg>
        </i>
        <i style={{ ["--x" as any]: "20%", ["--len" as any]: "18px", ["--s" as any]: 0.75, ["--d" as any]: "4.9s", ["--dl" as any]: ".7s" }}>
          <svg><use href="#lantern" /></svg>
        </i>
        <i style={{ ["--x" as any]: "80%", ["--len" as any]: "20px", ["--s" as any]: 0.78, ["--d" as any]: "5.9s", ["--dl" as any]: ".35s" }}>
          <svg><use href="#lantern" /></svg>
        </i>
        <i style={{ ["--x" as any]: "88%", ["--len" as any]: "34px", ["--s" as any]: 0.95, ["--d" as any]: "7.2s", ["--dl" as any]: ".6s" }}>
          <svg><use href="#lantern" /></svg>
        </i>
        <i style={{ ["--x" as any]: "95%", ["--len" as any]: "24px", ["--s" as any]: 0.82, ["--d" as any]: "5.1s", ["--dl" as any]: ".1s" }}>
          <svg><use href="#lantern" /></svg>
        </i>
      </div>

      {/* CHÂN CẢNH SILHOUETTE */}
      <svg className="festival-ground" viewBox="0 0 1000 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <symbol id="pine" viewBox="0 0 40 80">
          <path d="M20 0L31 26H26L36 48H28L40 78H0L12 48H4L14 26H9Z" />
        </symbol>
        <g id="g-pine">
          <use href="#pine" x="-6" y="100" width="50" height="100" />
          <use href="#pine" x="40" y="118" width="40" height="82" />
          <use href="#pine" x="84" y="82" width="60" height="120" />
          <use href="#pine" x="640" y="112" width="45" height="90" />
          <use href="#pine" x="684" y="86" width="60" height="120" />
          <use href="#pine" x="890" y="80" width="62" height="124" />
          <path d="M0 200V184Q250 166 500 182T1000 176V200Z" fill="#eaf6ff" opacity=".95" />
        </g>
        <g id="g-house">
          <path d="M0 200V172Q200 150 380 168T700 165T1000 172V200Z" />
          <path d="M445 172V124H615V172Z" /><path d="M435 126L530 82L625 126Z" />
          <path d="M130 176V118M130 148L100 122M130 138L166 108" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
          <g fill="#ffb347">
            <rect x="468" y="138" width="16" height="22" />
            <rect x="506" y="138" width="16" height="22" />
            <rect x="544" y="138" width="16" height="22" />
          </g>
        </g>
        <g id="g-dinh">
          <path d="M0 200V178Q250 166 500 176T1000 174V200Z" />
          <path d="M330 176V132H670V176Z" />
          <path d="M285 134Q345 138 370 106H630Q655 138 715 134Q650 152 500 152Q350 152 285 134Z" />
          <path d="M365 108Q400 106 420 80H580Q600 106 635 108Z" />
          <path d="M420 82Q470 80 495 52H505Q530 80 580 82Z" />
          <path d="M497 52L500 38L503 52Z" />
        </g>
      </svg>
    </>
  );
};

