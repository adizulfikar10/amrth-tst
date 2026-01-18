import React from "react";

interface ProgressBarProps {
  progress: number;
  logs: string[];
}

export function ProgressBar({ progress, logs }: ProgressBarProps) {
  return (
    <div className="progress-container">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <ul className="progress-logs">
        {logs.map((log, i) => (
          <li key={i}>{log}</li>
        ))}
      </ul>
    </div>
  );
}
