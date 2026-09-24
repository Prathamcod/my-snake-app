import { Gauge, Trophy } from "lucide-react";

interface ScorePanelProps {
  score: number;
  bestScore: number;
  speedLevel: number;
}

export function ScorePanel({ score, bestScore, speedLevel }: ScorePanelProps) {
  return (
    <div className="grid grid-cols-3 divide-x divide-border border-y border-border bg-panel" aria-label="Game statistics">
      <div className="px-4 py-3 sm:px-5">
        <p className="stat-label">Score</p>
        <p className="stat-value text-primary tabular-nums">{String(score).padStart(3, "0")}</p>
      </div>
      <div className="px-4 py-3 sm:px-5">
        <p className="stat-label"><Trophy aria-hidden="true" /> Best</p>
        <p className="stat-value tabular-nums">{String(bestScore).padStart(3, "0")}</p>
      </div>
      <div className="px-4 py-3 sm:px-5">
        <p className="stat-label"><Gauge aria-hidden="true" /> Speed</p>
        <p className="stat-value tabular-nums">{speedLevel}x</p>
      </div>
    </div>
  );
}
