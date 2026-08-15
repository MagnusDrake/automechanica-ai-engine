import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Shield, Heart, Zap, Crosshair, Flame } from 'lucide-react';

export default function AsteroidsGameEngine({ modelConfig, onOpenCodeEditor }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [gameState, setGameState] = useState('READY'); // READY | PLAYING | GAMEOVER | VICTORY
  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioCtxRef = useRef(null);

  const playSound = (freq, type = 'sine', duration = 0.1, gainVal = 0.08) => {
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
    ship: { x: 266, y: 280, r: 12, angle: -Math.PI / 2, vx: 0, vy: 0, rotSpeed: 0, thrust: false },
    lasers: [],
    asteroids: [],
    particles: [],
    localScore: 0,
    localLives: 3,
    localWave: 1
  });

  const spawnAsteroids = (count, w, h) => {
    const asts = [];
    for (let i = 0; i < count; i++) {
      let x, y;
      do {
        x = Math.random() * w;
        y = Math.random() * h;
      } while (Math.hypot(x - 266, y - 280) < 120); // Keep distance from ship spawn

      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 1.2;
      asts.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: 32, // Large
        tier: 3,
        vertCount: 8 + Math.floor(Math.random() * 4),
        offsets: Array.from({ length: 12 }, () => 0.8 + Math.random() * 0.4)
      });
    }
    return asts;
  };

  const handleStartGame = () => {
    const canvas = canvasRef.current;
    const w = canvas ? canvas.width : 532;
    const h = canvas ? canvas.height : 560;

    gameRef.current = {
      ship: { x: w / 2, y: h / 2, r: 12, angle: -Math.PI / 2, vx: 0, vy: 0, rotSpeed: 0, thrust: false },
      lasers: [],
      asteroids: spawnAsteroids(4, w, h),
      particles: [],
      localScore: 0,
      localLives: 3,
      localWave: 1
    };
    setScore(0);
    setLives(3);
    setWave(1);
    setGameState('PLAYING');
  };

  // Keyboard Handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      const ship = gameRef.current.ship;
      if (['ArrowLeft', 'KeyA', 'a', 'A'].includes(e.key) || ['ArrowLeft', 'KeyA'].includes(e.code)) {
        ship.rotSpeed = -0.08;
        e.preventDefault();
      }
      if (['ArrowRight', 'KeyD', 'd', 'D'].includes(e.key) || ['ArrowRight', 'KeyD'].includes(e.code)) {
        ship.rotSpeed = 0.08;
        e.preventDefault();
      }
      if (['ArrowUp', 'KeyW', 'w', 'W'].includes(e.key) || ['ArrowUp', 'KeyW'].includes(e.code)) {
        ship.thrust = true;
        e.preventDefault();
      }
      if (e.code === 'Space' || e.key === ' ') {
        fireLaser();
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      const ship = gameRef.current.ship;
      if (['ArrowLeft', 'KeyA', 'ArrowRight', 'KeyD', 'a', 'A', 'd', 'D'].includes(e.key) || ['ArrowLeft', 'KeyA', 'ArrowRight', 'KeyD'].includes(e.code)) {
        ship.rotSpeed = 0;
      }
      if (['ArrowUp', 'KeyW', 'w', 'W'].includes(e.key) || ['ArrowUp', 'KeyW'].includes(e.code)) {
        ship.thrust = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const fireLaser = () => {
    if (gameState !== 'PLAYING') return;
    const ship = gameRef.current.ship;
    const speed = 9.0;
    gameRef.current.lasers.push({
      x: ship.x + Math.cos(ship.angle) * ship.r,
      y: ship.y + Math.sin(ship.angle) * ship.r,
      vx: Math.cos(ship.angle) * speed + ship.vx * 0.2,
      vy: Math.sin(ship.angle) * speed + ship.vy * 0.2,
      life: 55
    });
    playSound(750, 'sawtooth', 0.08, 0.05);
  };

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    let animationFrameId;

    const gameLoop = () => {
      const g = gameRef.current;
      const ship = g.ship;

      if (gameState === 'PLAYING') {
        // Physics: Ship rotation & thrust
        ship.angle += ship.rotSpeed;

        if (ship.thrust) {
          const thrustPower = modelConfig.physicsThrust || 0.15;
          ship.vx += Math.cos(ship.angle) * thrustPower;
          ship.vy += Math.sin(ship.angle) * thrustPower;

          // Speed limit
          const maxSpd = modelConfig.maxSpeed || 6.5;
          const currentSpd = Math.hypot(ship.vx, ship.vy);
          if (currentSpd > maxSpd) {
            ship.vx = (ship.vx / currentSpd) * maxSpd;
            ship.vy = (ship.vy / currentSpd) * maxSpd;
          }

          // Thruster flame particles
          g.particles.push({
            x: ship.x - Math.cos(ship.angle) * (ship.r + 4),
            y: ship.y - Math.sin(ship.angle) * (ship.r + 4),
            vx: -Math.cos(ship.angle) * 2 + (Math.random() - 0.5),
            vy: -Math.sin(ship.angle) * 2 + (Math.random() - 0.5),
            color: Math.random() > 0.5 ? '#f59e0b' : '#ef4444',
            life: 18,
            r: 2.5
          });
        }

        // Friction dampening
        ship.vx *= 0.985;
        ship.vy *= 0.985;
        ship.x = (ship.x + ship.vx + w) % w;
        ship.y = (ship.y + ship.vy + h) % h;

        // Lasers update
        for (let i = g.lasers.length - 1; i >= 0; i--) {
          const l = g.lasers[i];
          l.x = (l.x + l.vx + w) % w;
          l.y = (l.y + l.vy + h) % h;
          l.life--;
          if (l.life <= 0) g.lasers.splice(i, 1);
        }

        // Asteroids update & Laser Collision
        for (let i = g.asteroids.length - 1; i >= 0; i--) {
          const ast = g.asteroids[i];
          ast.x = (ast.x + ast.vx + w) % w;
          ast.y = (ast.y + ast.vy + h) % h;

          // Check laser collisions
          for (let j = g.lasers.length - 1; j >= 0; j--) {
            const l = g.lasers[j];
            if (Math.hypot(l.x - ast.x, l.y - ast.y) < ast.r) {
              // Destroy laser
              g.lasers.splice(j, 1);

              // Explosion particles
              for (let p = 0; p < 12; p++) {
                const pAngle = Math.random() * Math.PI * 2;
                const pSpd = 1 + Math.random() * 3;
                g.particles.push({
                  x: ast.x, y: ast.y,
                  vx: Math.cos(pAngle) * pSpd,
                  vy: Math.sin(pAngle) * pSpd,
                  color: modelConfig.accentColor || '#38bdf8',
                  life: 25,
                  r: 2
                });
              }

              playSound(180, 'sawtooth', 0.2, 0.09);
              g.localScore += (4 - ast.tier) * 50;
              setScore(g.localScore);

              // Split asteroid
              if (ast.tier > 1) {
                const nextR = ast.tier === 3 ? 20 : 12;
                for (let k = 0; k < 2; k++) {
                  const splitAngle = Math.random() * Math.PI * 2;
                  g.asteroids.push({
                    x: ast.x, y: ast.y,
                    vx: Math.cos(splitAngle) * (Math.abs(ast.vx) + 0.6),
                    vy: Math.sin(splitAngle) * (Math.abs(ast.vy) + 0.6),
                    r: nextR,
                    tier: ast.tier - 1,
                    vertCount: 8,
                    offsets: Array.from({ length: 8 }, () => 0.8 + Math.random() * 0.4)
                  });
                }
              }

              g.asteroids.splice(i, 1);
              break;
            }
          }

          // Check Ship Collision
          if (Math.hypot(ship.x - ast.x, ship.y - ast.y) < ship.r + ast.r) {
            g.localLives--;
            setLives(g.localLives);
            playSound(110, 'sawtooth', 0.4, 0.15);

            // Explosion
            for (let p = 0; p < 24; p++) {
              const pAngle = Math.random() * Math.PI * 2;
              g.particles.push({
                x: ship.x, y: ship.y,
                vx: Math.cos(pAngle) * 3,
                vy: Math.sin(pAngle) * 3,
                color: '#ef4444',
                life: 30,
                r: 3
              });
            }

            if (g.localLives <= 0) {
              setGameState('GAMEOVER');
            } else {
              ship.x = w / 2;
              ship.y = h / 2;
              ship.vx = 0;
              ship.vy = 0;
            }
          }
        }

        // Wave cleared
        if (g.asteroids.length === 0) {
          g.localWave++;
          setWave(g.localWave);
          g.asteroids = spawnAsteroids(3 + g.localWave, w, h);
          playSound(880, 'sine', 0.4);
        }

        // Particles update
        for (let i = g.particles.length - 1; i >= 0; i--) {
          const p = g.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
          if (p.life <= 0) g.particles.splice(i, 1);
        }
      }

      // RENDER CANVAS
      ctx.fillStyle = '#060813';
      ctx.fillRect(0, 0, w, h);

      // Starfield background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let s = 0; s < 40; s++) {
        const sx = (s * 47) % w;
        const sy = (s * 73) % h;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Render Particles
      g.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Lasers
      ctx.fillStyle = modelConfig.accentColor || '#f43f5e';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 8;
      g.lasers.forEach(l => {
        ctx.beginPath();
        ctx.arc(l.x, l.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Render Asteroids (Vector Polygon Outline)
      ctx.strokeStyle = modelConfig.primaryColor || '#38bdf8';
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 6;
      ctx.lineWidth = 1.8;
      g.asteroids.forEach(ast => {
        ctx.beginPath();
        for (let v = 0; v < ast.vertCount; v++) {
          const vAngle = (v / ast.vertCount) * Math.PI * 2;
          const rad = ast.r * (ast.offsets[v] || 1);
          const vx = ast.x + Math.cos(vAngle) * rad;
          const vy = ast.y + Math.sin(vAngle) * rad;
          if (v === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        }
        ctx.closePath();
        ctx.stroke();
      });
      ctx.shadowBlur = 0;

      // Render Ship
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.angle);
      ctx.strokeStyle = '#ffffff';
      ctx.shadowColor = modelConfig.primaryColor || '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ship.r + 4, 0);
      ctx.lineTo(-ship.r, ship.r * 0.7);
      ctx.lineTo(-ship.r * 0.5, 0);
      ctx.lineTo(-ship.r, -ship.r * 0.7);
      ctx.closePath();
      ctx.stroke();

      // Thruster Flame when accelerating
      if (ship.thrust) {
        ctx.strokeStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(-ship.r * 0.5, -3);
        ctx.lineTo(-ship.r * 1.5, 0);
        ctx.lineTo(-ship.r * 0.5, 3);
        ctx.stroke();
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [modelConfig, gameState]);

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      
      {/* Game Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '532px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Crosshair size={24} color={modelConfig.primaryColor} />
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{modelConfig.version}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{modelConfig.modelName}</div>
          </div>
        </div>

        {/* HUD Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: lives }).map((_, i) => (
              <Shield key={i} size={18} color="#38bdf8" fill="#38bdf8" />
            ))}
          </div>

          <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>WAVE</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#60a5fa' }}>{wave}</div>
          </div>

          <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>SCORE</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>{score}</div>
          </div>

          <button onClick={() => setSoundEnabled(!soundEnabled)} style={{ background: 'transparent', border: 'none', color: soundEnabled ? '#34d399' : 'var(--text-dim)', cursor: 'pointer' }}>
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </div>

      {/* Special Ability Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(15, 23, 42, 0.8)', padding: '6px 12px', borderRadius: '9999px', border: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: modelConfig.primaryColor, fontWeight: 700 }}>
        <Zap size={14} />
        <span>Physics: {modelConfig.special}</span>
      </div>

      {/* HTML5 Canvas Frame */}
      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: `2px solid ${modelConfig.primaryColor}`, boxShadow: `0 0 24px ${modelConfig.primaryColor}40` }}>
        <canvas ref={canvasRef} width={532} height={560} style={{ display: 'block', background: '#060813' }} />

        {gameState !== 'PLAYING' && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(6, 8, 19, 0.88)', backdropFilter: 'blur(6px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', color: '#fff', textAlign: 'center', padding: '24px' }}>
            {gameState === 'READY' && (
              <>
                <Crosshair size={48} color={modelConfig.primaryColor} />
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{modelConfig.version}</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Rotate with [A/D] or [Arrows], Thrust with [W/Up], Fire with [SPACE].
                </p>
                <button className="btn btn-emerald" style={{ padding: '12px 24px', fontSize: '1rem' }} onClick={handleStartGame}>
                  <Play size={18} />
                  <span>Launch Spaceship</span>
                </button>
              </>
            )}

            {gameState === 'GAMEOVER' && (
              <>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f87171' }}>SHIP DESTROYED</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Final Score: {score} pts (Wave {wave})</p>
                <button className="btn btn-emerald" onClick={handleStartGame}>
                  <RotateCcw size={16} />
                  <span>Respawn Ship</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* On-screen Controls */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button className="btn btn-outline btn-sm" onMouseDown={() => { gameRef.current.ship.rotSpeed = -0.08; }} onMouseUp={() => { gameRef.current.ship.rotSpeed = 0; }}>
          ◄ ROTATE LEFT (A)
        </button>
        <button className="btn btn-emerald btn-sm" onMouseDown={() => { gameRef.current.ship.thrust = true; }} onMouseUp={() => { gameRef.current.ship.thrust = false; }}>
          <Flame size={14} /> THRUST (W)
        </button>
        <button className="btn btn-outline btn-sm" onMouseDown={() => { gameRef.current.ship.rotSpeed = 0.08; }} onMouseUp={() => { gameRef.current.ship.rotSpeed = 0; }}>
          ROTATE RIGHT (D) ►
        </button>
        <button className="btn btn-blue btn-sm" onClick={fireLaser}>
          <Crosshair size={14} /> FIRE (SPACE)
        </button>
      </div>

    </div>
  );
}
