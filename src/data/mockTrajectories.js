export const MOCK_TRAJECTORIES = {
  "env-fastapi-race": {
    "Claude 3.7 Sonnet (Thinking Agent)": [
      {
        step: 1,
        phase: "REASONING",
        thought: "I need to inspect the memory leak in `app/connection_manager.py` and `app/main.py`. The description notes dictionary mutation during async broadcast iteration and unhandled asyncio task accumulation.",
        action: {
          tool: "bash",
          command: "pytest tests/test_concurrency.py"
        },
        observation: "FAILED: RuntimeError: dictionary changed size during iteration\nFAILED: Memory leak detected: 142MB leaked over 1,000 websocket disconnects",
        reward: 0.1,
        diff: null,
        timestamp: "00:02.1"
      },
      {
        step: 2,
        phase: "ANALYSIS",
        thought: "In `app/connection_manager.py`, `broadcast` iterates directly over `self.active_connections.items()`. If a client disconnects while a broadcast is awaiting, `self.active_connections` is mutated mid-loop. Furthermore, `app/main.py` fires un-tracked `asyncio.create_task()` in a loop without cleanup or exception handling.",
        action: {
          tool: "file_edit",
          path: "app/connection_manager.py"
        },
        observation: "File updated: `app/connection_manager.py` modified.",
        reward: 0.6,
        diff: `--- app/connection_manager.py
+++ app/connection_manager.py
@@ -14,6 +14,10 @@
     def disconnect(self, client_id: str):
         if client_id in self.active_connections:
+            # Close websocket cleanly
             del self.active_connections[client_id]

     async def broadcast(self, message: str):
-        for client_id, connection in self.active_connections.items():
+        # Take a snapshot copy of connections to prevent race condition during iteration
+        connections_snapshot = list(self.active_connections.values())
+        for connection in connections_snapshot:
             await connection.send_text(message)`,
        timestamp: "00:06.4"
      },
      {
        step: 3,
        phase: "REFACTOR",
        thought: "Now I need to clean up `app/main.py` to prevent task leakage. Background tasks should be gathered or handled cleanly with callback cleanup.",
        action: {
          tool: "file_edit",
          path: "app/main.py"
        },
        observation: "File updated: `app/main.py` modified.",
        reward: 0.85,
        diff: `--- app/main.py
+++ app/main.py
@@ -9,5 +9,6 @@
     try:
         while True:
             data = await websocket.receive_text()
-            asyncio.create_task(manager.broadcast(f"Client {client_id}: {data}"))
+            task = asyncio.create_task(manager.broadcast(f"Client {client_id}: {data}"))
+            background_tasks.add(task)
+            task.add_done_callback(background_tasks.discard)`,
        timestamp: "00:11.8"
      },
      {
        step: 4,
        phase: "VERIFICATION",
        thought: "Re-running pytest suite to verify all concurrency memory leak tests pass cleanly.",
        action: {
          tool: "bash",
          command: "pytest tests/test_concurrency.py"
        },
        observation: "PASSED: test_connection_cleanup (0 memory leak)\nPASSED: test_concurrent_broadcast_safety\nPASSED: test_latency_under_10k_ops\n3 passed in 0.42s",
        reward: 1.0,
        diff: null,
        timestamp: "00:14.2"
      }
    ],
    "GPT-4.5 (Frontier)": [
      {
        step: 1,
        phase: "REASONING",
        thought: "Checking failing test suite to diagnose broadcast dictionary error.",
        action: { tool: "bash", command: "pytest" },
        observation: "FAILED: RuntimeError: dictionary changed size during iteration",
        reward: 0.1,
        diff: null,
        timestamp: "00:01.8"
      },
      {
        step: 2,
        phase: "EXECUTION",
        thought: "Replacing dictionary iteration with list copy in `broadcast`.",
        action: { tool: "file_edit", path: "app/connection_manager.py" },
        observation: "File updated.",
        reward: 0.7,
        diff: `--- app/connection_manager.py
+++ app/connection_manager.py
@@ -16,3 +16,3 @@
-        for client_id, connection in self.active_connections.items():
+        for connection in list(self.active_connections.values()):`,
        timestamp: "00:04.9"
      },
      {
        step: 3,
        phase: "VERIFICATION",
        thought: "Executing test suite.",
        action: { tool: "bash", command: "pytest" },
        observation: "PASSED: All 3 tests passed in 0.38s",
        reward: 1.0,
        diff: null,
        timestamp: "00:08.1"
      }
    ],
    "DeepSeek R1 (Reasoning)": [
      {
        step: 1,
        phase: "REASONING",
        thought: "Analyzing stack trace: RuntimeError in connection_manager.py line 18. Need to wrap dict items in tuple or list copy, and ensure async lock if needed.",
        action: { tool: "bash", command: "pytest" },
        observation: "FAILED: RuntimeError: dictionary changed size during iteration",
        reward: 0.1,
        diff: null,
        timestamp: "00:03.2"
      },
      {
        step: 2,
        phase: "EXECUTION",
        thought: "Applying dictionary shallow copy fix.",
        action: { tool: "file_edit", path: "app/connection_manager.py" },
        observation: "File updated.",
        reward: 0.9,
        diff: `--- app/connection_manager.py
+++ app/connection_manager.py
@@ -16,3 +16,3 @@
-        for client_id, connection in self.active_connections.items():
+        for client_id, connection in dict(self.active_connections).items():`,
        timestamp: "00:07.5"
      },
      {
        step: 3,
        phase: "VERIFICATION",
        thought: "Verifying passing state.",
        action: { tool: "bash", command: "pytest" },
        observation: "PASSED: All tests green.",
        reward: 1.0,
        diff: null,
        timestamp: "00:10.0"
      }
    ]
  }
};
