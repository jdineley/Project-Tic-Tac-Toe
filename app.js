// Basic structure

// Human Player vs Human player
// Human player vs computer

// Modules:
// 1. Gameboard module
//      - sets up the logic for the gameboard
//      - exposes functions to be consumed by players
// 2. Game flow control module

// Factories:
// Player constructor
// Player.prototype holds functions exposed by modules

// General stuff
// [0,1,2,3,4,5,6,7,8]
// winning combinations:
// [0,1,2,x,x,x,x,x,x]
// [x,x,x,3,4,5,x,x,x]
// [x,x,x,x,x,x,6,7,8]
// [0,x,x,3,x,x,6,x,x]
// [x,1,x,x,4,x,x,7,x]
// [x,x,2,x,x,5,x,x,8]
// [0,x,x,x,4,x,x,x,8]
// [x,x,2,x,4,x,6,x,x]

let squares = document.querySelectorAll('.square');
let squaresArr = [...squares];
let result = document.querySelector('.result');

let gameboardArr = [];
let curPlayer = 'X'
function changePlayer() {
    if(curPlayer === 'X'){
        curPlayer = 'O'
    } else {
        curPlayer = 'X'
    }
}
function showWinner(winner) {
    result.textContent = `${winner} is the winner`
}
function checkBoard(){
    document.querySelectorAll('.square').forEach((sq, i) => {
        gameboardArr[i] = sq.textContent;
    })
    // console.log(gameboardArr);
    let winningIndices = [
        '0,1,2','3,4,5','6,7,8','0,3,6','1,4,7','2,5,8','0,4,8','2,4,6'
    ];
    // console.log(curPlayer);
    let currentIndices = gameboardArr.map((player, index) => {
        if(player === curPlayer) {
            return index;
        }
    }).filter(el => el >= 0);
    console.log(currentIndices.join(','));

    if(winningIndices.includes(currentIndices.join(','))){
        showWinner(curPlayer);
    }
    
}


// let squaresArray = Array.from(squares)
squares.forEach((sq) => {
    sq.addEventListener('click', function(e) {
        console.log(squaresArr.indexOf(e.target))
        e.target.textContent = curPlayer;
        checkBoard()
        changePlayer();
    })
})




// Gameboard module
let gameboard = (function(){
    let gameboard = [];
    let player = 'player1'

    // cache DOM


    function render() {

    }

    return {};
})();

// Game flow module
let gameFlow = (function() {
    
    return {}
})();

// Player constructor
function Player(name) {
    this.name
}

