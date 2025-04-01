class MegaTicTacToe {
    constructor() {
        this.currentPlayer = 'X';
        this.megaGrid = Array(9).fill(null).map(() => Array(9).fill(null));
        this.miniGridWinners = Array(9).fill(null);
        this.activeMiniGrid = null;
        this.gameStatus = document.getElementById('game-status');
        this.megaGridElement = document.getElementById('mega-grid');
        this.resetButton = document.getElementById('reset-button');
        
        this.initializeGame();
        this.setupEventListeners();
        this.updateValidMoves();
    }

    initializeGame() {
        this.megaGridElement.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const miniGrid = document.createElement('div');
            miniGrid.className = 'mini-grid';
            miniGrid.dataset.index = i;
            
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('button');
                cell.className = 'cell';
                cell.dataset.miniIndex = i;
                cell.dataset.cellIndex = j;
                cell.addEventListener('click', () => this.handleCellClick(i, j));
                miniGrid.appendChild(cell);
            }
            
            this.megaGridElement.appendChild(miniGrid);
        }
    }

    setupEventListeners() {
        this.resetButton.addEventListener('click', () => this.resetGame());
    }

    handleCellClick(miniGridIndex, cellIndex) {
        if (this.isValidMove(miniGridIndex, cellIndex)) {
            this.makeMove(miniGridIndex, cellIndex);
            this.updateUI();
            
            if (this.checkMiniGridWinner(miniGridIndex)) {
                this.miniGridWinners[miniGridIndex] = this.currentPlayer;
                this.updateMiniGridStatus(miniGridIndex);
            }
            
            if (this.checkGameWinner()) {
                this.gameStatus.textContent = `Player ${this.currentPlayer} wins the game!`;
                return;
            }
            
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.gameStatus.textContent = `Player ${this.currentPlayer}'s turn`;
            this.updateValidMoves();
        }
    }

    isValidMove(miniGridIndex, cellIndex) {
        if (this.miniGridWinners[miniGridIndex] !== null) return false;
        if (this.megaGrid[miniGridIndex][cellIndex] !== null) return false;
        if (this.activeMiniGrid !== null && this.activeMiniGrid !== miniGridIndex) return false;
        return true;
    }

    makeMove(miniGridIndex, cellIndex) {
        this.megaGrid[miniGridIndex][cellIndex] = this.currentPlayer;
        this.activeMiniGrid = cellIndex;
    }

    updateUI() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = this.megaGridElement.children[i].children[j];
                const value = this.megaGrid[i][j];
                cell.textContent = value || '';
                cell.className = 'cell' + (value ? ` ${value.toLowerCase()}` : '');
            }
        }
        this.updateValidMoves();
    }

    updateValidMoves() {
        // Reset all cells and mini-grids
        for (let i = 0; i < 9; i++) {
            const miniGrid = this.megaGridElement.children[i];
            miniGrid.classList.remove('invalid', 'active');
            
            for (let j = 0; j < 9; j++) {
                const cell = miniGrid.children[j];
                cell.classList.remove('invalid');
            }
        }

        // Mark invalid mini-grids
        for (let i = 0; i < 9; i++) {
            if (this.miniGridWinners[i] !== null) {
                this.megaGridElement.children[i].classList.add('invalid');
            }
        }

        // Mark active mini-grid
        if (this.activeMiniGrid !== null) {
            const activeMiniGrid = this.megaGridElement.children[this.activeMiniGrid];
            activeMiniGrid.classList.add('active');
            
            // Mark invalid cells in active mini-grid
            for (let j = 0; j < 9; j++) {
                const cell = activeMiniGrid.children[j];
                if (this.megaGrid[this.activeMiniGrid][j] !== null) {
                    cell.classList.add('invalid');
                }
            }
        }
    }

    checkMiniGridWinner(miniGridIndex) {
        const grid = this.megaGrid[miniGridIndex];
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
                return true;
            }
        }
        return false;
    }

    updateMiniGridStatus(miniGridIndex) {
        const miniGrid = this.megaGridElement.children[miniGridIndex];
        miniGrid.classList.add('winner');
    }

    checkGameWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (this.miniGridWinners[a] && 
                this.miniGridWinners[a] === this.miniGridWinners[b] && 
                this.miniGridWinners[a] === this.miniGridWinners[c]) {
                return true;
            }
        }
        return false;
    }

    resetGame() {
        this.megaGrid = Array(9).fill(null).map(() => Array(9).fill(null));
        this.miniGridWinners = Array(9).fill(null);
        this.activeMiniGrid = null;
        this.currentPlayer = 'X';
        this.gameStatus.textContent = `Player ${this.currentPlayer}'s turn`;
        this.initializeGame();
        this.updateValidMoves();
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new MegaTicTacToe();
}); 