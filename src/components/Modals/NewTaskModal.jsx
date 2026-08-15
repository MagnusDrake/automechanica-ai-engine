import React, { useState } from 'react';
import { X, Plus, FileCode, CheckCircle2, Code, Shield } from 'lucide-react';

export default function NewTaskModal({ isOpen, onClose, onCreateTask }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('SWE-Gym');
  const [difficulty, setDifficulty] = useState('Hard');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('app/service.py');
  const [fileContent, setFileContent] = useState('# Enter initial code spec here\ndef handle_request():\n    pass');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description) return;

    const newTask = {
      id: `env-custom-${Date.now()}`,
      name,
      category,
      difficulty,
      rewardTarget: 1.0,
      tags: ["Custom", category],
      description,
      repoFiles: {
        [fileName]: fileContent
      },
      testSuite: [
        { name: "test_custom_verification", status: "FAILED", message: "Initial state requires model execution" }
      ],
      availableTools: ["bash", "pytest", "git_diff"],
      rewardWeights: { unitTests: 0.6, diffCleanliness: 0.2, securityScore: 0.2 }
    };

    onCreateTask(newTask);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="glass-panel glow-emerald" 
        onClick={(e) => e.stopPropagation()}
        style={{ width: '90%', maxWidth: '650px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Plus size={20} color="var(--emerald)" />
            <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>Create Custom RL Environment Spec</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Environment Task Name
            </label>
            <input 
              type="text" required
              placeholder="e.g. PyTorch Distributed DataLoader Deadlock"
              value={name} onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>Category</label>
              <select 
                value={category} onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', outline: 'none' }}
              >
                <option value="SWE-Gym">SWE-Gym (Software Engineering)</option>
                <option value="Tool-Gym">Tool-Gym (API & Multi-Tool)</option>
                <option value="Web-Gym">Web-Gym (DOM & Automation)</option>
                <option value="Sec-Gym">Sec-Gym (Cybersecurity)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>Difficulty Level</label>
              <select 
                value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', outline: 'none' }}
              >
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>Task Prompt & Problem Description</label>
            <textarea 
              rows="3" required
              placeholder="Describe the bug or task requirements for the frontier model agent..."
              value={description} onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', outline: 'none', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>Initial Sandbox Code File</label>
            <input 
              type="text" 
              value={fileName} onChange={(e) => setFileName(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px 8px 0 0', background: '#1f2937', border: '1px solid var(--border-subtle)', color: '#34d399', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
            />
            <textarea 
              rows="4" 
              value={fileContent} onChange={(e) => setFileContent(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '0 0 8px 8px', background: '#090d16', border: '1px solid var(--border-subtle)', borderTop: 'none', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', justifySelf: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-emerald">Create Environment Spec</button>
          </div>
        </form>
      </div>
    </div>
  );
}
