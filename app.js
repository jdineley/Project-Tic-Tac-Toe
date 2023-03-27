//First build tic-tac-toe console version then use that backend to drive the gui 

//Functional approach

function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    const boardReConfig = () => {
        console.log('Starting new game')
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
              board[i].push(cell());
            }
        }
    }
    boardReConfig()
    const getBoard = () => board;

    const markBoard = (player, row, column) => {
        if(board[row][column].getValue() === ''){
            board[row][column].addToken(player);
            return true;
        } else {
            console.log('Play again, this square is already taken')
        }
    }

    // for console only
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    }

    return { getBoard, markBoard, printBoard, boardReConfig }
}

function cell() {
    let value = '';

    const addToken = (player) => {
        value = player;
    } 

    const getValue = () => value;

    return {
        addToken,
        getValue
    };
}

function gameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two",
    firstToScore = 3
) {
    
    const board = gameBoard();

    const players = [
        {
            name: playerOneName,
            token: 'O',
            score: 0
        },
        {
            name: playerTwoName,
            token: 'X',
            score: 0
        }
    ]

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
    }
    const getActivePlayer = () => activePlayer;

    //console only
    const printNewRound = () => {
        board.printBoard();
        console.log(`${activePlayer.name}'s turn`)
    }

    const checkResultStatus = () => {
        const winningIndices = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        let flatBoardArray = board.getBoard().map((row) => row.map((cell) => cell.getValue())).flat()
        if(flatBoardArray.filter(e => e !== '').length < 9) {
            let currentIndices = flatBoardArray.map((player, index) => {
                if(player === activePlayer.token) {
                    return index;
                }
            }).filter(el => el >= 0);
            for(let i = 0; i < winningIndices.length; i++) {
                if(winningIndices[i].every((e) => {
                    return currentIndices.includes(e)
                })) {
                    console.log(`${activePlayer.name} is the winner`)
                    activePlayer.score++
                    return {
                        type: 'game win',
                        message: `${activePlayer.name} is the winner`
                    }
                }
            }
        } else {
            console.log('DRAW!!')
            return 'Draw'
        }
    }

    const firstToScoreCheck = () => {
        let result = checkResultStatus()
        if(getActivePlayer().score < firstToScore) {
            return result
        }
         else {
            console.log(`${getActivePlayer().name} wins round with ${firstToScore} points`)
            players.forEach(player => player.score = 0)
            return {
                type: 'round win',
                message: `${getActivePlayer().name} wins round with ${firstToScore} points`
            }
        }
    }

    const playRound = (row, column) => {
        console.log(`Adding ${activePlayer.token} token to row:${row} column:${column}`)
        if(board.markBoard(activePlayer.token, row, column)) {
            //check winner or draw..
            let result = firstToScoreCheck()
            if(result) return result
            switchPlayerTurn();
        }
        // For console..
        printNewRound();
    }

    const resetGame = () => {
        board.boardReConfig();
        activePlayer = players[0];
        printNewRound()
    }
    printNewRound();

    return {
        playRound,
        getActivePlayer,
        players,
        resetGame,
        getBoard: board.getBoard,
        firstToScore
    }

}


function screenController() {
    let game;
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const resultDiv = document.querySelector('.result')
    const resetDiv = document.querySelector('.reset')
    const playersDiv = document.querySelector('.players')
    const playAgainDiv = document.querySelector('.play-again')
    const scoreCountDiv = document.querySelector('.score-count')


    const startGame = () => {
        boardDiv.style.display = 'none'
        const h1 = document.createElement('h1')
        h1.textContent = 'Fill out game details'
        const form = document.createElement('form')
        const player1Input = document.createElement('input')
        player1Input.placeholder = 'player1 name'
        const player2Input = document.createElement('input')
        player2Input.placeholder = 'player2 name'
        const firstToScoreInput = document.createElement('input');
        firstToScoreInput.placeholder = 'first-to-score wins (default 3)'
        const button = document.createElement('button')
        button.textContent = 'submit and play'
        button.classList.add('start-button')
        form.append(player1Input, player2Input,firstToScoreInput, button);
        playersDiv.append(h1, form);
        button.addEventListener('click', startHandler)
        function startHandler(e) {
            e.preventDefault()
            let player1Name = player1Input.value === '' ? undefined : player1Input.value;
            let player2Name = player2Input.value === '' ? undefined : player2Input.value;
            let firstToScore = firstToScoreInput.value === '' ? undefined : firstToScoreInput.value; 
            game = gameController(player1Name, player2Name, firstToScore)
            updateScreen()
        }
    }

    const updateScreen = (result) => {
        boardDiv.style.display = 'grid';
        playersDiv.textContent = '';
        boardDiv.textContent = '';
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        
        playerTurnDiv.textContent = `${activePlayer.name}'s turn in first to ${game.firstToScore} battle`

        board.forEach((row,rowNum) => {
            row.forEach((cell, colNum) => {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');
                cellButton.dataset.row = rowNum; 
                cellButton.dataset.column = colNum; 
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })

        if(scoreCountDiv.textContent === '') {
            const player1ScoreDiv = document.createElement('div');
            const player2ScoreDiv = document.createElement('div');
            player1ScoreDiv.textContent = `${game.players[0].name} score = ${game.players[0].score}`;
            player2ScoreDiv.textContent = `${game.players[1].name} score = ${game.players[1].score}`;
            scoreCountDiv.append(player1ScoreDiv, player2ScoreDiv);
        } 
        if(result) {
            if(result !== 'Draw'){
                if(result.type === 'game win') {
                    const player1ScoreDiv = scoreCountDiv.querySelectorAll('div')[0];
                    const player2ScoreDiv = scoreCountDiv.querySelectorAll('div')[1];
                    player1ScoreDiv.textContent = `${game.players[0].name} score = ${game.players[0].score}`;
                    player2ScoreDiv.textContent = `${game.players[1].name} score = ${game.players[1].score}`;
                    resultDiv.textContent = result.message;
                    const playAgainButton = document.createElement('button');
                    playAgainButton.textContent = 'Play again'
                    playAgainDiv.append(playAgainButton)
                    boardDiv.removeEventListener('click', clickHandlerBoard);
                } else if(result.type === 'round win') {
                    scoreCountDiv.textContent = `${result.message}`
                    const resetButton = document.createElement('button');
                    resetButton.textContent = 'Start new game';
                    resetDiv.append(resetButton);
                    boardDiv.removeEventListener('click', clickHandlerBoard);
                }
            } else {
                resultDiv.textContent = result;
                const playAgainButton = document.createElement('button');
                playAgainButton.textContent = 'Play again'
                playAgainDiv.append(playAgainButton)
                boardDiv.removeEventListener('click', clickHandlerBoard);
            }
        } else {
            resultDiv.textContent = '';
            playAgainDiv.textContent = '';
            resetDiv.textContent = '';

        }
    }

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
        if(!selectedColumn || !selectedRow) return;
        updateScreen(game.playRound(selectedRow, selectedColumn));
    }

    function playAgainHandler(e) {
        game.resetGame()
        boardDiv.addEventListener('click', clickHandlerBoard);
        updateScreen();
    }

    function resetGameHandler(e) {
        game.resetGame()
        boardDiv.addEventListener('click', clickHandlerBoard);
        resultDiv.textContent = '';
        playAgainDiv.textContent = '';
        resetDiv.textContent = '';
        playerTurnDiv.textContent = '';
        scoreCountDiv.textContent = '';
        startGame();
    }

    boardDiv.addEventListener('click', clickHandlerBoard);
    playAgainDiv.addEventListener('click', playAgainHandler)
    resetDiv.addEventListener('click', resetGameHandler)

    startGame()
}

screenController();
