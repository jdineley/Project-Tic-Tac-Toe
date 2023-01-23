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

const playerSelect = (function(){

    let startPlayer;

    // DOM cache
    let X = document.querySelector('.X');
    let O = document.querySelector('.O');
    let playerIndicators = document.querySelectorAll('.player-select div');
    let h3 = document.querySelector('.player-select h3')

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
        h3.style.color = '#ccc'
        events.emit('activateSquares')
        render();
    }

    // API
    events.on('playerChange', setPlayer);


    return {startPlayer};
})();


const gameboard = (function(){
    //private variables:
    let gameboardArr = [];
    let curPlayer = 'X';

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
        if([...gameboardArr].filter((e) => {
            if(e) return e
        }).length < 9
        ){
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
                    squares.forEach((sq) => {
                        sq.removeEventListener('click', updateGameboardArr)
                    })
                }
            }
        } else {
            events.emit('displayResult', `Draw!`)
        }
    }


    // API
    events.on('setPlayer', setPlayer);
    events.on('activateSquares', eventBindSquares);

})()

const result = (function(){
    // private variables

    // DOM caching
    let resultDisplay = document.querySelector('.result h2');

    // render
    function render(result) {
        resultDisplay.textContent = result
    }

    // API
    events.on('displayResult', render)

})();


