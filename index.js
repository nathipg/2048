const X_AXIS = 'x';
const Y_AXIS = 'y';

const ARROW_LEFT = 'ArrowLeft';
const ARROW_RIGHT = 'ArrowRight';
const ARROW_UP = 'ArrowUp';
const ARROW_DOWN = 'ArrowDown';

const grid = [
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
];

const gridEl = document.getElementById('game-grid');


const deepClone = (e) => JSON.parse(JSON.stringify(e));

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
      const rowEl = gridEl.querySelector(`.row:nth-child(${x + 1})`);
      const cellEl = rowEl.querySelector(`.cell:nth-child(${y + 1})`);
      cellEl.innerText = cell;
      if(cell !== null) {
        
      }
    });
  });
};

const moveTiles = (grid, axis, reverseOrder = false) => {
  if(axis !== X_AXIS && axis !== Y_AXIS) {
    throw Error('Wrong axis value passed to moveTiles');
  }

  if(reverseOrder !== true && reverseOrder !== false) {
    throw Error('Wrong reverseOrder value passed to moveTiles');
  }

  const initialAxisValue = !reverseOrder ? 0 : 3;
  const finalAxisValue = !reverseOrder ? 3 : 0;
  const axisIncrement = !reverseOrder ? 1 : -1;
  const targetIncrement = !reverseOrder ? -1 : 1;
  const forCondition = !reverseOrder ? '<=' : '>=';
  const whileCondition = !reverseOrder ? '>=' : '<=';
  let somethingMove = false;

  for(let x = initialAxisValue; eval(`x ${forCondition} ${finalAxisValue}`); x += axisIncrement) {
    for(let y = initialAxisValue; eval(`y ${forCondition} ${finalAxisValue}`); y += axisIncrement) {
      const cell = grid[x][y];

      if(cell !== null) {
        let xTarget = x;
        let yTarget = y;
        let oldX = x;
        let oldY = y;

        if(axis === X_AXIS) {
          xTarget = !reverseOrder ? x - 1 : x + 1;
        } else {
          yTarget = !reverseOrder ? y - 1 : y + 1;
        }

        while(
          (
            eval(`xTarget ${whileCondition} ${initialAxisValue}`) // Valid xTarget
            && eval(`yTarget ${whileCondition} ${initialAxisValue}`) // Valid yTarget
          ) && (
            grid[xTarget][yTarget] === null // No value in target
            || grid[xTarget][yTarget] === cell // Current cell and target have the same value (should sum)
          )
        ) {
          if(grid[xTarget][yTarget] === null) {
            grid[xTarget][yTarget] = cell;
          } else {
            grid[xTarget][yTarget] = cell * 2;
          }
          
          grid[oldX][oldY] = null;

          if(axis === X_AXIS) {
            oldX = xTarget;
            xTarget = xTarget + targetIncrement;
          } else {
            oldY = yTarget;
            yTarget = yTarget + targetIncrement;
          }

          somethingMove = true;
        }
      }
    }
  }

  return somethingMove;
};

const checkGameState = () => {
    let hasNullValues = false;

    for(let x = 0; x <= 3; x++) {
      for(let y = 0; y <= 3; y++) {
        if(grid[x][y] === null) {
          hasNullValues = true;
          break;
        }
      }

      if(hasNullValues) {
        break;
      }
    }

    if(hasNullValues) {
      return;
    }

    const tempGrid = deepClone(grid);
    const moveTilesParam = [
      [Y_AXIS],
      [Y_AXIS, true],
      [X_AXIS],
      [X_AXIS, true],
    ];
    let somethingMove = false;

    moveTilesParam.forEach(param => {
      somethingMove = moveTiles(tempGrid, ...param);

      if(somethingMove) {
        return;
      }
    });

    if(!somethingMove) {
      gameOver();
    }
};

const gameOver = () => {
  console.log('GAME OVER');
};

window.addEventListener('keyup', event => {
  if([ARROW_LEFT, ARROW_RIGHT, ARROW_UP, ARROW_DOWN].indexOf(event.key) === -1) {
    return;
  }

  let somethingMove;

  switch(event.key) {
    case ARROW_LEFT:
      somethingMove = moveTiles(grid, Y_AXIS);
      break;
    case ARROW_RIGHT:
      somethingMove = moveTiles(grid, Y_AXIS, true);
      break;
    case ARROW_UP:
      somethingMove = moveTiles(grid, X_AXIS);
      break;
    case ARROW_DOWN:
      somethingMove = moveTiles(grid, X_AXIS, true);
      break;
  }

  if(somethingMove) {
    attachTile(getNewTile());
    renderGrid();
    checkGameState();
  }
}, false);

attachTile(getNewTile());
attachTile(getNewTile());

renderGrid();
