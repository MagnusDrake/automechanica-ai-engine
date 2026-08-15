import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Shield, Heart, Skull, Sparkles, Sword } from 'lucide-react';

export default function RoguelikeDungeonEngine({ modelConfig }) {
  const canvasRef = useRef(null);
  const [hp, setHp] = useState(100);
  const [maxHp, setMaxHp] = useState(100);
  const [level, setLevel] = useState(1);
  const [floor, setFloor] = useState(1);
  const [log, setLog] = useState("Welcome to the Procedural Crypt. Move with WASD/Arrows.");
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

  const mapCols = 24;
  const mapRows = 24;

  const generateDungeon = () => {
    // 0: Wall, 1: Floor, 2: Potion, 3: Chest, 4: Stairs
    const map = Array.from({ length: mapRows }, () => Array(mapCols).fill(0));
    const rooms = [];

    // Carve 5-7 procedural rectangular rooms
    for (let r = 0; r < 6; r++) {
      const rw = 4 + Math.floor(Math.random() * 4);
      const rh = 4 + Math.floor(Math.random() * 4);
      const rx = 1 + Math.floor(Math.random() * (mapCols - rw - 2));
      const ry = 1 + Math.floor(Math.random() * (mapRows - rh - 2));

      rooms.push({ x: rx, y: ry, w: rw, h: rh });

      for (let y = ry; y < ry + rh; y++) {
        for (let x = rx; x < rx + rw; x++) {
          map[y][x] = 1;
        }
      }
    }

    // Connect rooms with corridors
    for (let i = 0; i < rooms.length - 1; i++) {
      const rA = rooms[i];
      const rB = rooms[i + 1];
      let cx = Math.floor(rA.x + rA.w / 2);
      let cy = Math.floor(rA.y + rA.h / 2);
      const tx = Math.floor(rB.x + rB.w / 2);
      const ty = Math.floor(rB.y + rB.h / 2);

      while (cx !== tx) {
        map[cy][cx] = 1;
        cx += cx < tx ? 1 : -1;
      }
      while (cy !== ty) {
        map[cy][cx] = 1;
        cy += cy < ty ? 1 : -1;
      }
    }

    // Place Stairs in last room
    const lastRoom = rooms[rooms.length - 1];
    map[Math.floor(lastRoom.y + lastRoom.h / 2)][Math.floor(lastRoom.x + lastRoom.w / 2)] = 4;

    // Place Items & Potions
    rooms.forEach((rm, idx) => {
      if (idx > 0 && idx < rooms.length - 1) {
        map[rm.y + 1][rm.x + 1] = 2; // Potion
        if (rm.w > 4) map[rm.y + 2][rm.x + 2] = 3; // Chest
      }
    });

    // Spawn Enemies
    const enemies = [];
    rooms.forEach((rm, idx) => {
      if (idx > 0) {
        enemies.push({
          x: rm.x + 2,
          y: rm.y + 2,
          hp: 30,
          atk: 8,
          name: idx % 2 === 0 ? "Cyber Demon" : "Glitch Specter",
          char: idx % 2 === 0 ? "D" : "S",
          color: idx % 2 === 0 ? "#ef4444" : "#a855f7"
        });
      }
    });

    const firstRoom = rooms[0];
    const playerStart = {
      x: Math.floor(firstRoom.x + firstRoom.w / 2),
      y: Math.floor(firstRoom.y + firstRoom.h / 2)
    };

    return { map, enemies, playerStart };
  };

  const gameRef = useRef({
    map: [],
    discovered: Array.from({ length: mapRows }, () => Array(mapCols).fill(false)),
    player: { x: 5, y: 5, hp: 100, maxHp: 100, atk: 15, exp: 0, level: 1 },
    enemies: [],
    floor: 1
  });

  const handleStartGame = () => {
    const { map, enemies, playerStart } = generateDungeon();
    const discovered = Array.from({ length: mapRows }, () => Array(mapCols).fill(false));

    gameRef.current = {
      map,
      discovered,
      player: { x: playerStart.x, y: playerStart.y, hp: 100, maxHp: 100, atk: 15, exp: 0, level: 1 },
      enemies,
      floor: 1
    };

    setHp(100);
    setMaxHp(100);
    setLevel(1);
    setFloor(1);
    setLog("Entered Floor 1. Defeat enemies and reach the staircase (>)!");
    setGameState('PLAYING');
  };

  const movePlayer = (dx, dy) => {
    if (gameState !== 'PLAYING') return;
    const g = gameRef.current;
    const p = g.player;
    const nx = p.x + dx;
    const ny = p.y + dy;

    if (nx < 0 || nx >= mapCols || ny < 0 || ny >= mapRows || g.map[ny][nx] === 0) return;

    // Check Enemy Combat
    const enemyAtPos = g.enemies.find(e => e.x === nx && e.y === ny);
    if (enemyAtPos) {
      // Attack enemy
      const dmg = p.atk + Math.floor(Math.random() * 6);
      enemyAtPos.hp -= dmg;
      playSound(300, 'sawtooth', 0.1, 0.08);

      if (enemyAtPos.hp <= 0) {
        setLog(`You struck ${enemyAtPos.name} for ${dmg} DMG and defeated it!`);
        g.enemies = g.enemies.filter(e => e !== enemyAtPos);
        p.exp += 25;
        if (p.exp >= p.level * 50) {
          p.level++;
          p.maxHp += 20;
          p.hp = p.maxHp;
          p.atk += 5;
          setLevel(p.level);
          setMaxHp(p.maxHp);
          setHp(p.hp);
          playSound(600, 'sine', 0.3, 0.1);
        }
      } else {
        setLog(`You hit ${enemyAtPos.name} for ${dmg} DMG (HP: ${enemyAtPos.hp}).`);
      }
    } else {
      // Normal movement
      p.x = nx;
      p.y = ny;

      // Item pickup
      if (g.map[ny][nx] === 2) {
        // Potion
        p.hp = Math.min(p.maxHp, p.hp + 35);
        setHp(p.hp);
        g.map[ny][nx] = 1;
        setLog("Picked up Nano-Potion! +35 HP.");
        playSound(500, 'sine', 0.15, 0.08);
      } else if (g.map[ny][nx] === 3) {
        // Chest
        p.atk += 3;
        g.map[ny][nx] = 1;
        setLog("Opened Data Cache! +3 ATK power.");
        playSound(700, 'sine', 0.2, 0.09);
      } else if (g.map[ny][nx] === 4) {
        // Stairs
        g.floor++;
        setFloor(g.floor);
        const nextDungeon = generateDungeon();
        g.map = nextDungeon.map;
        g.enemies = nextDungeon.enemies;
        g.player.x = nextDungeon.playerStart.x;
        g.player.y = nextDungeon.playerStart.y;
        g.discovered = Array.from({ length: mapRows }, () => Array(mapCols).fill(false));
        setLog(`Descended to Floor ${g.floor}!`);
        playSound(800, 'sine', 0.4, 0.1);
      }
    }

    // Enemies turn to move & attack
    g.enemies.forEach(e => {
      const dist = Math.hypot(e.x - p.x, e.y - p.y);
      if (dist <= 1.5) {
        // Attack player
        const eDmg = Math.max(1, e.atk - Math.floor(Math.random() * 4));
        p.hp -= eDmg;
        setHp(p.hp);
        playSound(140, 'sawtooth', 0.15, 0.08);

        if (p.hp <= 0) {
          setGameState('GAMEOVER');
        }
      } else if (dist < 6) {
        // Chase player
        const edx = Math.sign(p.x - e.x);
        const edy = Math.sign(p.y - e.y);
        const enx = e.x + (Math.random() > 0.5 ? edx : 0);
        const eny = e.y + (Math.random() > 0.5 ? 0 : edy);
        if (g.map[eny] && g.map[eny][enx] === 1 && !g.enemies.some(o => o.x === enx && o.y === eny) && !(enx === p.x && eny === p.y)) {
          e.x = enx;
          e.y = eny;
        }
      }
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'KeyW', 'w', 'W'].includes(e.key) || ['ArrowUp', 'KeyW'].includes(e.code)) { movePlayer(0, -1); e.preventDefault(); }
      if (['ArrowDown', 'KeyS', 's', 'S'].includes(e.key) || ['ArrowDown', 'KeyS'].includes(e.code)) { movePlayer(0, 1); e.preventDefault(); }
      if (['ArrowLeft', 'KeyA', 'a', 'A'].includes(e.key) || ['ArrowLeft', 'KeyA'].includes(e.code)) { movePlayer(-1, 0); e.preventDefault(); }
      if (['ArrowRight', 'KeyD', 'd', 'D'].includes(e.key) || ['ArrowRight', 'KeyD'].includes(e.code)) { movePlayer(1, 0); e.preventDefault(); }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const tileSize = w / mapCols;

    let animationFrameId;

    const render = () => {
      const g = gameRef.current;
      const p = g.player;

      // Update Fog of War / Discovery within radius 5
      for (let y = 0; y < mapRows; y++) {
        for (let x = 0; x < mapCols; x++) {
          if (Math.hypot(x - p.x, y - p.y) < 5.5) {
            g.discovered[y][x] = true;
          }
        }
      }

      ctx.fillStyle = '#06080e';
      ctx.fillRect(0, 0, w, h);

      // Render Map
      for (let r = 0; r < mapRows; r++) {
        for (let c = 0; c < mapCols; c++) {
          const isDisc = g.discovered[r] && g.discovered[r][c];
          if (!isDisc) continue;

          const cell = g.map[r] ? g.map[r][c] : 0;
          const px = c * tileSize;
          const py = r * tileSize;
          const isVisible = Math.hypot(c - p.x, r - p.y) < 5.5;

          if (cell === 0) {
            ctx.fillStyle = isVisible ? '#1e293b' : '#0f172a';
            ctx.fillRect(px, py, tileSize, tileSize);
          } else if (cell === 1) {
            ctx.fillStyle = isVisible ? '#0f172a' : '#070b14';
            ctx.fillRect(px, py, tileSize, tileSize);
            ctx.strokeStyle = '#1e293b';
            ctx.strokeRect(px, py, tileSize, tileSize);
          } else if (cell === 2) {
            // Potion
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(px + tileSize / 2, py + tileSize / 2, 5, 0, Math.PI * 2);
            ctx.fill();
          } else if (cell === 3) {
            // Chest
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(px + 4, py + 4, tileSize - 8, tileSize - 8);
          } else if (cell === 4) {
            // Stairs
            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 16px monospace';
            ctx.fillText('>', px + 4, py + tileSize - 4);
          }
        }
      }

      // Render Enemies
      g.enemies.forEach(e => {
        if (Math.hypot(e.x - p.x, e.y - p.y) < 5.5) {
          const epx = e.x * tileSize;
          const epy = e.y * tileSize;
          ctx.fillStyle = e.color;
          ctx.shadowColor = e.color;
          ctx.shadowBlur = 8;
          ctx.font = 'bold 16px monospace';
          ctx.fillText(e.char, epx + 4, epy + tileSize - 4);
          ctx.shadowBlur = 0;
        }
      });

      // Render Player @
      const ppx = p.x * tileSize;
      const ppy = p.y * tileSize;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = modelConfig.primaryColor || '#ef4444';
      ctx.shadowBlur = 14;
      ctx.font = 'bold 18px monospace';
      ctx.fillText('@', ppx + 3, ppy + tileSize - 3);
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [modelConfig, gameState]);

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '532px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Skull size={24} color={modelConfig.primaryColor} />
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{modelConfig.version}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{modelConfig.modelName}</div>
          </div>
        </div>

        {/* HUD Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            <Heart size={16} fill="#ef4444" />
            <span>{hp}/{maxHp}</span>
          </div>

          <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>LVL</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#60a5fa' }}>{level}</div>
          </div>

          <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>FLOOR</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>{floor}</div>
          </div>

          <button onClick={() => setSoundEnabled(!soundEnabled)} style={{ background: 'transparent', border: 'none', color: soundEnabled ? '#34d399' : 'var(--text-dim)', cursor: 'pointer' }}>
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </div>

      {/* Combat Log */}
      <div style={{ width: '100%', maxWidth: '532px', background: 'rgba(15, 23, 42, 0.8)', padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
        &gt; {log}
      </div>

      {/* Canvas Frame */}
      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: `2px solid ${modelConfig.primaryColor}`, boxShadow: `0 0 24px ${modelConfig.primaryColor}40` }}>
        <canvas ref={canvasRef} width={532} height={560} style={{ display: 'block', background: '#06080e' }} />

        {gameState !== 'PLAYING' && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(6, 8, 14, 0.88)', backdropFilter: 'blur(6px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', color: '#fff', textAlign: 'center', padding: '24px' }}>
            {gameState === 'READY' && (
              <>
                <Skull size={48} color={modelConfig.primaryColor} />
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{modelConfig.version}</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Procedural BSP dungeon. Move with WASD/Arrows to explore fog, attack monsters, and descend stairs (&gt;)!
                </p>
                <button className="btn btn-emerald" style={{ padding: '12px 24px', fontSize: '1rem' }} onClick={handleStartGame}>
                  <Play size={18} />
                  <span>Enter Crypt</span>
                </button>
              </>
            )}

            {gameState === 'GAMEOVER' && (
              <>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f87171' }}>HERO PERISHED</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Reached Floor {floor} at Level {level}</p>
                <button className="btn btn-emerald" onClick={handleStartGame}>
                  <RotateCcw size={16} />
                  <span>Try Next Seed</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* On-screen D-Pad */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        <button className="btn btn-outline btn-sm" onClick={() => movePlayer(0, -1)}>▲ NORTH (W)</button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline btn-sm" onClick={() => movePlayer(-1, 0)}>◄ WEST (A)</button>
          <button className="btn btn-outline btn-sm" onClick={() => movePlayer(0, 1)}>▼ SOUTH (S)</button>
          <button className="btn btn-outline btn-sm" onClick={() => movePlayer(1, 0)}>EAST (D) ►</button>
        </div>
      </div>

    </div>
  );
}
