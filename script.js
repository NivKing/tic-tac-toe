document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset');
    const backToLobbyButton = document.getElementById('back-to-lobby');
    const playerXScore = document.getElementById('playerX-score');
    const playerOScore = document.getElementById('playerO-score');
    const playVsBotButton = document.getElementById('play-vs-bot');
    const playVsSelfButton = document.getElementById('play-vs-self');
    const lobbyContainer = document.querySelector('.lobby-container');
    const gameContainer = document.querySelector('.game-container');
    const popup = document.getElementById('popup');
    const winMessage = document.getElementById('win-message');
    const popupClose = document.getElementById('popup-close');

    let currentPlayer = 'X';
    let board = ['', '', '', '', '', '', '', '', ''];
    let scores = { X: 0, O: 0 };
    let vsBot = false;

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    resetButton.addEventListener('click', resetGame);
    backToLobbyButton.addEventListener('click', () => {
        lobbyContainer.style.display = 'block';
        gameContainer.style.display = 'none';
    });
    playVsBotButton.addEventListener('click', () => startGame(true));
    playVsSelfButton.addEventListener('click', () => startGame(false));
    popupClose.addEventListener('click', () => popup.classList.remove('show'));

    function startGame(bot) {
        vsBot = bot;
        lobbyContainer.style.display = 'none';
        gameContainer.style.display = 'block';
        resetGame(); // Reset board on game start
        if (vsBot && currentPlayer === 'O') {
            setTimeout(botMove, 500);
        }
    }

    function handleCellClick(event) {
        const index = event.target.dataset.index;
        if (board[index] || !gameContainer.style.display) return;
        makeMove(index);
    }

    function makeMove(index) {
        board[index] = currentPlayer;
        const cell = cells[index];
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer);

        if (checkWin(currentPlayer)) {
            scores[currentPlayer]++;
            updateScores();
            showPopup(`${currentPlayer} wins!`);
            setTimeout(resetGame, 1500); // Delay board reset
            return;
        }

        if (board.every(cell => cell)) {
            showPopup('There was a tie!');
            setTimeout(resetGame, 1500); // Delay board reset
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        if (vsBot && currentPlayer === 'O') {
            setTimeout(botMove, 500); // Delay for bot move
        }
    }

    function checkWin(player) {
        return winningCombinations.some(combination => {
            return combination.every(index => board[index] === player);
        });
    }

    function updateScores() {
        playerXScore.textContent = `Player X: ${scores.X}`;
        playerOScore.textContent = `Player O: ${scores.O}`;
    }

    function showPopup(message) {
        winMessage.textContent = message;
        popup.classList.add('show');
    }

    function botMove() {
        const bestMove = getBestMove();
        makeMove(bestMove);
    }

    function getBestMove() {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, 0, false);
                board[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }

    function minimax(board, depth, isMaximizing) {
        let result = checkWin('O');
        if (result) return 10;
        result = checkWin('X');
        if (result) return -10;
        if (board.every(cell => cell !== '')) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('X', 'O');
        });
        currentPlayer = 'X';
        updateScores(); // Ensure scores are updated
    }
});
