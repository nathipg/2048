const grid = [
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
];

const gridEl = document.getElementById('game-grid');

const getRand = (min, max) => {
  let range = max - min + 1;
  return Math.floor( Math.random() * range ) + min;
};

const getNewTileNumber = () => {
  const rand = getRand(1, 10);
  return rand === 10 ? 4 : 2; // 10% chance to get a 4
};

const getNewTilePosition = () => {
  let x;
  let y;

  do {
    x = getRand(0, 3);
    y = getRand(0, 3);

  } while (grid[x][y] !== null);

  return {x, y};
};

const getNewTile = () => {
  return {
    number: getNewTileNumber(),
    position: getNewTilePosition(),
  };
};

const attachTile = tile => {
  grid[tile.position.x][tile.position.y] = tile.number;
};

const renderGrid = () => {
  grid.forEach((row, x) => {
    row.forEach((cell, y) => {
      if(cell !== null) {
        const rowEl = gridEl.querySelector(`.row:nth-child(${x + 1})`);
        const cellEl = rowEl.querySelector(`.cell:nth-child(${y + 1})`);
        cellEl.innerText = cell;
      }
    });
  })
};

attachTile(getNewTile());
attachTile(getNewTile());

renderGrid();
