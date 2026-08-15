import React, { useState } from 'react';
import { 
  Trophy, 
  Search, 
  Filter, 
  Zap, 
  DollarSign, 
  Clock, 
  Target, 
  ChevronUp, 
  Sparkles,
  Award,
  BarChart3
} from 'lucide-react';

export default function LeaderboardView({ leaderboardData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('overallScore'); // overallScore | passAt1 | sweGymScore | toolGymScore | secGymScore

  const filteredModels = leaderboardData
    .filter(m => m.model.toLowerCase().includes(searchTerm.toLowerCase()) || m.provider.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b[selectedCategory] - a[selectedCategory]);

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-emerald">MECHANIZED BENCHMARKS</span>
            <span className="badge badge-purple">FRONTIER ARENA 2026</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Frontier AI Model Leaderboard & Gym Performance
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Rigorous evaluation of LLMs on interactive developer workspaces, tool use, web automation, and security patching.
          </p>
        </div>

        {/* Top Metric Cards */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px 16px', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#34d399', textTransform: 'uppercase', fontWeight: 700 }}>Top Model</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>Claude 3.7 Sonnet</div>
          </div>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '10px 16px', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#60a5fa', textTransform: 'uppercase', fontWeight: 700 }}>Pass@1 Record</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>88.4%</div>
          </div>
        </div>
      </div>

      {/* Filter & Metric Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#111827', border: '1px solid var(--border-subtle)', padding: '8px 14px', borderRadius: '8px', width: '320px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search model or provider..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.85rem', outline: 'none', width: '100%' }}
          />
        </div>

        {/* Category Metric Switcher */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(17, 24, 39, 0.8)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          {[
            { id: 'overallScore', label: 'Overall Index' },
            { id: 'passAt1', label: 'Pass@1 Rate' },
            { id: 'sweGymScore', label: 'SWE-Gym' },
            { id: 'toolGymScore', label: 'Tool-Gym' },
            { id: 'secGymScore', label: 'Sec-Gym' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`btn btn-sm ${selectedCategory === cat.id ? 'btn-emerald' : 'btn-outline'}`}
              style={{ border: 'none', fontSize: '0.78rem' }}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: 'rgba(15, 23, 42, 0.9)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '14px 16px' }}>Rank</th>
              <th style={{ padding: '14px 16px' }}>Model & Provider</th>
              <th style={{ padding: '14px 16px' }}>Overall Score</th>
              <th style={{ padding: '14px 16px' }}>Pass@1</th>
              <th style={{ padding: '14px 16px' }}>Pass@5</th>
              <th style={{ padding: '14px 16px' }}>SWE-Gym</th>
              <th style={{ padding: '14px 16px' }}>Tool-Gym</th>
              <th style={{ padding: '14px 16px' }}>Sec-Gym</th>
              <th style={{ padding: '14px 16px' }}>Avg Steps</th>
              <th style={{ padding: '14px 16px' }}>Cost / Task</th>
            </tr>
          </thead>
          <tbody>
            {filteredModels.map((item, index) => (
              <tr 
                key={item.model} 
                style={{ 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  background: index === 0 ? 'rgba(16, 185, 129, 0.04)' : 'transparent',
                  transition: 'background 0.2s ease'
                }}
              >
                <td style={{ padding: '14px 16px', fontWeight: 800, color: index === 0 ? '#fbbf24' : index === 1 ? '#e5e7eb' : index === 2 ? '#cd7f32' : 'var(--text-dim)' }}>
                  #{index + 1}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700, color: '#fff' }}>{item.model}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.provider}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, color: '#34d399', fontSize: '1rem' }}>{item.overallScore}%</span>
                    <div style={{ flex: 1, height: '6px', width: '60px', background: '#1f2937', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${item.overallScore}%`, background: 'linear-gradient(90deg, #10b981, #3b82f6)' }} />
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 700, color: '#60a5fa' }}>{item.passAt1}%</td>
                <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{item.passAt5}%</td>
                <td style={{ padding: '14px 16px', color: '#e5e7eb' }}>{item.sweGymScore}%</td>
                <td style={{ padding: '14px 16px', color: '#e5e7eb' }}>{item.toolGymScore}%</td>
                <td style={{ padding: '14px 16px', color: '#e5e7eb' }}>{item.secGymScore}%</td>
                <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.avgSteps}</td>
                <td style={{ padding: '14px 16px', color: '#34d399', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{item.avgCostPerTask}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
