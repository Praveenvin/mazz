// src/utils/pathfinding.ts
import type { MazeState, Position, PathfindingResult } from '../types/maze';
import { CellType } from '../types/maze';

// Priority Queue for A*/Dijkstra
class PriorityQueue<T> {
  private items: { item: T; priority: number }[] = [];
  
  enqueue(item: T, priority: number): void {
    this.items.push({ item, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }
  
  dequeue(): T | undefined {
    return this.items.shift()?.item;
  }
  
  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

// Heuristic: Manhattan distance
const manhattan = (a: Position, b: Position): number =>
  Math.abs(a.row - b.row) + Math.abs(a.col - b.col);

// Get neighbors (4-directional)
const getNeighbors = (maze: MazeState, { row, col }: Position): Position[] => {
  const dirs = [
    { dr: -1, dc: 0 }, // up
    { dr: 0, dc: 1 },  // right
    { dr: 1, dc: 0 },  // down
    { dr: 0, dc: -1 }, // left
  ];
  return dirs
    .map(({ dr, dc }) => ({ row: row + dr, col: col + dc }))
    .filter(pos => 
      pos.row >= 0 && pos.row < maze.rows &&
      pos.col >= 0 && pos.col < maze.cols &&
      maze.grid[pos.row][pos.col] !== CellType.Obstacle
    );
};

// Reconstruct path from cameFrom map
const reconstructPath = (cameFrom: Map<string, Position>, current: Position): Position[] => {
  const path: Position[] = [current];
  let key = `${current.row},${current.col}`;
  while (cameFrom.has(key)) {
    const prev = cameFrom.get(key)!;
    path.unshift(prev);
    key = `${prev.row},${prev.col}`;
  }
  return path;
};

// 🔍 A* Algorithm
export const aStar = (maze: MazeState): PathfindingResult => {
  const start = maze.start;
  const goal = maze.goal;
  if (!start || !goal) return { path: [], visited: [], durationMs: 0, nodesExpanded: 0, found: false };

  const startTime = performance.now();
  const openSet = new PriorityQueue<Position>();
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const cameFrom = new Map<string, Position>();
  const visited: Position[] = [];

  const startKey = `${start.row},${start.col}`;
  gScore.set(startKey, 0);
  fScore.set(startKey, manhattan(start, goal));
  openSet.enqueue(start, fScore.get(startKey)!);

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue()!;
    const currentKey = `${current.row},${current.col}`;
    visited.push(current);

    if (current.row === goal.row && current.col === goal.col) {
      const path = reconstructPath(cameFrom, current);
      return {
        path,
        visited,
        durationMs: performance.now() - startTime,
        nodesExpanded: visited.length,
        found: true,
      };
    }

    for (const neighbor of getNeighbors(maze, current)) {
      const neighborKey = `${neighbor.row},${neighbor.col}`;
      const tentativeG = (gScore.get(currentKey) || Infinity) + 1;

      if (tentativeG < (gScore.get(neighborKey) || Infinity)) {
        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, tentativeG);
        fScore.set(neighborKey, tentativeG + manhattan(neighbor, goal));
        if (!visited.some(v => v.row === neighbor.row && v.col === neighbor.col)) {
          openSet.enqueue(neighbor, fScore.get(neighborKey)!);
        }
      }
    }
  }

  return {
    path: [],
    visited,
    durationMs: performance.now() - startTime,
    nodesExpanded: visited.length,
    found: false,
  };
};

// 🔍 Dijkstra (A* with h=0)
export const dijkstra = (maze: MazeState): PathfindingResult => {
  const start = maze.start;
  const goal = maze.goal;
  if (!start || !goal) return { path: [], visited: [], durationMs: 0, nodesExpanded: 0, found: false };

  const startTime = performance.now();
  const openSet = new PriorityQueue<Position>();
  const dist = new Map<string, number>();
  const cameFrom = new Map<string, Position>();
  const visited: Position[] = [];

  const startKey = `${start.row},${start.col}`;
  dist.set(startKey, 0);
  openSet.enqueue(start, 0);

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue()!;
    const currentKey = `${current.row},${current.col}`;
    visited.push(current);

    if (current.row === goal.row && current.col === goal.col) {
      const path = reconstructPath(cameFrom, current);
      return {
        path,
        visited,
        durationMs: performance.now() - startTime,
        nodesExpanded: visited.length,
        found: true,
      };
    }

    for (const neighbor of getNeighbors(maze, current)) {
      const neighborKey = `${neighbor.row},${neighbor.col}`;
      const alt = (dist.get(currentKey) || Infinity) + 1;

      if (alt < (dist.get(neighborKey) || Infinity)) {
        cameFrom.set(neighborKey, current);
        dist.set(neighborKey, alt);
        if (!visited.some(v => v.row === neighbor.row && v.col === neighbor.col)) {
          openSet.enqueue(neighbor, alt);
        }
      }
    }
  }

  return {
    path: [],
    visited,
    durationMs: performance.now() - startTime,
    nodesExpanded: visited.length,
    found: false,
  };
};

// 🔍 BFS
export const bfs = (maze: MazeState): PathfindingResult => {
  const start = maze.start;
  const goal = maze.goal;
  if (!start || !goal) return { path: [], visited: [], durationMs: 0, nodesExpanded: 0, found: false };

  const startTime = performance.now();
  const queue: Position[] = [start];
  const cameFrom = new Map<string, Position>();
  const visited: Position[] = [];
  const visitedSet = new Set<string>([`${start.row},${start.col}`]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    visited.push(current);

    if (current.row === goal.row && current.col === goal.col) {
      const path = reconstructPath(cameFrom, current);
      return {
        path,
        visited,
        durationMs: performance.now() - startTime,
        nodesExpanded: visited.length,
        found: true,
      };
    }

    for (const neighbor of getNeighbors(maze, current)) {
      const key = `${neighbor.row},${neighbor.col}`;
      if (!visitedSet.has(key)) {
        visitedSet.add(key);
        cameFrom.set(key, current);
        queue.push(neighbor);
      }
    }
  }

  return {
    path: [],
    visited,
    durationMs: performance.now() - startTime,
    nodesExpanded: visited.length,
    found: false,
  };
};

// 🔍 DFS (stack-based)
export const dfs = (maze: MazeState): PathfindingResult => {
  const start = maze.start;
  const goal = maze.goal;
  if (!start || !goal) return { path: [], visited: [], durationMs: 0, nodesExpanded: 0, found: false };

  const startTime = performance.now();
  const stack: Position[] = [start];
  const cameFrom = new Map<string, Position>();
  const visited: Position[] = [];
  const visitedSet = new Set<string>([`${start.row},${start.col}`]);

  while (stack.length > 0) {
    const current = stack.pop()!;
    visited.push(current);

    if (current.row === goal.row && current.col === goal.col) {
      const path = reconstructPath(cameFrom, current);
      return {
        path,
        visited,
        durationMs: performance.now() - startTime,
        nodesExpanded: visited.length,
        found: true,
      };
    }

    // Reverse to maintain consistent order (up→right→down→left)
    for (const neighbor of getNeighbors(maze, current).reverse()) {
      const key = `${neighbor.row},${neighbor.col}`;
      if (!visitedSet.has(key)) {
        visitedSet.add(key);
        cameFrom.set(key, current);
        stack.push(neighbor);
      }
    }
  }

  return {
    path: [],
    visited,
    durationMs: performance.now() - startTime,
    nodesExpanded: visited.length,
    found: false,
  };
};

// 🔧 Run selected algorithm
export const runAlgorithm = (maze: MazeState, algo: string): PathfindingResult => {
  switch (algo) {
    case 'A*': return aStar(maze);
    case 'Dijkstra': return dijkstra(maze);
    case 'BFS': return bfs(maze);
    case 'DFS': return dfs(maze);
    default: return { path: [], visited: [], durationMs: 0, nodesExpanded: 0, found: false };
  }
};