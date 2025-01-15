import { expect, test, describe } from 'vitest'
import { createGrid, randomCell, ruleOverpopulation, ruleUnderpopulation, ruleReproduction, getTotalNeighbours, getSubGrid, advanceCellGenerationForGrid, type Grid } from './gol';

describe("createGrid", () => {
  test('it returns a square grid', () => {
    const grid10by10 = createGrid(10);
    expect(grid10by10.length).toBe(10);
    expect(grid10by10[0].length).toBe(10);
    console.table(grid10by10);

  });
  test('it returns a rectangular grid', () => {
    const grid5by2 = createGrid(5, 2);
    expect(grid5by2.length).toBe(5);
    expect(grid5by2[0].length).toBe(2);
  });

  test('it will use a cellCreator method to generate the cells', () => {
    const grid10by10_gen1 = createGrid(10, 10);
    const grid10by10_gen2 = createGrid(10, 10, advanceCellGenerationForGrid(grid10by10_gen1));

    expect(grid10by10_gen1).not.toEqual(grid10by10_gen2);

  });
})

describe('randomCell', () => {
  test('it returns 0 or 1', () => {
    expect([0, 1]).toContain(randomCell(0, 0));
  })
})

describe('ruleOverpopulation', () => {
  test('A cell with more than 3 live neighbours dies of overcrowding', () => {
    expect(ruleOverpopulation(1, 4)).toBe(true);
    expect(ruleOverpopulation(1, 10)).toBe(true);
    expect(ruleOverpopulation(0, 4)).toBe(false);
    expect(ruleOverpopulation(1, 3)).toBe(false);
    expect(ruleOverpopulation(1, 0)).toBe(false);
  });
})

describe('ruleUnderpopulation', () => {
  test('A cell with fewer than two live neighbours dies of under-population', () => {
    expect(ruleUnderpopulation(1, 1)).toBe(true);
    expect(ruleUnderpopulation(1, 0)).toBe(true);
    expect(ruleUnderpopulation(1, 2)).toBe(false);
    expect(ruleUnderpopulation(1, 4)).toBe(false);
    expect(ruleUnderpopulation(0, 1)).toBe(false);
    expect(ruleUnderpopulation(0, 0)).toBe(false);
  });
})

describe('ruleReproduction', () => {
  test('An empty cell with exactly 3 live neighbours "comes to life"', () => {
    expect(ruleReproduction(0, 3)).toBe(true);
    expect(ruleReproduction(0, 4)).toBe(false);
    expect(ruleReproduction(0, 2)).toBe(false);
    expect(ruleReproduction(0, 0)).toBe(false);
    expect(ruleReproduction(1, 3)).toBe(false);
  });
})

describe('getSubgrid', () => {
  const exampleGrid: Grid = [
    [0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
  ]
  test('it returns the correct subgrid', () => {
    expect(getSubGrid(exampleGrid, [0, 0], 3, 3)).toEqual([[0, 0, 1], [1, 1, 1], [0, 0, 0]]);
    expect(getSubGrid(exampleGrid, [2, 2], 3, 3)).toEqual([[0, 0, 0], [1, 0, 1], [0, 1, 0]]);
  })
})

describe('getTotalNeighbours', () => {
  test('it returns the correct number of living neighbours', () => {
    expect(getTotalNeighbours([[0, 0, 0], [1, 0, 0], [0, 0, 1]], 1, 1)).toBe(2);
  });
  test('it handles a cell near the edge', () => {
    expect(getTotalNeighbours([[0, 0, 0], [1, 0, 0], [0, 0, 1]], 0, 0)).toBe(1);
  });
});

describe('advanceCellGenerationForGrid', () => {
  test('it correctly returns the new state for a cell', () => {
    const exampleGrid: Grid = [
      [0, 0, 1, 0, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 0, 0, 0],
      [1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0],
    ];
    const cellCreator = advanceCellGenerationForGrid(exampleGrid);

    expect(cellCreator(0, 0)).toBe(0);
    expect(cellCreator(3, 3)).toBe(1);
    expect(cellCreator(1, 2)).toBe(0);
  });
});

// describe('golGenerator', () => {
//   const gol = gameOfLife();
//   console.table(gol.next().value);
//   console.table(gol.next().value);
//   console.table(gol.next().value);
//   console.table(gol.next().value);
//   console.table(gol.next().value);
//   console.table(gol.next().value);
//   console.table(gol.next().value);
//   console.table(gol.next().value);
//   console.table(gol.next().value);
//   console.table(gol.next().value);
// })
