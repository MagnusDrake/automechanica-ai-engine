import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Shield, Coins, Zap, Crosshair, Sparkles } from 'lucide-react';

export default function TowerDefenseEngine({ modelConfig }) {
  const canvasRef = useRef(null);
  const [gold, setGold] = useState(150);
  const [coreHp, setCoreHp] = useState(100);
  const [wave, setWave] = useState(1);
  const [selectedTurretType, setSelectedTurretType] = useState('laser'); // laser | cryo | plasma
  const [gameState, setGameState] = useState('READY'); // READY | PLAYING | GAMEOVER | VICTORY
  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioCtxRef = useRef(null);

  const playSound = (freq, type = 'sine', duration = 0.1, gainVal = 0.06) => {
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

  const waypoints = [
    { x: 0, y: 140 },
    { x: 160, y: 140 },
    { x: 160, y: 380 },
    { x: 380, y: 380 },
    { x: 380, y: 200 },
    { x: 532, y: 200 }
  ];

  const gameRef = useRef({
    turrets: [],
    creeps: [],
    projectiles: [],
    particles: [],
    gold: 150,
    coreHp: 100,
    wave: 1,
    waveSpawnCount: 12,
    spawnTimer: 0
  });

  const handleStartGame = () => {
    gameRef.current = {
      turrets: [
        { x: 100, y: 200, type: 'laser', range: 110, rate: 20, timer: 0, color: '#38bdf8' },
        { x: 260, y: 300, type: 'cryo', range: 100, rate: 35, timer: 0, color: '#06b6d4' }
      ],
      creeps: [],
      projectiles: [],
      particles: [],
      gold: 150,
      coreHp: 100,
      wave: 1,
      waveSpawnCount: 10,
      spawnTimer: 0
    };
    setGold(150);
    setCoreHp(100);
    setWave(1);
    setGameState('PLAYING');
  };

  const handleCanvasClick = (e) => {
    if (gameState !== 'PLAYING') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const turretCost = selectedTurretType === 'laser' ? 50 : selectedTurretType === 'cryo' ? 75 : 100;
    if (gameRef.current.gold < turretCost) return;

    // Check not on road
    const nearRoad = waypoints.some((wp, idx) => {
      if (idx === 0) return false;
      const prev = waypoints[idx - 1];
      const dist = Math.hypot(clickX - (prev.x + wp.x) / 2, clickY - (prev.y + wp.y) / 2);
      return dist < 30;
    });

    if (nearRoad) return;

    gameRef.current.gold -= turretCost;
    setGold(gameRef.current.gold);

    const range = selectedTurretType === 'laser' ? 110 : selectedTurretType === 'cryo' ? 95 : 140;
    const rate = selectedTurretType === 'laser' ? 18 : selectedTurretType === 'cryo' ? 30 : 45;
    const color = selectedTurretType === 'laser' ? '#38bdf8' : selectedTurretType === 'cryo' ? '#06b6d4' : '#f43f5e';

    gameRef.current.turrets.push({
      x: clickX,
      y: clickY,
      type: selectedTurretType,
      range,
      rate,
      timer: 0,
      color
    });

    playSound(600, 'sine', 0.1, 0.08);
  };

  // Main Canvas Render Loop
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
        // Spawn Creeps
        g.spawnTimer++;
        if (g.spawnTimer % 45 === 0 && g.waveSpawnCount > 0) {
          g.waveSpawnCount--;
          const hpBase = 40 + g.wave * 25;
          g.creeps.push({
            x: waypoints[0].x,
            y: waypoints[0].y,
            wpIdx: 1,
            hp: hpBase,
            maxHp: hpBase,
            speed: 1.6 + (g.wave * 0.15),
            slowTimer: 0,
            r: 9,
            color: g.wave % 2 === 0 ? '#ec4899' : '#f59e0b'
          });
        }

        // Update Creeps
        for (let i = g.creeps.length - 1; i >= 0; i--) {
          const c = g.creeps[i];
          const targetWp = waypoints[c.wpIdx];
          const angle = Math.atan2(targetWp.y - c.y, targetWp.x - c.x);
          const currentSpeed = c.slowTimer > 0 ? c.speed * 0.5 : c.speed;
          if (c.slowTimer > 0) c.slowTimer--;

          c.x += Math.cos(angle) * currentSpeed;
          c.y += Math.sin(angle) * currentSpeed;

          if (Math.hypot(c.x - targetWp.x, c.y - targetWp.y) < 6) {
            c.wpIdx++;
            if (c.wpIdx >= waypoints.length) {
              // Reached base core
              g.coreHp = Math.max(0, g.coreHp - 15);
              setCoreHp(g.coreHp);
              playSound(120, 'sawtooth', 0.3, 0.15);
              g.creeps.splice(i, 1);

              if (g.coreHp <= 0) {
                setGameState('GAMEOVER');
              }
              continue;
            }
          }
        }

        // Turret Targeting & Firing
        g.turrets.forEach(turret => {
          turret.timer++;
          if (turret.timer >= turret.rate) {
            // Find closest creep in range
            const target = g.creeps.find(c => Math.hypot(c.x - turret.x, c.y - turret.y) <= turret.range);
            if (target) {
              turret.timer = 0;

              // Fire projectile
              g.projectiles.push({
                x: turret.x,
                y: turret.y,
                target,
                type: turret.type,
                color: turret.color,
                damage: turret.type === 'plasma' ? 35 : turret.type === 'cryo' ? 12 : 22,
                speed: 7
              });

              playSound(turret.type === 'plasma' ? 150 : 800, turret.type === 'plasma' ? 'sawtooth' : 'triangle', 0.08, 0.04);
            }
          }
        });

        // Projectiles Update & Collision
        for (let i = g.projectiles.length - 1; i >= 0; i--) {
          const p = g.projectiles[i];
          const t = p.target;

          if (!g.creeps.includes(t)) {
            g.projectiles.splice(i, 1);
            continue;
          }

          const angle = Math.atan2(t.y - p.y, t.x - p.x);
          p.x += Math.cos(angle) * p.speed;
          p.y += Math.sin(angle) * p.speed;

          if (Math.hypot(p.x - t.x, p.y - t.y) < 10) {
            // Hit!
            t.hp -= p.damage;
            if (p.type === 'cryo') t.slowTimer = 60; // 60 frames slow

            // Particle hit effect
            for (let k = 0; k < 6; k++) {
              g.particles.push({
                x: t.x, y: t.y,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                color: p.color,
                life: 15,
                r: 2
              });
            }

            // Check Creep Death
            if (t.hp <= 0) {
              const cIdx = g.creeps.indexOf(t);
              if (cIdx !== -1) g.creeps.splice(cIdx, 1);
              g.gold += 15;
              setGold(g.gold);
              playSound(400, 'sine', 0.05, 0.03);
            }

            g.projectiles.splice(i, 1);
          }
        }

        // Wave Completion Check
        if (g.waveSpawnCount === 0 && g.creeps.length === 0) {
          g.wave++;
          setWave(g.wave);
          g.waveSpawnCount = 10 + g.wave * 4;
          g.gold += 40;
          setGold(g.gold);
          playSound(650, 'sine', 0.3, 0.08);
        }

        // Particles
        for (let i = g.particles.length - 1; i >= 0; i--) {
          const pt = g.particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life--;
          if (pt.life <= 0) g.particles.splice(i, 1);
        }
      }

      // RENDER CANVAS
      ctx.fillStyle = '#0a0e1a';
      ctx.fillRect(0, 0, w, h);

      // Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      for (let x = 0; x < w; x += 38) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 38) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // Render Waypoint Path / Road
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 32;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      waypoints.forEach((wp, idx) => {
        if (idx === 0) ctx.moveTo(wp.x, wp.y);
        else ctx.lineTo(wp.x, wp.y);
      });
      ctx.stroke();

      // Road Glow Line
      ctx.strokeStyle = modelConfig.primaryColor || '#8b5cf6';
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 8;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Render Base Core
      const lastWp = waypoints[waypoints.length - 1];
      ctx.fillStyle = '#10b981';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(lastWp.x, lastWp.y, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Render Turrets
      g.turrets.forEach(t => {
        // Range ring (subtle)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.range, 0, Math.PI * 2);
        ctx.stroke();

        // Turret Base
        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath();
        ctx.arc(t.x, t.y, 14, 0, Math.PI * 2);
        ctx.fill();

        // Turret Crystal
        ctx.fillStyle = t.color;
        ctx.shadowColor = t.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Render Creeps
      g.creeps.forEach(c => {
        ctx.fillStyle = c.color;
        ctx.shadowColor = c.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Health bar
        const barW = 16;
        const hpPercent = c.hp / c.maxHp;
        ctx.fillStyle = '#374151';
        ctx.fillRect(c.x - barW / 2, c.y - 14, barW, 3);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(c.x - barW / 2, c.y - 14, barW * hpPercent, 3);
      });

      // Render Projectiles
      g.projectiles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Particles
      g.particles.forEach(pt => {
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      });

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
          <Shield size={24} color={modelConfig.primaryColor} />
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{modelConfig.version}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{modelConfig.modelName}</div>
          </div>
        </div>

        {/* HUD Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            <Coins size={16} />
            <span>{gold}</span>
          </div>

          <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>CORE HP</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: coreHp < 30 ? '#f87171' : '#34d399' }}>{coreHp}%</div>
          </div>

          <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>WAVE</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#a855f7' }}>{wave}</div>
          </div>

          <button onClick={() => setSoundEnabled(!soundEnabled)} style={{ background: 'transparent', border: 'none', color: soundEnabled ? '#34d399' : 'var(--text-dim)', cursor: 'pointer' }}>
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </div>

      {/* Turret Selector Bar */}
      <div style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.8)', padding: '6px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
        {[
          { id: 'laser', label: 'Pulse Laser (50 G)', color: '#38bdf8' },
          { id: 'cryo', label: 'Cryo Freeze (75 G)', color: '#06b6d4' },
          { id: 'plasma', label: 'Plasma Mortar (100 G)', color: '#f43f5e' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setSelectedTurretType(t.id)}
            className={`btn btn-sm ${selectedTurretType === t.id ? 'btn-emerald' : 'btn-outline'}`}
            style={{ border: 'none', fontSize: '0.75rem' }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.color }} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Canvas Frame */}
      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: `2px solid ${modelConfig.primaryColor}`, boxShadow: `0 0 24px ${modelConfig.primaryColor}40`, cursor: 'crosshair' }}>
        <canvas ref={canvasRef} onClick={handleCanvasClick} width={532} height={560} style={{ display: 'block', background: '#0a0e1a' }} />

        {gameState !== 'PLAYING' && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(10, 14, 26, 0.88)', backdropFilter: 'blur(6px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', color: '#fff', textAlign: 'center', padding: '24px' }}>
            {gameState === 'READY' && (
              <>
                <Shield size={48} color={modelConfig.primaryColor} />
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{modelConfig.version}</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Click anywhere off the road to place turrets. Defend the green Core from creep swarms!
                </p>
                <button className="btn btn-emerald" style={{ padding: '12px 24px', fontSize: '1rem' }} onClick={handleStartGame}>
                  <Play size={18} />
                  <span>Start Defense Wave</span>
                </button>
              </>
            )}

            {gameState === 'GAMEOVER' && (
              <>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f87171' }}>CORE OVERRUN!</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Survived until Wave {wave}</p>
                <button className="btn btn-emerald" onClick={handleStartGame}>
                  <RotateCcw size={16} />
                  <span>Defend Again</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        Click any grid slot to construct selected turret. Defeat creeps to earn gold and fortify your defense.
      </div>

    </div>
  );
}
