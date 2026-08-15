import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BLOCK_TYPES, VoxelAIAgent } from './VoxelAgentManager';
import { Play, Pause, Zap, Trophy, Flame, Cpu, Terminal, Eye, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuadViewVoxelArena({ timeOfDay = 12 }) {
  const mountClaudeRef = useRef(null);
  const mountGPTRef = useRef(null);
  const mountDeepSeekRef = useRef(null);
  const mountGeminiRef = useRef(null);

  const [buildSpeedMultiplier, setBuildSpeedMultiplier] = useState(1.0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [telemetry, setTelemetry] = useState([
    { key: 'claude', name: 'Claude 3.7 Sonnet', structure: 'The Emerald Cyber-Spire', color: '#10b981', progress: 15, height: 2, placed: 30, total: 200, score: 98.4, thought: "Calculating cantilever moment balance at Y=4" },
    { key: 'gpt', name: 'GPT-4.5 (Frontier)', structure: 'The Quantum Monolith', color: '#a855f7', progress: 15, height: 2, placed: 25, total: 180, score: 97.9, thought: "Aligning concentric stepped pyramid rings" },
    { key: 'deepseek', name: 'DeepSeek R1', structure: 'The Obsidian Fortress', color: '#fbbf24', progress: 15, height: 2, placed: 32, total: 220, score: 96.8, thought: "Fortifying 4 bastion towers with stone battlements" },
    { key: 'gemini', name: 'Gemini 3 Pro', structure: 'The Solar Hyper-Gate', color: '#38bdf8', progress: 15, height: 2, placed: 28, total: 190, score: 96.2, thought: "Discretizing 360° circular Stargate torus arch" }
  ]);

  const sharedWorldRef = useRef({
    scene: null,
    agents: [],
    blocksMap: new Map(),
    blockMeshes: new Map(),
    boxGeo: new THREE.BoxGeometry(0.98, 0.98, 0.98),
    flowerGeo: new THREE.BoxGeometry(0.35, 0.45, 0.35),
    materialCache: new Map()
  });

  const handleInstantComplete = () => {
    if (window.__automechanica_quad_complete_all) {
      window.__automechanica_quad_complete_all();
      setIsCompleted(true);
      confetti({ particleCount: 140, spread: 85, origin: { y: 0.5 } });
    }
  };

  useEffect(() => {
    // 1. Shared 3D Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x38bdf8);
    scene.fog = new THREE.FogExp2(0x7dd3fc, 0.004);
    sharedWorldRef.current.scene = scene;

    // 2. Lighting
    const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x16a34a, 0.95);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
    dirLight.position.set(50, 75, 40);
    dirLight.castShadow = true;
    dirLight.shadow.bias = -0.0006;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // 3. Voxel Material Cache
    const getMaterial = (blockType) => {
      const cache = sharedWorldRef.current.materialCache;
      if (!cache.has(blockType.id)) {
        const mat = new THREE.MeshStandardMaterial({
          color: blockType.color,
          roughness: blockType.roughness !== undefined ? blockType.roughness : 0.5,
          metalness: blockType.metalness || 0.1,
          emissive: blockType.emissive || 0x000000,
          emissiveIntensity: blockType.emissiveIntensity || 0,
          transparent: !!blockType.transparent,
          opacity: blockType.opacity || 1.0
        });
        cache.set(blockType.id, mat);
      }
      return cache.get(blockType.id);
    };

    const addWorldBlock = (x, y, z, blockType) => {
      const key = `${x},${y},${z}`;
      if (sharedWorldRef.current.blocksMap.has(key)) return;

      const isFlower = blockType.id >= 12;
      const mesh = new THREE.Mesh(isFlower ? sharedWorldRef.current.flowerGeo : sharedWorldRef.current.boxGeo, getMaterial(blockType));
      mesh.position.set(x, isFlower ? y + 0.22 : y + 0.5, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

      sharedWorldRef.current.blocksMap.set(key, blockType);
      sharedWorldRef.current.blockMeshes.set(key, mesh);
    };

    // 4. Instanced Mountains & Hills
    const boxGeo = sharedWorldRef.current.boxGeo;
    const flowerGeo = sharedWorldRef.current.flowerGeo;

    const grassMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.8, metalness: 0.05 });
    const dirtMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.95 });
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.6, metalness: 0.1 });
    const quartzMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const flowerRedMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.4 });
    const flowerYellowMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xd97706, emissiveIntensity: 0.4 });
    const flowerBlueMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1d4ed8, emissiveIntensity: 0.4 });

    const grassTransforms = [];
    const dirtTransforms = [];
    const stoneTransforms = [];
    const quartzTransforms = [];
    const flowerTransforms = [];

    const dummy = new THREE.Object3D();
    const worldRadius = 24;

    for (let x = -worldRadius; x <= worldRadius; x++) {
      for (let z = -worldRadius; z <= worldRadius; z++) {
        const dClaude = Math.hypot(x - (-14), z - (-14));
        const dGPT = Math.hypot(x - 14, z - (-14));
        const dDeepSeek = Math.hypot(x - (-14), z - 14);
        const dGemini = Math.hypot(x - 14, z - 14);
        const minDist = Math.min(dClaude, dGPT, dDeepSeek, dGemini);

        let h = 0;
        if (minDist >= 5.5 && !(Math.abs(x) <= 1 || Math.abs(z) <= 1)) {
          const m = Math.sin(x * 0.2) * Math.cos(z * 0.2) * 3.5;
          h = Math.max(0, Math.floor(m));
        }

        for (let y = 0; y <= h; y++) {
          dummy.position.set(x, y + 0.5, z);
          dummy.updateMatrix();

          if (y === h) {
            if (h >= 5) quartzTransforms.push(dummy.matrix.clone());
            else grassTransforms.push(dummy.matrix.clone());

            if (Math.random() < 0.08) {
              const fDummy = new THREE.Object3D();
              fDummy.position.set(x, y + 1.2, z);
              fDummy.updateMatrix();
              flowerTransforms.push(fDummy.matrix.clone());
            }
          } else if (y >= h - 1) {
            dirtTransforms.push(dummy.matrix.clone());
          } else {
            stoneTransforms.push(dummy.matrix.clone());
          }
        }
      }
    }

    const createInstanced = (geo, mat, list) => {
      if (list.length === 0) return;
      const m = new THREE.InstancedMesh(geo, mat, list.length);
      for (let i = 0; i < list.length; i++) m.setMatrixAt(i, list[i]);
      m.instanceMatrix.needsUpdate = true;
      scene.add(m);
    };

    createInstanced(boxGeo, grassMat, grassTransforms);
    createInstanced(boxGeo, dirtMat, dirtTransforms);
    createInstanced(boxGeo, stoneMat, stoneTransforms);
    createInstanced(boxGeo, quartzMat, quartzTransforms);
    createInstanced(flowerGeo, flowerRedMat, flowerTransforms);

    // 5. Spawn 4 AI Avatars
    const agents = [
      new VoxelAIAgent('claude', 'Claude 3.7 (Cyber-Spire)', 0x10b981, -14, -14, scene),
      new VoxelAIAgent('gpt', 'GPT-4.5 (Quantum Monolith)', 0xa855f7, 14, -14, scene),
      new VoxelAIAgent('deepseek', 'DeepSeek R1 (Obsidian Fortress)', 0xfbbf24, -14, 14, scene),
      new VoxelAIAgent('gemini', 'Gemini 3 Pro (Solar Hyper-Gate)', 0x38bdf8, 14, 14, scene)
    ];

    agents.forEach(a => a.preSeedFoundation(0.15, addWorldBlock));
    sharedWorldRef.current.agents = agents;

    window.__automechanica_quad_complete_all = () => {
      agents.forEach(a => a.completeAllBlocks(addWorldBlock));
    };

    // 6. Setup 4 Dedicated Viewport Cameras & Renderers
    const setupViewport = (container, targetX, targetZ, angleOffset = 0.5) => {
      if (!container) return null;
      const w = container.clientWidth || 380;
      const h = container.clientHeight || 240;

      const cam = new THREE.PerspectiveCamera(50, w / h, 0.1, 500);
      const rend = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      rend.setSize(w, h);
      rend.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      rend.shadowMap.enabled = true;
      container.appendChild(rend.domElement);

      return { cam, rend, targetX, targetZ, angleOffset };
    };

    const vpClaude = setupViewport(mountClaudeRef.current, -14, -14, 0.4);
    const vpGPT = setupViewport(mountGPTRef.current, 14, -14, 1.8);
    const vpDeepSeek = setupViewport(mountDeepSeekRef.current, -14, 14, 3.2);
    const vpGemini = setupViewport(mountGeminiRef.current, 14, 14, 4.6);

    const viewports = [vpClaude, vpGPT, vpDeepSeek, vpGemini].filter(Boolean);

    // 7. Render & Simulation Loop
    let lastTime = performance.now();
    let animationId;

    const animate = (now) => {
      const delta = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      // Update AI Agents
      agents.forEach(a => {
        a.update(delta * buildSpeedMultiplier, addWorldBlock);
      });

      // Update Parent Telemetry
      setTelemetry(agents.map(a => ({
        key: a.key,
        name: a.name.split(' (')[0],
        structure: a.name.split('(')[1]?.replace(')', '') || 'Structure',
        color: `#${a.color.toString(16).padStart(6, '0')}`,
        progress: Math.round((a.placedCount / a.totalBlocks) * 100),
        height: a.currentHeight,
        placed: a.placedCount,
        total: a.totalBlocks,
        score: (95 + (a.placedCount / a.totalBlocks) * 4.5).toFixed(1),
        thought: a.key === 'claude' ? `Cantilever stress check at Y=${a.currentHeight}` : a.key === 'gpt' ? `Resonating crystal at Y=${a.currentHeight}` : a.key === 'deepseek' ? `Aligning bastion battlements at Y=${a.currentHeight}` : `Toroidal curvature radius check at Y=${a.currentHeight}`
      })));

      // Render all 4 Viewports simultaneously
      viewports.forEach(vp => {
        const timeVal = now * 0.0003;
        const camDist = 20;
        const orbitX = vp.targetX + Math.sin(timeVal + vp.angleOffset) * camDist;
        const orbitZ = vp.targetZ + Math.cos(timeVal + vp.angleOffset) * camDist;
        const orbitY = 12 + Math.sin(timeVal * 1.5) * 2;

        vp.cam.position.set(orbitX, orbitY, orbitZ);
        vp.cam.lookAt(vp.targetX, 6, vp.targetZ);
        vp.rend.render(scene, vp.cam);
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      viewports.forEach(vp => {
        if (vp.rend.domElement && vp.rend.domElement.parentNode) {
          vp.rend.domElement.parentNode.removeChild(vp.rend.domElement);
        }
        vp.rend.dispose();
      });
    };
  }, [buildSpeedMultiplier]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Quad Arena Controls Header */}
      <div className="glass-panel" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="badge badge-crimson">4-WAY MULTI-AGENT ARENA</span>
          <span className="badge badge-emerald">SIMULTANEOUS 3D TELEMETRY</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Speed Selector */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(15, 23, 42, 0.7)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setBuildSpeedMultiplier(0.5)}
              className={`btn btn-sm ${buildSpeedMultiplier === 0.5 ? 'btn-emerald' : 'btn-outline'}`}
              style={{ border: 'none', padding: '4px 8px', fontSize: '0.72rem' }}
            >
              0.5x Slow
            </button>
            <button
              onClick={() => setBuildSpeedMultiplier(1.0)}
              className={`btn btn-sm ${buildSpeedMultiplier === 1.0 ? 'btn-emerald' : 'btn-outline'}`}
              style={{ border: 'none', padding: '4px 8px', fontSize: '0.72rem' }}
            >
              1.0x Live
            </button>
            <button
              onClick={() => setBuildSpeedMultiplier(2.5)}
              className={`btn btn-sm ${buildSpeedMultiplier === 2.5 ? 'btn-emerald' : 'btn-outline'}`}
              style={{ border: 'none', padding: '4px 8px', fontSize: '0.72rem' }}
            >
              2.5x Turbo
            </button>
          </div>

          <button 
            className="btn btn-outline btn-sm"
            onClick={handleInstantComplete}
            style={{ borderColor: 'rgba(251, 191, 36, 0.5)', background: 'rgba(251, 191, 36, 0.12)', color: '#fbbf24', fontSize: '0.75rem' }}
          >
            {isCompleted ? <CheckCircle2 size={13} color="#10b981" /> : <Zap size={13} />}
            <span>{isCompleted ? 'All Completed 100%' : 'Instant Finish All (100%)'}</span>
          </button>
        </div>
      </div>

      {/* 4-Way Quad-Split 2x2 Grid View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
        
        {/* Viewport 1: Claude 3.7 */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '3px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} color="#10b981" />
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>Claude 3.7 Sonnet</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>The Emerald Cyber-Spire</div>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SCORE</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>{telemetry[0]?.score}%</div>
            </div>
          </div>

          {/* Live 3D Canvas */}
          <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <div ref={mountClaudeRef} style={{ width: '100%', height: '100%' }} />
            <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(7, 10, 17, 0.8)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.68rem', color: '#10b981', fontFamily: 'var(--font-mono)' }}>
              FEED-01 // CLAUDE_CAM
            </div>
          </div>

          {/* CoT Reasoning & Tool Stream */}
          <div style={{ background: '#070a11', padding: '10px', borderRadius: '6px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: '#60a5fa', marginBottom: '4px' }}>&gt; CoT: {telemetry[0]?.thought}</div>
            <div style={{ color: '#34d399' }}>$ place_voxel(x=-14, y={telemetry[0]?.height}, z=-14, type=EMERALD_NEON)</div>
            <div style={{ color: 'var(--text-dim)', marginTop: '4px' }}>Height: {telemetry[0]?.height} Y | Blocks: {telemetry[0]?.placed}/{telemetry[0]?.total} ({telemetry[0]?.progress}%)</div>
          </div>
        </div>

        {/* Viewport 2: GPT-4.5 */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '3px solid #a855f7' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} color="#a855f7" />
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>GPT-4.5 (Frontier)</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>The Quantum Monolith Citadel</div>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SCORE</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#a855f7' }}>{telemetry[1]?.score}%</div>
            </div>
          </div>

          <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <div ref={mountGPTRef} style={{ width: '100%', height: '100%' }} />
            <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(7, 10, 17, 0.8)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.68rem', color: '#a855f7', fontFamily: 'var(--font-mono)' }}>
              FEED-02 // GPT_CAM
            </div>
          </div>

          <div style={{ background: '#070a11', padding: '10px', borderRadius: '6px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: '#c084fc', marginBottom: '4px' }}>&gt; CoT: {telemetry[1]?.thought}</div>
            <div style={{ color: '#34d399' }}>$ place_voxel(x=14, y={telemetry[1]?.height}, z=-14, type=PURPLE_NEON)</div>
            <div style={{ color: 'var(--text-dim)', marginTop: '4px' }}>Height: {telemetry[1]?.height} Y | Blocks: {telemetry[1]?.placed}/{telemetry[1]?.total} ({telemetry[1]?.progress}%)</div>
          </div>
        </div>

        {/* Viewport 3: DeepSeek R1 */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '3px solid #fbbf24' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} color="#fbbf24" />
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>DeepSeek R1</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>The Obsidian Fortress</div>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SCORE</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24' }}>{telemetry[2]?.score}%</div>
            </div>
          </div>

          <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <div ref={mountDeepSeekRef} style={{ width: '100%', height: '100%' }} />
            <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(7, 10, 17, 0.8)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.68rem', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
              FEED-03 // DEEPSEEK_CAM
            </div>
          </div>

          <div style={{ background: '#070a11', padding: '10px', borderRadius: '6px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: '#fbbf24', marginBottom: '4px' }}>&gt; CoT: {telemetry[2]?.thought}</div>
            <div style={{ color: '#34d399' }}>$ place_voxel(x=-14, y={telemetry[2]?.height}, z=14, type=GOLD_NEON)</div>
            <div style={{ color: 'var(--text-dim)', marginTop: '4px' }}>Height: {telemetry[2]?.height} Y | Blocks: {telemetry[2]?.placed}/{telemetry[2]?.total} ({telemetry[2]?.progress}%)</div>
          </div>
        </div>

        {/* Viewport 4: Gemini 3 Pro */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '3px solid #38bdf8' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} color="#38bdf8" />
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>Gemini 3 Pro</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>The Solar Hyper-Gate</div>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SCORE</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>{telemetry[3]?.score}%</div>
            </div>
          </div>

          <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <div ref={mountGeminiRef} style={{ width: '100%', height: '100%' }} />
            <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(7, 10, 17, 0.8)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.68rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              FEED-04 // GEMINI_CAM
            </div>
          </div>

          <div style={{ background: '#070a11', padding: '10px', borderRadius: '6px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: '#38bdf8', marginBottom: '4px' }}>&gt; CoT: {telemetry[3]?.thought}</div>
            <div style={{ color: '#34d399' }}>$ place_voxel(x=14, y={telemetry[3]?.height}, z=14, type=CYAN_NEON)</div>
            <div style={{ color: 'var(--text-dim)', marginTop: '4px' }}>Height: {telemetry[3]?.height} Y | Blocks: {telemetry[3]?.placed}/{telemetry[3]?.total} ({telemetry[3]?.progress}%)</div>
          </div>
        </div>

      </div>

    </div>
  );
}
