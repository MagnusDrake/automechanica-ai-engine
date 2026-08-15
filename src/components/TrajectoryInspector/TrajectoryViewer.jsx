import React, { useState } from 'react';
import { 
  Layers, 
  BrainCircuit, 
  Terminal, 
  FileText, 
  TrendingUp, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  Code
} from 'lucide-react';

export default function TrajectoryViewer({ 
  environment, 
  trajectories, 
  selectedModel, 
  setSelectedModel, 
  availableModels 
}) {
  const modelSteps = trajectories[selectedModel] || [];
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);

  const activeStepData = modelSteps[selectedStepIndex] || modelSteps[0];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header Bar */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-emerald">Trajectory Inspector</span>
            <span className="badge badge-blue">{environment.name}</span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Agent Trajectory & Reasoning Trace
          </h2>
        </div>

        {/* Model Selection for Trajectory Comparison */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Comparing Trajectory For:</span>
          <select 
            value={selectedModel}
            onChange={(e) => {
              setSelectedModel(e.target.value);
              setSelectedStepIndex(0);
            }}
            style={{ 
              background: '#1f2937', 
              border: '1px solid var(--border-subtle)', 
              color: '#fff', 
              padding: '8px 14px', 
              borderRadius: '8px', 
              fontWeight: 600, 
              fontSize: '0.875rem' 
            }}
          >
            {availableModels.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Trajectory Step Timeline Slider */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} color="var(--emerald)" />
            <span>Execution Step Timeline ({modelSteps.length} Total Steps)</span>
          </h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Click step to inspect reasoning & code diffs
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
          {modelSteps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedStepIndex(idx)}
              style={{
                flex: '0 0 auto',
                width: '180px',
                padding: '12px',
                borderRadius: '10px',
                background: selectedStepIndex === idx ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)' : 'rgba(31, 41, 55, 0.5)',
                border: `1px solid ${selectedStepIndex === idx ? 'var(--emerald)' : 'var(--border-subtle)'}`,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: selectedStepIndex === idx ? '#34d399' : 'var(--text-muted)' }}>
                  STEP {step.step}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                  {step.timestamp}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {step.phase}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '0.72rem', color: '#60a5fa' }}>
                <TrendingUp size={12} />
                <span>Reward: {Math.round(step.reward * 100)}%</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Inspection Grid */}
      {activeStepData && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Left Column: Chain-of-Thought Reasoning & Action */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Reasoning Card */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <BrainCircuit size={18} color="#c084fc" />
                <h3 style={{ fontSize: '1rem', color: '#fff', margin: 0 }}>Model Chain-of-Thought (CoT)</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#e5e7eb', lineHeight: '1.6', background: 'rgba(15, 23, 42, 0.7)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-subtle)', margin: 0 }}>
                {activeStepData.thought}
              </p>
            </div>

            {/* Action Card */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Terminal size={18} color="#60a5fa" />
                <h3 style={{ fontSize: '1rem', color: '#fff', margin: 0 }}>Invoked Action Tool</h3>
              </div>
              <div style={{ background: '#090d16', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.825rem' }}>
                <div style={{ color: '#fbbf24', marginBottom: '4px' }}>Tool: {activeStepData.action.tool}</div>
                <div style={{ color: '#34d399' }}>Target: {activeStepData.action.command || activeStepData.action.path}</div>
              </div>
            </div>

            {/* Environment Observation Feedback */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <FileText size={18} color="#34d399" />
                <h3 style={{ fontSize: '1rem', color: '#fff', margin: 0 }}>Environment Sandbox Observation</h3>
              </div>
              <pre style={{ background: '#070a11', padding: '14px', borderRadius: '8px', color: '#9ca3af', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', whiteSpace: 'pre-wrap', margin: 0 }}>
                {activeStepData.observation}
              </pre>
            </div>

          </div>

          {/* Right Column: Code Patch Diff & Reward Trajectory */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* File Patch Code Diff */}
            <div className="glass-panel" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Code size={18} color="#10b981" />
                <h3 style={{ fontSize: '1rem', color: '#fff', margin: 0 }}>Unified File Patch (Diff)</h3>
              </div>

              {activeStepData.diff ? (
                <div style={{ flex: 1, background: '#070a11', padding: '14px', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', overflowY: 'auto', border: '1px solid var(--border-subtle)' }}>
                  <pre style={{ margin: 0 }}>
                    {activeStepData.diff.split('\n').map((line, lIdx) => {
                      let className = 'diff-context';
                      if (line.startsWith('+')) className = 'diff-add';
                      if (line.startsWith('-')) className = 'diff-remove';
                      return (
                        <div key={lIdx} className={className} style={{ padding: '2px 4px', borderRadius: '2px' }}>
                          {line}
                        </div>
                      );
                    })}
                  </pre>
                </div>
              ) : (
                <div style={{ flex: 1, border: '1px dashed var(--border-subtle)', borderRadius: '8px', padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={32} color="var(--text-dim)" style={{ marginBottom: '8px' }} />
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                    No file edits performed in this step (Read-only / Diagnostics action).
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
