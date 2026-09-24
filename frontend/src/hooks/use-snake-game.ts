import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  createInitialState,
  getSpeedLevel,
  getTickSpeed,
  isOpposite,
  tickGame,
  type Direction,
  type GameState,
} from "@/lib/snake-game";

const BEST_SCORE_KEY = "snake-arena-best-score";

type Action =
  | { type: "start" }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "restart" }
  | { type: "direction"; direction: Direction }
  | { type: "tick" };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "start":
      return state.status === "ready" ? { ...state, status: "playing" } : state;
    case "pause":
      return state.status === "playing" ? { ...state, status: "paused" } : state;
    case "resume":
      return state.status === "paused" ? { ...state, status: "playing" } : state;
    case "restart":
      return createInitialState("playing");
    case "direction":
      if (state.status !== "playing" || isOpposite(state.queuedDirection, action.direction)) return state;
      return { ...state, queuedDirection: action.direction };
    case "tick":
      return tickGame(state);
    default:
      return state;
  }
}

const keyDirections: Record<string, Direction | undefined> = {
  ArrowUp: "up",
  w: "up",
  W: "up",
  ArrowDown: "down",
  s: "down",
  S: "down",
  ArrowLeft: "left",
  a: "left",
  A: "left",
  ArrowRight: "right",
  d: "right",
  D: "right",
};

export function useSnakeGame() {
  const [state, dispatch] = useReducer(reducer, undefined, () => createInitialState());
  const [bestScore, setBestScore] = useState(0);
  const previousStatus = useRef(state.status);

  useEffect(() => {
    const stored = window.localStorage.getItem(BEST_SCORE_KEY);
    const parsed = stored ? Number.parseInt(stored, 10) : 0;
    if (Number.isFinite(parsed) && parsed > 0) setBestScore(parsed);
  }, []);

  useEffect(() => {
    if (state.score <= bestScore) return;
    setBestScore(state.score);
    window.localStorage.setItem(BEST_SCORE_KEY, String(state.score));
  }, [bestScore, state.score]);

  const changeDirection = useCallback((direction: Direction) => {
    dispatch({ type: "direction", direction });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = keyDirections[event.key];
      if (direction) {
        event.preventDefault();
        changeDirection(direction);
      }
      if (event.code === "Space") {
        event.preventDefault();
        if (state.status === "playing") dispatch({ type: "pause" });
        if (state.status === "paused") dispatch({ type: "resume" });
        if (state.status === "ready") dispatch({ type: "start" });
      }
    };
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeDirection, state.status]);

  useEffect(() => {
    if (state.status !== "playing") return;
    const timer = window.setTimeout(() => dispatch({ type: "tick" }), getTickSpeed(state.score));
    return () => window.clearTimeout(timer);
  }, [state]);

  useEffect(() => {
    previousStatus.current = state.status;
  }, [state.status]);

  return {
    state,
    bestScore,
    speedLevel: getSpeedLevel(state.score),
    start: () => dispatch({ type: "start" }),
    pause: () => dispatch({ type: "pause" }),
    resume: () => dispatch({ type: "resume" }),
    restart: () => dispatch({ type: "restart" }),
    changeDirection,
  };
}
