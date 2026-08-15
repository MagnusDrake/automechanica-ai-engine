import * as THREE from 'three';

// Block Palette Definition with Premium PBR Textures & Glowing Emissives
export const BLOCK_TYPES = {
  GRASS: { id: 1, name: 'Lush Grass', color: 0x22c55e, roughness: 0.8, metalness: 0.05 },
  DIRT: { id: 2, name: 'Rich Earth', color: 0x78350f, roughness: 0.95, metalness: 0.0 },
  STONE: { id: 3, name: 'Cobblestone', color: 0x64748b, roughness: 0.5, metalness: 0.15 },
  EMERALD_NEON: { id: 4, name: 'Cyber Emerald', color: 0x10b981, emissive: 0x059669, emissiveIntensity: 1.4, roughness: 0.15 },
  CYAN_NEON: { id: 5, name: 'Quantum Cyan', color: 0x06b6d4, emissive: 0x0891b2, emissiveIntensity: 1.4, roughness: 0.15 },
  PURPLE_NEON: { id: 6, name: 'Matrix Violet', color: 0xa855f7, emissive: 0x7e22ce, emissiveIntensity: 1.4, roughness: 0.15 },
  GOLD_NEON: { id: 7, name: 'Solar Gold', color: 0xfbbf24, emissive: 0xd97706, emissiveIntensity: 1.4, roughness: 0.15 },
  OBSIDIAN: { id: 8, name: 'Dark Obsidian', color: 0x1e293b, roughness: 0.3, metalness: 0.4 },
  GLASS: { id: 9, name: 'Cyber Glass', color: 0x38bdf8, opacity: 0.55, transparent: true, roughness: 0.1, metalness: 0.85 },
  RUBY: { id: 10, name: 'Ruby Core', color: 0xef4444, emissive: 0xdc2626, emissiveIntensity: 1.6, roughness: 0.1 },
  QUARTZ: { id: 11, name: 'White Marble', color: 0xf8fafc, roughness: 0.2, metalness: 0.1 },
  FLOWER_RED: { id: 12, name: 'Red Poppy', color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.3 },
  FLOWER_YELLOW: { id: 13, name: 'Yellow Dandelion', color: 0xfbbf24, emissive: 0xd97706, emissiveIntensity: 0.3 },
  FLOWER_BLUE: { id: 14, name: 'Blue Orchid', color: 0x3b82f6, emissive: 0x1d4ed8, emissiveIntensity: 0.3 }
};

// Blueprint Generators starting solidly from ground Y = 0
export function generateBlueprint(agentKey, originX, originZ) {
  const rawBlocks = [];

  if (agentKey === 'claude') {
    // Claude 3.7: The Emerald Cyber-Spire (Neo-Tokyo Skyscraper with Cantilevers)
    const baseSize = 4;
    const height = 22;

    for (let x = -baseSize - 1; x <= baseSize + 1; x++) {
      for (let z = -baseSize - 1; z <= baseSize + 1; z++) {
        rawBlocks.push({ x: originX + x, y: 0, z: originZ + z, type: BLOCK_TYPES.QUARTZ });
      }
    }

    for (let y = 1; y <= height; y++) {
      const radius = Math.max(1, Math.floor(baseSize * (1 - (y - 1) / (height * 1.25))));
      for (let x = -radius; x <= radius; x++) {
        for (let z = -radius; z <= radius; z++) {
          const isEdge = Math.abs(x) === radius || Math.abs(z) === radius;
          const isCorner = Math.abs(x) === radius && Math.abs(z) === radius;

          if (isCorner) {
            rawBlocks.push({ x: originX + x, y, z: originZ + z, type: BLOCK_TYPES.EMERALD_NEON });
          } else if (isEdge && (y % 3 === 0)) {
            rawBlocks.push({ x: originX + x, y, z: originZ + z, type: BLOCK_TYPES.GLASS });
          } else if (isEdge) {
            rawBlocks.push({ x: originX + x, y, z: originZ + z, type: BLOCK_TYPES.OBSIDIAN });
          }
        }
      }

      if (y === 7 || y === 14) {
        const ringR = radius + 2;
        for (let x = -ringR; x <= ringR; x++) {
          for (let z = -ringR; z <= ringR; z++) {
            if (Math.abs(x) === ringR || Math.abs(z) === ringR) {
              rawBlocks.push({ x: originX + x, y, z: originZ + z, type: BLOCK_TYPES.CYAN_NEON });
            }
          }
        }
      }
    }

    for (let y = height + 1; y <= height + 6; y++) {
      rawBlocks.push({ x: originX, y, z: originZ, type: BLOCK_TYPES.EMERALD_NEON });
    }
  }

  else if (agentKey === 'gpt') {
    // GPT-4.5: The Quantum Monolith Citadel (Stepped Concentric Pyramid with Floating Core)
    const baseSize = 6;

    for (let layer = 0; layer < baseSize; layer++) {
      const y = layer * 2;
      const size = baseSize - layer;
      for (let x = -size; x <= size; x++) {
        for (let z = -size; z <= size; z++) {
          const isEdge = Math.abs(x) === size || Math.abs(z) === size;
          if (isEdge) {
            rawBlocks.push({ x: originX + x, y, z: originZ + z, type: BLOCK_TYPES.PURPLE_NEON });
            rawBlocks.push({ x: originX + x, y: y + 1, z: originZ + z, type: BLOCK_TYPES.OBSIDIAN });
          }
        }
      }
    }

    for (let cy = 13; cy <= 18; cy++) {
      rawBlocks.push({ x: originX, y: cy, z: originZ, type: BLOCK_TYPES.CYAN_NEON });
      rawBlocks.push({ x: originX + 1, y: cy, z: originZ, type: BLOCK_TYPES.PURPLE_NEON });
      rawBlocks.push({ x: originX - 1, y: cy, z: originZ, type: BLOCK_TYPES.PURPLE_NEON });
      rawBlocks.push({ x: originX, y: cy, z: originZ + 1, type: BLOCK_TYPES.PURPLE_NEON });
      rawBlocks.push({ x: originX, y: cy, z: originZ - 1, type: BLOCK_TYPES.PURPLE_NEON });
    }
  }

  else if (agentKey === 'deepseek') {
    // DeepSeek R1: The Obsidian Fortress (4 Grand Bastions + Central Keep)
    const courtyardSize = 5;
    const wallH = 8;
    const towerH = 16;

    for (let x = -courtyardSize - 1; x <= courtyardSize + 1; x++) {
      for (let z = -courtyardSize - 1; z <= courtyardSize + 1; z++) {
        rawBlocks.push({ x: originX + x, y: 0, z: originZ + z, type: BLOCK_TYPES.STONE });
      }
    }

    const corners = [
      { cx: originX - courtyardSize, cz: originZ - courtyardSize },
      { cx: originX + courtyardSize, cz: originZ - courtyardSize },
      { cx: originX - courtyardSize, cz: originZ + courtyardSize },
      { cx: originX + courtyardSize, cz: originZ + courtyardSize }
    ];

    for (let y = 1; y <= towerH; y++) {
      if (y <= wallH) {
        for (let x = -courtyardSize; x <= courtyardSize; x++) {
          for (let z = -courtyardSize; z <= courtyardSize; z++) {
            const isWall = Math.abs(x) === courtyardSize || Math.abs(z) === courtyardSize;
            if (isWall) {
              const isBattlement = y === wallH && (x + z) % 2 === 0;
              if (y < wallH || isBattlement) {
                rawBlocks.push({ x: originX + x, y, z: originZ + z, type: BLOCK_TYPES.STONE });
              }
            }
          }
        }
      }

      corners.forEach(c => {
        for (let tx = -1; tx <= 1; tx++) {
          for (let tz = -1; tz <= 1; tz++) {
            const isCorner = Math.abs(tx) === 1 && Math.abs(tz) === 1;
            if (isCorner) {
              rawBlocks.push({ x: c.cx + tx, y, z: c.cz + tz, type: BLOCK_TYPES.GOLD_NEON });
            } else {
              rawBlocks.push({ x: c.cx + tx, y, z: c.cz + tz, type: BLOCK_TYPES.OBSIDIAN });
            }
          }
        }
      });
    }

    for (let y = 1; y <= 12; y++) {
      for (let x = -2; x <= 2; x++) {
        for (let z = -2; z <= 2; z++) {
          if (Math.abs(x) === 2 || Math.abs(z) === 2) {
            rawBlocks.push({ x: originX + x, y, z: originZ + z, type: BLOCK_TYPES.OBSIDIAN });
          }
        }
      }
    }
    for (let y = 13; y <= 15; y++) {
      rawBlocks.push({ x: originX, y, z: originZ, type: BLOCK_TYPES.GOLD_NEON });
    }
  }

  else {
    // Gemini 3 Pro: The Solar Hyper-Gate (FULL 360° Circular Stargate Torus)
    const baseW = 8;
    const gateRadius = 6.5;
    const centerY = 9;

    for (let x = -baseW; x <= baseW; x++) {
      for (let z = -3; z <= 3; z++) {
        rawBlocks.push({ x: originX + x, y: 0, z: originZ + z, type: BLOCK_TYPES.QUARTZ });
        if (Math.abs(x) <= baseW - 1 && Math.abs(z) <= 2) {
          rawBlocks.push({ x: originX + x, y: 1, z: originZ + z, type: BLOCK_TYPES.OBSIDIAN });
        }
      }
    }

    for (let y = 2; y <= centerY; y++) {
      rawBlocks.push({ x: originX - Math.round(gateRadius), y, z: originZ, type: BLOCK_TYPES.CYAN_NEON });
      rawBlocks.push({ x: originX + Math.round(gateRadius), y, z: originZ, type: BLOCK_TYPES.CYAN_NEON });
      rawBlocks.push({ x: originX - Math.round(gateRadius), y, z: originZ + 1, type: BLOCK_TYPES.OBSIDIAN });
      rawBlocks.push({ x: originX + Math.round(gateRadius), y, z: originZ + 1, type: BLOCK_TYPES.OBSIDIAN });
    }

    for (let y = Math.max(1, Math.floor(centerY - gateRadius)); y <= Math.ceil(centerY + gateRadius); y++) {
      for (let x = -Math.ceil(gateRadius); x <= Math.ceil(gateRadius); x++) {
        const dist = Math.hypot(x, y - centerY);
        if (dist >= gateRadius - 1.1 && dist <= gateRadius + 0.5) {
          rawBlocks.push({ x: originX + x, y, z: originZ, type: BLOCK_TYPES.CYAN_NEON });
          rawBlocks.push({ x: originX + x, y, z: originZ + 1, type: BLOCK_TYPES.GOLD_NEON });
        }
      }
    }

    for (let by = centerY - 2; by <= centerY + 2; by++) {
      rawBlocks.push({ x: originX, y: by, z: originZ, type: BLOCK_TYPES.RUBY });
    }
  }

  const uniqueMap = new Map();
  rawBlocks.forEach(b => {
    const key = `${b.x},${b.y},${b.z}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, b);
    }
  });

  return Array.from(uniqueMap.values()).sort((a, b) => a.y - b.y);
}

// Highly Detailed Cybernetic Robotic Avatar with Articulated Limbs & Glowing Core
export class VoxelAIAgent {
  constructor(key, name, color, originX, originZ, scene) {
    this.key = key;
    this.name = name;
    this.color = color;
    this.originX = originX;
    this.originZ = originZ;
    this.scene = scene;

    this.position = new THREE.Vector3(originX + 2, 0, originZ + 2);
    this.targetPos = new THREE.Vector3(originX + 2, 0, originZ + 2);
    this.rotation = 0;
    this.walkCycle = 0;

    this.allBlueprintBlocks = generateBlueprint(key, originX, originZ);
    this.blueprintQueue = [...this.allBlueprintBlocks];
    this.totalBlocks = this.allBlueprintBlocks.length;
    this.placedCount = 0;
    this.currentHeight = 0;

    this.placeTimer = 0;
    this.placeInterval = 0.32;

    this.mesh = this.createDetailedAvatarMesh();
    this.mesh.position.copy(this.position);
    this.scene.add(this.mesh);

    this.laserBeam = this.createLaserBeam();
    this.scene.add(this.laserBeam);
  }

  createLaserBeam() {
    const material = new THREE.LineBasicMaterial({ color: this.color, transparent: true, opacity: 0, linewidth: 2 });
    const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    return new THREE.Line(geometry, material);
  }

  createDetailedAvatarMesh() {
    const group = new THREE.Group();

    // 1. Cybernetic Helmet (Beveled)
    const headGeo = new THREE.BoxGeometry(0.85, 0.85, 0.85);
    const headMat = new THREE.MeshStandardMaterial({ color: this.color, roughness: 0.25, metalness: 0.3 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.95;
    head.castShadow = true;
    group.add(head);

    // Glowing Neon Cyber-Visor
    const visorGeo = new THREE.BoxGeometry(0.65, 0.2, 0.15);
    const visorMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: this.color, emissiveIntensity: 2.0 });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 1.98, 0.42);
    group.add(visor);

    // Helmet Antenna / Earpieces
    const earL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.2), headMat);
    earL.position.set(-0.48, 2.05, 0);
    const earR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.2), headMat);
    earR.position.set(0.48, 2.05, 0);
    group.add(earL, earR);

    // 2. Armored Torso with Glowing Power Core Reactor
    const bodyGeo = new THREE.BoxGeometry(0.95, 1.15, 0.55);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.3 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.0;
    body.castShadow = true;
    group.add(body);

    // Arc Reactor Core in Chest
    const coreGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 16);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: this.color, emissiveIntensity: 2.5 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.rotation.x = Math.PI / 2;
    core.position.set(0, 1.15, 0.3);
    group.add(core);

    // 3. Articulated Shoulder Pauldrons & Arms
    const shoulderGeo = new THREE.BoxGeometry(0.38, 0.38, 0.38);
    const shoulderMat = new THREE.MeshStandardMaterial({ color: this.color, roughness: 0.3, metalness: 0.2 });

    const armGeo = new THREE.BoxGeometry(0.28, 0.85, 0.28);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });

    // Left Arm Group
    this.armL = new THREE.Group();
    this.armL.position.set(-0.7, 1.3, 0);
    const shoulderL = new THREE.Mesh(shoulderGeo, shoulderMat);
    shoulderL.position.set(0, 0, 0);
    const limbL = new THREE.Mesh(armGeo, armMat);
    limbL.position.set(0, -0.45, 0);
    this.armL.add(shoulderL, limbL);
    group.add(this.armL);

    // Right Arm Group (Holds Laser Tool)
    this.armR = new THREE.Group();
    this.armR.position.set(0.7, 1.3, 0);
    const shoulderR = new THREE.Mesh(shoulderGeo, shoulderMat);
    shoulderR.position.set(0, 0, 0);
    const limbR = new THREE.Mesh(armGeo, armMat);
    limbR.position.set(0, -0.45, 0);
    this.armR.add(shoulderR, limbR);

    // Quantum Mining Laser Blaster Tool
    const toolGroup = new THREE.Group();
    const toolBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 12), new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 }));
    toolBarrel.rotation.x = Math.PI / 2;
    const toolEmitter = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: this.color, emissiveIntensity: 2.5 }));
    toolEmitter.position.set(0, 0, 0.35);
    toolGroup.add(toolBarrel, toolEmitter);
    toolGroup.position.set(0, -0.65, 0.3);
    this.tool = toolEmitter;
    this.armR.add(toolGroup);
    group.add(this.armR);

    // 4. Cybernetic Legs & Heavy Boots
    const legGeo = new THREE.BoxGeometry(0.36, 0.85, 0.36);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });
    const bootGeo = new THREE.BoxGeometry(0.38, 0.25, 0.45);
    const bootMat = new THREE.MeshStandardMaterial({ color: this.color, roughness: 0.3 });

    this.legL = new THREE.Group();
    this.legL.position.set(-0.25, 0.85, 0);
    const limbLegL = new THREE.Mesh(legGeo, legMat);
    limbLegL.position.set(0, -0.42, 0);
    const bootL = new THREE.Mesh(bootGeo, bootMat);
    bootL.position.set(0, -0.75, 0.05);
    this.legL.add(limbLegL, bootL);

    this.legR = new THREE.Group();
    this.legR.position.set(0.25, 0.85, 0);
    const limbLegR = new THREE.Mesh(legGeo, legMat);
    limbLegR.position.set(0, -0.42, 0);
    const bootR = new THREE.Mesh(bootGeo, bootMat);
    bootR.position.set(0, -0.75, 0.05);
    this.legR.add(limbLegR, bootR);

    group.add(this.legL, this.legR);

    // 5. Floating 3D Hologram Halo
    const haloGeo = new THREE.RingGeometry(0.5, 0.58, 24);
    const haloMat = new THREE.MeshStandardMaterial({ color: this.color, emissive: this.color, emissiveIntensity: 1.8, side: THREE.DoubleSide });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.set(0, 2.6, 0);
    group.add(halo);

    return group;
  }

  preSeedFoundation(fraction, worldBlockAdder) {
    const initialCount = Math.floor(this.totalBlocks * fraction);
    for (let i = 0; i < initialCount && this.blueprintQueue.length > 0; i++) {
      const b = this.blueprintQueue.shift();
      worldBlockAdder(b.x, b.y, b.z, b.type);
      this.placedCount++;
      if (b.y > this.currentHeight) this.currentHeight = b.y;
    }
  }

  completeAllBlocks(worldBlockAdder) {
    while (this.blueprintQueue.length > 0) {
      const b = this.blueprintQueue.shift();
      worldBlockAdder(b.x, b.y, b.z, b.type);
      this.placedCount++;
      if (b.y > this.currentHeight) this.currentHeight = b.y;
    }
  }

  update(delta, worldBlockAdder) {
    this.placeTimer += delta;

    if (this.placeTimer >= this.placeInterval && this.blueprintQueue.length > 0) {
      this.placeTimer = 0;
      const nextBlock = this.blueprintQueue.shift();

      const targetStandX = nextBlock.x + (nextBlock.x >= this.originX ? 1.5 : -1.5);
      const targetStandZ = nextBlock.z + (nextBlock.z >= this.originZ ? 1.5 : -1.5);
      this.targetPos.set(targetStandX, Math.max(0, nextBlock.y - 1), targetStandZ);

      worldBlockAdder(nextBlock.x, nextBlock.y, nextBlock.z, nextBlock.type);
      this.placedCount++;
      if (nextBlock.y > this.currentHeight) {
        this.currentHeight = nextBlock.y;
      }

      // Visual Laser Beam Flash
      const toolTipPos = new THREE.Vector3();
      this.tool.getWorldPosition(toolTipPos);
      const blockCenter = new THREE.Vector3(nextBlock.x, nextBlock.y + 0.5, nextBlock.z);

      const positions = this.laserBeam.geometry.attributes.position.array;
      positions[0] = toolTipPos.x;
      positions[1] = toolTipPos.y;
      positions[2] = toolTipPos.z;
      positions[3] = blockCenter.x;
      positions[4] = blockCenter.y;
      positions[5] = blockCenter.z;
      this.laserBeam.geometry.attributes.position.needsUpdate = true;
      this.laserBeam.material.opacity = 1.0;

      // Arm swing recoil animation
      this.armR.rotation.x = -Math.PI / 2.2;
    } else {
      if (this.laserBeam.material.opacity > 0) {
        this.laserBeam.material.opacity = Math.max(0, this.laserBeam.material.opacity - delta * 4);
      }
    }

    // Walking locomotion animation
    const dir = new THREE.Vector3().subVectors(this.targetPos, this.position);
    const dist = dir.length();

    if (dist > 0.15) {
      dir.normalize();
      this.position.addScaledVector(dir, delta * 4.0);
      this.rotation = Math.atan2(dir.x, dir.z);
      this.mesh.rotation.y = this.rotation;

      this.walkCycle += delta * 8;
      this.legL.rotation.x = Math.sin(this.walkCycle) * 0.6;
      this.legR.rotation.x = -Math.sin(this.walkCycle) * 0.6;
      this.armL.rotation.x = -Math.sin(this.walkCycle) * 0.6;
    } else {
      this.legL.rotation.x = 0;
      this.legR.rotation.x = 0;
      this.armR.rotation.x = Math.sin(Date.now() * 0.006) * 0.3;
    }

    this.mesh.position.copy(this.position);
  }
}
