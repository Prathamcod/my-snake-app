import type { Direction, GameState } from "./snake-game";

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  score: number;
}

export interface SnakeGameApi {
  getState(): Promise<GameState>;
  start(): Promise<GameState>;
  move(direction: Direction): Promise<GameState>;
  restart(): Promise<GameState>;
  getLeaderboard(): Promise<LeaderboardEntry[]>;
}

export const plannedGameEndpoints = {
  state: "GET /game/state",
  start: "POST /game/start",
  move: "POST /game/move",
  restart: "POST /game/restart",
  leaderboard: "GET /leaderboard",
} as const;
