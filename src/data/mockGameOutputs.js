export const MOCK_GAME_OUTPUTS = {
  "claude-3.7": {
    id: "claude-3.7",
    modelName: "Claude 3.7 Sonnet (Thinking Agent)",
    gameTitle: "Cyberpunk Neon Protocol",
    theme: "Cyberpunk Emerald Neon",
    primaryColor: "#10b981", // Emerald Neon
    wallColor: "#3b82f6",    // Cyber Blue Walls
    pelletColor: "#f59e0b",  // Amber Gold pellets
    ghostColors: ["#ef4444", "#ec4899", "#06b6d4", "#a855f7"],
    gameSpeed: 7, // Faster tick speed
    specialAbility: "Cyber Speed Boost (+50% Speed when eating pellets)",
    scores: {
      originality: 96,
      visualDesign: 97,
      playability: 98,
      smoothness: 99,
      codeArchitecture: 97,
      audioSFX: 95,
      totalOverall: 97.0
    },
    judgeReview: "Claude 3.7 designed an open Cyber-Grid maze with smart flanking ghost AI that attempts to cut off player escape routes. Features high-velocity movement and dynamic particle trails.",
    specialFeatures: ["Open Cyber-Grid Maze", "Flanking Ghost AI", "Speed Boost Trail", "Synth SFX"],
    // Unique Open Cyber-Grid Maze Layout (19 x 20)
    maze: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,3,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,3,1],
      [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
      [1,2,1,1,2,2,2,2,2,2,2,2,2,2,2,1,1,2,1],
      [1,2,2,2,2,1,1,2,1,1,1,2,1,1,2,2,2,2,1],
      [1,1,1,1,2,1,0,0,0,0,0,0,0,1,2,1,1,1,1],
      [0,0,0,1,2,1,0,1,1,0,1,1,0,1,2,1,0,0,0],
      [1,1,1,1,2,1,0,1,0,0,0,1,0,1,2,1,1,1,1],
      [0,0,0,0,2,0,0,1,0,0,0,1,0,0,2,0,0,0,0],
      [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
      [0,0,0,1,2,1,0,0,0,0,0,0,0,1,2,1,0,0,0],
      [1,1,1,1,2,1,0,1,1,1,1,1,0,1,2,1,1,1,1],
      [1,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1],
      [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
      [1,3,2,1,2,2,2,2,2,0,2,2,2,2,2,1,2,3,1],
      [1,1,2,1,2,1,2,1,1,1,1,1,2,1,2,1,2,1,1],
      [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
      [1,2,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,2,1],
      [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
  },

  "gpt-4.5": {
    id: "gpt-4.5",
    modelName: "GPT-4.5 (Frontier)",
    gameTitle: "Quantum Shift: Parallel Dimensions",
    theme: "Quantum Holographic Purple",
    primaryColor: "#a855f7", // Quantum Purple Pac-Man
    wallColor: "#06b6d4",    // Holographic Cyan Walls
    pelletColor: "#34d399",  // Emerald Energy Pellets
    ghostColors: ["#ef4444", "#f59e0b", "#eab308", "#ec4899"],
    gameSpeed: 6, // Ultra fast
    specialAbility: "Quantum Warp Portals + Ghost Phase Absorber",
    scores: {
      originality: 95,
      visualDesign: 98,
      playability: 96,
      smoothness: 98,
      codeArchitecture: 96,
      audioSFX: 93,
      totalOverall: 96.0
    },
    judgeReview: "GPT-4.5 generated a circular chamber maze with 4 active warp portals. Power pellets trigger 'Quantum Shift Mode' turning ghosts into absorbed energy particles for massive point bonuses.",
    specialFeatures: ["4 Quantum Portals", "Holographic Chamber Maze", "Phase Absorber Mode", "Laser SFX"],
    // Unique Quantum Chamber Maze Layout (19 x 20) with multiple cross-portals
    maze: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,3,2,2,2,2,1,2,2,2,2,2,1,2,2,2,2,3,1],
      [1,2,1,1,1,2,1,2,1,1,1,2,1,2,1,1,1,2,1],
      [1,2,1,3,1,2,2,2,2,1,2,2,2,2,1,3,1,2,1],
      [1,2,1,2,1,1,1,1,2,1,2,1,1,1,1,2,1,2,1],
      [0,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,0], // Side Warp Portal 1
      [1,2,1,1,1,2,1,1,1,0,1,1,1,2,1,1,1,2,1],
      [1,2,2,2,1,2,1,0,0,0,0,0,1,2,1,2,2,2,1],
      [1,1,1,2,1,2,1,0,1,1,1,0,1,2,1,2,1,1,1],
      [0,0,0,2,0,2,0,0,1,0,1,0,0,2,0,2,0,0,0], // Center Warp Tunnel
      [1,1,1,2,1,2,1,0,1,1,1,0,1,2,1,2,1,1,1],
      [1,2,2,2,1,2,1,0,0,0,0,0,1,2,1,2,2,2,1],
      [1,2,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,2,1],
      [0,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,2,2,0], // Side Warp Portal 2
      [1,2,1,2,1,1,1,1,2,1,2,1,1,1,1,2,1,2,1],
      [1,2,1,3,1,2,2,2,2,1,2,2,2,2,1,3,1,2,1],
      [1,2,1,1,1,2,1,2,1,1,1,2,1,2,1,1,1,2,1],
      [1,3,2,2,2,2,1,2,2,2,2,2,1,2,2,2,2,3,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
  },

  "deepseek-r1": {
    id: "deepseek-r1",
    modelName: "DeepSeek R1 (Reasoning)",
    gameTitle: "Retro Glitch Arcade Pac",
    theme: "Retro CRT Glitch",
    primaryColor: "#fbbf24", // Arcade Amber Pac-Man
    wallColor: "#dc2626",    // Neon Red Walls
    pelletColor: "#ffffff",  // White CRT Pellets
    ghostColors: ["#00ffff", "#ff00ff", "#ffff00", "#00ff00"],
    gameSpeed: 9, // Tactical speed
    specialAbility: "Glitch Stasis (Freezes ghosts in place for 5 sec)",
    scores: {
      originality: 93,
      visualDesign: 92,
      playability: 95,
      smoothness: 96,
      codeArchitecture: 97,
      audioSFX: 90,
      totalOverall: 93.8
    },
    judgeReview: "DeepSeek R1 designed a tight, asymmetric arcade labyrinth with narrow choke points. Eating Glitch Pellets triggers a full screen color-inversion and freezes ghosts in stasis.",
    specialFeatures: ["Asymmetric Labyrinth", "Glitch Stasis Mode", "CRT Scanline Filter", "8-Bit Retro Chiptunes"],
    // Unique Asymmetric Labyrinth Maze Layout (19 x 20)
    maze: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,2,2,2,1,2,2,2,2,1,2,2,2,2,1,2,2,2,1],
      [1,2,1,2,1,2,1,1,2,1,2,1,1,2,1,2,1,2,1],
      [1,3,1,2,2,2,1,3,2,1,2,3,1,2,2,2,1,3,1],
      [1,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1],
      [1,2,2,2,1,2,2,2,2,0,2,2,2,2,1,2,2,2,1],
      [1,2,1,2,1,1,1,1,2,1,2,1,1,1,1,2,1,2,1],
      [1,2,1,2,2,2,2,1,0,0,0,1,2,2,2,2,1,2,1],
      [1,2,1,1,1,1,2,1,1,0,1,1,2,1,1,1,1,2,1],
      [0,2,2,2,2,1,2,0,0,0,0,0,2,1,2,2,2,2,0], // CRT Warp Alley
      [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
      [1,2,1,2,2,2,2,1,0,0,0,1,2,2,2,2,1,2,1],
      [1,2,1,2,1,1,1,1,2,1,2,1,1,1,1,2,1,2,1],
      [1,2,2,2,1,2,2,2,2,0,2,2,2,2,1,2,2,2,1],
      [1,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1],
      [1,3,1,2,2,2,1,3,2,1,2,3,1,2,2,2,1,3,1],
      [1,2,1,2,1,2,1,1,2,1,2,1,1,2,1,2,1,2,1],
      [1,2,2,2,1,2,2,2,2,1,2,2,2,2,1,2,2,2,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
  }
};
