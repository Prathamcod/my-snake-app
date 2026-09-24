import { useRef, type PointerEvent } from "react";
import { BOARD_SIZE, type Direction, type GameState } from "@/lib/snake-game";

interface GameArenaProps {
  state: GameState;
  onDirection: (direction: Direction) => void;
}

const swipeThreshold = 24;

const statusContent = {
  ready: { eyebrow: "Arena ready", title: "Press start", detail: "Then steer with arrows or WASD" },
  paused: { eyebrow: "Run suspended", title: "Paused", detail: "Resume when you’re ready" },
  "game-over": { eyebrow: "Signal lost", title: "Game over", detail: "Restart to enter the arena again" },
  playing: null,
} as const;

export function GameArena({ state, onDirection }: GameArenaProps) {
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const overlay = statusContent[state.status];
  const head = state.snake[0];

  const handlePointerDown = (event: PointerEvent<SVGSVGElement>) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: PointerEvent<SVGSVGElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start || state.status !== "playing") return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < swipeThreshold) return;
    onDirection(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
  };

  return (
    <div className="arena-shell">
      <svg
        className="arena-grid touch-none"
        viewBox={`0 0 ${BOARD_SIZE} ${BOARD_SIZE}`}
        role="img"
        aria-label={`Snake arena. Score ${state.score}. Status ${state.status}.`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { pointerStart.current = null; }}
      >
        <rect className="fill-arena" width={BOARD_SIZE} height={BOARD_SIZE} />
        <g className="food-mark">
          <circle cx={state.food.x + 0.5} cy={state.food.y + 0.5} r="0.34" />
          <circle cx={state.food.x + 0.5} cy={state.food.y + 0.5} r="0.47" fill="none" strokeWidth="0.07" />
        </g>
        <g className="snake-mark">
          {state.snake.map((segment, index) => (
            <rect
              key={`${segment.x}-${segment.y}-${index}`}
              x={segment.x + 0.08}
              y={segment.y + 0.08}
              width="0.84"
              height="0.84"
              rx={index === 0 ? "0.28" : "0.2"}
              className={index === 0 ? "snake-head" : "snake-body"}
            />
          ))}
          {head ? <circle cx={head.x + 0.64} cy={head.y + 0.34} r="0.07" className="fill-arena" /> : null}
        </g>
      </svg>

      {overlay ? (
        <div className="arena-overlay" aria-live="polite">
          <p>{overlay.eyebrow}</p>
          <h2>{overlay.title}</h2>
          <span>{overlay.detail}</span>
        </div>
      ) : null}
      <div className="scan-line" aria-hidden="true" />
    </div>
  );
}
