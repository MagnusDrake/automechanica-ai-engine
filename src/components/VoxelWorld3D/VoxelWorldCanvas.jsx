import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BLOCK_TYPES, VoxelAIAgent } from './VoxelAgentManager';

export default function VoxelWorldCanvas({ 
  cameraMode = 'orbit', 
  selectedBlockType = BLOCK_TYPES.EMERALD_NEON,
  onTelemetryUpdate,
  timeOfDay = 12,
  buildSpeedMultiplier = 1.0
}) {
  const mountRef = useRef(null);
  const worldRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    dirLight: null,
    ambientLight: null,
    hemiLight: null,
    cloudsGroup: null,
    birdsGroup: null,
    agents: [],
    blocksMap: new Map(),
    blockMeshes: new Map(),
    cameraMode: 'orbit',
    timeOfDay: 12,
    buildSpeedMultiplier: 1.0,
    player: { pos: new THREE.Vector3(0, 3.2, 22), yaw: 0, pitch: 0 },
    keys: { w: false, a: false, s: false, d: false, space: false, shift: false }
  });

  useEffect(() => {
    worldRef.current.cameraMode = cameraMode;
    if (cameraMode === 'firstPerson') {
      worldRef.current.player.pos.set(0, 3.2, 22);
      worldRef.current.player.yaw = 0;
      worldRef.current.player.pitch = 0;
      if (worldRef.current.camera) {
        worldRef.current.camera.up.set(0, 1, 0);
        worldRef.current.camera.rotation.set(0, 0, 0, 'YXZ');
      }
    }
  }, [cameraMode]);

  useEffect(() => {
    worldRef.current.timeOfDay = timeOfDay;
  }, [timeOfDay]);

  useEffect(() => {
    worldRef.current.buildSpeedMultiplier = buildSpeedMultiplier;
  }, [buildSpeedMultiplier]);

  // Initial Scene Mount (Runs ONCE)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // 1. Scene & Sky
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x38bdf8);
    scene.fog = new THREE.FogExp2(0x7dd3fc, 0.003);
    worldRef.current.scene = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 1000);
    camera.up.set(0, 1, 0);
    camera.position.set(0, 28, 48);
    camera.lookAt(0, 5, 0);
    worldRef.current.camera = camera;

    // 3. WebGL Renderer with High Performance
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    worldRef.current.renderer = renderer;

    // 4. Lighting System
    const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x16a34a, 0.95);
    scene.add(hemiLight);
    worldRef.current.hemiLight = hemiLight;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);
    worldRef.current.ambientLight = ambientLight;

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
    dirLight.position.set(50, 75, 40);
    dirLight.castShadow = true;
    dirLight.shadow.bias = -0.0006;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 250;
    dirLight.shadow.camera.left = -70;
    dirLight.shadow.camera.right = 70;
    dirLight.shadow.camera.top = 70;
    dirLight.shadow.camera.bottom = -70;
    scene.add(dirLight);
    worldRef.current.dirLight = dirLight;

    // 5. Volumetric 3D Voxel Clouds
    const cloudsGroup = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, transparent: true, opacity: 0.85 });
    const cloudBoxGeo = new THREE.BoxGeometry(4, 2, 4);

    for (let c = 0; c < 16; c++) {
      const cloud = new THREE.Group();
      const cx = (Math.random() - 0.5) * 220;
      const cz = (Math.random() - 0.5) * 220;
      const cy = 34 + Math.random() * 8;

      for (let bx = -2; bx <= 2; bx++) {
        for (let bz = -2; bz <= 2; bz++) {
          if (Math.random() > 0.3) {
            const part = new THREE.Mesh(cloudBoxGeo, cloudMat);
            part.position.set(bx * 3.5, 0, bz * 3.5);
            cloud.add(part);
          }
        }
      }
      cloud.position.set(cx, cy, cz);
      cloudsGroup.add(cloud);
    }
    scene.add(cloudsGroup);
    worldRef.current.cloudsGroup = cloudsGroup;

    // 6. Flock of Animated Flying 3D Birds
    const birdsGroup = new THREE.Group();
    const birdMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });
    const birds = [];

    for (let b = 0; b < 7; b++) {
      const bird = new THREE.Group();
      const bBody = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.6), birdMat);
      const wingMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
      const wingL = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.3), wingMat);
      wingL.position.set(-0.35, 0, 0);
      const wingR = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.3), wingMat);
      wingR.position.set(0.35, 0, 0);
      
      bird.add(bBody, wingL, wingR);
      bird.wingL = wingL;
      bird.wingR = wingR;
      bird.orbitRadius = 24 + b * 4;
      bird.orbitSpeed = 0.5 + Math.random() * 0.4;
      bird.orbitAngle = (b / 7) * Math.PI * 2;
      bird.altitude = 18 + (b % 3) * 3;

      birdsGroup.add(bird);
      birds.push(bird);
    }
    scene.add(birdsGroup);
    worldRef.current.birdsGroup = birdsGroup;

    // 7. High-Performance Instanced 3D Voxel Terrain Engine
    // Shared Geometries & PBR Materials
    const boxGeo = new THREE.BoxGeometry(0.98, 0.98, 0.98);
    const flowerGeo = new THREE.BoxGeometry(0.35, 0.45, 0.35);

    const grassMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.8, metalness: 0.05 });
    const dirtMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.95 });
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.6, metalness: 0.1 });
    const quartzMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const flowerRedMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.4 });
    const flowerYellowMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xd97706, emissiveIntensity: 0.4 });
    const flowerBlueMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1d4ed8, emissiveIntensity: 0.4 });

    // Collect all terrain voxel coordinates
    const grassTransforms = [];
    const dirtTransforms = [];
    const stoneTransforms = [];
    const quartzTransforms = [];
    const flowerRedTransforms = [];
    const flowerYellowTransforms = [];
    const flowerBlueTransforms = [];

    const dummy = new THREE.Object3D();

    const worldRadius = 26;

    const getTerrainHeight = (x, z) => {
      // 4 Flat Building Plazas at Y = 0
      const dClaude = Math.hypot(x - (-14), z - (-14));
      const dGPT = Math.hypot(x - 14, z - (-14));
      const dDeepSeek = Math.hypot(x - (-14), z - 14);
      const dGemini = Math.hypot(x - 14, z - 14);
      const minBuildingDist = Math.min(dClaude, dGPT, dDeepSeek, dGemini);

      if (minBuildingDist < 6.0) return 0;

      // Roads
      if ((Math.abs(x) <= 2 && Math.abs(z) <= 20) || (Math.abs(z) <= 2 && Math.abs(x) <= 20)) {
        return 0;
      }

      // Rolling Hills & Mountains
      const m1 = Math.sin(x * 0.18) * Math.cos(z * 0.18) * 4.5;
      const m2 = Math.cos((x + z) * 0.14) * 3.0;
      const distFromOrigin = Math.hypot(x, z);
      const edgeMountain = distFromOrigin > 16 ? Math.min(7, (distFromOrigin - 16) * 0.7) : 0;

      const rawH = m1 + m2 + edgeMountain;
      const blend = Math.min(1.0, Math.max(0.0, (minBuildingDist - 6.0) / 4.0));

      return Math.max(0, Math.floor(rawH * blend));
    };

    // Calculate all voxel positions
    for (let x = -worldRadius; x <= worldRadius; x++) {
      for (let z = -worldRadius; z <= worldRadius; z++) {
        const h = getTerrainHeight(x, z);

        for (let y = 0; y <= h; y++) {
          dummy.position.set(x, y + 0.5, z);
          dummy.updateMatrix();

          if (y === h) {
            const isRoad = (Math.abs(x) <= 1 && Math.abs(z) <= 20) || (Math.abs(z) <= 1 && Math.abs(x) <= 20);
            if (isRoad) {
              stoneTransforms.push(dummy.matrix.clone());
            } else if (h >= 6) {
              quartzTransforms.push(dummy.matrix.clone());
            } else {
              grassTransforms.push(dummy.matrix.clone());

              // Flowers on top of grass (y + 1)
              if (Math.random() < 0.12) {
                const flowerDummy = new THREE.Object3D();
                flowerDummy.position.set(x, y + 1.22, z);
                flowerDummy.updateMatrix();
                const randType = Math.random();
                if (randType < 0.35) flowerRedTransforms.push(flowerDummy.matrix.clone());
                else if (randType < 0.7) flowerYellowTransforms.push(flowerDummy.matrix.clone());
                else flowerBlueTransforms.push(flowerDummy.matrix.clone());
              }

              // Trees on hills
              if (h >= 2 && h <= 5 && Math.random() < 0.035) {
                for (let ty = y + 1; ty <= y + 3; ty++) {
                  const tDummy = new THREE.Object3D();
                  tDummy.position.set(x, ty + 0.5, z);
                  tDummy.updateMatrix();
                  dirtTransforms.push(tDummy.matrix.clone());
                }
                for (let lx = -1; lx <= 1; lx++) {
                  for (let lz = -1; lz <= 1; lz++) {
                    const lDummy = new THREE.Object3D();
                    lDummy.position.set(x + lx, y + 4.5, z + lz);
                    lDummy.updateMatrix();
                    grassTransforms.push(lDummy.matrix.clone());
                  }
                }
                const topDummy = new THREE.Object3D();
                topDummy.position.set(x, y + 5.5, z);
                topDummy.updateMatrix();
                grassTransforms.push(topDummy.matrix.clone());
              }
            }
          } else if (y >= h - 1) {
            dirtTransforms.push(dummy.matrix.clone());
          } else {
            stoneTransforms.push(dummy.matrix.clone());
          }
        }
      }
    }

    // Helper: Create InstancedMesh from transform matrix list
    const createInstanced = (geo, mat, matrixList) => {
      if (matrixList.length === 0) return;
      const instMesh = new THREE.InstancedMesh(geo, mat, matrixList.length);
      instMesh.castShadow = true;
      instMesh.receiveShadow = true;
      for (let i = 0; i < matrixList.length; i++) {
        instMesh.setMatrixAt(i, matrixList[i]);
      }
      instMesh.instanceMatrix.needsUpdate = true;
      scene.add(instMesh);
    };

    // Instantiate all terrain in 7 ultra-fast draw calls!
    createInstanced(boxGeo, grassMat, grassTransforms);
    createInstanced(boxGeo, dirtMat, dirtTransforms);
    createInstanced(boxGeo, stoneMat, stoneTransforms);
    createInstanced(boxGeo, quartzMat, quartzTransforms);
    createInstanced(flowerGeo, flowerRedMat, flowerRedTransforms);
    createInstanced(flowerGeo, flowerYellowMat, flowerYellowTransforms);
    createInstanced(flowerGeo, flowerBlueMat, flowerBlueTransforms);

    // 8. Individual Dynamic AI Megastructure Block Adder
    const dynamicMaterialCache = new Map();
    const getDynamicMaterial = (blockType) => {
      if (!dynamicMaterialCache.has(blockType.id)) {
        const mat = new THREE.MeshStandardMaterial({
          color: blockType.color,
          roughness: blockType.roughness !== undefined ? blockType.roughness : 0.5,
          metalness: blockType.metalness || 0.1,
          emissive: blockType.emissive || 0x000000,
          emissiveIntensity: blockType.emissiveIntensity || 0,
          transparent: !!blockType.transparent,
          opacity: blockType.opacity || 1.0
        });
        dynamicMaterialCache.set(blockType.id, mat);
      }
      return dynamicMaterialCache.get(blockType.id);
    };

    const addWorldBlock = (x, y, z, blockType) => {
      const key = `${x},${y},${z}`;
      if (worldRef.current.blocksMap.has(key)) return;

      const mesh = new THREE.Mesh(boxGeo, getDynamicMaterial(blockType));
      mesh.position.set(x, y + 0.5, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

      worldRef.current.blocksMap.set(key, blockType);
      worldRef.current.blockMeshes.set(key, mesh);
    };

    // 9. Spawn 4 Autonomous AI Avatars & Pre-seed initial 15% Foundation
    const agents = [
      new VoxelAIAgent('claude', 'Claude 3.7 (Cyber-Spire)', 0x10b981, -14, -14, scene),
      new VoxelAIAgent('gpt', 'GPT-4.5 (Quantum Monolith)', 0xa855f7, 14, -14, scene),
      new VoxelAIAgent('deepseek', 'DeepSeek R1 (Obsidian Fortress)', 0xfbbf24, -14, 14, scene),
      new VoxelAIAgent('gemini', 'Gemini 3 Pro (Solar Hyper-Gate)', 0x38bdf8, 14, 14, scene)
    ];

    agents.forEach(agent => {
      agent.preSeedFoundation(0.15, addWorldBlock);
    });

    worldRef.current.agents = agents;

    window.__automechanica_complete_all = () => {
      agents.forEach(a => a.completeAllBlocks(addWorldBlock));
    };

    // 10. Mouse & Keyboard Handlers with preventDefault
    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let orbitAngle = 0.45;
    let orbitPitch = 0.52;

    const handleMouseDown = (e) => {
      isMouseDown = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e) => {
      if (!isMouseDown) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      if (worldRef.current.cameraMode === 'orbit') {
        orbitAngle -= deltaX * 0.006;
        orbitPitch = Math.max(0.08, Math.min(1.4, orbitPitch + deltaY * 0.006));
      } else {
        const p = worldRef.current.player;
        p.yaw -= deltaX * 0.004;
        p.pitch = Math.max(-1.2, Math.min(1.2, p.pitch - deltaY * 0.004));
      }
    };

    const handleMouseUp = () => { isMouseDown = false; };

    const handleKeyDown = (e) => {
      const k = worldRef.current.keys;
      let handled = false;

      if (e.code === 'KeyW') { k.w = true; handled = true; }
      if (e.code === 'KeyA') { k.a = true; handled = true; }
      if (e.code === 'KeyS') { k.s = true; handled = true; }
      if (e.code === 'KeyD') { k.d = true; handled = true; }
      if (e.code === 'Space') { k.space = true; handled = true; }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') { k.shift = true; handled = true; }

      if (handled) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      const k = worldRef.current.keys;
      if (e.code === 'KeyW') k.w = false;
      if (e.code === 'KeyA') k.a = false;
      if (e.code === 'KeyS') k.s = false;
      if (e.code === 'KeyD') k.d = false;
      if (e.code === 'Space') k.space = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') k.shift = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // 11. Main 60 FPS Render Loop
    let lastTime = performance.now();
    let animationId;

    const animate = (now) => {
      const delta = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const w = worldRef.current;
      const t = w.timeOfDay;

      // Animate clouds
      if (w.cloudsGroup) {
        w.cloudsGroup.children.forEach(c => {
          c.position.x += delta * 1.5;
          if (c.position.x > 150) c.position.x = -150;
        });
      }

      // Animate flying birds
      if (w.birdsGroup) {
        birds.forEach(bird => {
          bird.orbitAngle += delta * bird.orbitSpeed * 0.4;
          bird.position.x = Math.sin(bird.orbitAngle) * bird.orbitRadius;
          bird.position.z = Math.cos(bird.orbitAngle) * bird.orbitRadius;
          bird.position.y = bird.altitude + Math.sin(bird.orbitAngle * 3) * 1.5;
          bird.rotation.y = bird.orbitAngle + Math.PI / 2;

          const flap = Math.sin(now * 0.015 * bird.orbitSpeed) * 0.7;
          bird.wingL.rotation.z = flap;
          bird.wingR.rotation.z = -flap;
        });
      }

      // Dynamic Solar Lighting
      const sunAngle = (t / 24) * Math.PI * 2;
      const sunY = Math.sin(sunAngle - Math.PI / 2);
      const sunX = Math.cos(sunAngle - Math.PI / 2);

      w.dirLight.position.set(sunX * 70, Math.max(18, sunY * 70), 35);

      if (t >= 8 && t <= 17) {
        scene.background.set(0x38bdf8);
        scene.fog.color.set(0x7dd3fc);
        w.hemiLight.color.set(0x7dd3fc);
        w.hemiLight.groundColor.set(0x16a34a);
        w.hemiLight.intensity = 0.95;
        w.ambientLight.intensity = 0.55;
        w.dirLight.color.set(0xfffbeb);
        w.dirLight.intensity = 1.4;
      } else if ((t >= 5 && t < 8) || (t > 17 && t <= 19)) {
        scene.background.set(0x581c87);
        scene.fog.color.set(0x581c87);
        w.hemiLight.color.set(0xfb923c);
        w.hemiLight.groundColor.set(0x15803d);
        w.hemiLight.intensity = 0.75;
        w.ambientLight.intensity = 0.45;
        w.dirLight.color.set(0xf97316);
        w.dirLight.intensity = 1.1;
      } else {
        scene.background.set(0x030712);
        scene.fog.color.set(0x030712);
        w.hemiLight.color.set(0x38bdf8);
        w.hemiLight.groundColor.set(0x064e3b);
        w.hemiLight.intensity = 0.55;
        w.ambientLight.intensity = 0.35;
        w.dirLight.color.set(0x60a5fa);
        w.dirLight.intensity = 0.5;
      }

      // Update AI Agents
      const effectiveDelta = delta * (w.buildSpeedMultiplier || 1.0);
      agents.forEach(agent => {
        agent.update(effectiveDelta, addWorldBlock);
      });

      // Update Telemetry
      if (onTelemetryUpdate) {
        onTelemetryUpdate(agents.map(a => ({
          key: a.key,
          name: a.name,
          color: a.color,
          placedCount: a.placedCount,
          totalBlocks: a.totalBlocks,
          height: a.currentHeight,
          progress: Math.round((a.placedCount / a.totalBlocks) * 100)
        })));
      }

      // Camera Movement
      if (w.cameraMode === 'orbit') {
        const radius = 54;
        camera.up.set(0, 1, 0);
        camera.position.x = Math.sin(orbitAngle) * radius * Math.cos(orbitPitch);
        camera.position.y = Math.sin(orbitPitch) * radius + 6;
        camera.position.z = Math.cos(orbitAngle) * radius * Math.cos(orbitPitch);
        camera.lookAt(0, 7, 0);
      } else {
        const p = w.player;
        const k = w.keys;
        const speed = 8.5;

        const forward = new THREE.Vector3(-Math.sin(p.yaw), 0, -Math.cos(p.yaw));
        const right = new THREE.Vector3(Math.cos(p.yaw), 0, -Math.sin(p.yaw));

        if (k.w) p.pos.addScaledVector(forward, speed * delta);
        if (k.s) p.pos.addScaledVector(forward, -speed * delta);
        if (k.d) p.pos.addScaledVector(right, speed * delta);
        if (k.a) p.pos.addScaledVector(right, -speed * delta);
        if (k.space) p.pos.y = Math.min(35, p.pos.y + speed * delta);
        if (k.shift) p.pos.y = Math.max(1.8, p.pos.y - speed * delta);

        camera.position.copy(p.pos);
        camera.up.set(0, 1, 0);
        camera.rotation.order = 'YXZ';
        camera.rotation.y = p.yaw;
        camera.rotation.x = p.pitch;
        camera.rotation.z = 0;
      }

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '580px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-subtle)', boxShadow: '0 0 35px rgba(16, 185, 129, 0.3)' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />
      
      {/* 3D Performance & Status Badge */}
      <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(7, 10, 17, 0.85)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
        <div className="live-dot" />
        <span style={{ color: '#34d399', fontWeight: 700 }}>60 FPS INSTANCED VOXEL TERRAIN</span>
        <span style={{ color: 'var(--text-muted)' }}>| {timeOfDay >= 8 && timeOfDay <= 17 ? '☀️ Sunny Day' : timeOfDay >= 5 && timeOfDay <= 19 ? '🌅 Sunset' : '🌙 Cyberpunk Night'} ({timeOfDay}:00h)</span>
      </div>

      {/* Camera Instructions Overlay */}
      <div style={{ position: 'absolute', bottom: '12px', left: '14px', background: 'rgba(7, 10, 17, 0.88)', backdropFilter: 'blur(8px)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: '#e5e7eb' }}>
        {cameraMode === 'orbit' ? (
          <span>🖱️ <strong>Orbit Drone Cam</strong>: Click &amp; Drag to rotate 360° • Scroll to Zoom</span>
        ) : (
          <span>⌨️ <strong>First-Person Mode</strong>: [W, A, S, D] to Walk • [SPACE] Jump/Fly • [SHIFT] Descend • Click &amp; Drag to Look</span>
        )}
      </div>
    </div>
  );
}
