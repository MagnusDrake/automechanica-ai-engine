import React from 'react';
import { Target, X, Send, Award, CheckCircle2 } from 'lucide-react';

export default function CreatorMissionModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 999999 }}>
      <div 
        className="glass-panel glow-purple" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          width: '90%', 
          maxWidth: '720px', 
          padding: '28px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid var(--purple-accent)',
          boxShadow: '0 0 40px rgba(139, 92, 246, 0.4)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Target size={24} color="#c084fc" />
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>Creator Mission Manifesto</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Project Motivation & Engineering Portfolio</div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-sm" style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: '#e5e7eb', fontSize: '0.9rem', lineHeight: '1.6' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.4)', padding: '16px', borderRadius: '10px' }}>
            <h4 style={{ color: '#c084fc', margin: '0 0 6px 0', fontSize: '1rem', fontWeight: 800 }}>Inspired by Mechanize Inc.</h4>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              This application—**AUTOMECHANICA**—was created as a direct proof of concept to demonstrate deep technical mastery in building RL simulation environments, automated reward graders, and game-generation evaluation sandboxes for frontier LLMs.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.9)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <h5 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: 700 }}>Key Architectural Capabilities Built:</h5>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              <li style={{ marginBottom: '6px' }}><strong style={{ color: '#fff' }}>Interactive Coding & Tool Gyms</strong> (SWE-Gym, Tool-Gym, Web-Gym, Sec-Gym).</li>
              <li style={{ marginBottom: '6px' }}><strong style={{ color: '#fff' }}>Step-by-Step Trajectory Debugger</strong> with CoT reasoning and unified file diffs.</li>
              <li style={{ marginBottom: '6px' }}><strong style={{ color: '#fff' }}>Automated Reward Grader Studio</strong> calibrating AST, unit tests, and security metrics.</li>
              <li style={{ marginBottom: '6px' }}><strong style={{ color: '#fff' }}>Playable GameDev Evaluation Suite</strong> executing 60 FPS Pac-Man canvas engines with custom AI ghost pathfinding & Web Audio API SFX.</li>
              <li><strong style={{ color: '#fff' }}>SFT & DPO Dataset Exporter</strong> for OpenAI/Anthropic training JSONL pipelines.</li>
            </ul>
          </div>

          <div style={{ textAlign: 'center', fontStyle: 'italic', color: '#34d399', fontSize: '0.85rem', marginTop: '6px' }}>
            "Built to demonstrate relentless drive, speed of execution, and passion for frontier AI evaluation."
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
          <button className="btn btn-emerald" onClick={onClose}>
            <Send size={15} />
            <span>Return to AUTOMECHANICA</span>
          </button>
        </div>

      </div>
    </div>
  );
}
