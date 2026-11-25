import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

interface Point {
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  isGold: boolean;
}

const SEGMENT_COUNT = 36;
const SEGMENT_SPACING = 10.5;

function normalizeAngle(a: number): number {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function buildWaypoints(width: number, height: number): Point[] {
  const waypoints: Point[] = [];
  const cards = Array.from(
    document.querySelectorAll<HTMLElement>('main .rounded-2xl')
  );

  const visibleRects = cards
    .map((el) => el.getBoundingClientRect())
    .filter(
      (r) =>
        r.width > 90 &&
        r.height > 60 &&
        r.bottom > 20 &&
        r.top < height - 20 &&
        r.right > 20 &&
        r.left < width - 20
    )
    .slice(0, 12);

  if (visibleRects.length > 0) {
    const pad = 16;
    visibleRects.forEach((r, idx) => {
      const left = Math.max(24, r.left - pad);
      const right = Math.min(width - 24, r.right + pad);
      const top = Math.max(24, r.top - pad);
      const bottom = Math.min(height - 24, r.bottom + pad);
      const midX = (left + right) / 2;
      const midY = (top + bottom) / 2;

      if (idx % 2 === 0) {
        waypoints.push({ x: left, y: top });
        waypoints.push({ x: midX, y: top });
        waypoints.push({ x: right, y: midY });
        waypoints.push({ x: right, y: bottom });
      } else {
        waypoints.push({ x: right, y: top });
        waypoints.push({ x: midX, y: bottom });
        waypoints.push({ x: left, y: bottom });
        waypoints.push({ x: left, y: midY });
      }
    });
  }

  // Fallback gentle figure-8 around main canvas area if no cards found
  if (waypoints.length < 4) {
    const startX = width > 1024 ? 300 : 40;
    const usableW = Math.max(220, width - startX - 40);
    for (let i = 0; i < 8; i++) {
      const t = (i / 8) * Math.PI * 2;
      waypoints.push({
        x: startX + usableW * (0.5 + 0.38 * Math.sin(t)),
        y: height * (0.5 + 0.32 * Math.sin(t * 2)),
      });
    }
  }

  return waypoints;
}

export const DragonBackdrop: React.FC = () => {
  const { state, activeTab } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const showDragon = state.settings.showDragon;
  const isDark = state.settings.theme === 'dark';

  const themeRef = useRef(isDark);
  themeRef.current = isDark;

  const waypointsRef = useRef<Point[]>([]);

  // Refresh card waypoints when tab changes
  useEffect(() => {
    if (!showDragon) return undefined;
    const timer = setTimeout(() => {
      waypointsRef.current = buildWaypoints(window.innerWidth, window.innerHeight);
    }, 120);
    return () => clearTimeout(timer);
  }, [activeTab, showDragon]);

  useEffect(() => {
    if (!showDragon) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      waypointsRef.current = buildWaypoints(width, height);
    };

    resize();

    // Initialize dragon spine near upper-right area of content
    const initX = width > 1024 ? width * 0.65 : width * 0.5;
    const initY = height * 0.35;
    const spine: Point[] = Array.from({ length: SEGMENT_COUNT }, (_, i) => ({
      x: initX - i * SEGMENT_SPACING,
      y: initY,
    }));

    let heading = 0.25;
    let waypointIndex = 0;
    let time = 0;
    const particles: Particle[] = [];

    const mouse = {
      x: initX,
      y: initY,
      lastMovedAt: 0,
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.lastMovedAt = performance.now();
    };

    const onRefreshLayout = () => {
      waypointsRef.current = buildWaypoints(width, height);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onRefreshLayout, { passive: true });

    const layoutTimer = window.setInterval(onRefreshLayout, 2400);

    let rafId = 0;
    let lastTime = performance.now();

    const drawDragon = (dt: number) => {
      time += dt;
      const dark = themeRef.current;
      const wps = waypointsRef.current;
      const now = performance.now();

      // Determine target waypoint + gentle mouse attraction
      let target: Point = { x: width * 0.6, y: height * 0.5 };
      if (wps.length > 0) {
        if (waypointIndex >= wps.length) waypointIndex = 0;
        target = wps[waypointIndex];
        const distToWp = Math.hypot(target.x - spine[0].x, target.y - spine[0].y);
        if (distToWp < 46) {
          waypointIndex = (waypointIndex + 1) % wps.length;
          target = wps[waypointIndex];
        }
      }

      // Blend subtly toward cursor if recently moved
      const mouseAge = now - mouse.lastMovedAt;
      if (mouseAge < 2500 && mouse.x > (width > 1024 ? 260 : 0)) {
        const pull = (1 - mouseAge / 2500) * 0.55;
        target = {
          x: lerp(target.x, mouse.x, pull),
          y: lerp(target.y, mouse.y, pull),
        };
      }

      // Smooth steering with subtle serpentine wave
      const desiredAngle = Math.atan2(target.y - spine[0].y, target.x - spine[0].x);
      const waveAngle = Math.sin(time * 3.1) * 0.28;
      const diff = normalizeAngle(desiredAngle + waveAngle - heading);
      heading = normalizeAngle(heading + diff * Math.min(1, dt * 3.2));

      const speed = 135; // Smooth graceful patrol speed (px/s)
      spine[0].x += Math.cos(heading) * speed * dt;
      spine[0].y += Math.sin(heading) * speed * dt;

      // Soft boundary clamping
      const minX = width > 1024 ? 290 : 20;
      if (spine[0].x < minX) heading = normalizeAngle(lerp(heading, 0, 0.15));
      if (spine[0].x > width - 20) heading = normalizeAngle(lerp(heading, Math.PI, 0.15));
      if (spine[0].y < 20) heading = normalizeAngle(lerp(heading, Math.PI / 2, 0.15));
      if (spine[0].y > height - 20)
        heading = normalizeAngle(lerp(heading, -Math.PI / 2, 0.15));

      // Inverse kinematics follow along spine with undulating ripple
      for (let i = 1; i < SEGMENT_COUNT; i++) {
        const prev = spine[i - 1];
        const cur = spine[i];
        const dx = cur.x - prev.x;
        const dy = cur.y - prev.y;
        const angle = Math.atan2(dy, dx);
        const ripple = Math.sin(time * 5.2 - i * 0.42) * 0.035;
        const nextAngle = angle + ripple;
        cur.x = prev.x + Math.cos(nextAngle) * SEGMENT_SPACING;
        cur.y = prev.y + Math.sin(nextAngle) * SEGMENT_SPACING;
      }

      // Spawn subtle starlight/ember particles along body
      if (Math.random() < 0.55) {
        const sampleIdx = Math.floor(Math.random() * (SEGMENT_COUNT - 4)) + 2;
        const pt = spine[sampleIdx];
        particles.push({
          x: pt.x + (Math.random() - 0.5) * 10,
          y: pt.y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 18,
          vy: (Math.random() - 0.5) * 18 - 8,
          life: 0,
          maxLife: 0.7 + Math.random() * 0.7,
          size: 1.2 + Math.random() * 2.1,
          isGold: Math.random() < 0.42,
        });
      }

      // Clear frame
      ctx.clearRect(0, 0, width, height);

      // Update & draw trailing particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const alpha = (1 - p.life / p.maxLife) * (dark ? 0.75 : 0.45);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.isGold
          ? `rgba(251, 191, 36, ${alpha})`
          : `rgba(56, 189, 248, ${alpha})`;
        ctx.fill();
      }

      ctx.save();
      const baseAlpha = dark ? 0.88 : 0.65;
      ctx.globalAlpha = baseAlpha;

      // 1. Soft neon aura behind spine
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(spine[0].x, spine[0].y);
      for (let i = 1; i < SEGMENT_COUNT; i++) {
        ctx.lineTo(spine[i].x, spine[i].y);
      }
      ctx.strokeStyle = dark
        ? 'rgba(99, 102, 241, 0.22)'
        : 'rgba(99, 102, 241, 0.14)';
      ctx.lineWidth = 26;
      ctx.shadowColor = dark ? '#6366f1' : '#818cf8';
      ctx.shadowBlur = dark ? 22 : 10;
      ctx.stroke();
      ctx.restore();

      // 2. Tail plume ribbons at final segment
      const tailEnd = spine[SEGMENT_COUNT - 1];
      const tailPrev = spine[SEGMENT_COUNT - 2];
      const tailAngle = Math.atan2(tailEnd.y - tailPrev.y, tailEnd.x - tailPrev.x);
      ctx.save();
      ctx.strokeStyle = dark ? '#fbbf24' : '#d97706';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      for (let f = -1; f <= 1; f++) {
        const a = tailAngle + f * 0.35 + Math.sin(time * 7 + f) * 0.18;
        ctx.beginPath();
        ctx.moveTo(tailEnd.x, tailEnd.y);
        ctx.quadraticCurveTo(
          tailEnd.x + Math.cos(a) * 13,
          tailEnd.y + Math.sin(a) * 13,
          tailEnd.x + Math.cos(a + 0.15) * 24,
          tailEnd.y + Math.sin(a + 0.15) * 24
        );
        ctx.stroke();
      }
      ctx.restore();

      // 3. Four animated Eastern Dragon legs (indices 8 and 21)
      const legAnchors = [8, 21];
      ctx.save();
      ctx.strokeStyle = dark ? '#38bdf8' : '#4338ca';
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      legAnchors.forEach((idx, pairIdx) => {
        const cur = spine[idx];
        const prev = spine[idx - 1];
        const dir = Math.atan2(prev.y - cur.y, prev.x - cur.x);
        const swing = Math.sin(time * 5.2 + pairIdx * Math.PI) * 0.35;
        for (const side of [-1, 1]) {
          const shoulderAngle = dir + side * (Math.PI * 0.55) + swing * side;
          const elbowX = cur.x + Math.cos(shoulderAngle) * 12;
          const elbowY = cur.y + Math.sin(shoulderAngle) * 12;
          const clawAngle = shoulderAngle - side * 0.55;
          const pawX = elbowX + Math.cos(clawAngle) * 10;
          const pawY = elbowY + Math.sin(clawAngle) * 10;

          ctx.beginPath();
          ctx.moveTo(cur.x, cur.y);
          ctx.lineTo(elbowX, elbowY);
          ctx.lineTo(pawX, pawY);
          ctx.stroke();

          // Tiny golden claw tips
          ctx.fillStyle = dark ? '#fbbf24' : '#d97706';
          ctx.beginPath();
          ctx.arc(pawX, pawY, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.restore();

      // 4. Body segments & scales (back to front)
      for (let i = SEGMENT_COUNT - 1; i >= 1; i--) {
        const t = i / (SEGMENT_COUNT - 1);
        const radius = lerp(10.5, 2.2, Math.pow(t, 0.85));
        const p = spine[i];
        const prev = spine[i - 1];
        const segAngle = Math.atan2(prev.y - p.y, prev.x - p.x);

        // Gradient hue from indigo-violet to electric cyan toward tail
        const color =
          t < 0.35
            ? dark
              ? '#6366f1'
              : '#4f46e5'
            : t < 0.72
            ? dark
              ? '#8b5cf6'
              : '#7c3aed'
            : dark
            ? '#38bdf8'
            : '#0284c7';

        // Golden dorsal spine spike every 2 segments
        if (i % 2 === 1 && i < SEGMENT_COUNT - 3) {
          const spikeLen = lerp(8.5, 3, t);
          const spikeAngle = segAngle + Math.PI / 2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(
            p.x + Math.cos(spikeAngle - 0.5) * spikeLen,
            p.y + Math.sin(spikeAngle - 0.5) * spikeLen
          );
          ctx.lineTo(
            p.x - Math.cos(segAngle) * 4,
            p.y - Math.sin(segAngle) * 4
          );
          ctx.closePath();
          ctx.fillStyle = dark ? 'rgba(251, 191, 36, 0.85)' : 'rgba(217, 119, 6, 0.75)';
          ctx.fill();
        }

        // Scale disc
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // Subtle inner scale rim highlight
        if (i % 2 === 0 && radius > 3.5) {
          ctx.beginPath();
          ctx.arc(
            p.x + Math.cos(segAngle) * (radius * 0.2),
            p.y + Math.sin(segAngle) * (radius * 0.2),
            radius * 0.58,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = dark
            ? 'rgba(224, 231, 255, 0.25)'
            : 'rgba(255, 255, 255, 0.35)';
          ctx.fill();
        }
      }

      // 5. Sculpted Eastern Dragon Head (segment 0)
      const head = spine[0];
      const neck = spine[1];
      const headAngle = Math.atan2(head.y - neck.y, head.x - neck.x);

      ctx.save();
      ctx.translate(head.x, head.y);
      ctx.rotate(headAngle);

      // Flowing golden whiskers (râu rồng)
      ctx.strokeStyle = dark ? '#fde68a' : '#d97706';
      ctx.lineWidth = 1.6;
      ctx.lineCap = 'round';
      for (const side of [-1, 1]) {
        const wave1 = Math.sin(time * 6 + side) * 6;
        const wave2 = Math.cos(time * 5 + side) * 8;
        ctx.beginPath();
        ctx.moveTo(11, side * 4);
        ctx.bezierCurveTo(
          4,
          side * (16 + wave1),
          -14,
          side * (22 + wave2),
          -28,
          side * (16 - wave1 * 0.7)
        );
        ctx.stroke();
      }

      // Swept-back golden antler horns
      ctx.strokeStyle = dark ? '#fbbf24' : '#b45309';
      ctx.lineWidth = 2.4;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(-2, side * 6);
        ctx.quadraticCurveTo(-11, side * 14, -22, side * 11);
        ctx.stroke();

        // Small horn fork
        ctx.beginPath();
        ctx.moveTo(-11, side * 11);
        ctx.lineTo(-15, side * 16);
        ctx.stroke();
      }

      // Mane spikes behind head
      ctx.fillStyle = dark ? '#8b5cf6' : '#6d28d9';
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(-3, side * 8);
        ctx.lineTo(-14, side * 13);
        ctx.lineTo(-10, side * 4);
        ctx.closePath();
        ctx.fill();
      }

      // Dragon skull & snout
      ctx.fillStyle = dark ? '#6366f1' : '#4338ca';
      ctx.shadowColor = dark ? '#38bdf8' : '#6366f1';
      ctx.shadowBlur = dark ? 14 : 6;
      ctx.beginPath();
      ctx.moveTo(16, 0);
      ctx.quadraticCurveTo(10, -8.5, -4, -9.5);
      ctx.quadraticCurveTo(-11, -6, -10, 0);
      ctx.quadraticCurveTo(-11, 6, -4, 9.5);
      ctx.quadraticCurveTo(10, 8.5, 16, 0);
      ctx.closePath();
      ctx.fill();

      // Golden crest along nose bridge
      ctx.shadowBlur = 0;
      ctx.strokeStyle = dark ? '#fbbf24' : '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(13, 0);
      ctx.stroke();

      // Glowing eyes
      ctx.fillStyle = '#fde047';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 8;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(3, side * 5, 2.6, 1.7, side * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      ctx.restore();
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (!document.hidden) {
        drawDragon(dt);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(layoutTimer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onRefreshLayout);
    };
  }, [showDragon]);

  if (!showDragon) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none w-full h-full"
    />
  );
};
