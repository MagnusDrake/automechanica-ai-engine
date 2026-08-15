import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Swords, 
  Play, 
  RotateCcw, 
  TrendingUp, 
  CheckCircle2, 
  Zap, 
  Cpu, 
  Terminal, 
  Code, 
  Trophy,
  Flame,
  Clock
} from 'lucide-react';

export default function ModelBattleArena() {
  const [modelA, setModelA] = useState("Claude 3.7 Sonnet (Thinking Agent)");
  const [modelB, setModelB] = useState("GPT-4.5 (Frontier)");
  const [selectedTask, setSelectedTask] = useState("quantum-gate"); // quantum-gate | async-memory | zero-day-rop | multi-agent-market

  const [isBattling, setIsBattling] = useState(false);
  const [modelASteps, setModelASteps] = useState([]);
  const [modelBSteps, setModelBSteps] = useState([]);
  const [modelAScore, setModelAScore] = useState(0);
  const [modelBScore, setModelBScore] = useState(0);
  const [winner, setWinner] = useState(null);

  const tasks = [
    { id: "quantum-gate", title: "Quantum Circuit Gate Optimization (Qiskit)", difficulty: "Expert", target: "Synthesize 12-qubit entangled state with < 14 CNOT gates" },
    { id: "async-memory", title: "Async Connection Pool Deadlock & Memory Leak", difficulty: "Hard", target: "Fix race condition in dictionary key mutation under 10k concurrent ws" },
    { id: "zero-day-rop", title: "Heap Overflow & ROP Chain Exploit Mitigation", difficulty: "Expert", target: "Discover memory corruption bug, write exploit PoC, and apply ASLR-safe patch" },
    { id: "multi-agent-market", title: "Autonomous Market Bidding & Auction Equilibrium", difficulty: "Expert", target: "Converge to Pareto-optimal pricing against 50 adversarial bidding agents" }
  ];

  const currentTaskData = tasks.find(t => t.id === selectedTask) || tasks[0];

  const handleStartBattle = () => {
    setIsBattling(true);
    setModelASteps([]);
    setModelBSteps([]);
    setModelAScore(0);
    setModelBScore(0);
    setWinner(null);

    const traceA = [
      { step: 1, action: "Analyzing AST topology & gate depth", reward: 25, log: "$ qiskit_opt --circuit-depth=12 --transpile-level=3\n> Gate count: 28 CNOTs (Sub-optimal)", time: "0.8s" },
      { step: 2, action: "Applying topological commute rewrites", reward: 75, log: "$ qiskit_passes.CommutativeCancellation()\n> Gate count reduced to 16 CNOTs", time: "2.1s" },
      { step: 3, action: "Synthesizing optimal Clifford+T decomposition", reward: 100, log: "$ verify_fidelity --state=GHZ_12\n> PASSED: 12 CNOT gates. Fidelity: 99.98%", time: "3.4s" }
    ];

    const traceB = [
      { step: 1, action: "Simulating unitary matrix decomposition", reward: 20, log: "$ quantum_decomp --matrix=U_target\n> Gate count: 32 CNOTs", time: "0.9s" },
      { step: 2, action: "Greedy heuristic gate pruning", reward: 60, log: "$ apply_heuristic_pass\n> Gate count: 18 CNOTs", time: "2.5s" },
      { step: 3, action: "Final circuit verification", reward: 95, log: "$ verify_fidelity --state=GHZ_12\n> PASSED: 14 CNOT gates. Fidelity: 99.85%", time: "4.1s" }
    ];

    let idxA = 0;
    let idxB = 0;

    const intervalA = setInterval(() => {
      if (idxA < traceA.length) {
        const step = traceA[idxA];
        setModelASteps(prev => [...prev, step]);
        setModelAScore(step.reward);
        idxA++;
        if (idxA === traceA.length) {
          clearInterval(intervalA);
          if (!winner) {
            setWinner(modelA);
            confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
          }
        }
      }
    }, 1100);

    const intervalB = setInterval(() => {
      if (idxB < traceB.length) {
        const step = traceB[idxB];
        setModelBSteps(prev => [...prev, step]);
        setModelBScore(step.reward);
        idxB++;
        if (idxB === traceB.length) {
          clearInterval(intervalB);
          setIsBattling(false);
        }
      }
    }, 1400);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-crimson">HEAD-TO-HEAD ARENA</span>
            <span className="badge badge-purple">MODEL BATTLE ROYALE</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Frontier AI Head-to-Head Arena
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Deploy two frontier AI models simultaneously into the exact same sandbox challenge. Compare live code generation speed, test execution velocity, and final reward score!
          </p>
        </div>

        <button 
          className={`btn ${isBattling ? 'btn-outline' : 'btn-emerald'}`}
          onClick={handleStartBattle}
          disabled={isBattling}
          style={{ padding: '10px 20px', fontSize: '0.95rem' }}
        >
          {isBattling ? (
            <>
              <div className="live-dot" />
              <span>Live Race in Progress...</span>
            </>
          ) : (
            <>
              <Swords size={18} />
              <span>Launch Model Battle</span>
            </>
          )}
        </button>
      </div>

      {/* Task & Matchup Controls */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Task Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Benchmark Task:</span>
          <select 
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            style={{ background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}
          >
            {tasks.map(t => (
              <option key={t.id} value={t.id}>{t.title} ({t.difficulty})</option>
            ))}
          </select>
        </div>

        {/* Matchup Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="badge badge-blue" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>{modelA}</span>
          <span style={{ fontWeight: 800, color: '#f43f5e', fontSize: '1.1rem' }}>VS</span>
          <span className="badge badge-purple" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>{modelB}</span>
        </div>

      </div>

      {/* Winner Banner if battle ended */}
      {winner && (
        <div className="glass-panel glow-emerald" style={{ padding: '16px 24px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Trophy size={28} color="#fbbf24" />
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>MATCH WINNER: {winner}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Completed task with 100% test pass rate in 3.4s execution time.</div>
            </div>
          </div>
          <span className="badge badge-emerald">VICTORY</span>
        </div>
      )}

      {/* Split-Screen Battle Arena Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Model A Card */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '3px solid #38bdf8' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu size={20} color="#38bdf8" />
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: 0 }}>{modelA}</h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Anthropic Thinking Engine</div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>REWARD</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                {modelAScore}%
              </div>
            </div>
          </div>

          <div style={{ height: '6px', width: '100%', background: '#1f2937', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${modelAScore}%`, background: 'linear-gradient(90deg, #38bdf8, #10b981)', transition: 'width 0.3s ease' }} />
          </div>

          {/* Terminal Stream */}
          <div style={{ background: '#070a11', padding: '14px', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', minHeight: '260px', overflowY: 'auto', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: '#6b7280', marginBottom: '8px' }}># Agent Execution Daemon --sandbox-a</div>
            {modelASteps.length === 0 ? (
              <div style={{ color: 'var(--text-dim)', fontStyle: 'italic', marginTop: '20px' }}>
                Waiting for battle initialization...
              </div>
            ) : (
              modelASteps.map((s, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <div style={{ color: '#38bdf8', fontWeight: 700 }}>[STEP {s.step}] {s.action} ({s.time})</div>
                  <pre style={{ margin: '4px 0 0 0', color: s.log.includes('PASSED') ? '#34d399' : '#e5e7eb', whiteSpace: 'pre-wrap' }}>
                    {s.log}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Model B Card */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '3px solid #c084fc' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu size={20} color="#c084fc" />
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: 0 }}>{modelB}</h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>OpenAI Frontier Architecture</div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>REWARD</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#c084fc', fontFamily: 'var(--font-mono)' }}>
                {modelBScore}%
              </div>
            </div>
          </div>

          <div style={{ height: '6px', width: '100%', background: '#1f2937', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${modelBScore}%`, background: 'linear-gradient(90deg, #c084fc, #f43f5e)', transition: 'width 0.3s ease' }} />
          </div>

          {/* Terminal Stream */}
          <div style={{ background: '#070a11', padding: '14px', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', minHeight: '260px', overflowY: 'auto', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: '#6b7280', marginBottom: '8px' }}># Agent Execution Daemon --sandbox-b</div>
            {modelBSteps.length === 0 ? (
              <div style={{ color: 'var(--text-dim)', fontStyle: 'italic', marginTop: '20px' }}>
                Waiting for battle initialization...
              </div>
            ) : (
              modelBSteps.map((s, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <div style={{ color: '#c084fc', fontWeight: 700 }}>[STEP {s.step}] {s.action} ({s.time})</div>
                  <pre style={{ margin: '4px 0 0 0', color: s.log.includes('PASSED') ? '#34d399' : '#e5e7eb', whiteSpace: 'pre-wrap' }}>
                    {s.log}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
