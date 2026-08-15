import React, { useState } from 'react';
import { Terminal, Key, Code2, Sparkles, CheckCircle2, Gamepad2, Layers } from 'lucide-react';
import PlayableGameArcade from './PlayableGameArcade';
import GameJudgePanel from './GameJudgePanel';
import { EXPANDED_GAMES_METADATA } from '../../data/mockExpandedGames';

export default function GameBuilderStudio({ selectedModel, setSelectedModel, availableModels }) {
  const [selectedGameId, setSelectedGameId] = useState('pacman');
  const [activeModelKey, setActiveModelKey] = useState('claude-3.7'); // claude-3.7 | gpt-4.5 | deepseek-r1
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [customEndpoint, setCustomEndpoint] = useState('https://api.openai.com/v1/chat/completions');

  const currentGame = EXPANDED_GAMES_METADATA.find(g => g.id === selectedGameId) || EXPANDED_GAMES_METADATA[0];
  const currentModelConfig = currentGame.models[activeModelKey] || currentGame.models['claude-3.7'];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-emerald">THE IMAGINATION MATRIX</span>
            <span className="badge badge-purple">{currentGame.title}</span>
            <span className="badge badge-blue">{currentGame.genre}</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Multi-Genre AI Video Game Evaluation Gym
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            {currentGame.tagline}. Playable directly inside your browser at 60 FPS!
          </p>
        </div>

        {/* Model Selector & API Prompt Inspector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn btn-outline btn-sm" onClick={() => setShowPromptModal(true)}>
            <Terminal size={15} />
            <span>System Prompt & API</span>
          </button>

          <div style={{ display: 'flex', gap: '6px', background: 'rgba(15, 23, 42, 0.7)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => { setActiveModelKey('claude-3.7'); setSelectedModel("Claude 3.7 Sonnet (Thinking Agent)"); }}
              className={`btn btn-sm ${activeModelKey === 'claude-3.7' ? 'btn-emerald' : 'btn-outline'}`}
              style={{ border: 'none' }}
            >
              Claude 3.7
            </button>
            <button
              onClick={() => { setActiveModelKey('gpt-4.5'); setSelectedModel("GPT-4.5 (Frontier)"); }}
              className={`btn btn-sm ${activeModelKey === 'gpt-4.5' ? 'btn-emerald' : 'btn-outline'}`}
              style={{ border: 'none' }}
            >
              GPT-4.5
            </button>
            <button
              onClick={() => { setActiveModelKey('deepseek-r1'); setSelectedModel("DeepSeek R1 (Reasoning)"); }}
              className={`btn btn-sm ${activeModelKey === 'deepseek-r1' ? 'btn-emerald' : 'btn-outline'}`}
              style={{ border: 'none' }}
            >
              DeepSeek R1
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left side Playable Arcade, Right side AI Judge Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Interactive Playable Canvas Arcade */}
        <PlayableGameArcade 
          selectedGameId={selectedGameId}
          selectedGame={currentGame}
          selectedModelKey={activeModelKey}
          modelConfig={currentModelConfig}
          onSelectGame={setSelectedGameId}
          gamesList={EXPANDED_GAMES_METADATA}
        />

        {/* Right Column: Multi-Dimensional Judge Panel */}
        <GameJudgePanel 
          gameConfig={{
            modelName: currentModelConfig.modelName,
            scores: {
              originality: currentModelConfig.scores.originality,
              visualDesign: currentModelConfig.scores.visualDesign,
              playability: currentModelConfig.scores.playability,
              smoothness: currentModelConfig.scores.smoothness,
              codeArchitecture: currentModelConfig.scores.codeArchitecture,
              audioSFX: currentModelConfig.scores.audioSFX,
              totalOverall: currentModelConfig.scores.overall
            },
            judgeReview: currentModelConfig.judgeNote,
            specialFeatures: [currentModelConfig.special, currentGame.tagline, "60 FPS Canvas Loop", "Procedural SFX Synth"]
          }} 
        />

      </div>

      {/* Prompt & API Modal */}
      {showPromptModal && (
        <div className="modal-overlay" onClick={() => setShowPromptModal(false)} style={{ zIndex: 999999 }}>
          <div 
            className="glass-panel glow-emerald" 
            onClick={(e) => e.stopPropagation()}
            style={{ width: '90%', maxWidth: '750px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'rgba(15, 23, 42, 0.95)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Terminal size={20} color="var(--emerald)" />
                <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>System Evaluation Prompt & Live Execution Spec</h3>
              </div>
              <button onClick={() => setShowPromptModal(false)} className="btn btn-outline btn-sm">Close</button>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                SYSTEM PROMPT SENT TO AI MODELS FOR {currentGame.title.toUpperCase()}:
              </label>
              <pre style={{ background: '#090d16', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', color: '#34d399', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', margin: 0, whiteSpace: 'pre-wrap', maxHeight: '180px', overflowY: 'auto' }}>
{`You are a frontier GameDev AI agent operating inside AUTOMECHANICA Engine.
Your task: Build a complete, self-contained HTML5 Canvas game for genre: [${currentGame.genre}].
Requirements:
1. Implement physics, collision detection, and delta-time loop.
2. Implement AI enemy pathfinding / emergent swarm behavior.
3. Design a unique theme, color scheme, and map mechanics.
4. Implement procedural sound synthesis via Web Audio API.
5. Provide valid executable JavaScript code without syntax errors.`}
              </pre>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ color: '#fff', fontSize: '0.9rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={16} color="var(--cyber-blue)" />
                <span>Connect Live Model API Endpoint</span>
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>API Provider Key (Optional)</label>
                  <input 
                    type="password" 
                    placeholder="sk-proj-..."
                    value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>API Endpoint URL / Local LLM</label>
                  <input 
                    type="text" 
                    value={customEndpoint} onChange={(e) => setCustomEndpoint(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                When an API key is provided, AUTOMECHANICA executes real live API calls to your model, parses the returned HTML5 Canvas code in an isolated sandbox, and runs the automated grader.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-emerald btn-sm" onClick={() => setShowPromptModal(false)}>
                <CheckCircle2 size={14} />
                <span>Save API Config</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
