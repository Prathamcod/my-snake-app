export const BOARD_SIZE = 20;
export const SCORE_PER_FOOD = 10;
export const INITIAL_TICK_MS = 180;
export const MIN_TICK_MS = 78;

export type Point = Readonly<{ x: number; y: number }>;
export type Direction = "up" | "down" | "left" | "right";
export type GameStatus = "ready" | "playing" | "paused" | "game-over";

export interface GameState {
  snake: Point[];
  food: Point;
  direction: Direction;
  queuedDirection: Direction;
  score: number;
  status: GameStatus;
}

const directionVectors: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const opposites: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

export function pointsEqual(a: Point, b: Point) {
  return a.x === b.x && a.y === b.y;
}

export function isOpposite(a: Direction, b: Direction) {
  return opposites[a] === b;
}

export function createInitialState(status: GameStatus = "ready"): GameState {
  const center = Math.floor(BOARD_SIZE / 2);
  return {
    snake: [
      { x: center, y: center },
      { x: center - 1, y: center },
      { x: center - 2, y: center },
    ],
    food: { x: center + 4, y: center },
    direction: "right",
    queuedDirection: "right",
    score: 0,
    status,
  };
}

export function spawnFood(snake: Point[], random: () => number = Math.random): Point {
  const occupied = new Set(snake.map(({ x, y }) => `${x}:${y}`));
  const free: Point[] = [];
  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      if (!occupied.has(`${x}:${y}`)) free.push({ x, y });
    }
  }
  return free[Math.floor(random() * free.length)] ?? { x: 0, y: 0 };
}

export function tickGame(state: GameState, random: () => number = Math.random): GameState {
  if (state.status !== "playing") return state;

  const direction = isOpposite(state.direction, state.queuedDirection)
    ? state.direction
    : state.queuedDirection;
  const vector = directionVectors[direction];
  const head = state.snake[0];
  if (!head) return { ...state, status: "game-over" };

  const nextHead = { x: head.x + vector.x, y: head.y + vector.y };
  const hitWall =
    nextHead.x < 0 ||
    nextHead.x >= BOARD_SIZE ||
    nextHead.y < 0 ||
    nextHead.y >= BOARD_SIZE;
  const ateFood = pointsEqual(nextHead, state.food);
  const collisionBody = ateFood ? state.snake : state.snake.slice(0, -1);
  const hitSelf = collisionBody.some((segment) => pointsEqual(segment, nextHead));

  if (hitWall || hitSelf) return { ...state, direction, status: "game-over" };

  const snake = [nextHead, ...state.snake];
  if (!ateFood) snake.pop();
  const score = ateFood ? state.score + SCORE_PER_FOOD : state.score;

  return {
    ...state,
    snake,
    food: ateFood ? spawnFood(snake, random) : state.food,
    direction,
    queuedDirection: direction,
    score,
  };
}

export function getTickSpeed(score: number) {
  const level = Math.floor(score / 40);
  return Math.max(MIN_TICK_MS, INITIAL_TICK_MS - level * 14);
}

export function getSpeedLevel(score: number) {
  return Math.floor(score / 40) + 1;
}
