import React, { useState } from 'react';
import { 
  Gamepad2, 
  Crosshair, 
  Gauge, 
  Shield, 
  Skull, 
  Code, 
  Layers, 
  Play, 
  Sparkles 
} from 'lucide-react';
import AsteroidsGameEngine from './Engines/AsteroidsGameEngine';
import CyberRacerEngine from './Engines/CyberRacerEngine';
import TowerDefenseEngine from './Engines/TowerDefenseEngine';
import RoguelikeDungeonEngine from './Engines/RoguelikeDungeonEngine';
import LiveCodeSandboxModal from './LiveCodeSandboxModal';

// Pac-Man Engine component
import PacmanArcadeEngine from './Engines/PacmanArcadeEngine';

export default function PlayableGameArcade({ 
  selectedGameId = 'pacman', 
  selectedGame, 
  selectedModelKey = 'claude-3.7',
  modelConfig,
  onSelectGame,
  gamesList = []
}) {
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Game Matrix Genre Selector Pills */}
      <div className="glass-panel" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' }}>
          {gamesList.map(g => {
            const isSelected = g.id === selectedGameId;
            return (
              <button
                key={g.id}
                onClick={() => onSelectGame(g.id)}
                className={`btn btn-sm ${isSelected ? 'btn-emerald' : 'btn-outline'}`}
                style={{ border: 'none', fontSize: '0.78rem', whiteSpace: 'nowrap' }}
              >
                {g.id === 'pacman' && <Gamepad2 size={14} />}
                {g.id === 'asteroids' && <Crosshair size={14} />}
                {g.id === 'racer' && <Gauge size={14} />}
                {g.id === 'towerdefense' && <Shield size={14} />}
                {g.id === 'roguelike' && <Skull size={14} />}
                <span>{g.title.split(':')[0]}</span>
              </button>
            );
          })}
        </div>

        <button 
          className="btn btn-outline btn-sm"
          onClick={() => setIsCodeModalOpen(true)}
          style={{ borderColor: 'rgba(59, 130, 246, 0.4)', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}
        >
          <Code size={14} />
          <span>Live Code Sandbox</span>
        </button>
      </div>

      {/* Render Active Game Engine */}
      {selectedGameId === 'pacman' && (
        <PacmanArcadeEngine gameConfig={modelConfig} />
      )}

      {selectedGameId === 'asteroids' && (
        <AsteroidsGameEngine modelConfig={modelConfig} />
      )}

      {selectedGameId === 'racer' && (
        <CyberRacerEngine modelConfig={modelConfig} />
      )}

      {selectedGameId === 'towerdefense' && (
        <TowerDefenseEngine modelConfig={modelConfig} />
      )}

      {selectedGameId === 'roguelike' && (
        <RoguelikeDungeonEngine modelConfig={modelConfig} />
      )}

      {/* Live Code Sandbox Modal */}
      <LiveCodeSandboxModal 
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        selectedGame={selectedGame}
        selectedModel={selectedModelKey}
        modelConfig={modelConfig}
      />

    </div>
  );
}
