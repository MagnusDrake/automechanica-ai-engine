export const EXPANDED_GAMES_METADATA = [
  {
    id: "pacman",
    title: "Cyber-Pac Protocol",
    genre: "Arcade & Grid Pathfinding",
    tagline: "Tile-grid vector collision & 4-Ghost Flanking AI",
    badge: "Grid Vector",
    color: "#10b981",
    models: {
      "claude-3.7": {
        modelName: "Claude 3.7 Sonnet",
        version: "Cyber-Pac Neon Protocol",
        primaryColor: "#10b981",
        wallColor: "#3b82f6",
        pelletColor: "#f59e0b",
        ghostColors: ["#ef4444", "#ec4899", "#06b6d4", "#a855f7"],
        speed: 7,
        special: "Cyber Speed Boost (+50% velocity when clearing nodes)",
        scores: { originality: 97, visualDesign: 98, playability: 99, smoothness: 99, codeArchitecture: 98, audioSFX: 95, overall: 97.6 },
        judgeNote: "Flawless tile-grid synchronization, Euclidean flanking pathfinding for the red ghost, and zero micro-stutter."
      },
      "gpt-4.5": {
        modelName: "GPT-4.5 (Frontier)",
        version: "Quantum Shift Pac",
        primaryColor: "#a855f7",
        wallColor: "#06b6d4",
        pelletColor: "#34d399",
        ghostColors: ["#ef4444", "#f59e0b", "#eab308", "#ec4899"],
        speed: 6,
        special: "Quantum 4-Way Warp Portals + Ghost Phase Absorber",
        scores: { originality: 96, visualDesign: 98, playability: 97, smoothness: 98, codeArchitecture: 96, audioSFX: 94, overall: 96.5 },
        judgeNote: "High-contrast quantum vectors, teleportation physics, and power pellet energy phase multipliers."
      },
      "deepseek-r1": {
        modelName: "DeepSeek R1",
        version: "Retro Glitch Arcade Pac",
        primaryColor: "#fbbf24",
        wallColor: "#dc2626",
        pelletColor: "#ffffff",
        ghostColors: ["#00ffff", "#ff00ff", "#ffff00", "#00ff00"],
        speed: 8,
        special: "Glitch Stasis (5-Second Screen Inversion & Freeze)",
        scores: { originality: 94, visualDesign: 93, playability: 95, smoothness: 96, codeArchitecture: 97, audioSFX: 91, overall: 94.3 },
        judgeNote: "Authentic 80s arcade feel with scanlines, tight labyrinth corridors, and stasis stuns."
      }
    }
  },

  {
    id: "asteroids",
    title: "Neural Asteroids: Vector Space Combat",
    genre: "2D Newtonian Physics Sandbox",
    tagline: "Inertial drift, angular acceleration, laser cannons & splitting asteroids",
    badge: "Vector Physics",
    color: "#3b82f6",
    models: {
      "claude-3.7": {
        modelName: "Claude 3.7 Sonnet",
        version: "Hyper-Vector Asteroids v2",
        primaryColor: "#38bdf8",
        accentColor: "#f43f5e",
        physicsThrust: 0.15,
        maxSpeed: 6.5,
        special: "Plasma Burst Spread Cannon + Quantum Inertia Dampener",
        scores: { originality: 98, visualDesign: 99, playability: 98, smoothness: 100, codeArchitecture: 99, audioSFX: 96, overall: 98.3 },
        judgeNote: "Realistic conservation of momentum, delta-time particle exhaust trails, and multi-tier splitting asteroid vectors."
      },
      "gpt-4.5": {
        modelName: "GPT-4.5 (Frontier)",
        version: "Singularity Space Shooter",
        primaryColor: "#c084fc",
        accentColor: "#fbbf24",
        physicsThrust: 0.18,
        maxSpeed: 7.0,
        special: "Gravity Vortex Torpedo + Shield Overcharge",
        scores: { originality: 97, visualDesign: 98, playability: 97, smoothness: 98, codeArchitecture: 97, audioSFX: 95, overall: 97.0 },
        judgeNote: "Intense space combat physics with gravity well mechanics and particle explosions."
      },
      "deepseek-r1": {
        modelName: "DeepSeek R1",
        version: "Wireframe Vector Void",
        primaryColor: "#34d399",
        accentColor: "#e11d48",
        physicsThrust: 0.12,
        maxSpeed: 5.8,
        special: "Pulse Laser Beam + Retro Wireframe Shader",
        scores: { originality: 95, visualDesign: 94, playability: 96, smoothness: 97, codeArchitecture: 98, audioSFX: 92, overall: 95.3 },
        judgeNote: "Clean mathematical wireframe rendering with precise polygon collision hitboxes."
      }
    }
  },

  {
    id: "racer",
    title: "Cyber-Racer: 2.5D Vector Drift",
    genre: "Pseudo-3D Raycast Horizon",
    tagline: "Dynamic road curvature, depth projection, AI traffic & nitro boosts",
    badge: "Raycast 2.5D",
    color: "#f59e0b",
    models: {
      "claude-3.7": {
        modelName: "Claude 3.7 Sonnet",
        version: "Neon Velocity Horizon 3000",
        primaryColor: "#10b981",
        roadColor: "#1e1b4b",
        trafficDensity: 8,
        special: "Hyperspace Nitro Boost (2.0x acceleration with chromatic drift)",
        scores: { originality: 98, visualDesign: 99, playability: 97, smoothness: 99, codeArchitecture: 98, audioSFX: 96, overall: 97.8 },
        judgeNote: "Masterful pseudo-3D perspective projection math, continuous road curve interpolations, and reactive traffic AI."
      },
      "gpt-4.5": {
        modelName: "GPT-4.5 (Frontier)",
        version: "Quantum Grid Outrun",
        primaryColor: "#06b6d4",
        roadColor: "#311042",
        trafficDensity: 10,
        special: "Phase Shift Lane Teleportation",
        scores: { originality: 96, visualDesign: 98, playability: 96, smoothness: 98, codeArchitecture: 96, audioSFX: 94, overall: 96.3 },
        judgeNote: "High speed horizon rendering with dynamic day-night neon sky gradient cycles."
      },
      "deepseek-r1": {
        modelName: "DeepSeek R1",
        version: "CRT Vector Expressway",
        primaryColor: "#fbbf24",
        roadColor: "#18181b",
        trafficDensity: 7,
        special: "Slipstream Draft Multiplier",
        scores: { originality: 94, visualDesign: 93, playability: 95, smoothness: 97, codeArchitecture: 97, audioSFX: 90, overall: 94.3 },
        judgeNote: "Classic 80s arcade Outrun homage with responsive steering and friction decay."
      }
    }
  },

  {
    id: "towerdefense",
    title: "Quantum Defense: Swarm Automata",
    genre: "Real-Time Strategy & Grid Defense",
    tagline: "Creep wave pathfinding, elemental laser turrets & energy economy",
    badge: "Emergent Swarms",
    color: "#8b5cf6",
    models: {
      "claude-3.7": {
        modelName: "Claude 3.7 Sonnet",
        version: "Neural Bastion: Swarm Defense",
        primaryColor: "#8b5cf6",
        turretTypes: ["Pulse Laser", "Cryo Slow", "Plasma Mortar", "Tesla Arc"],
        special: "EMP Chain Reaction Burst",
        scores: { originality: 99, visualDesign: 98, playability: 99, smoothness: 98, codeArchitecture: 99, audioSFX: 95, overall: 98.0 },
        judgeNote: "Complex multi-target range detection, elemental status effects (freezing/burning), and wave escalation."
      },
      "gpt-4.5": {
        modelName: "GPT-4.5 (Frontier)",
        version: "Singularity Defense Matrix",
        primaryColor: "#ec4899",
        turretTypes: ["Laser Cannon", "Gravity Freeze", "Singularity Bomb"],
        special: "Orbital Particle Strike",
        scores: { originality: 97, visualDesign: 97, playability: 98, smoothness: 97, codeArchitecture: 97, audioSFX: 93, overall: 96.5 },
        judgeNote: "Dynamic particle arcs between turrets and emergent swarm clustering."
      },
      "deepseek-r1": {
        modelName: "DeepSeek R1",
        version: "Hex-Grid Defense Core",
        primaryColor: "#14b8a6",
        turretTypes: ["Gatling Laser", "Shock Turret", "Missile Array"],
        special: "Overclock Turret Frequency",
        scores: { originality: 95, visualDesign: 94, playability: 96, smoothness: 96, codeArchitecture: 98, audioSFX: 91, overall: 95.0 },
        judgeNote: "Mathematical spatial partitioning grid for high performance creep collision detection."
      }
    }
  },

  {
    id: "roguelike",
    title: "Matrix Roguelike: Procedural Crypt",
    genre: "Procedural BSP Dungeon Crawler",
    tagline: "Binary Space Partitioning rooms, fog of war, turn-based enemy state machines",
    badge: "Procedural Roguelike",
    color: "#ef4444",
    models: {
      "claude-3.7": {
        modelName: "Claude 3.7 Sonnet",
        version: "Cyber-Crypt: Binary Crawler",
        primaryColor: "#ef4444",
        special: "Quantum Teleport Scroll + Glitch Blade Criticals",
        scores: { originality: 99, visualDesign: 98, playability: 98, smoothness: 99, codeArchitecture: 99, audioSFX: 94, overall: 97.8 },
        judgeNote: "Procedural BSP dungeon carving with room corridor linking, dynamic raycasted field of view (FOV), and enemy AI aggression states."
      },
      "gpt-4.5": {
        modelName: "GPT-4.5 (Frontier)",
        version: "Dungeon of the Void",
        primaryColor: "#f97316",
        special: "Void Blast + Health Leech Shield",
        scores: { originality: 97, visualDesign: 97, playability: 97, smoothness: 98, codeArchitecture: 96, audioSFX: 92, overall: 96.1 },
        judgeNote: "Rich loot tables, randomized weapon stats, and atmospheric dungeon fog."
      },
      "deepseek-r1": {
        modelName: "DeepSeek R1",
        version: "ASCII Retro Hack",
        primaryColor: "#22c55e",
        special: "Matrix Slow-Motion + Berserk Stance",
        scores: { originality: 96, visualDesign: 95, playability: 96, smoothness: 97, codeArchitecture: 98, audioSFX: 90, overall: 95.3 },
        judgeNote: "Pure roguelike turn-based mechanics with deterministic seed generation."
      }
    }
  }
];
