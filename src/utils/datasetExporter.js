/**
 * Utility to convert agent trajectory histories into SFT and DPO standard JSONL formats
 */

export function exportToOpenAISFT(trajectory, env) {
  const jsonlLines = [];

  const systemMessage = {
    role: "system",
    content: `You are an expert AI software engineer operating inside the Mechanize evaluation sandbox. Your objective is to resolve: ${env.name}`
  };

  const messages = [systemMessage];

  trajectory.forEach(step => {
    messages.push({
      role: "assistant",
      content: `<thought>\n${step.thought}\n</thought>\n<action tool="${step.action.tool}">\n${step.action.command || step.action.path}\n</action>`
    });

    if (step.observation) {
      messages.push({
        role: "tool",
        content: step.observation
      });
    }
  });

  const record = { messages };
  jsonlLines.push(JSON.stringify(record, null, 2));

  return jsonlLines.join('\n');
}

export function exportToDPO(winningTrajectory, losingTrajectory, env) {
  const record = {
    prompt: `[Mechanize Task]: ${env.name}\n${env.description}`,
    chosen: winningTrajectory.map(s => `Thought: ${s.thought}\nAction: ${JSON.stringify(s.action)}\nDiff: ${s.diff || 'None'}`).join('\n\n'),
    rejected: losingTrajectory ? losingTrajectory.map(s => `Thought: ${s.thought}\nAction: ${JSON.stringify(s.action)}`).join('\n\n') : "Agent failed after 10 steps due to context overflow."
  };

  return JSON.stringify(record, null, 2);
}

export function downloadFile(content, fileName, contentType = 'text/plain') {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}
