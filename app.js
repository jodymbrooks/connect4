//TODO: Handle tie

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const squares = document.querySelectorAll('.grid div');
    const result = document.getElementById('result');
    const displayCurrentPlayer = document.getElementById('current-player');
    const help = document.getElementById('help');
    const p1Chip = document.getElementById('p1Chip');
    const p2Chip = document.getElementById('p2Chip');
    let dropping = false;


    let currentPlayer = 1;

    for (var i = 0, len = squares.length - 7; i < len; i++) {
        (function (index) {
            // add an onclick to each square in your grid
            squares[i].onclick = function () { handleCellClick(index); }
        })(i);
    }

    function isTaken(square) {
        return square.classList.contains('taken');
    }

    function isPlayerOne(square) {
        return square.classList.contains('player-1');
    }

    function isPlayerTwo(square) {
        return square.classList.contains('player-2');
    }

    function findBottomUntaken(col) {
        for (let idx = col + 35; idx >= 0; idx = idx - 7) {
            let square = squares[idx];
            let belowSquare = squares[idx + 7];
            if (!isTaken(square) && isTaken(belowSquare))
                return idx;
        }

        return -1;
    }

    function animateDrop(startSquare, stopSquare) {
        dropping = true;
        const chip = currentPlayer == 1 ? p1Chip : p2Chip;

        const gridTop = grid.offsetTop;
        const gridLeft = grid.offsetLeft + 2;
        let y = startSquare.offsetTop + gridTop;
        const endY = stopSquare.offsetTop + gridTop;

        chip.style.left = (gridLeft + startSquare.offsetLeft) + 'px';
        chip.style.top = y + 'px';
        chip.style.display = 'block';


        let speed = 0;
        const timerId = setInterval(function() {
            speed += 2;
            y += speed;
            chip.style.top = y + 'px';
            if (y >= endY) {
                clearInterval(timerId);
                chip.style.display = 'none';
                dropChip(stopSquare);
                stopSquare.classList.add('taken');
                stopSquare.classList.add('player-' + currentPlayer);
                currentPlayer = (currentPlayer == 1 ? 2 : 1);
                dropping = false;
                displayCurrentPlayer.innerHTML = currentPlayer;

                // check if there is a winner
                checkBoard();
                }
        }, 30);

    }

    function handleCellClick(clickedIndex) {
        if (dropping) return;
        clearHelp();

        const col = clickedIndex % 7;
        const topSquare = squares[col];

        if (isTaken(squares[col])) {
            showHelp("Can't go here");
            return;
        }

        const bottomUntakenIdx = findBottomUntaken(col);
        if (bottomUntakenIdx == -1) {
            showHelp("Can't go here");
            return;
        }
        const bottomUntakenSquare = squares[bottomUntakenIdx];

        if (currentPlayer === 1) {
            animateDrop(topSquare, bottomUntakenSquare);
        } else if (currentPlayer === 2) {
            animateDrop(topSquare, bottomUntakenSquare);
        }
    }

    function showHelp(msg) {
        help.innerHTML = msg;
        if (msg && msg.length > 0) {
            window.setTimeout(() => {
                clearHelp();
            }, 2000);
        }
    }

    function clearHelp() {
        showHelp('');
    }


    //check the board for a win or lose
    function checkBoard() {
        //make const that shows all winning arrays
        const winningArrays = [
            [0, 1, 2, 3], [41, 40, 39, 38], [7, 8, 9, 10], [34, 33, 32, 31], [14, 15, 16, 17], [27, 26, 25, 24], [21, 22, 23, 24],
            [20, 19, 18, 17], [28, 29, 30, 31], [13, 12, 11, 10], [35, 36, 37, 38], [6, 5, 4, 3], [0, 7, 14, 21], [41, 34, 27, 20],
            [1, 8, 15, 22], [40, 33, 26, 19], [2, 9, 16, 23], [39, 32, 25, 18], [3, 10, 17, 24], [38, 31, 24, 17], [4, 11, 18, 25],
            [37, 30, 23, 16], [5, 12, 19, 26], [36, 29, 22, 15], [6, 13, 20, 27], [35, 28, 21, 14], [0, 8, 16, 24], [41, 33, 25, 17],
            [7, 15, 23, 31], [34, 26, 18, 10], [14, 22, 30, 38], [27, 19, 11, 3], [35, 29, 23, 17], [6, 12, 18, 24], [28, 22, 16, 10],
            [13, 19, 25, 31], [21, 15, 9, 3], [20, 26, 32, 38], [36, 30, 24, 18], [5, 11, 17, 23], [37, 31, 25, 19], [4, 10, 16, 22],
            [2, 10, 18, 26], [39, 31, 23, 15], [1, 9, 17, 25], [40, 32, 24, 16], [9, 7, 25, 33], [8, 16, 24, 32], [11, 7, 23, 29],
            [12, 18, 24, 30], [1, 2, 3, 4], [5, 4, 3, 2], [8, 9, 10, 11], [12, 11, 10, 9], [15, 16, 17, 18], [19, 18, 17, 16],
            [22, 23, 24, 25], [26, 25, 24, 23], [29, 30, 31, 32], [33, 32, 31, 30], [36, 37, 38, 39], [40, 39, 38, 37], [7, 14, 21, 28],
            [8, 15, 22, 29], [9, 16, 23, 30], [10, 17, 24, 31], [11, 18, 25, 32], [12, 19, 26, 33], [13, 20, 27, 34]
        ];

        // now take the 4 values in each winningArray and plug them into the squares values
        for (let y = 0; y < winningArrays.length; y++) {
            const square1 = squares[winningArrays[y][0]];
            const square2 = squares[winningArrays[y][1]];
            const square3 = squares[winningArrays[y][2]];
            const square4 = squares[winningArrays[y][3]];
            const squaresToCheck = { square1, square2, square3, square4 };

            // now check those arrays to see if they all have the class of player-1
            if (isPlayerOne(square1) &&
                isPlayerOne(square2) &&
                isPlayerOne(square3) &&
                isPlayerOne(square4)) {

                // they do, so player1 is passed as the winner
                result.innerHTML = 'Player one wins!';
                // remove ability to change result
                cleanupForWin(squaresToCheck);
                // TODO: highlight the winning positions
            }
            else // check to see if they all are player-2
                if (isPlayerTwo(square1) &&
                    isPlayerTwo(square2) &&
                    isPlayerTwo(square3) &&
                    isPlayerTwo(square4)) {

                    // they do, player2 is passed as the winner as well as the chip positions
                    result.innerHTML = 'Player two wins!';
                    cleanupForWin(squaresToCheck);
                    // TODO: highlight the winning positions
                }
        }
    }

    function cleanupForWin(squaresThatWon) {
        const { square1, square2, square3, square4 } = squaresThatWon;

        squares.forEach(square => square.onclick = null);

        document.getElementById('current-player-info').innerHTML = '';

        square1.style.backgroundColor = 'yellow';
        square2.style.backgroundColor = 'yellow';
        square3.style.backgroundColor = 'yellow';
        square4.style.backgroundColor = 'yellow';

    }

    function dropChip(square) {
        const color = currentPlayer === 1 ? 'Red' : 'Blue';
        const chipHtml = `<svg><circle cx="9" cy="9" r="8.5" stroke="Dark${color}" stroke-width="1" fill="${color}" /></svg>`;
        square.innerHTML = chipHtml;
    }
});
