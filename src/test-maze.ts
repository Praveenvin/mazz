// src/test-maze.ts
import { createEmptyMaze } from './types/maze';
import { setStart, setGoal, toggleObstacle } from './utils/maze';

const maze = createEmptyMaze();
console.log('Empty maze grid[0][0]:', maze.grid[0][0]); // 0 (Empty)

const m1 = setStart(maze, 0, 0);
console.log('After setStart(0,0):', m1.grid[0][0]); // 2 (Start)

const m2 = toggleObstacle(m1, 0, 1);
console.log('After toggleObstacle(0,1):', m2.grid[0][1]); // 1 (Obstacle)

const m3 = setGoal(m2, 9, 9);
console.log('Goal position:', m3.goal); // { row: 9, col: 9 }
console.log('grid[9][9]:', m3.grid[9][9]); // 3 (Goal)