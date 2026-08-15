import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Heart, Gamepad2, Sparkles } from 'lucide-react';
import { MOCK_GAME_OUTPUTS } from '../../../data/mockGameOutputs';

export default function PacmanArcadeEngine({ gameConfig }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState('READY'); // READY | PLAYING | GAMEOVER | VICTORY
  const [soundEnabled, setSoundEnabled] = useState(true);

  const activeConfig = gameConfig?.maze ? gameConfig : MOCK_GAME_OUTPUTS['claude-3.7'];

  const audioCtxRef = useRef(null);

  const playSound = (freq, type = 'sine', duration = 0.1) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const gameRef = useRef({
    grid: (activeConfig.maze || MOCK_GAME_OUTPUTS['claude-3.7'].maze).map(row => [...row]),
    pac: { x: 9, y: 16, dirX: 0, dirY: 0, nextDirX: 0, nextDirY: 0 },
    ghosts: [
      { x: 9, y: 8, color: activeConfig.ghostColors?.[0] || '#ef4444', dirX: 1, dirY: 0, scared: false, frozen: false },
      { x: 9, y: 9, color: activeConfig.ghostColors?.[1] || '#ec4899', dirX: -1, dirY: 0, scared: false, frozen: false },
      { x: 8, y: 9, color: activeConfig.ghostColors?.[2] || '#06b6d4', dirX: 0, dirY: -1, scared: false, frozen: false },
      { x: 10, y: 9, color: activeConfig.ghostColors?.[3] || '#a855f7', dirX: 0, dirY: 1, scared: false, frozen: false }
    ],
    scaredTimer: 0,
    stasisTimer: 0,
    localScore: 0,
    localLives: 3
  });

  const handleStartGame = () => {
    const rawMaze = activeConfig.maze || MOCK_GAME_OUTPUTS['claude-3.7'].maze;
    gameRef.current = {
      grid: rawMaze.map(row => [...row]),
      pac: { x: 9, y: 16, dirX: 0, dirY: 0, nextDirX: 0, nextDirY: 0 },
      ghosts: [
        { x: 9, y: 8, color: activeConfig.ghostColors?.[0] || '#ef4444', dirX: 1, dirY: 0, scared: false, frozen: false },
        { x: 9, y: 9, color: activeConfig.ghostColors?.[1] || '#ec4899', dirX: -1, dirY: 0, scared: false, frozen: false },
        { x: 8, y: 9, color: activeConfig.ghostColors?.[2] || '#06b6d4', dirX: 0, dirY: -1, scared: false, frozen: false },
        { x: 10, y: 9, color: activeConfig.ghostColors?.[3] || '#a855f7', dirX: 0, dirY: 1, scared: false, frozen: false }
      ],
      scaredTimer: 0,
      stasisTimer: 0,
      localScore: 0,
      localLives: 3
    };
    setScore(0);
    setLives(3);
    setGameState('PLAYING');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      const code = e.code;
      const pac = gameRef.current.pac;
      let handled = false;

      if (['ArrowUp', 'KeyW', 'w', 'W'].includes(key) || ['ArrowUp', 'KeyW'].includes(code)) {
        pac.nextDirX = 0; pac.nextDirY = -1;
        if (pac.dirX === 0 && pac.dirY === 0) { pac.dirX = 0; pac.dirY = -1; }
        handled = true;
      } else if (['ArrowDown', 'KeyS', 's', 'S'].includes(key) || ['ArrowDown', 'KeyS'].includes(code)) {
        pac.nextDirX = 0; pac.nextDirY = 1;
        if (pac.dirX === 0 && pac.dirY === 0) { pac.dirX = 0; pac.dirY = 1; }
        handled = true;
      } else if (['ArrowLeft', 'KeyA', 'a', 'A'].includes(key) || ['ArrowLeft', 'KeyA'].includes(code)) {
        pac.nextDirX = -1; pac.nextDirY = 0;
        if (pac.dirX === 0 && pac.dirY === 0) { pac.dirX = -1; pac.dirY = 0; }
        handled = true;
      } else if (['ArrowRight', 'KeyD', 'd', 'D'].includes(key) || ['ArrowRight', 'KeyD'].includes(code)) {
        pac.nextDirX = 1; pac.nextDirY = 0;
        if (pac.dirX === 0 && pac.dirY === 0) { pac.dirX = 1; pac.dirY = 0; }
        handled = true;
      }

      if (handled) e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const tileSize = 28;
    const cols = 19;
    const rows = 20;
    let stepCounter = 0;
    let animationFrameId;

    const isWall = (x, y) => {
      if (x < 0 || x >= cols || y < 0 || y >= rows) return false;
      return gameRef.current.grid[y] && gameRef.current.grid[y][x] === 1;
    };

    const speedDivider = activeConfig.speed || activeConfig.gameSpeed || 7;

    const gameLoop = () => {
      const gState = gameRef.current;
      const pac = gState.pac;

      if (gameState === 'PLAYING') {
        stepCounter++;

        if (stepCounter % speedDivider === 0) {
          if (pac.nextDirX !== 0 || pac.nextDirY !== 0) {
            if (!isWall(pac.x + pac.nextDirX, pac.y + pac.nextDirY)) {
              pac.dirX = pac.nextDirX;
              pac.dirY = pac.nextDirY;
            }
          }

          const nextX = pac.x + pac.dirX;
          const nextY = pac.y + pac.dirY;

          if (nextX < 0) pac.x = cols - 1;
          else if (nextX >= cols) pac.x = 0;
          else if (!isWall(nextX, nextY)) {
            pac.x = nextX;
            pac.y = nextY;
          }

          if (gState.grid[pac.y] && gState.grid[pac.y][pac.x] === 2) {
            gState.grid[pac.y][pac.x] = 0;
            gState.localScore += 10;
            setScore(gState.localScore);
            playSound(440, 'triangle', 0.04);
          } else if (gState.grid[pac.y] && gState.grid[pac.y][pac.x] === 3) {
            gState.grid[pac.y][pac.x] = 0;
            gState.localScore += 50;
            setScore(gState.localScore);
            gState.scaredTimer = 40;
            gState.ghosts.forEach(g => g.scared = true);
            playSound(880, 'square', 0.2);
          }

          const remainingPellets = gState.grid.flat().filter(cell => cell === 2 || cell === 3).length;
          if (remainingPellets === 0) {
            setGameState('VICTORY');
            playSound(600, 'sine', 0.5);
          }

          if (gState.scaredTimer > 0) {
            gState.scaredTimer--;
            if (gState.scaredTimer === 0) gState.ghosts.forEach(g => g.scared = false);
          }

          gState.ghosts.forEach(ghost => {
            const possibleDirs = [
              { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }
            ].filter(d => !isWall(ghost.x + d.x, ghost.y + d.y));

            if (possibleDirs.length > 0) {
              const chosen = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
              ghost.x += chosen.x;
              ghost.y += chosen.y;
            }

            if (ghost.x === pac.x && ghost.y === pac.y) {
              if (ghost.scared) {
                gState.localScore += 200;
                setScore(gState.localScore);
                ghost.x = 9; ghost.y = 8;
                ghost.scared = false;
                playSound(523, 'sawtooth', 0.15);
              } else {
                gState.localLives--;
                setLives(gState.localLives);
                playSound(150, 'sawtooth', 0.3);
                if (gState.localLives <= 0) {
                  setGameState('GAMEOVER');
                } else {
                  pac.x = 9; pac.y = 16;
                  pac.dirX = 0; pac.dirY = 0;
                  pac.nextDirX = 0; pac.nextDirY = 0;
                }
              }
            }
          });
        }
      }

      // RENDER
      ctx.fillStyle = '#070a11';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = gState.grid[r] ? gState.grid[r][c] : 0;
          const px = c * tileSize;
          const py = r * tileSize;

          if (cell === 1) {
            ctx.fillStyle = activeConfig.wallColor || '#3b82f6';
            ctx.shadowColor = ctx.fillStyle;
            ctx.shadowBlur = 8;
            ctx.fillRect(px + 2, py + 2, tileSize - 4, tileSize - 4);
            ctx.shadowBlur = 0;
          } else if (cell === 2) {
            ctx.fillStyle = activeConfig.pelletColor || '#f59e0b';
            ctx.beginPath();
            ctx.arc(px + tileSize / 2, py + tileSize / 2, 3, 0, Math.PI * 2);
            ctx.fill();
          } else if (cell === 3) {
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = activeConfig.primaryColor || '#10b981';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(px + tileSize / 2, py + tileSize / 2, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // Pac-Man
      const pacPx = pac.x * tileSize + tileSize / 2;
      const pacPy = pac.y * tileSize + tileSize / 2;
      ctx.fillStyle = activeConfig.primaryColor || '#10b981';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(pacPx, pacPy, tileSize / 2 - 2, 0.2 * Math.PI, 1.8 * Math.PI);
      ctx.lineTo(pacPx, pacPy);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Ghosts
      gState.ghosts.forEach(ghost => {
        const gPx = ghost.x * tileSize + tileSize / 2;
        const gPy = ghost.y * tileSize + tileSize / 2;
        ctx.fillStyle = ghost.scared ? '#3b82f6' : ghost.color;
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.arc(gPx, gPy - 2, tileSize / 2 - 2, Math.PI, 0, false);
        ctx.lineTo(gPx + tileSize / 2 - 2, gPy + tileSize / 2 - 2);
        ctx.lineTo(gPx - tileSize / 2 + 2, gPy + tileSize / 2 - 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(gPx - 4, gPy - 4, 3, 0, Math.PI * 2);
        ctx.arc(gPx + 4, gPy - 4, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeConfig, gameState]);

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '532px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Gamepad2 size={24} color={activeConfig.primaryColor || '#10b981'} />
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{activeConfig.version || activeConfig.gameTitle}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activeConfig.modelName}</div>
          </div>
        </div>

        {/* HUD Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: lives }).map((_, i) => (
              <Heart key={i} size={18} color="#ef4444" fill="#ef4444" />
            ))}
          </div>

          <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SCORE</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>{score}</div>
          </div>

          <button onClick={() => setSoundEnabled(!soundEnabled)} style={{ background: 'transparent', border: 'none', color: soundEnabled ? '#34d399' : 'var(--text-dim)', cursor: 'pointer' }}>
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </div>

      {/* Special Ability */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(15, 23, 42, 0.8)', padding: '6px 12px', borderRadius: '9999px', border: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: activeConfig.primaryColor || '#10b981', fontWeight: 700 }}>
        <Sparkles size={14} />
        <span>Ability: {activeConfig.special || activeConfig.specialAbility}</span>
      </div>

      {/* Canvas Frame */}
      <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: `2px solid ${activeConfig.wallColor || '#3b82f6'}`, boxShadow: `0 0 24px ${activeConfig.wallColor || '#3b82f6'}40` }}>
        <canvas ref={canvasRef} width={532} height={560} style={{ display: 'block', background: '#070a11' }} />

        {gameState !== 'PLAYING' && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(7, 10, 17, 0.85)', backdropFilter: 'blur(6px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', color: '#fff', textAlign: 'center', padding: '24px' }}>
            {gameState === 'READY' && (
              <>
                <Gamepad2 size={48} color={activeConfig.primaryColor || '#10b981'} />
                <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{activeConfig.version || activeConfig.gameTitle}</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Use WASD / Arrow Keys or On-Screen D-Pad to collect pellets!
                </p>
                <button className="btn btn-emerald" style={{ padding: '12px 24px', fontSize: '1rem' }} onClick={handleStartGame}>
                  <Play size={18} />
                  <span>Start Playing Game</span>
                </button>
              </>
            )}

            {gameState === 'GAMEOVER' && (
              <>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f87171' }}>GAME OVER</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Final Score: {score} pts</p>
                <button className="btn btn-emerald" onClick={handleStartGame}>
                  <RotateCcw size={16} />
                  <span>Play Again</span>
                </button>
              </>
            )}

            {gameState === 'VICTORY' && (
              <>
                <Trophy size={48} color="#fbbf24" />
                <h2 style={{ fontSize: '1.8rem', color: '#fbbf24', margin: 0 }}>VICTORY! MAZE CLEARED</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Score: {score} pts</p>
                <button className="btn btn-emerald" onClick={handleStartGame}>
                  <RotateCcw size={16} />
                  <span>Play Again</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* On-screen D-Pad */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
        <button className="btn btn-outline btn-sm" onClick={() => { gameRef.current.pac.nextDirX = 0; gameRef.current.pac.nextDirY = -1; gameRef.current.pac.dirX = 0; gameRef.current.pac.dirY = -1; }}>▲ UP (W)</button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline btn-sm" onClick={() => { gameRef.current.pac.nextDirX = -1; gameRef.current.pac.nextDirY = 0; gameRef.current.pac.dirX = -1; gameRef.current.pac.dirY = 0; }}>◄ LEFT (A)</button>
          <button className="btn btn-outline btn-sm" onClick={() => { gameRef.current.pac.nextDirX = 0; gameRef.current.pac.nextDirY = 1; gameRef.current.pac.dirX = 0; gameRef.current.pac.dirY = 1; }}>▼ DOWN (S)</button>
          <button className="btn btn-outline btn-sm" onClick={() => { gameRef.current.pac.nextDirX = 1; gameRef.current.pac.nextDirY = 0; gameRef.current.pac.dirX = 1; gameRef.current.pac.dirY = 0; }}>RIGHT (D) ►</button>
        </div>
      </div>

    </div>
  );
}
