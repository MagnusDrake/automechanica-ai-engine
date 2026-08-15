import React from 'react';
import { Trophy, Sparkles, Building2, Layers, CheckCircle2, ShieldCheck, Award } from 'lucide-react';

export default function ArchitectJudgePanel({ telemetry = [] }) {
  const modelJudgeReports = {
    claude: {
      model: "Claude 3.7 Sonnet",
      structure: "The Emerald Cyber-Spire",
      scores: { verticality: 99, symmetry: 97, materialHarmony: 98, constructionVelocity: 96, spatialPlanning: 99, overall: 97.8 },
      review: "Masterclass in vertical cantilever engineering. Balanced Neo-Tokyo cantilever rings with glowing glass viewing decks and an emerald pinnacle.",
      badges: ["Highest Verticality (24 Y)", "Cantilever Balcony Architecture", "Zero Spatial Collisions"]
    },
    gpt: {
      model: "GPT-4.5 (Frontier)",
      structure: "The Quantum Monolith Citadel",
      scores: { verticality: 96, symmetry: 99, materialHarmony: 97, constructionVelocity: 97, spatialPlanning: 98, overall: 97.4 },
      review: "Immaculate mathematical concentric stepping. Features a floating quantum crystal core suspended at center altitude with purple neon accents.",
      badges: ["Concentric 4-Tier Pyramid", "Floating Voxel Core", "Perfect Euler Symmetry"]
    },
    deepseek: {
      model: "DeepSeek R1",
      structure: "The Obsidian Fortress",
      scores: { verticality: 94, symmetry: 98, materialHarmony: 95, constructionVelocity: 98, spatialPlanning: 97, overall: 96.4 },
      review: "Impenetrable medieval-futuristic layout with 4 spiraling corner towers and alternating stone battlements.",
      badges: ["4 Symmetrical Towers", "Castellated Battlements", "High Density Voxel Efficiency"]
    },
    gemini: {
      model: "Gemini 3 Pro",
      structure: "The Solar Hyper-Gate",
      scores: { verticality: 95, symmetry: 96, materialHarmony: 96, constructionVelocity: 95, spatialPlanning: 96, overall: 95.6 },
      review: "Spectacular circular torus geometry. Accurate trigonometric voxel arch discretization with gold and cyan lighting rings.",
      badges: ["Trigonometric Torus Ring", "Dual Neon Light Rings", "Monumental Gateway"]
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Building2 size={20} color="var(--emerald)" />
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>3D Spatial Reasoning & Architect Matrix</h3>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Automated real-time evaluation of autonomous AI megastructures</div>
          </div>
        </div>
        <span className="badge badge-emerald">ARCHITECTUS v3.0</span>
      </div>

      {/* Model Scorecards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {Object.keys(modelJudgeReports).map(key => {
          const report = modelJudgeReports[key];
          const agentLive = telemetry.find(a => a.key === key);
          const currentHeight = agentLive ? agentLive.height : 0;
          const currentProgress = agentLive ? agentLive.progress : 0;

          return (
            <div 
              key={key}
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '14px 16px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>{report.model}</span>
                  <span style={{ fontSize: '0.75rem', color: '#60a5fa', marginLeft: '8px' }}>— {report.structure}</span>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                  {report.scores.overall}%
                </div>
              </div>

              {/* Spatial Metric Bars */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <div>Verticality: <strong style={{ color: '#fff' }}>{report.scores.verticality}%</strong></div>
                <div>Symmetry: <strong style={{ color: '#fff' }}>{report.scores.symmetry}%</strong></div>
                <div>Palette Harmony: <strong style={{ color: '#fff' }}>{report.scores.materialHarmony}%</strong></div>
              </div>

              <p style={{ margin: 0, fontSize: '0.78rem', color: '#e5e7eb', fontStyle: 'italic', background: 'rgba(7, 10, 17, 0.6)', padding: '8px 10px', borderRadius: '6px' }}>
                "{report.review}"
              </p>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {report.badges.map((b, i) => (
                  <span key={i} className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                    <CheckCircle2 size={10} />
                    {b}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
