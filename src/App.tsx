import { useState, useEffect, useCallback, useRef } from 'react';
import { createEmptyMaze, CellType } from './types/maze';
import { toggleObstacle, setStart, setGoal } from './utils/maze';
import { runAlgorithm } from './utils/pathfinding';
import type { Position, PathfindingResult, Algorithm } from './types/maze';

type PlacementMode = 'none' | 'placingStart' | 'placingGoal';

export default function App() {
  const [darkMode, setDarkMode] = useState(true); // Default to dark
  const [maze, setMaze] = useState(() => createEmptyMaze());
  const [mode, setMode] = useState<PlacementMode>('none');
  const [selectedCell, setSelectedCell] = useState<Position | null>(null);
  const [algorithm, setAlgorithm] = useState<Algorithm>('A*');
  const [pathResult, setPathResult] = useState<PathfindingResult | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [stepMode, setStepMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const animationRef = useRef<number | null>(null);
  
  // Sync dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.background = 'radial-gradient(circle at 20% 30%, #0f172a, #020617)';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.background = 'radial-gradient(circle at 20% 30%, #f0f9ff, #e0f2fe)';
    }
    return () => { document.documentElement.style.background = ''; };
  }, [darkMode]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (mode === 'placingStart') {
      setMaze(prev => setStart(prev, row, col));
      setMode('none');
      setPathResult(null);
    } else if (mode === 'placingGoal') {
      setMaze(prev => setGoal(prev, row, col));
      setMode('none');
      setPathResult(null);
    } else {
      setMaze(prev => toggleObstacle(prev, row, col));
      setPathResult(null);
    }
    setSelectedCell({ row, col });
  }, [mode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMode('none');
        setSelectedCell(null);
      } else if (e.key === 'r' || e.key === 'R') {
        setMaze(createEmptyMaze());
        setPathResult(null);
      } else if (e.key === ' ') {
        e.preventDefault();
        if (maze.start && maze.goal) computePath();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [maze.start, maze.goal]);

  // Compute path
  const computePath = useCallback(() => {
    if (!maze.start || !maze.goal) return;
    
    setIsComputing(true);
    // Simulate slight delay for UX
    setTimeout(() => {
      const result = runAlgorithm(maze, algorithm);
      setPathResult(result);
      setIsComputing(false);
      if (stepMode && result.visited.length > 0) {
        setCurrentStep(0);
      }
    }, 100);
  }, [maze, algorithm, stepMode]);

  // Step animation
  useEffect(() => {
    if (!stepMode || !pathResult?.visited.length || currentStep >= pathResult.visited.length) return;

    animationRef.current = window.setTimeout(() => {
      setCurrentStep(prev => Math.min(prev + 1, pathResult.visited.length));
    }, 150);
    
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, [currentStep, stepMode, pathResult?.visited.length]);

  // Get render type
  const getRenderCellType = (row: number, col: number): CellType => {
    const baseType = maze.grid[row][col];
    if (baseType === CellType.Start || baseType === CellType.Goal) return baseType;

    if (pathResult?.path.some(p => p.row === row && p.col === col)) {
      return CellType.Path;
    }

    if (stepMode) {
      const stepVisited = pathResult?.visited.slice(0, currentStep) || [];
      if (stepVisited.some(p => p.row === row && p.col === col)) {
        return CellType.Visited;
      }
    } else if (pathResult?.visited.some(p => p.row === row && p.col === col)) {
      return CellType.Visited;
    }

    return baseType;
  };

  // Cell styling
  const getCellClass = (type: CellType, isSelected: boolean, isPath = false) => {
    const base = "w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-xs md:text-sm font-bold rounded-lg transition-all duration-300 relative";
    const selected = isSelected ? "ring-2 ring-blue-400 scale-105 z-10" : "";
    
    switch (type) {
      case CellType.Empty:
        return `${base} ${darkMode ? 'bg-gray-800/50 hover:bg-gray-700/70' : 'bg-gray-100 hover:bg-gray-200'} border border-gray-700/30 ${selected}`;
      case CellType.Obstacle:
        return `${base} bg-gradient-to-br from-gray-700 to-gray-900 text-gray-200 border border-gray-600 shadow-inner ${selected}`;
      case CellType.Start:
        return `${base} bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border-2 border-emerald-400 shadow-lg ${selected} animate-pulse`;
      case CellType.Goal:
        return `${base} bg-gradient-to-br from-rose-500 to-rose-700 text-white border-2 border-rose-400 shadow-lg ${selected} animate-pulse`;
      case CellType.Path:
        return `${base} bg-gradient-to-br from-blue-500 to-cyan-500 text-white border border-blue-400 shadow-md ${selected} ${isPath ? 'path-cell' : ''}`;
      case CellType.Visited:
        return `${base} bg-gradient-to-br from-amber-400 to-amber-600 text-gray-900 border border-amber-500/50 ${selected}`;
      default:
        return base;
    }
  };

  const getCellSymbol = (type: CellType) => {
    switch (type) {
      case CellType.Start: return 'S';
      case CellType.Goal: return 'G';
      case CellType.Obstacle: return '⊡';
      case CellType.Path: return '•';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass rounded-2xl p-6 mb-6 backdrop-blur">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                🧭 MazeRunner Pro
              </h1>
              <p className="text-gray-400 mt-1">
                Advanced Navigation Algorithm Tester • Robotics Lab
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/70 text-gray-200 rounded-xl border border-gray-700 transition flex items-center gap-2"
              >
                {darkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
              <button
                onClick={() => setMaze(createEmptyMaze())}
                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-700/70 text-gray-200 rounded-xl border border-gray-700 transition flex items-center gap-2"
              >
                🔄 Reset
              </button>
            </div>
          </div>
        </div>

        {/* Controls & Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Placement Controls */}
            <div className="glass rounded-2xl p-5">
              <h2 className="font-bold text-lg mb-3 text-cyan-300 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                Placement
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode('placingStart')}
                  className={`py-3 rounded-xl font-medium transition flex flex-col items-center justify-center gap-1 ${
                    mode === 'placingStart'
                      ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-300'
                      : 'bg-gray-800/50 hover:bg-gray-700/70 text-gray-300 border border-gray-700'
                  }`}
                >
                  🟢 Start
                </button>
                <button
                  onClick={() => setMode('placingGoal')}
                  className={`py-3 rounded-xl font-medium transition flex flex-col items-center justify-center gap-1 ${
                    mode === 'placingGoal'
                      ? 'bg-rose-500/20 border border-rose-500 text-rose-300'
                      : 'bg-gray-800/50 hover:bg-gray-700/70 text-gray-300 border border-gray-700'
                  }`}
                >
                  🔴 Goal
                </button>
              </div>
            </div>

            {/* Algorithm Selector */}
            <div className="glass rounded-2xl p-5">
              <h2 className="font-bold text-lg mb-3 text-cyan-300 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                Algorithm
              </h2>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="A*">A* (Optimal)</option>
                <option value="Dijkstra">Dijkstra (Weighted)</option>
                <option value="BFS">BFS (Unweighted)</option>
                <option value="DFS">DFS (Depth-First)</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="glass rounded-2xl p-5">
              <h2 className="font-bold text-lg mb-3 text-cyan-300 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                Execution
              </h2>
              <div className="space-y-3">
                <button
                  onClick={computePath}
                  disabled={!maze.start || !maze.goal || isComputing}
                  className={`w-full py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                    !maze.start || !maze.goal
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : isComputing
                      ? 'bg-cyan-600 animate-pulse'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg'
                  }`}
                >
                  {isComputing ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-r-transparent"></span>
                      Computing...
                    </>
                  ) : (
                    '▶️ Find Optimal Path'
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setStepMode(!stepMode);
                    if (!stepMode) setCurrentStep(0);
                  }}
                  className={`w-full py-2.5 rounded-xl font-medium transition ${
                    stepMode
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-800/50 hover:bg-gray-700/70 text-gray-300 border border-gray-700'
                  }`}
                >
                  {stepMode ? '⏹️ Stop Visualization' : '⏯️ Step-by-Step'}
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="glass rounded-2xl p-5">
              <h2 className="font-bold text-lg mb-3 text-cyan-300 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                Legend
              </h2>
              <div className="space-y-2.5">
                {[
                  { color: 'bg-gradient-to-r from-emerald-500 to-emerald-700', label: 'Start (S)' },
                  { color: 'bg-gradient-to-r from-rose-500 to-rose-700', label: 'Goal (G)' },
                  { color: 'bg-gradient-to-r from-gray-700 to-gray-900', label: 'Obstacle (⊡)' },
                  { color: 'bg-gradient-to-r from-blue-500 to-cyan-500', label: 'Optimal Path (•)' },
                  { color: 'bg-gradient-to-r from-amber-400 to-amber-600', label: 'Visited Nodes' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded ${item.color}`}></div>
                    <span className="text-gray-300 text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Grid & Analytics */}
          <div className="lg:col-span-3 space-y-6">
            {/* Grid */}
            <div className="glass rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xl text-white">Interactive 10×10 Grid</h2>
                <div className="text-sm text-gray-400">
                  {maze.start && maze.goal 
                    ? `Start: (${maze.start.row}, ${maze.start.col}) → Goal: (${maze.goal.row}, ${maze.goal.col})`
                    : '👈 Set Start & Goal to begin'}
                </div>
              </div>
              
              <div className="flex justify-center">
                <div 
                  className="grid gap-1.5 p-4 rounded-xl bg-black/20"
                  style={{ 
                    gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
                    maxWidth: '520px'
                  }}
                >
                  {maze.grid.map((row, r) =>
                    row.map((_, c) => {
                      const cellType = getRenderCellType(r, c);
                      const isPath = pathResult?.path.some(p => p.row === r && p.col === c);
                      return (
                        <div
                          key={`${r}-${c}`}
                          onClick={() => handleCellClick(r, c)}
                          className={getCellClass(cellType, selectedCell?.row === r && selectedCell?.col === c, isPath)}
                          title={`Cell (${r}, ${c})`}
                        >
                          {getCellSymbol(cellType)}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="mt-4 text-center text-sm text-gray-400">
                <kbd className="px-2 py-1 bg-gray-800/50 rounded-md mx-1">Click</kbd> 
                to toggle obstacles | 
                <kbd className="px-2 py-1 bg-gray-800/50 rounded-md mx-1">Space</kbd> 
                to compute | 
                <kbd className="px-2 py-1 bg-gray-800/50 rounded-md mx-1">Esc</kbd> 
                to cancel
              </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Metrics Card */}
              <div className="glass rounded-2xl p-6">
                <h2 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-cyan-400 rounded-full"></span>
                  Performance Metrics
                </h2>
                
                {pathResult ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Metric label="Algorithm" value={algorithm} icon="⚡" />
                      <Metric 
                        label="Status" 
                        value={pathResult.found ? 'Path Found' : 'No Path'} 
                        icon={pathResult.found ? '✅' : '❌'}
                        color={pathResult.found ? 'text-emerald-400' : 'text-rose-400'}
                      />
                      <Metric label="Path Length" value={pathResult.path.length.toString()} icon="📏" />
                      <Metric label="Nodes Visited" value={pathResult.nodesExpanded.toString()} icon="🔍" />
                      <Metric label="Compute Time" value={`${pathResult.durationMs.toFixed(2)} ms`} icon="⏱️" />
                      <Metric 
                        label="Efficiency" 
                        value={`${((pathResult.path.length / pathResult.nodesExpanded) * 100).toFixed(1)}%`} 
                        icon="📈"
                      />
                    </div>
                    
                    {stepMode && pathResult.visited.length > 0 && (
                      <div className="pt-4">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                          <span>Step Visualization</span>
                          <span>{currentStep} / {pathResult.visited.length}</span>
                        </div>
                        <div className="w-full bg-gray-800/50 rounded-full h-2.5">
                          <div 
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-300" 
                            style={{ width: `${Math.min(100, (currentStep / pathResult.visited.length) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-3">📊</div>
                    <p>Run an algorithm to see performance analytics</p>
                    <p className="text-sm mt-2">Set Start & Goal, then click <strong>Find Optimal Path</strong></p>
                  </div>
                )}
              </div>

              {/* Algorithm Comparison */}
              <div className="glass rounded-2xl p-6">
                <h2 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-violet-400 rounded-full"></span>
                  Algorithm Insights
                </h2>
                
                <div className="space-y-3 text-sm">
                  <Insight 
                    algo="A*" 
                    desc="Best for most cases — uses heuristic to find shortest path efficiently" 
                    icon="🎯" 
                    active={algorithm === 'A*'} 
                  />
                  <Insight 
                    algo="Dijkstra" 
                    desc="Guarantees shortest path without heuristic — slower but exact" 
                    icon="⚖️" 
                    active={algorithm === 'Dijkstra'} 
                  />
                  <Insight 
                    algo="BFS" 
                    desc="Finds shortest path in unweighted grids — simple and reliable" 
                    icon="🔍" 
                    active={algorithm === 'BFS'} 
                  />
                  <Insight 
                    algo="DFS" 
                    desc="Explores deeply first — not optimal but memory efficient" 
                    icon="🌀" 
                    active={algorithm === 'DFS'} 
                  />
                </div>

                <div className="mt-6 pt-4 border-t border-gray-800">
                  <h3 className="font-medium text-cyan-300 mb-2">💡 Pro Tips</h3>
                  <ul className="text-gray-400 space-y-1.5 text-sm list-disc pl-5">
                    <li>Press <kbd className="bg-gray-800 px-1.5 rounded">Space</kbd> to recompute</li>
                    <li>Try dense mazes to see algorithm differences</li>
                    <li>Step mode helps understand search patterns</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          🧠 MazeRunner Pro • Advanced Pathfinding Lab • Robotics Navigation System
        </div>
      </div>
    </div>
  );
}

// Reusable components
const Metric: React.FC<{ label: string; value: string; icon: string; color?: string }> = ({ 
  label, value, icon, color = 'text-cyan-300' 
}) => (
  <div className="bg-gray-800/30 p-3 rounded-xl">
    <div className="flex items-center gap-2 mb-1">
      <span className="text-lg">{icon}</span>
      <span className="text-gray-400 text-sm">{label}</span>
    </div>
    <div className={`text-lg font-bold ${color}`}>{value}</div>
  </div>
);

const Insight: React.FC<{ algo: string; desc: string; icon: string; active: boolean }> = ({ 
  algo, desc, icon, active 
}) => (
  <div className={`p-3 rounded-xl border transition-all ${active ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-800 bg-gray-800/20'}`}>
    <div className="flex items-start gap-3">
      <span className={`text-xl ${active ? 'text-cyan-400' : 'text-gray-400'}`}>{icon}</span>
      <div>
        <div className={`font-medium ${active ? 'text-cyan-300' : 'text-gray-300'}`}>{algo}</div>
        <div className="text-gray-400 text-sm mt-1">{desc}</div>
      </div>
    </div>
  </div>
);