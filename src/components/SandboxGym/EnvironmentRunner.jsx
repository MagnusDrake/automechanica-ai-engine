import React, { useState } from 'react';
import { 
  FileCode, 
  Terminal as TerminalIcon, 
  Globe, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Maximize2, 
  Copy, 
  Check, 
  Code2, 
  ShieldCheck, 
  Zap,
  RotateCcw
} from 'lucide-react';

export default function EnvironmentRunner({ 
  environment, 
  selectedModel, 
  testSuite, 
  rewardScore, 
  activeStep, 
  trajectorySteps, 
  isSimulating, 
  onRunSimulation,
  onResetEnv
}) {
  const [selectedFile, setSelectedFile] = useState(Object.keys(environment.repoFiles)[0] || '');
  const [rightTab, setRightTab] = useState('terminal'); // terminal | browser | network | grader
  const [copied, setCopied] = useState(false);

  const currentFileContent = environment.repoFiles[selectedFile] || '';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: 'calc(100vh - 85px)', padding: '16px' }}>
      
      {/* Top Banner: Environment Spec Info */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span className="badge badge-purple">{environment.category}</span>
            <span className={`badge ${environment.difficulty === 'Expert' ? 'badge-crimson' : environment.difficulty === 'Hard' ? 'badge-amber' : 'badge-emerald'}`}>
              {environment.difficulty}
            </span>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#fff' }}>{environment.name}</h2>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, maxWidth: '850px' }}>
            {environment.description}
          </p>
        </div>

        {/* Live Reward Score & Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Automated Reward Signal
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: rewardScore >= 80 ? '#34d399' : rewardScore >= 50 ? '#fbbf24' : '#f87171' }}>
              {rewardScore} <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>/ 100</span>
            </div>
          </div>

          <div style={{ width: '1px', height: '40px', background: 'var(--border-subtle)' }} />

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-outline btn-sm" onClick={onResetEnv} title="Reset Sandbox State">
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
            <button 
              className={`btn btn-sm ${isSimulating ? 'btn-outline' : 'btn-emerald'}`}
              onClick={onRunSimulation}
              disabled={isSimulating}
            >
              <Play size={14} />
              <span>{isSimulating ? 'Executing...' : 'Evaluate Model'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Workspace Split View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flex: 1, minHeight: 0 }}>
        
        {/* Left Side: Code Editor & Repository Tree */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* File Tab Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(15, 23, 42, 0.8)', padding: '4px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' }}>
              {Object.keys(environment.repoFiles).map(filePath => (
                <button
                  key={filePath}
                  onClick={() => setSelectedFile(filePath)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px 6px 0 0',
                    background: selectedFile === filePath ? 'rgba(31, 41, 55, 0.9)' : 'transparent',
                    color: selectedFile === filePath ? '#34d399' : 'var(--text-muted)',
                    border: 'none',
                    borderBottom: selectedFile === filePath ? '2px solid #10b981' : 'none',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  <FileCode size={13} />
                  <span>{filePath}</span>
                </button>
              ))}
            </div>

            <button onClick={handleCopyCode} className="btn btn-outline btn-sm" style={{ padding: '3px 8px' }}>
              {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
            </button>
          </div>

          {/* Code Viewer Box */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', background: '#090d16', fontFamily: 'var(--font-mono)', fontSize: '0.825rem', lineHeight: '1.6' }}>
            <pre style={{ margin: 0, color: '#e5e7eb' }}>
              <code>{currentFileContent}</code>
            </pre>
          </div>

        </div>

        {/* Right Side: Virtual Sandbox Terminal / Browser / Grader */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* Right Pane Navigation Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(15, 23, 42, 0.8)', padding: '4px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              
              <button 
                onClick={() => setRightTab('terminal')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px',
                  background: rightTab === 'terminal' ? 'rgba(31, 41, 55, 0.9)' : 'transparent',
                  color: rightTab === 'terminal' ? '#60a5fa' : 'var(--text-muted)',
                  border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
                }}
              >
                <TerminalIcon size={14} />
                <span>Bash Stream</span>
              </button>

              <button 
                onClick={() => setRightTab('browser')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px',
                  background: rightTab === 'browser' ? 'rgba(31, 41, 55, 0.9)' : 'transparent',
                  color: rightTab === 'browser' ? '#c084fc' : 'var(--text-muted)',
                  border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
                }}
              >
                <Globe size={14} />
                <span>Web Agent DOM</span>
              </button>

              <button 
                onClick={() => setRightTab('grader')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px',
                  background: rightTab === 'grader' ? 'rgba(31, 41, 55, 0.9)' : 'transparent',
                  color: rightTab === 'grader' ? '#34d399' : 'var(--text-muted)',
                  border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600
                }}
              >
                <ShieldCheck size={14} />
                <span>Unit Grader ({testSuite.filter(t=>t.status==='PASSED').length}/{testSuite.length})</span>
              </button>

            </div>

            <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
              AGENT ACTIVE
            </span>
          </div>

          {/* Pane Content */}
          <div style={{ flex: 1, overflowY: 'auto', background: '#070a11', padding: '16px' }}>
            
            {/* TERMINAL VIEW */}
            {rightTab === 'terminal' && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.825rem', lineHeight: '1.6' }}>
                <div style={{ color: '#6b7280', marginBottom: '8px' }}>
                  # Mechanize Agent Sandbox v2.6 [Ubuntu 24.04 LTS x86_64]
                </div>
                <div style={{ color: '#10b981', marginBottom: '12px' }}>
                  $ model_eval_daemon --model="{selectedModel}" --env="{environment.id}"
                </div>

                {trajectorySteps.length === 0 ? (
                  <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '20px' }}>
                    Press "Evaluate Model" or "Run Agent Trajectory" above to initiate execution trace stream...
                  </div>
                ) : (
                  trajectorySteps.map((step, idx) => (
                    <div key={idx} style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <div style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                        <span>[STEP {step.step}] {step.phase}</span>
                        <span>{step.timestamp}</span>
                      </div>
                      <div style={{ color: '#9ca3af', margin: '4px 0 8px 0', fontSize: '0.8rem' }}>
                        &gt; {step.thought}
                      </div>
                      <div style={{ background: '#111827', padding: '8px 12px', borderRadius: '6px', color: '#60a5fa' }}>
                        $ {step.action.tool} {step.action.command || step.action.path || ''}
                      </div>
                      {step.observation && (
                        <div style={{ marginTop: '6px', color: step.observation.includes('PASSED') ? '#34d399' : '#e5e7eb', whitespace: 'pre-wrap' }}>
                          {step.observation}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* BROWSER DOM VIEW */}
            {rightTab === 'browser' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1f2937', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <Globe size={14} color="#60a5fa" />
                  <span style={{ fontSize: '0.78rem', color: '#9ca3af', fontFamily: 'var(--font-mono)' }}>
                    https://sandbox.mechanize.internal/app-under-test
                  </span>
                </div>

                <div style={{ border: '1px dashed var(--border-subtle)', borderRadius: '8px', padding: '24px', textAlign: 'center', background: 'rgba(17, 24, 39, 0.5)' }}>
                  <Globe size={40} color="var(--cyber-blue)" style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ color: '#fff', margin: '0 0 6px 0' }}>Simulated Web Agent Viewport</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    Captures dynamic browser DOM tree, screenshot step frames, and click/type coordinates during web agent evaluation runs.
                  </p>
                </div>
              </div>
            )}

            {/* GRADER TEST SUITE VIEW */}
            {rightTab === 'grader' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ color: '#fff', fontSize: '0.9rem', margin: '0 0 4px 0' }}>Automated Verification Suite</h4>
                
                {testSuite.map((test, index) => (
                  <div 
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      background: test.status === 'PASSED' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                      border: `1px solid ${test.status === 'PASSED' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      {test.status === 'PASSED' ? (
                        <CheckCircle2 size={18} color="#34d399" style={{ marginTop: '2px' }} />
                      ) : (
                        <XCircle size={18} color="#f87171" style={{ marginTop: '2px' }} />
                      )}
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                          {test.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: test.status === 'PASSED' ? '#34d399' : '#f87171', marginTop: '4px' }}>
                          {test.message}
                        </div>
                      </div>
                    </div>
                    
                    <span className={`badge ${test.status === 'PASSED' ? 'badge-emerald' : 'badge-crimson'}`}>
                      {test.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
