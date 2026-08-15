import React, { useState } from 'react';
import { GitBranch, BrainCircuit, Sparkles, TrendingUp, CheckCircle2, XCircle, ArrowRight, CornerDownRight } from 'lucide-react';

export default function MCTSTreeViewer() {
  const [selectedNodeId, setSelectedNodeId] = useState("node-3");

  const treeNodes = [
    {
      id: "node-root",
      title: "Root: Initialize Distributed Async Connection Pool",
      depth: 0,
      visits: 64,
      qValue: 0.88,
      status: "EXPLORED",
      thought: "Formulating execution plan: Need to inspect dictionary concurrency locks and task accumulation in main.py.",
      action: "git_diff app/connection_manager.py"
    },
    {
      id: "node-1",
      parentId: "node-root",
      title: "Branch A: Replace Dict with Thread-Safe Mutex Lock (sync)",
      depth: 1,
      visits: 12,
      qValue: 0.42,
      status: "PRUNED",
      thought: "Attempting threading.Lock inside async broadcast loop. Resulted in event loop blockage and latency spike (+180ms).",
      action: "file_edit app/connection_manager.py"
    },
    {
      id: "node-2",
      parentId: "node-root",
      title: "Branch B: Snapshot Copy list(active_connections.values())",
      depth: 1,
      visits: 48,
      qValue: 0.94,
      status: "BEST_PATH",
      thought: "Taking a shallow snapshot list of websocket connections before awaiting broadcast eliminates race conditions with zero lock overhead.",
      action: "file_edit app/connection_manager.py"
    },
    {
      id: "node-3",
      parentId: "node-2",
      title: "Branch B.1: Add Background Task Discard Callback",
      depth: 2,
      visits: 36,
      qValue: 0.99,
      status: "OPTIMAL_LEAF",
      thought: "Tracking background asyncio tasks in a set with `add_done_callback(background_tasks.discard)` prevents memory accumulation completely.",
      action: "pytest tests/test_concurrency.py"
    }
  ];

  const selectedNode = treeNodes.find(n => n.id === selectedNodeId) || treeNodes[0];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-emerald">REASONING TREE INSPECTOR</span>
            <span className="badge badge-blue">MCTS EXPLORATION GRAPH</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Monte Carlo Tree Search (MCTS) Reasoning Explorer
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Visualize how frontier reasoning models explore multiple solution hypotheses, calculate rollout values Q(s, a), and prune dead branches during code generation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <span className="badge badge-emerald">Optimal Path: Branch B &gt; B.1</span>
        </div>
      </div>

      {/* Tree Visualization & Node Inspector Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        
        {/* Left Side: Tree Hierarchy */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitBranch size={18} color="var(--emerald)" />
            <span>MCTS Decision Hierarchy</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {treeNodes.map(node => {
              const isSelected = node.id === selectedNodeId;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{
                    marginLeft: `${node.depth * 28}px`,
                    padding: '14px 16px',
                    borderRadius: '10px',
                    background: isSelected ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)' : 'rgba(31, 41, 55, 0.5)',
                    border: `1px solid ${isSelected ? 'var(--emerald)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {node.depth > 0 && <CornerDownRight size={14} color="var(--text-dim)" />}
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{node.title}</span>
                    </div>

                    <span className={`badge ${node.status === 'OPTIMAL_LEAF' || node.status === 'BEST_PATH' ? 'badge-emerald' : node.status === 'PRUNED' ? 'badge-crimson' : 'badge-blue'}`}>
                      {node.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    <span>Visits N: {node.visits}</span>
                    <span>Rollout Value Q: {(node.qValue * 100).toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Node Details Card */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BrainCircuit size={22} color="#c084fc" />
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: 0 }}>Node State & Reasoning Trace</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedNode.id} (Depth: {selectedNode.depth})</div>
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
              CoT Hypothesis Formulation:
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#e5e7eb', lineHeight: '1.6' }}>
              {selectedNode.thought}
            </p>
          </div>

          <div style={{ background: '#090d16', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
            <div style={{ color: '#fbbf24', marginBottom: '4px' }}>Target Tool Action:</div>
            <div style={{ color: '#34d399' }}>$ {selectedNode.action}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#34d399', textTransform: 'uppercase' }}>Rollout Q-Value</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>{(selectedNode.qValue * 100).toFixed(1)}%</div>
            </div>

            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#60a5fa', textTransform: 'uppercase' }}>Exploration Visits</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>{selectedNode.visits} Iterations</div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
