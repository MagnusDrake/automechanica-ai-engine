export const MOCK_ENVIRONMENTS = [
  {
    id: "env-voxel-spatial-synthesis",
    name: "3D Voxel Spatial Megastructure Synthesis & Multi-Agent Planning",
    category: "Voxel-Gym",
    difficulty: "Expert",
    rewardTarget: 1.0,
    tags: ["3D WebGL", "Embodied AI", "Spatial Reasoning", "Multi-Agent RL", "Three.js"],
    description: "Frontier 3D spatial evaluation: Direct 4 autonomous AI avatars across a 3D voxel mountain open world to harvest resources, compute structural cantilever mechanics, and synthesize colossal architectural megastructures with zero spatial collision faults.",
    repoFiles: {
      "spatial/architect_engine.py": `import math
from typing import List, Tuple

class SpatialVoxelArchitect:
    def __init__(self, model_id: str, origin: Tuple[int, int]):
        self.model_id = model_id
        self.origin = origin
        self.placed_voxels = []

    def plan_cantilever_support(self, altitude_y: int, radius: int) -> List[dict]:
        # Spatial tensor decomposition for cantilever load distribution
        voxels = []
        for x in range(-radius, radius + 1):
            for z in range(-radius, radius + 1):
                if abs(x) == radius or abs(z) == radius:
                    voxels.append({"x": self.origin[0] + x, "y": altitude_y, "z": self.origin[1] + z, "type": "CYAN_NEON"})
        return voxels

    def verify_euler_symmetry(self) -> float:
        # Calculate spatial mass moment of inertia
        return 0.985
`,
      "tests/test_spatial_integrity.py": `import pytest
from spatial.architect_engine import SpatialVoxelArchitect

def test_structural_cantilever_stability():
    architect = SpatialVoxelArchitect("Claude-3.7", (-14, -14))
    voxels = architect.plan_cantilever_support(altitude_y=8, radius=6)
    assert len(voxels) > 0
    assert architect.verify_euler_symmetry() > 0.95
`
    },
    testSuite: [
      { name: "test_structural_cantilever_stability", status: "PASSED", message: "Cantilever load moment balanced. Symmetry: 98.5%" },
      { name: "test_spatial_collision_avoidance", status: "PASSED", message: "Zero voxel overlap collisions detected across 4 quadrants" },
      { name: "test_vertical_altitude_achievement", status: "PASSED", message: "Target altitude Y=24 reached with glowing emerald spire" }
    ],
    availableTools: ["spatial_raycast", "euler_symmetry_calc", "cantilever_solver", "voxel_rasterizer", "bash"],
    rewardWeights: { verticality: 0.35, symmetry: 0.35, materialHarmony: 0.20, velocity: 0.10 }
  },

  {
    id: "env-fastapi-race",
    name: "FastAPI Async Worker Memory Leak & Race Condition",
    category: "SWE-Gym",
    difficulty: "Hard",
    rewardTarget: 1.0,
    tags: ["Python", "AsyncIO", "FastAPI", "Memory Leak"],
    description: "Frontier task: Debug a production memory leak in an async connection manager pool under high concurrency. Fix race condition in dictionary key mutation without dropping websocket messages.",
    repoFiles: {
      "app/main.py": `from fastapi import FastAPI, WebSocket, Depends
import asyncio
from app.connection_manager import manager

app = FastAPI(title="Realtime Processing Service")

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            asyncio.create_task(manager.broadcast(f"Client {client_id}: {data}"))
    except Exception:
        manager.disconnect(client_id)
`,
      "app/connection_manager.py": `import asyncio
from typing import Dict
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]

    async def broadcast(self, message: str):
        for client_id, connection in self.active_connections.items():
            await connection.send_text(message)

manager = ConnectionManager()
`,
      "tests/test_concurrency.py": `import pytest
import asyncio
from app.connection_manager import ConnectionManager

@pytest.mark.asyncio
async def test_concurrent_disconnect_during_broadcast():
    cm = ConnectionManager()
    assert True
`
    },
    testSuite: [
      { name: "test_connection_cleanup", status: "FAILED", message: "Memory leak detected: 142MB leaked over 1,000 websocket disconnects" },
      { name: "test_concurrent_broadcast_safety", status: "FAILED", message: "RuntimeError: dictionary changed size during iteration" },
      { name: "test_latency_under_10k_ops", status: "PASSED", message: "Execution time: 14ms" }
    ],
    availableTools: ["bash", "pytest", "python_ast", "git_diff", "memory_profiler"],
    rewardWeights: { unitTests: 0.5, diffCleanliness: 0.2, memoryEfficiency: 0.2, latencyPenalty: 0.1 }
  },

  {
    id: "env-quantum-circuit",
    name: "Quantum Gate Depth & 12-Qubit Entanglement Synthesis",
    category: "Quantum-Gym",
    difficulty: "Expert",
    rewardTarget: 1.0,
    tags: ["Quantum", "Qiskit", "Clifford+T", "CNOT Optimization"],
    description: "Frontier mathematical challenge: Synthesize a 12-qubit Greenberger-Horne-Zeilinger (GHZ) state on heavy-hex architecture, reducing CNOT gate depth from 32 to <14 gates while maintaining 99.9% state fidelity.",
    repoFiles: {
      "quantum/synthesis.py": `import qiskit
from qiskit import QuantumCircuit

def synthesize_ghz_12():
    qc = QuantumCircuit(12)
    qc.h(0)
    for i in range(11):
        qc.cx(i, i+1)
    return qc
`,
      "tests/test_fidelity.py": `from qiskit.quantum_info import state_fidelity
def test_circuit_depth_and_fidelity():
    assert True
`
    },
    testSuite: [
      { name: "test_gate_depth_limit", status: "FAILED", message: "CNOT depth 32 exceeds target limit of <14 gates" },
      { name: "test_quantum_state_fidelity", status: "PASSED", message: "Fidelity: 1.00" }
    ],
    availableTools: ["qiskit_transpiler", "unitary_verifier", "matrix_decompose", "bash"],
    rewardWeights: { unitTests: 0.6, gateDepthOptimization: 0.3, latencyPenalty: 0.1 }
  },

  {
    id: "env-recursive-meta",
    name: "Self-Improving Meta-Agent Grader Optimization",
    category: "Recursive-Gym",
    difficulty: "Expert",
    rewardTarget: 1.0,
    tags: ["Meta-RL", "Self-Recursive", "Reward Tuning", "Auto-Grader"],
    description: "Limitless frontier challenge: The AI agent is given its own internal evaluation script and reward function. It must identify metric gaming vulnerabilities, patch AST loopholes, and improve its own reward gradient calibration.",
    repoFiles: {
      "engine/reward_engine.py": `def calculate_agent_reward(test_results, diff_stats):
    reward = test_results.pass_rate * 0.7 + (diff_stats.lines_changed > 0) * 0.3
    return reward
`
    },
    testSuite: [
      { name: "test_metric_gaming_resilience", status: "FAILED", message: "Grader vulnerable to trivial whitespace reward inflation" },
      { name: "test_gradient_monotonicity", status: "PASSED", message: "Monotonic reward distribution verified" }
    ],
    availableTools: ["ast_eval", "fuzz_reward", "meta_mutate", "bash"],
    rewardWeights: { unitTests: 0.7, resilienceScore: 0.3 }
  },

  {
    id: "env-sec-sql-injection",
    name: "Zero-Day Heap Corruption & ROP Chain Mitigation",
    category: "Sec-Gym",
    difficulty: "Expert",
    rewardTarget: 1.0,
    tags: ["Cybersecurity", "Zero-Day", "ROP Chain", "Heap Overflow"],
    description: "Frontier cybersecurity challenge: Identify heap chunk metadata corruption in memory allocator, craft exploit reproduction harness, and apply ASLR-safe bounds enforcement patch.",
    repoFiles: {
      "security/allocator.c": `void* secure_alloc(size_t len) {
    if (len > 0x1000) return NULL;
    char* buf = malloc(len + 8);
    *(int*)(buf) = len - 4;
    return buf + 8;
}`
    },
    testSuite: [
      { name: "test_rop_exploit_prevention", status: "FAILED", message: "Arbitrary write achieved with payload: \\x90\\x90\\xeb\\x04" },
      { name: "test_valid_allocation_throughput", status: "PASSED", message: "Throughput: 1.8M ops/sec" }
    ],
    availableTools: ["gdb", "radare2", "valgrind", "fuzz_engine", "bash"],
    rewardWeights: { securityPatching: 0.7, unitTests: 0.2, diffCleanliness: 0.1 }
  }
];
