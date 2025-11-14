// src/types/maze.ts

export type Position = {
  row: number;
  col: number;
};

// CellType is a runtime enum → keep as value
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
};

// Algorithm is a union type → import as type
export type Algorithm = 'A*' | 'Dijkstra' | 'BFS' | 'DFS';

export type PathfindingResult = {
  path: Position[];
  visited: Position[];
  durationMs: number;
  nodesExpanded: number;
  found: boolean;
};

export const DEFAULT_ROWS = 10;
export const DEFAULT_COLS = 10;

export const createEmptyMaze = (rows = DEFAULT_ROWS, cols = DEFAULT_COLS): MazeState => ({
  grid: Array(rows).fill(null).map(() => Array(cols).fill(CellType.Empty)),
  start: null,
  goal: null,
  rows,
  cols,
});