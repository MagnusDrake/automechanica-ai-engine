import React, { useState } from 'react';
import { 
  Sliders, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Save, 
  RotateCcw, 
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';

export default function RewardStudio({ currentEnv }) {
  const [weights, setWeights] = useState({
    unitTests: 50,
    diffCleanliness: 20,
    securityScore: 20,
    latencyPenalty: 10
  });

  const [saved, setSaved] = useState(false);

  const totalWeight = weights.unitTests + weights.diffCleanliness + weights.securityScore + weights.latencyPenalty;

  const handleSliderChange = (key, value) => {
    setWeights(prev => ({ ...prev, [key]: Number(value) }));
  };

  const handleSaveGrader = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-emerald">REWARD FUNCTION DESIGNER</span>
            <span className="badge badge-purple">{currentEnv.name}</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Automated Reward Signal & Grader Studio
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Configure reinforcement learning reward signals for model fine-tuning and benchmark verification.
          </p>
        </div>

        <button className="btn btn-emerald" onClick={handleSaveGrader}>
          {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          <span>{saved ? 'Grader Spec Saved!' : 'Save Reward Spec'}</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Sliders Configuration Panel */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="var(--emerald)" />
            <span>Reward Component Weight Distribution</span>
          </h3>

          {/* Unit Test Weight */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>Unit Test Pass Rate Grader</label>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)' }}>{weights.unitTests}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={weights.unitTests} 
              onChange={(e) => handleSliderChange('unitTests', e.target.value)}
              style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
              Evaluates execution pass percentage of pytest / jest verification test cases.
            </p>
          </div>

          {/* Diff Cleanliness Weight */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>AST Code & Diff Cleanliness</label>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>{weights.diffCleanliness}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={weights.diffCleanliness} 
              onChange={(e) => handleSliderChange('diffCleanliness', e.target.value)}
              style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer' }}
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
              Penalizes unnecessary file edits, bloat lines, or breaking refactors outside target scope.
            </p>
          </div>

          {/* Security Score Weight */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>Security & CVE Audit Validation</label>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#c084fc', fontFamily: 'var(--font-mono)' }}>{weights.securityScore}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={weights.securityScore} 
              onChange={(e) => handleSliderChange('securityScore', e.target.value)}
              style={{ width: '100%', accentColor: '#8b5cf6', cursor: 'pointer' }}
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '6px 0 0 0' }}>
              Verifies zero introduced security vulnerabilities (OWASP, SQLi, HMAC verification).
            </p>
          </div>

        </div>

        {/* Live Reward Calculation Summary */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ color: '#fff', fontSize: '1rem', margin: 0 }}>Grader Calibration Summary</h3>

          <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Normalized Weight Sum</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: totalWeight === 100 ? '#34d399' : '#fbbf24' }}>
              {totalWeight}%
            </div>
            {totalWeight !== 100 && (
              <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '4px' }}>
                Warning: Weights sum to {totalWeight}% (will automatically normalize to 100% during RL training).
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Target Environment:</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>{currentEnv.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Grader Engine:</span>
              <span style={{ color: '#34d399', fontWeight: 600 }}>Mechanize Grader v2.6</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
