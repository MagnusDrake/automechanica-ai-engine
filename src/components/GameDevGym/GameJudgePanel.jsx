import React from 'react';
import { 
  Sparkles, 
  Award, 
  Palette, 
  Gamepad, 
  Zap, 
  Code, 
  Volume2, 
  CheckCircle2,
  Brain,
  Star
} from 'lucide-react';

export default function GameJudgePanel({ gameConfig }) {
  const scores = gameConfig.scores;

  const criteria = [
    { key: 'originality', label: 'Originality & Innovation', score: scores.originality, icon: Sparkles, color: '#c084fc', desc: 'Creative theme twists, unique maze design, and power-up mechanics' },
    { key: 'visualDesign', label: 'Visual Design & Aesthetics', score: scores.visualDesign, icon: Palette, color: '#60a5fa', desc: 'Neon glassmorphism, particle effects, UI HUD, and rendering fidelity' },
    { key: 'playability', label: 'Playability & Controls', score: scores.playability, icon: Gamepad, color: '#34d399', desc: 'WASD & Arrow keys grid alignment, movement responsiveness, collision precision' },
    { key: 'smoothness', label: 'Smoothness & 60 FPS', score: scores.smoothness, icon: Zap, color: '#fbbf24', desc: 'Delta-time requestAnimationFrame render loop stability and zero micro-stutter' },
    { key: 'codeArchitecture', label: 'Code Architecture', score: scores.codeArchitecture, icon: Code, color: '#f87171', desc: 'Canvas state machine, clean OOP structure, exception safety' },
    { key: 'audioSFX', label: 'Audio & Sound Synthesis', score: scores.audioSFX, icon: Volume2, color: '#38bdf8', desc: 'Web Audio API procedural chiptune synthesizer for waka-waka and sound FX' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Overall Judge Rating Banner */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-emerald">AI GAME DEV JUDGE PANEL</span>
            <span className="badge badge-purple">{gameConfig.modelName}</span>
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Automated Evaluation Scorecard
          </h3>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Overall Score</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>
            {scores.totalOverall} <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>/ 100</span>
          </div>
        </div>
      </div>

      {/* Criteria Progress Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {criteria.map(item => {
          const Icon = item.icon;
          return (
            <div key={item.key} className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon size={18} color={item.color} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>{item.label}</span>
                </div>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: item.color, fontFamily: 'var(--font-mono)' }}>
                  {item.score}%
                </span>
              </div>

              <div style={{ height: '6px', width: '100%', background: '#1f2937', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${item.score}%`, background: item.color }} />
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Qualitative Judge Commentary */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Brain size={16} color="var(--purple-accent)" />
          <span>Qualitative AI Judge Review</span>
        </h4>
        <p style={{ fontSize: '0.85rem', color: '#e5e7eb', lineHeight: '1.6', background: 'rgba(15, 23, 42, 0.7)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', margin: 0 }}>
          "{gameConfig.judgeReview}"
        </p>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
          {gameConfig.specialFeatures.map((feat, idx) => (
            <span key={idx} className="badge badge-emerald">
              <CheckCircle2 size={12} />
              {feat}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
