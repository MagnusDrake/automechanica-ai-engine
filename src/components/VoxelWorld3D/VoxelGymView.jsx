import React, { useState } from 'react';
import { Box, Sparkles, Trophy, Eye, Camera, Sun, Moon, LayoutGrid, Globe2 } from 'lucide-react';
import VoxelWorldCanvas from './VoxelWorldCanvas';
import QuadViewVoxelArena from './QuadViewVoxelArena';
import VoxelHUD from './VoxelHUD';
import ArchitectJudgePanel from './ArchitectJudgePanel';
import { BLOCK_TYPES } from './VoxelAgentManager';

export default function VoxelGymView() {
  const [arenaMode, setArenaMode] = useState('quad'); // 'quad' | '360'
  const [cameraMode, setCameraMode] = useState('orbit'); // orbit | firstPerson
  const [timeOfDay, setTimeOfDay] = useState(12);
  const [buildSpeedMultiplier, setBuildSpeedMultiplier] = useState(1.0);
  const [selectedBlock, setSelectedBlock] = useState(BLOCK_TYPES.EMERALD_NEON);
  const [telemetry, setTelemetry] = useState([]);

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Top Banner & Mode Switcher */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-emerald">VOXEL-ARENA v4.0</span>
            <span className="badge badge-purple">4-WAY MULTI-AGENT ARENA</span>
            <span className="badge badge-blue">FRONTIER 3D SPATIAL BENCHMARK</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Next-Gen Multi-Agent 3D Spatial Reasoning Benchmark
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Simultaneously evaluate 4 frontier AI models (Claude 3.7, GPT-4.5, DeepSeek R1, Gemini 3 Pro) as they plan, pathfind, shoot laser beams, and erect megastructures in real time!
          </p>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(15, 23, 42, 0.8)', padding: '5px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setArenaMode('quad')}
            className={`btn btn-sm ${arenaMode === 'quad' ? 'btn-emerald' : 'btn-outline'}`}
            style={{ border: 'none', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700 }}
          >
            <LayoutGrid size={15} />
            <span>4-Way Quad-Split Feeds</span>
          </button>

          <button
            onClick={() => setArenaMode('360')}
            className={`btn btn-sm ${arenaMode === '360' ? 'btn-emerald' : 'btn-outline'}`}
            style={{ border: 'none', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700 }}
          >
            <Globe2 size={15} />
            <span>360° Open World Arena</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Content */}
      {arenaMode === 'quad' ? (
        <QuadViewVoxelArena timeOfDay={timeOfDay} />
      ) : (
        <>
          <VoxelWorldCanvas 
            cameraMode={cameraMode}
            selectedBlockType={selectedBlock}
            onTelemetryUpdate={setTelemetry}
            timeOfDay={timeOfDay}
            buildSpeedMultiplier={buildSpeedMultiplier}
          />

          <VoxelHUD 
            cameraMode={cameraMode}
            setCameraMode={setCameraMode}
            timeOfDay={timeOfDay}
            setTimeOfDay={setTimeOfDay}
            buildSpeedMultiplier={buildSpeedMultiplier}
            setBuildSpeedMultiplier={setBuildSpeedMultiplier}
            telemetry={telemetry}
          />
        </>
      )}

      {/* 3D Spatial Reasoning & Architect Matrix Scorecard */}
      <ArchitectJudgePanel telemetry={telemetry} />

    </div>
  );
}
