import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import VoxelGymView from './components/VoxelWorld3D/VoxelGymView';
import EnvironmentRunner from './components/SandboxGym/EnvironmentRunner';
import GameBuilderStudio from './components/GameDevGym/GameBuilderStudio';
import ModelBattleArena from './components/BattleArena/ModelBattleArena';
import MCTSTreeViewer from './components/TrajectoryInspector/MCTSTreeViewer';
import TrajectoryViewer from './components/TrajectoryInspector/TrajectoryViewer';
import LeaderboardView from './components/BenchmarkArena/LeaderboardView';
import RewardStudio from './components/RewardGrader/RewardStudio';
import SFTExporter from './components/DatasetStudio/SFTExporter';
import NewTaskModal from './components/Modals/NewTaskModal';
import CreatorMissionModal from './components/Modals/CreatorMissionModal';

import { MOCK_ENVIRONMENTS } from './data/mockEnvironments';
import { MOCK_TRAJECTORIES } from './data/mockTrajectories';
import { MOCK_LEADERBOARD } from './data/mockLeaderboard';

export default function App() {
  const [environments, setEnvironments] = useState(MOCK_ENVIRONMENTS);
  const [currentEnvId, setCurrentEnvId] = useState(MOCK_ENVIRONMENTS[0].id);
  const [trajectories, setTrajectories] = useState(MOCK_TRAJECTORIES);
  const [leaderboardData, setLeaderboardData] = useState(MOCK_LEADERBOARD);

  const availableModels = [
    "Claude 3.7 Sonnet (Thinking Agent)",
    "GPT-4.5 (Frontier)",
    "DeepSeek R1 (Reasoning)",
    "Gemini 3 Pro",
    "Llama 3.3 70B Instruct"
  ];

  const [selectedModel, setSelectedModel] = useState(availableModels[0]);
  const [activeTab, setActiveTab] = useState('voxel3d'); // voxel3d | gamedev | battle | gym | mcts | trajectory | arena | grader | dataset
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);

  // Active Sandbox Simulation State
  const currentEnv = environments.find(e => e.id === currentEnvId) || environments[0];
  const [testSuite, setTestSuite] = useState(currentEnv.testSuite);
  const [rewardScore, setRewardScore] = useState(33.3);
  const [trajectorySteps, setTrajectorySteps] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Sync test suite when environment changes
  useEffect(() => {
    setTestSuite(currentEnv.testSuite);
    setRewardScore(currentEnv.testSuite.filter(t => t.status === 'PASSED').length > 0 ? 33.3 : 0);
    setTrajectorySteps([]);
  }, [currentEnvId]);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTrajectorySteps([]);
    setTestSuite(currentEnv.testSuite.map(t => ({ ...t, status: 'FAILED' })));
    setRewardScore(10);

    const fullModelTrace = (trajectories[currentEnvId] && trajectories[currentEnvId][selectedModel]) || [
      {
        step: 1,
        phase: "REASONING",
        thought: "Analyzing environment repository code structure and test execution outputs.",
        action: { tool: "bash", command: "pytest" },
        observation: "FAILED: 2 test cases failing",
        reward: 0.2,
        diff: null,
        timestamp: "00:02.0"
      },
      {
        step: 2,
        phase: "REFACTOR",
        thought: "Applying patch fix to code file.",
        action: { tool: "file_edit", path: Object.keys(currentEnv.repoFiles)[0] },
        observation: "File updated.",
        reward: 0.8,
        diff: `+ # Patch applied for ${currentEnv.name}`,
        timestamp: "00:06.0"
      },
      {
        step: 3,
        phase: "VERIFICATION",
        thought: "Re-running test suite to verify 100% pass score.",
        action: { tool: "bash", command: "pytest" },
        observation: "PASSED: All test cases passed successfully!",
        reward: 1.0,
        diff: null,
        timestamp: "00:09.5"
      }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < fullModelTrace.length) {
        const nextStep = fullModelTrace[stepIndex];
        setTrajectorySteps(prev => [...prev, nextStep]);
        setRewardScore(Math.round(nextStep.reward * 100));

        if (stepIndex === fullModelTrace.length - 1) {
          setTestSuite(currentEnv.testSuite.map(t => ({ ...t, status: 'PASSED', message: 'Verification succeeded!' })));
          setRewardScore(100);
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        }
        stepIndex++;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 1200);
  };

  const handleResetEnv = () => {
    setTestSuite(currentEnv.testSuite);
    setRewardScore(33.3);
    setTrajectorySteps([]);
    setIsSimulating(false);
  };

  const handleCreateTask = (newTask) => {
    setEnvironments(prev => [newTask, ...prev]);
    setCurrentEnvId(newTask.id);
    setActiveTab('gym');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-canvas)' }}>
      
      {/* Primary Header Navbar */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentEnv={currentEnv}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        availableModels={availableModels}
        onOpenNewTask={() => setIsNewTaskModalOpen(true)}
        onOpenMission={() => setIsMissionModalOpen(true)}
        onRunSimulation={handleRunSimulation}
        isSimulating={isSimulating}
      />

      {/* Main Tab Views */}
      <main style={{ flex: 1 }}>
        {activeTab === 'voxel3d' && (
          <VoxelGymView />
        )}

        {activeTab === 'gamedev' && (
          <GameBuilderStudio 
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            availableModels={availableModels}
          />
        )}

        {activeTab === 'battle' && (
          <ModelBattleArena />
        )}

        {activeTab === 'gym' && (
          <EnvironmentRunner 
            environment={currentEnv}
            selectedModel={selectedModel}
            testSuite={testSuite}
            rewardScore={rewardScore}
            activeStep={trajectorySteps.length}
            trajectorySteps={trajectorySteps}
            isSimulating={isSimulating}
            onRunSimulation={handleRunSimulation}
            onResetEnv={handleResetEnv}
          />
        )}

        {activeTab === 'mcts' && (
          <MCTSTreeViewer />
        )}

        {activeTab === 'trajectory' && (
          <TrajectoryViewer 
            environment={currentEnv}
            trajectories={(trajectories[currentEnvId]) || { [selectedModel]: trajectorySteps }}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            availableModels={availableModels}
          />
        )}

        {activeTab === 'arena' && (
          <LeaderboardView 
            leaderboardData={leaderboardData}
          />
        )}

        {activeTab === 'grader' && (
          <RewardStudio 
            currentEnv={currentEnv}
          />
        )}

        {activeTab === 'dataset' && (
          <SFTExporter 
            environment={currentEnv}
            trajectories={(trajectories[currentEnvId]) || { [selectedModel]: trajectorySteps }}
            selectedModel={selectedModel}
          />
        )}
      </main>

      {/* Root Level Modals */}
      <NewTaskModal 
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onCreateTask={handleCreateTask}
      />

      <CreatorMissionModal 
        isOpen={isMissionModalOpen}
        onClose={() => setIsMissionModalOpen(false)}
      />

    </div>
  );
}
