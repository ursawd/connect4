/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

"use strict"; //added by PDB

//-----------------------INITIALIZATION------------------
const WIDTH = 7; // number of board squares across
const HEIGHT = 6; // number of board squares vertically

let currPlayer = 1; // active player: 1 or 2
let board = []; // will be array of rows, each row is array of cells  (board[y][x])

//--------------------------FUNCTIONS--------------------
/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // makes 2D array filled w/ null.
  board = Array(HEIGHT)
    .fill(null)
    .map(() => Array(WIDTH).fill(null));
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  const htmlBoard = document.querySelector("#board");
  // create table tr for selection top row
  const top = document.createElement("tr");
  // insert id into top row
  top.setAttribute("id", "column-top");
  // add event listener to top row
  top.addEventListener("click", handleClick);

  // create top cells (td's), insert id, append to table as top row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    headCell.innerText = "Click Here";
    top.append(headCell);
  }
  htmlBoard.append(top);

  //create row, create cells (td's) in row, append cells to
  //row, append to to table
  for (let y = 0; y < HEIGHT; y++) {
    //create row
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td"); //create cell
      cell.setAttribute("id", `${y}-${x}`); //insert id = coord of cell
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (board[y][x] === null) {
      return y;
    }
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const tc = document.getElementById(y + "-" + x);
  const div = document.createElement("div");
  div.classList.add("piece", `p${currPlayer}`);
  tc.append(div);
}

/** endGame: announce game end */

function endGame(msg) {
  document.querySelector("h4").classList.toggle("banner");
  document.querySelector("h4").innerText = msg;
  document
    .getElementById("column-top")
    .removeEventListener("click", handleClick);
  document
    .querySelector("#again")
    .addEventListener("click", () => location.reload());
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  // using == instead of === checks for both undefined and null
  if (y == null) {
    return;
  }

  // place piece in board and add to HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // any used cell should = 1 or 2.
  if (board.every((row) => row.every((cell) => cell > 0))) {
    endGame("Tie Game!");
  }

  // switch players

  currPlayer === 1 ? (currPlayer = 2) : (currPlayer = 1);
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
/** _win: sliding mask defining win path*/

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT && // Restrict check to only coord on board
        x >= 0 &&
        x < WIDTH && // Restrict check to only coord on board
        board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) {
    // -Traverse rows
    for (let x = 0; x < WIDTH; x++) {
      // -Traverse columns in row
      let horiz = [
        // -Make array of board coords
        [y, x], //  that are 4 contiguous elements.
        [y, x + 1], //  Used as means to define coords
        [y, x + 2], //  used to check for winner in
        [y, x + 3], //  _win() function above. Will contain
      ]; //  invalid coords corrected by _win()
      let vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      let diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      let diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

//starts game by activation 'click here' buttons
function startGame() {
  document.getElementById("column-top").addEventListener("click", handleClick);
  document.querySelector("h4").classList.toggle("banner");
  document.querySelector("#start").removeEventListener("click", startGame);
}

//----------------------------CONTROL-------------------------------
//
makeBoard();
makeHtmlBoard();
// turn off click buttons to place a piece. Turned on in start event
document.getElementById("column-top").removeEventListener("click", handleClick);
// add event listener to start button. only button active
document.querySelector("#start").addEventListener("click", startGame);
