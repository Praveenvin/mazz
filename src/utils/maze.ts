// src/utils/maze.ts
import type { MazeState, Position } from '../types/maze';
import { CellType, MIN_SIZE, MAX_SIZE } from '../types/maze';

export const cloneMaze = (maze: MazeState): MazeState => ({
  ...maze,
  grid: maze.grid.map(row => [...row]),
  visitCount: maze.visitCount?.map(row => [...row]) || [],
  start: maze.start ? { ...maze.start } : null,
  goal: maze.goal ? { ...maze.goal } : null,
});

export const toggleObstacle = (maze: MazeState, row: number, col: number): MazeState => {
  const newMaze = cloneMaze(maze);
  const current = newMaze.grid[row][col];

  if (current === CellType.Start || current === CellType.Goal) return maze;

  newMaze.grid[row][col] = current === CellType.Obstacle ? CellType.Empty : CellType.Obstacle;
  return newMaze;
};

export const setStart = (maze: MazeState, row: number, col: number): MazeState => {
  const newMaze = cloneMaze(maze);

  if (newMaze.start) {
    const { row: r, col: c } = newMaze.start;
    if (newMaze.grid[r][c] === CellType.Start) {
      newMaze.grid[r][c] = CellType.Empty;
    }
  }

  if (newMaze.grid[row][col] !== CellType.Obstacle) {
    newMaze.grid[row][col] = CellType.Start;
    newMaze.start = { row, col };
  }

  return newMaze;
};

export const setGoal = (maze: MazeState, row: number, col: number): MazeState => {
  const newMaze = cloneMaze(maze);

  if (newMaze.goal) {
    const { row: r, col: c } = newMaze.goal;
    if (newMaze.grid[r][c] === CellType.Goal) {
      newMaze.grid[r][c] = CellType.Empty;
    }
  }

  if (newMaze.grid[row][col] !== CellType.Obstacle) {
    newMaze.grid[row][col] = CellType.Goal;
    newMaze.goal = { row, col };
  }

  return newMaze;
};

export const isValidPosition = (maze: MazeState, { row, col }: Position): boolean => {
  return row >= 0 && row < maze.rows && col >= 0 && col < maze.cols;
};

export const resizeMaze = (maze: MazeState, newSize: number): MazeState => {
  newSize = Math.max(MIN_SIZE, Math.min(MAX_SIZE, newSize));
  
  const newGrid = Array(newSize).fill(null).map(() => Array(newSize).fill(CellType.Empty));
  const newVisitCount = Array(newSize).fill(null).map(() => Array(newSize).fill(0));

  for (let r = 0; r < Math.min(maze.rows, newSize); r++) {
    for (let c = 0; c < Math.min(maze.cols, newSize); c++) {
      newGrid[r][c] = maze.grid[r][c];
      newVisitCount[r][c] = maze.visitCount?.[r]?.[c] || 0;
    }
  }

  const adjustPos = (pos: Position | null): Position | null => {
    if (!pos) return null;
    if (pos.row < newSize && pos.col < newSize) return pos;
    return null;
  };

  return {
    grid: newGrid,
    visitCount: newVisitCount,
    start: adjustPos(maze.start),
    goal: adjustPos(maze.goal),
    rows: newSize,
    cols: newSize,
  };
};