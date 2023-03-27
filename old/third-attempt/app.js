// pub-sub
let events = {
    events: {},
    on(eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },
    off(eventName, fn) {
        if(this.events[eventName]){
            for(let i = 0; i < this.events.length; i++){
                if(this.events[eventName][i] === fn){
                    this.events[eventName].splice(i, 1);
                    break;
                }
            }
        }
    },
    emit(eventName, data) {
        if(this.events[eventName]){
            this.events[eventName].forEach((fn) => {
                fn(data);
            })
        }
    }
}







// MODULE
const playerSelect = (function(){

    let startPlayer;

    // DOM cache
    let X = document.querySelector('.X');
    let O = document.querySelector('.O');
    let playerIndicators = document.querySelectorAll('.player-select div');
    let selectPlayer = document.querySelector('.container h3')

    // bind event
    playerIndicators.forEach((pl) => {
        pl.addEventListener('click', choosePlayer)
    })
    


    // Render
    function render(player){
        if(player){
            if(player === 'X'){
                X.style.color = 'red';
                O.style.color = 'black';
            } else if(player === 'O') {
                X.style.color = 'black';
                O.style.color = 'red';
            }
        } 
        else {
            events.emit('setPlayer', startPlayer);
            
            if(startPlayer === 'X'){
                X.style.color = 'red'
                O.style.color = 'black'
            } else {
                X.style.color = 'black'
                O.style.color = 'red'
            }
        }
    }

    function setPlayer(curPlayer){
        render(curPlayer);
    }

    function choosePlayer(e){
        startPlayer = e.target.textContent;
        playerIndicators.forEach((pl) => {
            pl.removeEventListener('click', choosePlayer)
        })
        selectPlayer.style.color = '#ccc'
        events.emit('activateSquares')
        render();
    }

    function playerSelectReset(){
        selectPlayer.style.color = 'black'
        playerIndicators.forEach((pl) => {
            pl.addEventListener('click', choosePlayer)
        })
        X.style.color = 'black';
        O.style.color = 'black';
    }

    // API
    events.on('playerChange', setPlayer);
    events.on('playerSelectReset', playerSelectReset);


    return {startPlayer};
})();


// MODULE
const gameboard = (function(){
    //private variables:
    let gameboardArr = [];
    let curPlayer ;

    //DOM Caching

    let squares = document.querySelectorAll('.square');

    // Render
    // Only function to touch the DOM
    function render() {
        squares.forEach((sq, i) => {
            sq.textContent = gameboardArr[i]
        })
        events.emit('playerChange', curPlayer);
    }


    //Event binding
    function eventBindSquares(){
        squares.forEach((sq, i) => {
            sq.index = i;
            sq.addEventListener('click', updateGameboardArr)
        })
    }

    function removeEventBindSquares(){
        squares.forEach((sq) => {
            sq.removeEventListener('click', updateGameboardArr)
        })
    }


    // Event handlers

    function updateGameboardArr(e){
        gameboardArr[e.target.index] = curPlayer
        checkForWinner();
        changePlayer();
        render();

        e.target.removeEventListener('click', updateGameboardArr)
    }

    // Functions
    function changePlayer(){
        if(curPlayer === 'X'){
            curPlayer = 'O';
        } else if(curPlayer === 'O'){
            curPlayer = 'X';
        }
    }

    function setPlayer(player){
        curPlayer = player;
    }

    function checkForWinner(){
        let winningIndices = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        // console.log(gameboardArr, [...gameboardArr])
        if([...gameboardArr].filter((e) => {
            if(e) return e
        }).length < 9
        ){
            // console.log(gameboardArr.map((player, index) => {
            //     if(player === curPlayer) {
            //         return index;
            //     }
            //     }).filter(el => el >= 0))
            let currentIndices = gameboardArr.map((player, index) => {
            if(player === curPlayer) {
                return index;
            }
            })
            .filter(el => el >= 0);
            for(let i = 0; i < winningIndices.length; i++){
                if(winningIndices[i].every((e) => {
                    return currentIndices.includes(e)
                })) {
                    events.emit('displayResult', `${curPlayer} is the winner`)
                    removeEventBindSquares();
                    events.emit('updateScore', curPlayer)
                }
            }
        } else {
            events.emit('displayResult', `Draw!`)
        }
    }

    function resetGame(){
        gameboardArr = [];
        curPlayer = '';
        squares.forEach((sq) => {
            sq.textContent = '';
        })
        // removeEventBindSquares();
    }

    // API
    events.on('setPlayer', setPlayer);
    events.on('activateSquares', eventBindSquares);
    events.on('resetGame', resetGame);

})()

// MODULE
const result = (function(){
    // private variables

    // DOM caching
    let resultDisplay = document.querySelector('.result h2');
    let playAgainBut = document.querySelector('.result button')
    // render
    function render(result) {
        resultDisplay.textContent = result
        playAgainBut.style.display = 'block';
    }

    //handlers
    function playAgain(){
        events.emit('resetGame');
        resultDisplay.textContent = '';
        playAgainBut.style.display = 'none';
        events.emit('playerSelectReset');
    }

    //Event binding
    playAgainBut.addEventListener('click', playAgain)
    

    // API
    events.on('displayResult', render)

})();


//MODULE 
//Score keeping
(function() {
    // DOM Caching
    let playerXScore = document.querySelector('.playerX p')
    let playerOScore = document.querySelector('.playerO p')
    let playersScores = document.querySelectorAll('.player')
    let resetScoresBut = document.querySelector('#reset-scores')

    // Functions
    function updateScore(winner) {
        if(winner === 'X') playerXScore.textContent++
        else playerOScore.textContent++ 
        resetScoresBut.style.display = 'block'
    }

    function resetScores() {
        console.log('here')
        playersScores.forEach((player) => {
            player.querySelector('p').textContent = 0
        })
        resetScoresBut.style.display = 'none'
    }

    // Event binding
    resetScoresBut.addEventListener('click', resetScores)


    // API
    events.on('updateScore', updateScore)
})()



