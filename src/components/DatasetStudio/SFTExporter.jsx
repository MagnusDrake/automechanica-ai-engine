import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Copy, 
  Check, 
  FileJson, 
  Sparkles, 
  Filter,
  Code
} from 'lucide-react';
import { exportToOpenAISFT, exportToDPO, downloadFile } from '../../utils/datasetExporter';

export default function SFTExporter({ environment, trajectories, selectedModel }) {
  const [format, setFormat] = useState('openai'); // openai | anthropic | dpo
  const [copied, setCopied] = useState(false);

  const modelTrajectory = trajectories[selectedModel] || [];
  
  let jsonlContent = '';
  if (format === 'openai') {
    jsonlContent = exportToOpenAISFT(modelTrajectory, environment);
  } else if (format === 'dpo') {
    jsonlContent = exportToDPO(modelTrajectory, null, environment);
  } else {
    jsonlContent = JSON.stringify({
      model: selectedModel,
      environment: environment.id,
      steps: modelTrajectory
    }, null, 2);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const fileName = `mechanize_trajectory_${environment.id}_${selectedModel.replace(/[^a-zA-Z0-9]/g, '_')}_${format}.jsonl`;
    downloadFile(jsonlContent, fileName, 'application/json');
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-emerald">RL & SFT DATASET STUDIO</span>
            <span className="badge badge-blue">{selectedModel}</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Agent Trajectory Dataset Exporter
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Export verified agent reasoning traces into standard JSONL datasets for Supervised Fine-Tuning (SFT) and Direct Preference Optimization (DPO).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline" onClick={handleCopy}>
            {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
            <span>{copied ? 'Copied JSONL!' : 'Copy to Clipboard'}</span>
          </button>
          <button className="btn btn-emerald" onClick={handleDownload}>
            <Download size={16} />
            <span>Download .JSONL File</span>
          </button>
        </div>
      </div>

      {/* Exporter Controls & Live Previewer */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        
        {/* Controls */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h3 style={{ color: '#fff', fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileJson size={18} color="var(--cyber-blue)" />
            <span>Dataset Output Format</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => setFormat('openai')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px', borderRadius: '8px',
                background: format === 'openai' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(31, 41, 55, 0.5)',
                border: `1px solid ${format === 'openai' ? 'var(--emerald)' : 'var(--border-subtle)'}`,
                color: '#fff', cursor: 'pointer', textAlign: 'left'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>OpenAI Messages JSONL</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>System, User, Assistant & Tool roles</div>
              </div>
              {format === 'openai' && <Check size={16} color="#34d399" />}
            </button>

            <button
              onClick={() => setFormat('dpo')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px', borderRadius: '8px',
                background: format === 'dpo' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(31, 41, 55, 0.5)',
                border: `1px solid ${format === 'dpo' ? 'var(--cyber-blue)' : 'var(--border-subtle)'}`,
                color: '#fff', cursor: 'pointer', textAlign: 'left'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>DPO Preference Pair</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Prompt + Chosen vs Rejected traces</div>
              </div>
              {format === 'dpo' && <Check size={16} color="#60a5fa" />}
            </button>
          </div>

          <div style={{ padding: '14px', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Trajectory Stats</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
              {modelTrajectory.length} Steps Logged
            </div>
            <div style={{ fontSize: '0.8rem', color: '#e5e7eb', marginTop: '2px' }}>
              Reward: {modelTrajectory.length ? Math.round(modelTrajectory[modelTrajectory.length-1].reward * 100) : 0}%
            </div>
          </div>

        </div>

        {/* Live Code Preview */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h4 style={{ color: '#fff', fontSize: '0.9rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Code size={16} color="var(--emerald)" />
              <span>Live Dataset Preview</span>
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>JSONL format</span>
          </div>

          <div style={{ flex: 1, background: '#070a11', padding: '16px', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', overflowY: 'auto', border: '1px solid var(--border-subtle)', color: '#34d399', lineHeight: '1.6' }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {jsonlContent}
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
}
