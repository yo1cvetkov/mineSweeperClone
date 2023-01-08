import { times, range } from "lodash/fp";

// Logic behind the game :

// Theese are the statuses that has predefined styles inside css and also meaning as a status (state) of tiles
export const TILE_STATUSES = {
  HIDDEN: "hidden",
  MARKED: "marked",
  MINE: "mine",
  NUMBER: "number",
};

export function createBoard(boardSize, minePositions) {
  // For the board structure we use array of arrays

  // In this format of displaying the board the parent array is the whole board and each row is the new child array that has listed numbers from left to right according to the schedule of the mines.
  const board = [];
  // get position of a mine based on board size and number of mines
  // It will be displayed as x,y coords same as in the board array

  // After that we gonna loop through the x direction

  return times((x) => {
    return times((y) => {
      return {
        x,
        y,
        mine: minePositions.some(positionMatch.bind(null, { x, y })),
        status: TILE_STATUSES.HIDDEN,
      };
    }, boardSize);
  }, boardSize);
}

export function markedTilesCount(board) {
  return board.reduce((count, row) => {
    return count + row.filter((tile) => tile.status === TILE_STATUSES.MARKED).length;
  }, 0);
}

export function markTile(board, { x, y }) {
  const tile = board[x][y];
  // Check if the clicked tile is not hidden or not marked means that is either a number or mine
  if (tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.MARKED) return board;
  // check if the status is marked  and if it is set it to hidden
  if (tile.status === TILE_STATUSES.MARKED) {
    return replaceTile(board, { x, y }, { ...tile, status: TILE_STATUSES.HIDDEN });
  } else {
    return replaceTile(board, { x, y }, { ...tile, status: TILE_STATUSES.MARKED });
  }
}

function replaceTile(board, position, newTile) {
  return board.map((row, x) => {
    return row.map((tile, y) => {
      if (positionMatch(position, { x, y })) {
        return newTile;
      }
      return tile;
    });
  });
}

export function revealTile(board, { x, y }) {
  const tile = board[x][y];
  if (tile.status !== TILE_STATUSES.HIDDEN) return board;

  // if the cliked tile is a mine set its status to mine and immediately exit out the function
  if (tile.mine) {
    return replaceTile(board, { x, y }, { ...tile, status: TILE_STATUSES.MINE });
  }

  tile.status = TILE_STATUSES.NUMBER;
  // this is neccessarry because of the fact that in order for number of surrounding mines do display we need to now status of nearby tiles
  const adjacentTiles = nearbyTiles(board, tile);

  // Get the nearby mines
  const mines = adjacentTiles.filter((t) => t.mine);

  const newBoard = replaceTile(board, { x, y }, { ...tile, status: TILE_STATUSES.NUMBER, adjacentMinesCount: mines.length });

  if (mines.length === 0) {
    return adjacentTiles.reduce((b, t) => {
      return revealTile(b, t);
    }, newBoard);
  }

  return newBoard;
}

export function checkLose(board) {
  return board.some((row) => {
    return row.some((tile) => {
      return tile.status === TILE_STATUSES.MINE;
    });
  });
}

export function checkWin(board) {
  return board.every((row) => {
    return row.every((tile) => {
      // it check are there every tile has the status of number of status of mine that is either hidden or marked
      return tile.status === TILE_STATUSES.NUMBER || (tile.mine && (tile.status === TILE_STATUSES.HIDDEN || tile.status === TILE_STATUSES.MARKED));
    });
  });
}

export function positionMatch(a, b) {
  // It checks are the inputed coords same as existing coords

  return a.x === b.x && a.y === b.y;
}

function nearbyTiles(board, { x, y }) {
  // array that will contain adjacent tiles based on the 3x3 sample
  const offsets = range(-1, 2);

  return offsets
    .flatMap((xOffset) => {
      return offsets.map((yOffset) => {
        return board[x + xOffset]?.[y + yOffset];
      });
    })
    .filter((tile) => tile !== null);
}
