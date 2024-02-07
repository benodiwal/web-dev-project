// Game configuration
const rows = 6;
const columns = 7;
let currentPlayer = 1; 
const gameBoard = Array.from({ length: rows }, () => Array(columns).fill(null));
let timerInterval;
let currentPlayerTime = 30;
let currentPoints1 = 0;
let currentPoints2 = 0;

// Elements
const timeElement = document.querySelector('.timeTurn');
const timerElement = document.querySelector('.timer');
const currentPlayerElement = document.querySelector('.currentPlayer');
const markerRedElement = document.querySelector('.marker-red');
const markerYellowElement = document.querySelector('.marker-yellow');
const currentPoints1Element = document.querySelector('.pointsPlayer1');
const currentPoints2Element = document.querySelector('.pointsPlayer2');
const winnerElement = document.querySelector('.winner');
const backgroundWinnerElement = document.querySelector('.backgroundGameBoardStart2');

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.button-restart').addEventListener('click', restart);
    document.querySelector('.button-restart-ingame').addEventListener('click', restart);
    document.querySelector('.button-again').addEventListener('click', playAgain);
});

// Initialize game board
function displayBoard() {
    const gameBoardElement = document.querySelector('.board');
    gameBoardElement.innerHTML = '';
    document.addEventListener('mousemove', positionMarkerOnMouseMove);

    for (let row = 0; row < rows; row++) {
        const rowElement = document.createElement('div');
        rowElement.className = 'row';

        for (let col = 0; col < columns; col++) {
            const columnElement = document.createElement('div');
            columnElement.className = 'column';
            columnElement.appendChild(gameBoard[row][col] !== null ? gameBoard[row][col] : document.createTextNode(''));
            columnElement.addEventListener('click', () => {
                if (!(cpu === 1 && currentPlayer === 2)) {
                    const selectedCol = col;
                    const nextFreeRow = findNextFreeRow(selectedCol);

                    if (nextFreeRow !== -1) {
                        addStone(nextFreeRow, selectedCol, currentPlayer);
                        currentPlayerTime = 30;
                        startTimer();
                        displayBoard();
                        positionMarker(selectedCol);
                    }
                }
            });
            columnElement.style.cursor = 'pointer';
            rowElement.appendChild(columnElement);
        }

        gameBoardElement.appendChild(rowElement);
    }
    
    clearInterval(cpuTimerInterval); // Clear the existing CPU timer interval
    if (cpu === 1 && currentPlayer === 2) {
        cpuTurn();
    }

    playerTurn(currentPlayer);
}


// Player Turn Function
function playerTurn(player) {
    // Set background color based on the current player
    timeElement.style.backgroundColor = player === 1 ? 'rgba(253, 102, 135, 1)' : 'rgba(255, 206, 103, 1)';
    // Get the viewport width
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

    // Check if the viewport width is less than or equal to 769 pixels
    if (viewportWidth >= 769) {
        if (player === 1) {
            markerYellowElement.style.display = 'none';
            markerRedElement.style.display = 'flex';
        } else {
            markerRedElement.style.display = 'none';
            markerYellowElement.style.display = 'flex';
        }
    }

    // Update player and timer information
    if (cpu === 0 || (cpu === 1 && player === 1)) {
        currentPlayerElement.textContent = `PLAYER ${player}'S TURN`;
    } else if (cpu === 1 && player === 2) {
        currentPlayerElement.textContent = `CPU'S TURN`;
        markerRedElement.style.display = 'none';
        markerYellowElement.style.display = 'none';
    }

    timerElement.textContent = `${currentPlayerTime}s`;
}

// CPU Logic
let cpuTimerInterval; // Declare a separate timer interval for CPU turn

function cpuTurn() {
    if (currentPlayer === 2) {

        const delay = Math.floor(Math.random() * (6000 - 1000 + 1)) + 1000;

        cpuTimerInterval = setTimeout(() => {
            const selectedCol = Math.floor(Math.random() * columns);
            const nextFreeRow = findNextFreeRow(selectedCol);

            if (nextFreeRow !== -1) {
                addStone(nextFreeRow, selectedCol, currentPlayer);
                currentPlayerTime = 30;
                startTimer();
                displayBoard();
            }
        }, delay);
    }
}


// Marker Positioning
const boardElement = document.querySelector('.board');

function positionMarkerOnMouseMove(event) {
    const verticalOffset = 12;
    const horizontalOffset = -11;

    const mouseX = event.clientX - boardElement.getBoundingClientRect().left;
    const mouseY = event.clientY - boardElement.getBoundingClientRect().top;

    const selectedCol = Math.floor(mouseX / (boardElement.offsetWidth / columns));

    // Check if selectedCol is a valid index
    if (selectedCol >= 0 && selectedCol < columns) {
        const selectedColumn = boardElement.querySelector(`.column:nth-child(${selectedCol + 1})`);
        const offsetLeft = selectedColumn.offsetLeft;
        const offsetTop = selectedColumn.offsetTop;

        markerRedElement.style.left = `${offsetLeft - horizontalOffset}px`;
        markerRedElement.style.top = `${offsetTop - markerRedElement.offsetHeight - verticalOffset}px`;

        markerYellowElement.style.left = `${offsetLeft - horizontalOffset}px`;
        markerYellowElement.style.top = `${offsetTop - markerYellowElement.offsetHeight - verticalOffset}px`;
    }
}


function positionMarker(selectedCol) {
    const verticalOffset = 12;
    const horizontalOffset = -11;

    const selectedColumn = boardElement.querySelector(`.column:nth-child(${selectedCol + 1})`);
    const offsetLeft = selectedColumn.offsetLeft;
    const offsetTop = selectedColumn.offsetTop;


    if (currentPlayer === 1) {
        markerRedElement.style.left = `${offsetLeft - horizontalOffset}px`;
        markerRedElement.style.top = `${offsetTop - markerRedElement.offsetHeight - verticalOffset}px`;
    } else if (cpu === 0 && currentPlayer === 2) {
        markerYellowElement.style.left = `${offsetLeft - horizontalOffset}px`;
        markerYellowElement.style.top = `${offsetTop - markerRedElement.offsetHeight - verticalOffset}px`;
    }
}


// Restart Function
function restart() {
    const backgroundIngameMenuElement1 = document.querySelector('.backgroundIngameMenu');
    const backgroundGameBoardStart1Element1 = document.querySelector('.backgroundGameBoardStart1');

    // Reset display styles
    backgroundIngameMenuElement1.style.display = 'none';
    backgroundGameBoardStart1Element1.style.display = 'flex';

    // Reset scores
    currentPoints1 = 0;
    currentPoints1Element.innerHTML = currentPoints1;

    currentPoints2 = 0;
    currentPoints2Element.innerHTML = currentPoints2;

    winnerElement.style.display = 'none';
    timeElement.style.display = 'flex';

    currentPlayerTime = 30;
    currentPlayer = 1;

    backgroundWinnerElement.style.backgroundColor = 'rgba(92, 45, 213, 1)';

    // Reset game board
    gameBoard.forEach(row => row.fill(null));

    // Update the board display
    displayBoard();
}

// Play Again Function
function playAgain() {
    winnerElement.style.display = 'none';
    timeElement.style.display = 'flex';

    backgroundWinnerElement.style.backgroundColor = 'rgba(92, 45, 213, 1)';

    currentPlayerTime = 30;

    // Reset game board
    gameBoard.forEach(row => row.fill(null));
    // Update the board display
    displayBoard();
}

// Function to add a stone in the next free row
function addStone(row, col, player) {
    // Create a new div element for the stone
    if (!checkWin(1) && !checkWin(2)) {
        const stoneElement = document.createElement('div');
        stoneElement.className = player === 1 ? 'stone1' : 'stone2';

        // Append the div element to the DOM
        const columnElement = document.querySelector(`.row:nth-child(${row + 1}) .column:nth-child(${col + 1})`);
        columnElement.appendChild(stoneElement);

        // Set the div element in the gameBoard matrix
        gameBoard[row][col] = stoneElement;

        positionMarker(col);

        // Check for a winner
        if (checkWin(player)) {
            timeElement.style.display = 'none';
            winnerElement.style.display = 'flex';
            const h2Element = winnerElement.querySelector('h2');
            if (cpu === 0) {
                h2Element.textContent = `PLAYER ${player}`;
            }
            if (cpu === 1 && currentPlayer === 1) {
                h2Element.textContent = `PLAYER ${player}`;
            } else if (cpu === 1 && currentPlayer === 2) {
                h2Element.textContent = 'THE CPU';
            }
            if (player === 1) {
                backgroundWinnerElement.style.backgroundColor = 'rgba(253, 102, 135, 1)';
                currentPoints1 += 1;
                currentPoints1Element.innerHTML = currentPoints1;
            } else {
                backgroundWinnerElement.style.backgroundColor = 'rgba(255, 206, 103, 1)';
                currentPoints2Element.innerHTML = currentPoints2 += 1;
            }
        }
        
        currentPlayer = currentPlayer === 1 ? 2 : 1;
    }    

    if (isBoardFull()) {
        timeElement.style.display = 'none';
        winnerElement.style.display = 'flex';
        const h2Element = winnerElement.querySelector('h2');
        const h1Element = winnerElement.querySelector('h1');
        h2Element.textContent = 'WE HAVE A';
        h1Element.textContent = 'TIE';
    }
}

function isBoardFull() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (gameBoard[row][col] === null) {
                return false;
            }
        }
    }
    return true;
}



// Funktion zum Suchen der nächsten freien Zeile in einer Spalte
function findNextFreeRow(col) {
    for (let row = rows - 1; row >= 0; row--) {
        if (gameBoard[row][col] === null) {
            return row;
        }
    }
    return -1;
}

// Funktion zum Starten des Timers
function startTimer() {
    // Überprüfe, ob der Timer bereits läuft
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            currentPlayerTime--;
            const timerElement = document.querySelector('.timer');
            const currentPlayerElement = document.querySelector('.currentPlayer');
            if(cpu === 0){
                currentPlayerElement.textContent = `PLAYER ${currentPlayer}'S TURN`;
            } 
            if (cpu === 1 && currentPlayer === 1) {
                currentPlayerElement.textContent = `PLAYER ${currentPlayer}'S TURN`;
            } else if(cpu === 1 && currentPlayer === 2) {
                currentPlayerElement.textContent = `CPU'S TURN`;
            }
            timerElement.textContent = `${currentPlayerTime}s`;

            if (currentPlayerTime === 0) {
                // Timer abgelaufen, wechsle zum nächsten Spieler
                currentPlayer = currentPlayer === 1 ? 2 : 1;
                currentPlayerTime = 30;
                clearInterval(timerInterval);
                timerInterval = null; // Setze timerInterval zurück
                startTimer();
                displayBoard();
            }
        }, 1000); // Intervall von 1 Sekunde
    }
}

// Funktion zum Überprüfen, ob ein Spieler gewonnen hat
function checkWin(player) {
    // Überprüfe horizontale Linien
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col <= columns - 4; col++) {
            if (
                gameBoard[row][col]?.classList.contains(`stone${player}`) &&
                gameBoard[row][col + 1]?.classList.contains(`stone${player}`) &&
                gameBoard[row][col + 2]?.classList.contains(`stone${player}`) &&
                gameBoard[row][col + 3]?.classList.contains(`stone${player}`)
            ) {
                gameBoard[row][col].classList.add(`winningStone${player}`);
                gameBoard[row][col + 1]?.classList.add(`winningStone${player}`);
                gameBoard[row][col + 2]?.classList.add(`winningStone${player}`);
                gameBoard[row][col + 3]?.classList.add(`winningStone${player}`);
                return true;
            }
        }
    }

    // Überprüfe vertikale Linien
    for (let col = 0; col < columns; col++) {
        for (let row = 0; row <= rows - 4; row++) {
            if (
                gameBoard[row][col]?.classList.contains(`stone${player}`) &&
                gameBoard[row + 1][col]?.classList.contains(`stone${player}`) &&
                gameBoard[row + 2][col]?.classList.contains(`stone${player}`) &&
                gameBoard[row + 3][col]?.classList.contains(`stone${player}`)
            ) {
                gameBoard[row][col].classList.add(`winningStone${player}`);
                gameBoard[row + 1][col]?.classList.add(`winningStone${player}`);
                gameBoard[row + 2][col]?.classList.add(`winningStone${player}`);
                gameBoard[row + 3][col]?.classList.add(`winningStone${player}`);
                return true;
            }
        }
    }

    // Überprüfe diagonale Linien (von links oben nach rechts unten)
    for (let row = 0; row <= rows - 4; row++) {
        for (let col = 0; col <= columns - 4; col++) {
            if (
                gameBoard[row][col]?.classList.contains(`stone${player}`) &&
                gameBoard[row + 1][col + 1]?.classList.contains(`stone${player}`) &&
                gameBoard[row + 2][col + 2]?.classList.contains(`stone${player}`) &&
                gameBoard[row + 3][col + 3]?.classList.contains(`stone${player}`)
            ) {
                gameBoard[row][col].classList.add(`winningStone${player}`);
                gameBoard[row + 1][col + 1].classList.add(`winningStone${player}`);
                gameBoard[row + 2][col + 2].classList.add(`winningStone${player}`);
                gameBoard[row + 3][col + 3].classList.add(`winningStone${player}`);
                return true;
            }
        }
    }

    // Überprüfe diagonale Linien (von rechts oben nach links unten)
    for (let row = 0; row <= rows - 4; row++) {
        for (let col = 3; col < columns; col++) {
            if (
                gameBoard[row][col]?.classList.contains(`stone${player}`) &&
                gameBoard[row + 1][col - 1]?.classList.contains(`stone${player}`) &&
                gameBoard[row + 2][col - 2]?.classList.contains(`stone${player}`) &&
                gameBoard[row + 3][col - 3]?.classList.contains(`stone${player}`)
            ) {
                gameBoard[row][col].classList.add(`winningStone${player}`);
                gameBoard[row + 1][col - 1].classList.add(`winningStone${player}`);
                gameBoard[row + 2][col - 2].classList.add(`winningStone${player}`);
                gameBoard[row + 3][col - 3].classList.add(`winningStone${player}`);
                return true;
            }
        }
    }

    return false;
}



// Starte den Timer für den ersten Spieler
startTimer();
displayBoard();