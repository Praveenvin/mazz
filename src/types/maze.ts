// src/types/maze.ts

export const MIN_SIZE = 5;
export const MAX_SIZE = 20;
export const DEFAULT_SIZE = 10;

export type Position = {
  row: number;
  col: number;
};

export enum CellType {
  Empty = 0,
  Obstacle = 1,
  Start = 2,
  Goal = 3,
  Path = 4,
  Visited = 5,
}

export type Cell = {
  type: CellType;
  position: Position;
};

export type MazeState = {
  grid: CellType[][];
  start: Position | null;
  goal: Position | null;
  rows: number;
  cols: number;
  visitCount?: number[][];
};

export type Algorithm = 'A*' | 'Dijkstra' | 'BFS' | 'DFS';

export type PathfindingResult = {
  path: Position[];
  visited: Position[];
  durationMs: number;
  nodesExpanded: number;
  found: boolean;
};

export const createEmptyMaze = (size = DEFAULT_SIZE): MazeState => ({
  grid: Array(size).fill(null).map(() => Array(size).fill(CellType.Empty)),
  start: null,
  goal: null,
  rows: size,
  cols: size,
  visitCount: Array(size).fill(null).map(() => Array(size).fill(0)),
});