class Game {
	constructor(p1, p2, HEIGHT = 6, WIDTH = 7){
		this.HEIGHT = HEIGHT;
		this.WIDTH = WIDTH;
		this.board = [];
		this.players = [p1, p2];
		this.currPlayer = p1;
		this.gameOver = false;
		this.makeBoard();
		this.makeHtmlBoard();
	}

	makeBoard() {
		for (let y = 0; y < this.HEIGHT; y++) {
			this.board.push(Array.from({ length: this.WIDTH }));
		}
	}

	/** makeHtmlBoard: make HTML table and row of column tops. */
	makeHtmlBoard() {
		const htmlBoard = document.getElementById('board');
		htmlBoard.innerHTML = "";

		// make column tops (clickable area for adding a piece to that column)
		const top = document.createElement('tr');
		top.setAttribute('id', 'column-top');
		this.handleGameClick = this.handleClick.bind(this);
    
    top.addEventListener("click", this.handleGameClick);
	
		for (let x = 0; x < this.WIDTH; x++) {
			const headCell = document.createElement('td');
			headCell.setAttribute('id', x);
			top.append(headCell);
		}
	
		htmlBoard.append(top);
	
		// make main part of board
		for (let y = 0; y < this.HEIGHT; y++) {
			const row = document.createElement('tr');
	
			for (let x = 0; x < this.WIDTH; x++) {
				const cell = document.createElement('td');
				cell.setAttribute('id', `${y}-${x}`);
				row.append(cell);
			}
	
			htmlBoard.append(row);
		}
	}

	/** findSpotForCol: given column x, return top empty y (null if filled) */
	findSpotForCol(x) {
		for (let y = this.HEIGHT - 1; y >= 0; y--) {
			if (!this.board[y][x]) {
				return y;
			}
		}
		return null;
	}

	/** placeInTable: update DOM to place piece into HTML table of board */
	placeInTable(y, x) {
		const piece = document.createElement('div');
		piece.classList.add('piece', "_" + y);
		piece.style.backgroundColor = this.currPlayer.color;
		const spot = document.getElementById(`${y}-${x}`);
		spot.append(piece);
	}

	/** endGame: announce game end */
	endGame(msg) {
		setTimeout(() => {
			alert(msg)
		}, 500);
	}

	/** handleClick: handle click of column top to play piece */

	handleClick(evt) {
		// prevents game from continuing if over
		if (this.gameOver === true) return;
	
		// get x from ID of clicked cell
		const x = +evt.target.id;
	
		// get next spot in column (if none, ignore click)
		const y = this.findSpotForCol(x);
		if (y === null) {
			return;
		}
	
		// place piece in board and add to HTML table
		this.board[y][x] = this.currPlayer;
		this.placeInTable(y, x);
		
		// check for win
		if (this.checkForWin()) {
			this.gameOver = true;
			return this.endGame(`Player ${this.currPlayer.player} won!`);
		}
		
		// check for tie
		if (this.board.every(row => row.every(spot => spot))) {
			this.gameOver = true;
			return this.endGame('Game is a Tie');
		}
			
		// switch players
		this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
	}
	
	/** checkForWin: check board cell-by-cell for "does a win start here?" */
	checkForWin() {
			// Check four cells to see if they're all color of current player
			//  - cells: list of four (y, x) cells
			//  - returns true if all are legal coordinates & all match currPlayer
		const _win = cells => cells.every(
			([y, x]) =>
				y >= 0 &&
				y < this.HEIGHT &&
				x >= 0 &&
				x < this.WIDTH &&
				this.board[y][x] === this.currPlayer
		);
	
	
		for (let y = 0; y < this.HEIGHT; y++) {
			for (let x = 0; x < this.WIDTH; x++) {
				// get "check list" of 4 cells (starting here) for each of the different
				// ways to win
				const horiz  = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
				const vert   = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
				const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
				const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
	
				// find winner (only checking each win-possibility as needed)
				if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
					return true;
				}
			}
		}
	}
}

class Player {
	constructor(color, player){
		this.color = color;
		this.player = player;
	}
}

document.getElementById("new-game").addEventListener("click", () => {
	const P1 = new Player(document.getElementById('p1-color').value, 1)
	const P2 = new Player(document.getElementById('p2-color').value, 2)
	new Game(P1,P2);
});



