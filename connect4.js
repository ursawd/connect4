/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

"use strict"; //added by PDB

//-----------------------INITIALIZATION------------------
const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

//--------------------------FUNCTIONS--------------------
/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  //? TODO: set "board" to empty HEIGHT x WIDTH matrix array
  board = Array(HEIGHT)
    .fill(null)
    .map(() => Array(WIDTH).fill(null));
} //end makeBoard()

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  //? TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector("#board");

  //? TODO: add comment for this code
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

  //? TODO: add comment for this code
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
} //end makeHtmlBoard()

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  //? TODO: write the real version of this, rather than always returning 0
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (board[y][x] === null) {
      return y;
    }
  }
  // return 2; //!left over code?
} //end findSpotForCol()

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  //? TODO: make a div and insert into correct table cell
  const tc = document.getElementById(y + "-" + x);
  const div = document.createElement("div");
  div.classList.add("piece", `p${currPlayer}`);
  tc.append(div);
} //end placeInTable()

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  setTimeout(() => {
    alert(msg);
  }, 100);
  document.querySelector("h4").classList.toggle("banner");
  document.querySelector("h4").innerText = msg;
  document
    .getElementById("column-top")
    .removeEventListener("click", handleClick);
  document.querySelector("#again").addEventListener("click", playAgain);
  function playAgain() {
    location.reload();
  }
} //end endGame()

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return; //ends handleClick processing
  }

  // place piece in board and add to HTML table
  //? TODO: add line to update in-memory board
  board[y][x] = currPlayer; //!watch
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  //? TODO: check if all cells in board are filled; if so call, call endGame
  if (board.every((row) => row.every((cell) => cell > 0))) {
    endGame("Tie Game!");
  }

  // switch players

  //? TODO: switch currPlayer 1 <-> 2
  currPlayer === 1 ? (currPlayer = 2) : (currPlayer = 1);
} //end handleClick()

/** checkForWin: check board cell-by-cell for "does a win start here?" */

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
  } //end _win()

  //? TODO: read and understand this code. Add comments to help you.

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
} // end checkForWin()
//----------------------------CONTROL----------------------------
//add listener to start button, until clicked nothing is create
makeBoard();
makeHtmlBoard();
// turn off click buttons to place a piece. Turned on in start event
document.getElementById("column-top").removeEventListener("click", handleClick);
document.querySelector("#start").addEventListener("click", startGame);

function startGame() {
  document.getElementById("column-top").addEventListener("click", handleClick);
  document.querySelector("h4").classList.toggle("banner");
  document.querySelector("#start").removeEventListener("click", startGame);
}
