import React, { useState } from 'react';
import { Camera, Sun, Moon, Eye, Zap, Layers, Sparkles, Box, CheckCircle2, Play, Gauge } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function VoxelHUD({ 
  cameraMode, 
  setCameraMode, 
  timeOfDay, 
  setTimeOfDay, 
  buildSpeedMultiplier,
  setBuildSpeedMultiplier,
  telemetry = [] 
}) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleInstantComplete = () => {
    if (window.__automechanica_complete_all) {
      window.__automechanica_complete_all();
      setIsCompleted(true);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      
      {/* Top Controls Bar */}
      <div className="glass-panel" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* Camera Perspective Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>3D View:</span>
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(15, 23, 42, 0.7)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setCameraMode('orbit')}
              className={`btn btn-sm ${cameraMode === 'orbit' ? 'btn-emerald' : 'btn-outline'}`}
              style={{ border: 'none', padding: '4px 10px', fontSize: '0.75rem' }}
            >
              <Eye size={13} />
              <span>Orbit Drone Cam</span>
            </button>
            <button
              onClick={() => setCameraMode('firstPerson')}
              className={`btn btn-sm ${cameraMode === 'firstPerson' ? 'btn-emerald' : 'btn-outline'}`}
              style={{ border: 'none', padding: '4px 10px', fontSize: '0.75rem' }}
            >
              <Camera size={13} />
              <span>First-Person Avatar</span>
            </button>
          </div>
        </div>

        {/* Construction Pace Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Gauge size={15} color="var(--cyber-blue)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>Build Speed:</span>
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(15, 23, 42, 0.7)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setBuildSpeedMultiplier(0.5)}
              className={`btn btn-sm ${buildSpeedMultiplier === 0.5 ? 'btn-emerald' : 'btn-outline'}`}
              style={{ border: 'none', padding: '4px 8px', fontSize: '0.72rem' }}
            >
              Cinematic (0.5x)
            </button>
            <button
              onClick={() => setBuildSpeedMultiplier(1.0)}
              className={`btn btn-sm ${buildSpeedMultiplier === 1.0 ? 'btn-emerald' : 'btn-outline'}`}
              style={{ border: 'none', padding: '4px 8px', fontSize: '0.72rem' }}
            >
              Live (1x)
            </button>
            <button
              onClick={() => setBuildSpeedMultiplier(2.5)}
              className={`btn btn-sm ${buildSpeedMultiplier === 2.5 ? 'btn-emerald' : 'btn-outline'}`}
              style={{ border: 'none', padding: '4px 8px', fontSize: '0.72rem' }}
            >
              Turbo (2.5x)
            </button>
          </div>
        </div>

        {/* Instant Fast-Forward (100%) */}
        <button 
          className="btn btn-outline btn-sm"
          onClick={handleInstantComplete}
          style={{ borderColor: 'rgba(251, 191, 36, 0.5)', background: 'rgba(251, 191, 36, 0.12)', color: '#fbbf24', fontSize: '0.75rem' }}
        >
          {isCompleted ? <CheckCircle2 size={13} color="#10b981" /> : <Zap size={13} />}
          <span>{isCompleted ? 'Completed 100%' : 'Instant Finish (100%)'}</span>
        </button>

        {/* Solar Cycle Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sun size={15} color="#fbbf24" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Solar:</span>
          <input 
            type="range" min="0" max="24" value={timeOfDay} 
            onChange={(e) => setTimeOfDay(Number(e.target.value))}
            style={{ width: '90px', accentColor: '#10b981', cursor: 'pointer' }}
          />
          <Moon size={15} color="#a855f7" />
        </div>

      </div>

      {/* Live AI Avatar Telemetry & CoT Thought Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
        {telemetry.map(agent => {
          const thoughts = {
            claude: "📐 Calculating cantilever moment balance at Y=" + agent.height,
            gpt: "🔮 Aligning concentric stepped pyramid rings & floating crystal",
            deepseek: "🏰 Fortifying 4 bastion towers with castellated stone",
            gemini: "⭕ Discretizing 360° circular Stargate torus arch"
          };

          return (
            <div 
              key={agent.key}
              className="glass-panel"
              style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: `3px solid #${agent.color.toString(16).padStart(6, '0')}` }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{agent.name.split(' (')[0]}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                  {agent.progress}%
                </span>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Building: <strong style={{ color: '#e5e7eb' }}>{agent.name.split('(')[1]?.replace(')', '') || 'Structure'}</strong>
              </div>

              {/* Progress Bar */}
              <div style={{ height: '5px', width: '100%', background: '#1f2937', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${agent.progress}%`, background: `#${agent.color.toString(16).padStart(6, '0')}`, transition: 'width 0.3s ease' }} />
              </div>

              <div style={{ fontSize: '0.72rem', color: '#60a5fa', fontStyle: 'italic', background: 'rgba(7, 10, 17, 0.5)', padding: '5px 8px', borderRadius: '5px' }}>
                {thoughts[agent.key] || "Erecting voxels..."}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                <span>Height: {agent.height} Y-Voxels</span>
                <span>Blocks: {agent.placedCount}/{agent.totalBlocks}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
