# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    # MazeRunner Pro

    MazeRunner Pro is an interactive maze visualizer and pathfinding playground built with React + TypeScript + Vite. Explore 2D and 3D maze views, place start/goal points, draw obstacles, and run multiple pathfinding algorithms (A*, Dijkstra, BFS, DFS). The app also includes heatmap visualizations to inspect algorithm exploration.

    Live demo: run locally (instructions below).

    Key features
    - Interactive grid editor: place start/goal, draw or erase obstacles by clicking or dragging.
    - Multiple algorithms: A* (heuristic), Dijkstra (weighted), BFS and DFS (unweighted/exploratory).
    - Step mode: animate the exploration step-by-step.
    - Heatmap: visualize node visit frequency from runs.
    - 2D and 3D views (Three.js) for richer visualization.

    Tech stack
    - React + TypeScript
    - Vite (dev server & build)
    - Tailwind CSS + PostCSS
    - Three.js (3D view)
    - ESLint for linting
    - Optional: TensorFlow.js is included in dependencies (not required for basic pathfinding features)

    Getting started

    Prerequisites
    - Node.js 18+ (LTS recommended)
    - Git (optional)

    Install and run locally
    ```powershell
    # install
    npm install

    # dev server
    npm run dev

    # build for production
    npm run build

    # preview built app
    npm run preview
    ```

    Project layout (important files)
    - `src/App.tsx` — main UI and controls (grid size, algorithms, heatmap, 2D/3D toggle).
    - `src/utils/pathfinding.ts` — implementations of A*, Dijkstra, BFS, DFS and a tiny priority queue.
    - `src/utils/maze.ts` — maze state helpers (toggle obstacles, set start/goal, resize, clone).
    - `src/types/maze.ts` — shared TypeScript types and constants.
    - `src/components/ThreeDMaze` — 3D rendering (uses `three`).

    Usage & controls
    - Click a grid cell to toggle obstacle. Use drag to paint obstacles.
    - Use the Placement buttons to place Start (S) and Goal (G).
    - Choose an algorithm from the dropdown and click "Find Path" to run.
    - Press Space to run the selected algorithm (if start & goal are set).
    - Press `r` to reset the maze. Press `Esc` to cancel placement.

    Notes
    - Line endings: when running on Windows you may see CRLF conversion warnings from Git — this is normal.
    - TensorFlow is included in `package.json` but not used by the core pathfinding code.

    Contributing
    - Open issues or PRs in this repository. Small, focused PRs are easiest to review.
    - Add tests and documentation for new algorithms or features.

    License
    - Add a `LICENSE` file if you plan to publish this project. (No license is included by default.)

    Where to look for algorithms and techniques
    - See `TECHNIQUES.md` (new file) for a compact summary of implemented algorithms and visual techniques, with pointers to source files.

    Enjoy exploring mazes! Pull requests welcome.
