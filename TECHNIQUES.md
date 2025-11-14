# Techniques & Implementation Notes

This file summarizes algorithms, data structures and UX/visualization techniques used in this project and points to the source files where they are implemented.

Core algorithms

- A* (A-star)
  - Where: `src/utils/pathfinding.ts`
  - Uses: Manhattan distance heuristic, grid neighbors (4-directional), priority queue (min-heap style).
  - Purpose: finds an optimal path efficiently when heuristic is admissible.

- Dijkstra
  - Where: `src/utils/pathfinding.ts`
  - Uses: priority queue, distance map.
  - Purpose: shortest-path on unweighted graphs (or when weights are uniform it behaves like BFS with priority queue).

- BFS (Breadth-first search)
  - Where: `src/utils/pathfinding.ts`
  - Uses: queue, visited set, cameFrom map for path reconstruction.
  - Purpose: shortest path in unweighted grids (level-by-level exploration).

- DFS (Depth-first search)
  - Where: `src/utils/pathfinding.ts`
  - Uses: stack, visited set, cameFrom map.
  - Purpose: exploratory search; not guaranteed to produce shortest path but useful for visual comparison.

Supporting data structures & helpers

- PriorityQueue (simple min-heap wrapper)
  - Where: `src/utils/pathfinding.ts`
  - Note: implemented using array + sort for simplicity (sufficient for small grids). Replace with binary heap for performance on large graphs.

- Grid representation
  - Where: `src/types/maze.ts`, `src/utils/maze.ts`
  - Uses a 2D array of `CellType` values. `MazeState` includes `start`, `goal`, `rows`, `cols`, and optional `visitCount` for heatmap.

- Maze helpers
  - `cloneMaze`, `toggleObstacle`, `setStart`, `setGoal`, `resizeMaze` — implemented in `src/utils/maze.ts`.
  - Purpose: keep state updates immutable-friendly and centralized.

Visualization & UI techniques

- Heatmap
  - Where: `src/App.tsx` (render logic)
  - Uses a `visitCount` per cell to color cells with varying transparency/gradient based on frequency.

- Step Mode / Animation
  - Where: `src/App.tsx`
  - Uses a `visited` array produced by algorithms and animates traversal using `setTimeout` / React state for step index.

- 2D & 3D Views
  - 2D: rendered as HTML elements styled with Tailwind CSS (fast to iterate, responsive).
  - 3D: `src/components/ThreeDMaze` (uses three.js) — enables a visually rich perspective; useful for presentations and exploring spatial relationships.

Performance notes

- Algorithms use small-size-friendly implementations (array-sorted PQ). For larger grids (100×100+) consider:
  - Replacing sorted-array PQ with binary heap or Fibonacci heap.
  - Reducing allocations by reusing arrays/maps where safe.

Extensibility ideas

- Weighted cells & variable-cost terrain (e.g., different traversal costs).
- Diagonal neighbors and octile distance heuristic for diagonal movement.
- Maze generation algorithms (Prim's, recursive division, recursive backtracker) to produce solvable mazes.
- GPU-accelerated visualization / worker threads for heavy computations.

Where to read code
- Pathfinding: `src/utils/pathfinding.ts`
- Maze state & helpers: `src/utils/maze.ts`
- Types: `src/types/maze.ts`
- Main UI: `src/App.tsx`

If you want, I can add code comments, unit tests, or benchmark scripts for the algorithms.
