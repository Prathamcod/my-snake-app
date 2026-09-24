import { createFileRoute } from "@tanstack/react-router";
import { Pause, Play, RefreshCw, RotateCcw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DirectionPad } from "@/components/snake/direction-pad";
import { GameArena } from "@/components/snake/game-arena";
import { ScorePanel } from "@/components/snake/score-panel";
import { useSnakeGame } from "@/hooks/use-snake-game";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Snake Arena — Neon Arcade Game" },
      { name: "description", content: "Play a fast, polished Snake game with keyboard and touch controls, score tracking, and increasing speed." },
      { property: "og:title", content: "Snake Arena — Neon Arcade Game" },
      { property: "og:description", content: "Enter the grid, chase the signal, and set a new high score in this polished browser Snake game." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SnakeArenaPage,
});

function SnakeArenaPage() {
  const { state, bestScore, speedLevel, start, pause, resume, restart, changeDirection } = useSnakeGame();
  const isPlaying = state.status === "playing";

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto flex min-h-dvh w-full max-w-[86rem] flex-col px-4 py-5 sm:px-6 sm:py-7 lg:px-10">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border pb-4 sm:flex sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="brand-mark shrink-0" aria-hidden="true"><Zap /></div>
            <div className="min-w-0">
              <p className="brand-name truncate">Snake Arena</p>
              <p className="brand-subtitle truncate">Neon grid protocol</p>
            </div>
          </div>
          <div className="status-pill" data-status={state.status}>
            <span aria-hidden="true" />
            {state.status === "game-over" ? "Offline" : state.status}
          </div>
        </header>

        <div className="grid flex-1 items-center gap-7 py-6 lg:grid-cols-[minmax(15rem,0.72fr)_minmax(28rem,1.6fr)_minmax(15rem,0.72fr)] lg:gap-8 lg:py-8">
          <section className="order-2 lg:order-1" aria-labelledby="mission-title">
            <p className="section-kicker">Protocol 01</p>
            <h1 id="mission-title" className="mt-3 max-w-sm text-3xl font-semibold leading-tight sm:text-4xl">
              Chase the signal. Own the grid.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              Collect every pulse, stay inside the perimeter, and never cross your own trail.
            </p>
            <div className="mt-7 hidden space-y-3 lg:block">
              <ControlHint keys={["↑", "↓", "←", "→"]} label="Move" />
              <ControlHint keys={["W", "A", "S", "D"]} label="Alternate" />
              <ControlHint keys={["SPACE"]} label="Pause / resume" wide />
            </div>
          </section>

          <section className="order-1 min-w-0 lg:order-2" aria-label="Snake game">
            <ScorePanel score={state.score} bestScore={bestScore} speedLevel={speedLevel} />
            <GameArena state={state} onDirection={changeDirection} />
            <div className="mt-4 flex min-h-10 items-center justify-center gap-3">
              {state.status === "ready" ? (
                <Button variant="game" size="lg" onClick={start}><Play /> Start run</Button>
              ) : null}
              {state.status === "playing" ? (
                <Button variant="gameOutline" size="lg" onClick={pause}><Pause /> Pause</Button>
              ) : null}
              {state.status === "paused" ? (
                <>
                  <Button variant="game" size="lg" onClick={resume}><Play /> Resume</Button>
                  <Button variant="gameOutline" size="lg" onClick={restart}><RotateCcw /> Restart</Button>
                </>
              ) : null}
              {state.status === "game-over" ? (
                <Button variant="game" size="lg" onClick={restart}><RefreshCw /> Run again</Button>
              ) : null}
            </div>
          </section>

          <aside className="order-3 flex flex-col items-center lg:items-start" aria-label="Mobile controls">
            <p className="section-kicker mb-4">Direction control</p>
            <DirectionPad onDirection={changeDirection} disabled={!isPlaying} />
            <p className="mt-4 text-center text-xs leading-5 text-muted-foreground lg:text-left">
              Tap the pad or swipe across the arena.
            </p>
            <div className="mt-7 grid w-full max-w-xs grid-cols-3 gap-2 border-t border-border pt-5 lg:hidden">
              <Metric label="Length" value={state.snake.length} />
              <Metric label="Level" value={speedLevel} />
              <Metric label="Points" value={state.score} />
            </div>
          </aside>
        </div>

        <footer className="flex items-center justify-between border-t border-border pt-4 text-[0.7rem] uppercase text-muted-foreground">
          <span>Grid 20 × 20</span>
          <span>Local best saved</span>
        </footer>
      </div>
    </main>
  );
}

function ControlHint({ keys, label, wide = false }: { keys: string[]; label: string; wide?: boolean }) {
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <div className="flex gap-1">{keys.map((key) => <kbd key={key} className={wide ? "key-cap key-wide" : "key-cap"}>{key}</kbd>)}</div>
      <span>{label}</span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="text-center"><p className="text-lg font-semibold tabular-nums">{value}</p><p className="text-[0.65rem] uppercase text-muted-foreground">{label}</p></div>;
}
