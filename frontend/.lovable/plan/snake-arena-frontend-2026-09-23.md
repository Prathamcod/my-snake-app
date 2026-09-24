# Snake Arena frontend

## Goal
Build a production-ready single-player Snake game at `/` with a neon arcade presentation, responsive controls, reliable game behavior, and clean seams for future API integration.

## Experience
- Center the arena as the primary focus, with live score, saved best score, speed level, and clear status indicators.
- Support Start, Pause, Resume, and Restart with distinct game-over, paused, and ready overlays.
- Add arrow-key/WASD input plus ergonomic mobile direction controls.
- Use a dark near-black arena, electric green snake, coral food, restrained cyan accents, crisp typography, subtle grid texture, and lightweight motion.
- Keep desktop information compact around the board and stack controls cleanly on smaller screens.

## Game behavior
- Use a deterministic initial snake position and direction on a fixed logical grid.
- Prevent immediate reverse moves and safely queue rapid direction input.
- Grow and award points on food collection, spawn food only in free cells, and increase speed gradually.
- End the run on wall or body collision; restart creates a clean new run.
- Persist the best score in local storage without coupling it to the game engine.

## Maintainable structure
- Put pure types, movement, collision, food placement, scoring, and reset logic in a reusable game module.
- Put the timer loop, keyboard/touch input, lifecycle state, and score persistence in a focused React hook.
- Split the screen into small components for the arena, status/score panel, action controls, and direction pad.
- Add a lightweight API contract/interface representing future `/game/state`, `/game/start`, `/game/move`, `/game/restart`, and `/leaderboard` integration without making network calls in v1.
- Replace the placeholder README with local setup, controls, architecture notes, and future backend integration guidance.

## Validation
- Verify startup, movement, food growth, score updates, pause/resume, restart, and visible collision handling.
- Check keyboard and touch interactions at desktop and mobile sizes.
- Confirm metadata, accessibility labels, reduced-motion behavior, and a clean preview build.
