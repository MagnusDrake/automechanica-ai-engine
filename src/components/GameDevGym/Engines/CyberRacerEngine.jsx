import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Gauge, Zap, Flame } from 'lucide-react';

export default function CyberRacerEngine({ modelConfig }) {
  const canvasRef = useRef(null);
  const [speedKmh, setSpeedKmh] = useState(0);
  const [distance, setDistance] = useState(0);
  const [nitro, setNitro] = useState(100);
  const [gameState, setGameState] = useState('READY'); // READY | PLAYING | GAMEOVER
  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioCtxRef = useRef(null);

  const playSound = (freq, type = 'sawtooth', duration = 0.1, gainVal = 0.05) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const gameRef = useRef({
    playerX: 0, // -1 (left) to 1 (right)
    speed: 0,
    maxSpeed: 240,
    accel: 1.8,
    braking: 3.5,
    nitroActive: false,
    nitroFuel: 100,
    roadOffset: 0,
    curve: 0,
    targetCurve: 0,
    curveTimer: 0,
    distanceKm: 0,
    traffic: [
      { x: -0.5, y: 400, speed: 80, color: '#f43f5e' },
      { x: 0.2, y: 800, speed: 95, color: '#38bdf8' },
      { x: -0.2, y: 1200, speed: 70, color: '#a855f7' },
      { x: 0.6, y: 1600, speed: 110, color: '#f59e0b' }
    ],
    keys: { left: false, right: false, up: false, down: false, nitro: false }
  });

  const handleStartGame = () => {
    gameRef.current = {
      playerX: 0,
      speed: 0,
      maxSpeed: 240,
      accel: 1.8,
      braking: 3.5,
      nitroActive: false,
      nitroFuel: 100,
      roadOffset: 0,
      curve: 0,
      targetCurve: 0,
      curveTimer: 0,
      distanceKm: 0,
      traffic: [
        { x: -0.5, y: 400, speed: 80, color: '#f43f5e' },
        { x: 0.2, y: 800, speed: 95, color: '#38bdf8' },
        { x: -0.2, y: 1200, speed: 70, color: '#a855f7' },
        { x: 0.6, y: 1600, speed: 110, color: '#f59e0b' }
      ],
      keys: { left: false, right: false, up: false, down: false, nitro: false }
    };
    setSpeedKmh(0);
    setDistance(0);
    setNitro(100);
    setGameState('PLAYING');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const k = gameRef.current.keys;
      if (['ArrowLeft', 'KeyA', 'a', 'A'].includes(e.key) || ['ArrowLeft', 'KeyA'].includes(e.code)) { k.left = true; e.preventDefault(); }
      if (['ArrowRight', 'KeyD', 'd', 'D'].includes(e.key) || ['ArrowRight', 'KeyD'].includes(e.code)) { k.right = true; e.preventDefault(); }
      if (['ArrowUp', 'KeyW', 'w', 'W'].includes(e.key) || ['ArrowUp', 'KeyW'].includes(e.code)) { k.up = true; e.preventDefault(); }
      if (['ArrowDown', 'KeyS', 's', 'S'].includes(e.key) || ['ArrowDown', 'KeyS'].includes(e.code)) { k.down = true; e.preventDefault(); }
      if (e.code === 'Space' || e.key === ' ') { k.nitro = true; e.preventDefault(); }
    };

    const handleKeyUp = (e) => {
      const k = gameRef.current.keys;
      if (['ArrowLeft', 'KeyA', 'a', 'A'].includes(e.key) || ['ArrowLeft', 'KeyA'].includes(e.code)) k.left = false;
      if (['ArrowRight', 'KeyD', 'd', 'D'].includes(e.key) || ['ArrowRight', 'KeyD'].includes(e.code)) k.right = false;
      if (['ArrowUp', 'KeyW', 'w', 'W'].includes(e.key) || ['ArrowUp', 'KeyW'].includes(e.code)) k.up = false;
      if (['ArrowDown', 'KeyS', 's', 'S'].includes(e.key) || ['ArrowDown', 'KeyS'].includes(e.code)) k.down = false;
      if (e.code === 'Space' || e.key === ' ') k.nitro = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main 2.5D Raycasting Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    let animationFrameId;

    const gameLoop = () => {
      const g = gameRef.current;

      if (gameState === 'PLAYING') {
        // Acceleration / Nitro
        const isNitro = g.keys.nitro && g.nitroFuel > 0 && g.speed > 50;
        const currentMax = isNitro ? 320 : g.maxSpeed;

        if (isNitro) {
          g.speed += g.accel * 2.2;
          g.nitroFuel = Math.max(0, g.nitroFuel - 0.4);
          setNitro(Math.round(g.nitroFuel));
          if (Math.random() > 0.7) playSound(120 + Math.random() * 80, 'triangle', 0.05, 0.08);
        } else if (g.keys.up) {
          g.speed = Math.min(currentMax, g.speed + g.accel);
        } else if (g.keys.down) {
          g.speed = Math.max(0, g.speed - g.braking);
        } else {
          g.speed = Math.max(0, g.speed - 0.6); // Natural deceleration
        }

        // Steering (scales with speed)
        const steerSpeed = (g.speed / g.maxSpeed) * 0.035;
        if (g.keys.left) g.playerX = Math.max(-0.95, g.playerX - steerSpeed);
        if (g.keys.right) g.playerX = Math.min(0.95, g.playerX + steerSpeed);

        // Natural road curve changes
        g.curveTimer++;
        if (g.curveTimer % 120 === 0) {
          g.targetCurve = (Math.random() - 0.5) * 4;
        }
        g.curve += (g.targetCurve - g.curve) * 0.02;

        // Centrifugal force pushing car outward on turns
        g.playerX -= (g.curve * 0.005) * (g.speed / g.maxSpeed);

        // Distance & Progress
        g.roadOffset += g.speed * 0.4;
        g.distanceKm += (g.speed / 3600) * 0.05;
        setSpeedKmh(Math.round(g.speed));
        setDistance(Math.round(g.distanceKm * 100) / 100);

        // Traffic AI update
        for (let i = 0; i < g.traffic.length; i++) {
          const car = g.traffic[i];
          car.y -= (g.speed - car.speed) * 0.15;

          // Recycle traffic
          if (car.y < 0) {
            car.y = 1200 + Math.random() * 800;
            car.x = (Math.random() - 0.5) * 1.5;
          } else if (car.y > 2200) {
            car.y = 200;
            car.x = (Math.random() - 0.5) * 1.5;
          }

          // Collision check near player (y ~ 50-90)
          if (car.y > 40 && car.y < 95 && Math.abs(car.x - g.playerX) < 0.28) {
            playSound(90, 'sawtooth', 0.4, 0.2);
            setGameState('GAMEOVER');
          }
        }
      }

      // RENDER 2.5D CANVAS
      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.5);
      skyGrad.addColorStop(0, '#0f0c29');
      skyGrad.addColorStop(0.6, '#302b63');
      skyGrad.addColorStop(1, '#24243e');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.5);

      // Neon horizon grid sun
      const horizonY = h * 0.46;
      ctx.fillStyle = '#f43f5e';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.arc(w / 2 + g.curve * 30, horizonY - 10, 45, Math.PI, 0);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Render 2.5D Ground & Road lines (Pseudo-3D Horizon Projection)
      const lines = 120;
      for (let i = 0; i < lines; i++) {
        const perspective = i / lines;
        const lineY = horizonY + (h - horizonY) * Math.pow(perspective, 2.2);
        const nextY = horizonY + (h - horizonY) * Math.pow((i + 1) / lines, 2.2);

        const roadW = w * (0.05 + 0.85 * Math.pow(perspective, 1.8));
        const curveOffset = Math.sin(perspective * Math.PI) * g.curve * 60;
        const roadCenterX = w / 2 - g.playerX * roadW * 0.5 + curveOffset;

        // Grass/Terrain
        const isGrassAlt = Math.floor((g.roadOffset + i * 4) / 20) % 2 === 0;
        ctx.fillStyle = isGrassAlt ? '#060a17' : '#0a1024';
        ctx.fillRect(0, lineY, w, nextY - lineY + 1);

        // Road Surface
        const isRoadAlt = Math.floor((g.roadOffset + i * 4) / 20) % 2 === 0;
        ctx.fillStyle = isRoadAlt ? '#1e1b4b' : '#171438';
        ctx.fillRect(roadCenterX - roadW / 2, lineY, roadW, nextY - lineY + 1);

        // Road Neon Curbs
        ctx.fillStyle = isRoadAlt ? '#10b981' : '#3b82f6';
        const curbW = roadW * 0.05;
        ctx.fillRect(roadCenterX - roadW / 2 - curbW, lineY, curbW, nextY - lineY + 1);
        ctx.fillRect(roadCenterX + roadW / 2, lineY, curbW, nextY - lineY + 1);

        // Center White Dashes
        if (isRoadAlt) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(roadCenterX - 2, lineY, 4, nextY - lineY + 1);
        }
      }

      // Render Traffic AI Cars
      g.traffic.forEach(car => {
        const p = 1.0 - Math.min(1, Math.max(0, car.y / 1500));
        if (p > 0.05 && p < 0.98) {
          const tY = horizonY + (h - horizonY) * Math.pow(p, 2.2);
          const tRoadW = w * (0.05 + 0.85 * Math.pow(p, 1.8));
          const tCurve = Math.sin(p * Math.PI) * g.curve * 60;
          const tCenterX = w / 2 - g.playerX * tRoadW * 0.5 + tCurve;
          const carX = tCenterX + car.x * (tRoadW * 0.45);
          const carW = 38 * p;
          const carH = 22 * p;

          ctx.fillStyle = car.color;
          ctx.shadowColor = car.color;
          ctx.shadowBlur = 10;
          ctx.fillRect(carX - carW / 2, tY - carH, carW, carH);
          ctx.shadowBlur = 0;

          // Tail lights
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(carX - carW / 2 + 2, tY - 6 * p, 4 * p, 4 * p);
          ctx.fillRect(carX + carW / 2 - 6 * p, tY - 6 * p, 4 * p, 4 * p);
        }
      });

      // Render Player Sports Car
      const pCarW = 54;
      const pCarH = 28;
      const pCarX = w / 2;
      const pCarY = h - 60;

      // Car Body (Neon Cyberpunk)
      ctx.fillStyle = modelConfig.primaryColor || '#10b981';
      ctx.shadowColor = modelConfig.primaryColor || '#10b981';
      ctx.shadowBlur = 14;
      ctx.fillRect(pCarX - pCarW / 2, pCarY - pCarH, pCarW, pCarH);
      ctx.shadowBlur = 0;

      // Roof / Windshield
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(pCarX - pCarW / 4, pCarY - pCarH + 4, pCarW / 2, pCarH - 12);

      // Tail lights
      ctx.fillStyle = g.keys.down ? '#ffffff' : '#ef4444';
      ctx.fillRect(pCarX - pCarW / 2 + 4, pCarY - 6, 8, 4);
      ctx.fillRect(pCarX + pCarW / 2 - 12, pCarY - 6, 8, 4);

      // Nitro exhaust glow
      if (g.keys.nitro && g.nitroFuel > 0 && g.speed > 50) {
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 18;
        ctx.fillRect(pCarX - 6, pCarY + 2, 12, 14);
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [modelConfig, gameState]);

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '532px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Gauge size={24} color={modelConfig.primaryColor} />
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{modelConfig.version}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{modelConfig.modelName}</div>
          </div>
        </div>

        {/* HUD Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>NITRO</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8' }}>{nitro}%</div>
          </div>

          <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>SPEED</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: speedKmh > 200 ? '#f43f5e' : '#34d399' }}>{speedKmh} <span style={{ fontSize: '0.7rem' }}>KM/H</span></div>
          </div>

          <button onClick={() => setSoundEnabled(!soundEnabled)} style={{ background: 'transparent', border: 'none', color: soundEnabled ? '#34d399' : 'var(--text-dim)', cursor: 'pointer' }}>
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </div>

      {/* Special Ability Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(15, 23, 42, 0.8)', padding: '6px 12px', borderRadius: '9999px', border: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: modelConfig.primaryColor, fontWeight: 700 }}>
        <Flame size={14} />
        <span>Engine: {modelConfig.special}</span>
      </div>

      {/* Canvas Frame */}
      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: `2px solid ${modelConfig.primaryColor}`, boxShadow: `0 0 24px ${modelConfig.primaryColor}40` }}>
        <canvas ref={canvasRef} width={532} height={560} style={{ display: 'block', background: '#070a11' }} />

        {gameState !== 'PLAYING' && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(7, 10, 17, 0.88)', backdropFilter: 'blur(6px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', color: '#fff', textAlign: 'center', padding: '24px' }}>
            {gameState === 'READY' && (
              <>
                <Gauge size={48} color={modelConfig.primaryColor} />
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{modelConfig.version}</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Steer with [A/D] or [Arrows], Accelerate with [W/Up], Brake with [S/Down], Nitro with [SPACE].
                </p>
                <button className="btn btn-emerald" style={{ padding: '12px 24px', fontSize: '1rem' }} onClick={handleStartGame}>
                  <Play size={18} />
                  <span>Start Racing</span>
                </button>
              </>
            )}

            {gameState === 'GAMEOVER' && (
              <>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f87171' }}>CAR CRASHED!</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Total Distance: {distance} KM</p>
                <button className="btn btn-emerald" onClick={handleStartGame}>
                  <RotateCcw size={16} />
                  <span>Race Again</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* On-screen Controls */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button className="btn btn-outline btn-sm" onMouseDown={() => { gameRef.current.keys.left = true; }} onMouseUp={() => { gameRef.current.keys.left = false; }}>
          ◄ STEER LEFT (A)
        </button>
        <button className="btn btn-emerald btn-sm" onMouseDown={() => { gameRef.current.keys.up = true; }} onMouseUp={() => { gameRef.current.keys.up = false; }}>
          ACCELERATE (W)
        </button>
        <button className="btn btn-outline btn-sm" onMouseDown={() => { gameRef.current.keys.down = true; }} onMouseUp={() => { gameRef.current.keys.down = false; }}>
          BRAKE (S)
        </button>
        <button className="btn btn-outline btn-sm" onMouseDown={() => { gameRef.current.keys.right = true; }} onMouseUp={() => { gameRef.current.keys.right = false; }}>
          STEER RIGHT (D) ►
        </button>
        <button className="btn btn-blue btn-sm" onMouseDown={() => { gameRef.current.keys.nitro = true; }} onMouseUp={() => { gameRef.current.keys.nitro = false; }}>
          <Flame size={14} /> NITRO (SPACE)
        </button>
      </div>

    </div>
  );
}
