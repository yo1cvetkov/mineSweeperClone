// Displaying UI code :

import { TILE_STATUSES, createBoard, markTile, revealTile, checkLose, checkWin, positionMatch, markedTilesCount } from "./minesweeper.js";
let testBoard;
if (process.env.NODE_ENV !== "production" && window.testBoard) {
  testBoard = window.testBoard;
}
// Inside our CSS the size of the cell / single tile is determined based on --size variable so we need to define it inside here

const BOARD_SIZE = testBoard?.length ?? 10;
const NUMBER_OF_MINES = testBoard?.flat().filter((t) => t.mine).length ?? 10;

// Create initial board

let board = testBoard ?? createBoard(BOARD_SIZE, getMinePositions(BOARD_SIZE, NUMBER_OF_MINES));

// Select the board element
const boardElement = document.querySelector(".board");

// stores the span element with the mines left text
const minesLeftText = document.querySelector("[data-mine-count]");

const messageText = document.querySelector(".subtext");

// render function which will basically always render a new tile table and not mutate the original one

function render() {
  // We want to reset our HTML to the empty
  boardElement.innerHTML = "";

  checkGameEnd();
  // get the tile elements with the function and for each of the element, append it to the board
  getTileElements().forEach((element) => {
    boardElement.append(element);
  });

  listMinesLeft();
}

function getTileElements() {
  // get the board elements and flatMap its rows and map for each tile the tileToElement function
  return board.flatMap((row) => {
    return row.map(tileToElement);
  });
}

function tileToElement(tile) {
  // Create an element that will contain theese tiles
  const element = document.createElement("div");
  element.dataset.status = tile.status;
  element.dataset.x = tile.x;
  element.dataset.y = tile.y;
  element.textContent = tile.adjacentMinesCount || "";
  return element;
}

// Defined the addEventListener inside the global scope

boardElement.addEventListener("click", (e) => {
  if (!e.target.matches("[data-status]")) return;
  // Redefined the board with revealTile function that uses target 's x and y coords do display them as revealed
  board = revealTile(board, {
    x: parseInt(e.target.dataset.x),
    y: parseInt(e.target.dataset.y),
  });
  // render it again
  render();
});

boardElement.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  if (!e.target.matches("[data-status]")) return;
  // Redefined the board with markTile function that uses target's x and y coords do display them as marked
  board = markTile(board, {
    x: parseInt(e.target.dataset.x),
    y: parseInt(e.target.dataset.y),
  });
  // render it again
  render();
});

// Set the size CSS variable
boardElement.style.setProperty("--size", BOARD_SIZE);

render();

// set the text content of that span to the actual number of mines

function listMinesLeft() {
  // counts the marked tiles reducing filtered rows based on marked tiles and adding all of them on one another
  minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount(board);
}

function checkGameEnd() {
  const win = checkWin(board);
  const lose = checkLose(board);

  if (win || lose) {
    // stops all the events on the board
    boardElement.addEventListener("click", stopProp, { capture: true });
    boardElement.addEventListener("contextmenu", stopProp, { capture: true });
  }

  if (win) {
    messageText.textContent = "You won 😄";
  }

  if (lose) {
    messageText.textContent = "You lost 😓 Restart and try again 🤔";
    // If someone has lost then we want to reveal all the mine tiles

    board.forEach((row) => {
      row.forEach((tile) => {
        // after someone lost but has marked some of the mines they wont display at the end as mines so we need to check for marked tiles and call markTile function again to unmark them in order for all the mines to be properly marked
        if (tile.status === TILE_STATUSES.MARKED) board = markTile(board, tile);
        if (tile.mine) board = revealTile(board, tile);
      });
    });
  }
}

function stopProp(e) {
  // stops the propagation so that if the previous condition is true it will never continue to propagate to the click events
  e.stopImmediatePropagation();
}

function getMinePositions(boardSize, numberOfMines) {
  // array that will contain positions of mines
  const positions = [];

  // We can't use simple loop to generate the mines because in certain situation we may can run in situation where we have two same coords which is not what we want because we don't want overlaping entities. Instead we use while loop

  // this way if we have generated a mine that is same as one already existing we will continue to loop NOT PERFECTLY CLEAR !!!!!
  while (positions.length < numberOfMines) {
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    };

    // Check if any of random generated positions matches existing positions inside positions array

    // if (!positions.some((p) => positionMatch(p, position)))
    // same as
    if (!positions.some(positionMatch.bind(null, position))) {
      // this way position will always be bound for first argument and automatically other argument will be parsed as the second argument

      // If they dont push position to the positions array
      positions.push(position);
    }
  }

  return positions;
}

function randomNumber(size) {
  return Math.floor(Math.random() * size);
}
