export type Row = number[];
export type Grid = Row[];
type CellCreator = (row: number, column: number) => number;
type CellRule = (cell: number, totalNeighbours: number) => boolean;

export function randomCell(_row: number, _column: number) {
  return Math.max(0, Math.round(Math.random() - 0.3));
}

export function createGrid(
  rows: number,
  columns: number = rows,
  createCell: CellCreator = randomCell
): Grid {
  const grid: Grid = [];
  for (let row = 0; row < rows; row++) {
    grid[row] = [];
    for (let column = 0; column < columns; column++) {
      grid[row][column] = createCell(row, column);
    }
  }
  return grid;
}

export const ruleOverpopulation: CellRule = (
  cell: number,
  totalNeighbours: number
) => cell === 1 && totalNeighbours > 3;

export const ruleUnderpopulation: CellRule = (
  cell: number,
  totalNeighbours: number
) => cell === 1 && totalNeighbours < 2;

export const ruleReproduction: CellRule = (
  cell: number,
  totalNeighbours: number
) => cell === 0 && totalNeighbours === 3;

export const ruleReproductionLifeFindsAWay: CellRule = (
  cell: number,
  totalNeighbours: number
) => cell === 0 && (totalNeighbours === 3 || (totalNeighbours === 2 && Math.random() < 0.0001));

export const shouldCellUpdate: CellRule = (
  cell: number,
  totalNeighbours: number
) => {
  return [ruleReproduction, ruleOverpopulation, ruleUnderpopulation]
    .map((rule) => rule(cell, totalNeighbours))
    .includes(true);
};

export function getSubGrid(
  grid: Grid,
  topLeft: [row: number, column: number],
  height: number,
  width: number
): Grid {
  return grid
    .slice(Math.max(0, topLeft[0]), topLeft[0] + height)
    .map((r) => r.slice(Math.max(0, topLeft[1]), topLeft[1] + width));
}

export function reduceGrid(total: number, item: Row | number): number {
  return typeof item === "number"
    ? total + item
    : item.reduce(reduceGrid, total);
}

export function getTotalNeighbours(grid: Grid, row: number, column: number) {
  const cell = grid[row][column];
  const neighbours = getSubGrid(grid, [row - 1, column - 1], 3, 3);
  const total = neighbours.reduce(reduceGrid, 0 - cell);
  return total;
}

export function advanceCellGenerationForGrid(grid: Grid): CellCreator {
  return (row: number, column: number) => {
    const cell = grid[row][column];
    const totalNeighbours = getTotalNeighbours(grid, row, column);
    return shouldCellUpdate(cell, totalNeighbours) ? Number(!cell) : cell;
  };
}

export function advanceGrid(grid: Grid): Grid {
  return createGrid(grid.length, grid[0]?.length || 0, advanceCellGenerationForGrid(grid));
}

export function* gameOfLife(
  settings: { height?: number; width?: number } = {}
) {
  const { width = 10, height = 10 } = settings;
  let grid = createGrid(height, width);
  yield grid;
  while (true) {
    grid = createGrid(height, width, advanceCellGenerationForGrid(grid));
    yield grid;
  }
}
