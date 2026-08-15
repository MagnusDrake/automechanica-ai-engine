import React from 'react';
import { 
  Box, 
  Terminal, 
  Layers, 
  Trophy, 
  Sliders, 
  Database, 
  Play, 
  PlusCircle, 
  Cpu, 
  CheckCircle2,
  Sparkles,
  Gamepad2,
  Target,
  Swords,
  GitBranch,
  Boxes
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentEnv, 
  selectedModel, 
  setSelectedModel, 
  availableModels,
  onOpenNewTask,
  onOpenMission,
  onRunSimulation,
  isSimulating
}) {
  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '12px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)'
          }}>
            <Box size={24} color="#070a11" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>AUTOMECHANICA</h1>
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>ENGINE v3.5</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              3D Voxel World &amp; Frontier AI Evaluation Matrix
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(15, 23, 42, 0.7)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
          
          <button 
            className={`btn btn-sm ${activeTab === 'voxel3d' ? 'btn-emerald' : 'btn-outline'}`}
            onClick={() => setActiveTab('voxel3d')}
            style={{ border: 'none', padding: '6px 14px', background: activeTab === 'voxel3d' ? undefined : 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }}
          >
            <Boxes size={16} color={activeTab === 'voxel3d' ? '#070a11' : '#34d399'} />
            <span style={{ fontWeight: 800 }}>3D Voxel-Gym</span>
          </button>

          <button 
            className={`btn btn-sm ${activeTab === 'gamedev' ? 'btn-emerald' : 'btn-outline'}`}
            onClick={() => setActiveTab('gamedev')}
            style={{ border: 'none', padding: '6px 12px' }}
          >
            <Gamepad2 size={15} color={activeTab === 'gamedev' ? '#070a11' : '#34d399'} />
            <span>2D Game Matrix</span>
          </button>

          <button 
            className={`btn btn-sm ${activeTab === 'battle' ? 'btn-emerald' : 'btn-outline'}`}
            onClick={() => setActiveTab('battle')}
            style={{ border: 'none', padding: '6px 12px' }}
          >
            <Swords size={15} color={activeTab === 'battle' ? '#070a11' : '#f43f5e'} />
            <span>Model Battle Arena</span>
          </button>

          <button 
            className={`btn btn-sm ${activeTab === 'gym' ? 'btn-emerald' : 'btn-outline'}`}
            onClick={() => setActiveTab('gym')}
            style={{ border: 'none', padding: '6px 12px' }}
          >
            <Terminal size={15} />
            <span>Frontier Gyms</span>
          </button>

          <button 
            className={`btn btn-sm ${activeTab === 'mcts' ? 'btn-emerald' : 'btn-outline'}`}
            onClick={() => setActiveTab('mcts')}
            style={{ border: 'none', padding: '6px 12px' }}
          >
            <GitBranch size={15} color={activeTab === 'mcts' ? '#070a11' : '#60a5fa'} />
            <span>MCTS Tree</span>
          </button>

          <button 
            className={`btn btn-sm ${activeTab === 'trajectory' ? 'btn-emerald' : 'btn-outline'}`}
            onClick={() => setActiveTab('trajectory')}
            style={{ border: 'none', padding: '6px 12px' }}
          >
            <Layers size={15} />
            <span>Trajectory Trace</span>
          </button>

          <button 
            className={`btn btn-sm ${activeTab === 'arena' ? 'btn-emerald' : 'btn-outline'}`}
            onClick={() => setActiveTab('arena')}
            style={{ border: 'none', padding: '6px 12px' }}
          >
            <Trophy size={15} />
            <span>Leaderboard</span>
          </button>

          <button 
            className={`btn btn-sm ${activeTab === 'grader' ? 'btn-emerald' : 'btn-outline'}`}
            onClick={() => setActiveTab('grader')}
            style={{ border: 'none', padding: '6px 12px' }}
          >
            <Sliders size={15} />
            <span>Reward Grader</span>
          </button>

          <button 
            className={`btn btn-sm ${activeTab === 'dataset' ? 'btn-emerald' : 'btn-outline'}`}
            onClick={() => setActiveTab('dataset')}
            style={{ border: 'none', padding: '6px 12px' }}
          >
            <Database size={15} />
            <span>SFT/RL Dataset</span>
          </button>
        </nav>

        {/* Controls & Model Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          <button 
            className="btn btn-outline btn-sm" 
            onClick={onOpenMission}
            style={{ borderColor: 'rgba(139, 92, 246, 0.5)', background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', fontWeight: 700 }}
          >
            <Target size={15} color="#c084fc" />
            <span>Creator Mission</span>
          </button>

          {/* Active Model Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(31, 41, 55, 0.7)', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <Cpu size={15} color="var(--cyber-blue)" />
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'var(--text-main)', 
                fontSize: '0.8rem', 
                fontWeight: 600, 
                outline: 'none', 
                cursor: 'pointer' 
              }}
            >
              {availableModels.map(m => (
                <option key={m} value={m} style={{ background: '#111827', color: '#fff' }}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <button className="btn btn-outline btn-sm" onClick={onOpenNewTask}>
            <PlusCircle size={15} />
            <span>New Task</span>
          </button>

        </div>

      </div>
    </header>
  );
}
