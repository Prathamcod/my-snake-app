# Snake Arena

A polished, responsive single-player Snake prototype built with TanStack Start, React, TypeScript, and Tailwind CSS.

## Run locally

```sh
bun install
bun run dev
```

Open `http://localhost:3000` (or the URL shown by Vite).

## Controls

- Arrow keys or `WASD`: steer
- Space: start, pause, or resume
- On mobile: use the direction pad or swipe across the arena
- Start/Resume/Pause/Restart buttons provide full game lifecycle control

## Architecture

- `src/lib/snake-game.ts`: pure grid movement, collision, food spawning, score, and speed logic
- `src/hooks/use-snake-game.ts`: game timer, keyboard input, lifecycle state, and local best-score persistence
- `src/components/snake/`: arena renderer, score panel, and touch controls
- `src/lib/game-api.ts`: transport-neutral contract for future server integration

The game engine is intentionally independent of React and networking. A future FastAPI service can implement the `SnakeGameApi` contract around `/game/state`, `/game/start`, `/game/move`, `/game/restart`, and `/leaderboard` without changing the board components.
