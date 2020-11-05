//Variable for set direction keyname
let direction = '';
//Grid size (- 1)
let GRID_SIZE = 20;
// Game speed
let gameSpeedRender = 100;
//Snake class
class Snake{
    constructor(){
        this.snakeTail = [{ x: GRID_SIZE - 9, y: GRID_SIZE - 9}];
        this.gameOver = false;
    }
    draw(gameContainer){
        this.snakeTail.forEach(tail => {
            const snakeElement = document.createElement('div');
            if(this.gameOver) {
                snakeElement.style.visibility = 'hidden';
            }
            snakeElement.style.gridRowStart = tail.y;
            snakeElement.style.gridColumnStart = tail.x;
            snakeElement.classList.add('snake');
            gameContainer.appendChild(snakeElement);
        });
    }
    update(){
        if(this.checkCollision()){
            this.gameOver = true;
        }
        if(this.gameOver){
            gameInterval = clearInterval();
            const gameOverMessage = document.getElementById('gameOverMessage');
            const restartButton = document.getElementById('restartButton');
            gameOverMessage.style.visibility = 'visible';
            restartButton.addEventListener('click', () => {
                window.location.reload();
            })
            return;

        }
        if(this.eatFood(this.snakeTail[0],fruit.location)){
            fruit.getFoodLocation();
            this.addTail();
        }
        const inputDir = this.getDir();
        
        for(let i = this.snakeTail.length - 2 ; i >= 0; i--){
            this.snakeTail[i + 1] = { ...this.snakeTail[i] };
        }

        this.snakeTail[0].x += inputDir.x;
        this.snakeTail[0].y += inputDir.y;

    }
    getDir(){
        let inputDirection = { x: 0, y: 0};
        switch(direction) {
            case 'Left':
            {
                inputDirection = { x: -1,y: 0};
                break;
            }
            case 'Right':
            {
                inputDirection = { x: 1,y: 0};
                break;
            }
            case 'Up':
            {
                inputDirection = { x: 0,y: -1};
                break;
            }
            case 'Down':
            {
                inputDirection = { x: 0,y: 1};
                break;
            }
        }
        return inputDirection;
    }
    eatFood(snakePos,fruitPos){
        return snakePos.x === fruitPos.x && snakePos.y === fruitPos.y
    }
    addTail(){
        this.snakeTail.push({...this.snakeTail[this.snakeTail.length - 1]});
    }
    checkCollision(){
        return this.outMap(this.snakeTail[0]) || this.tailBite(this.snakeTail[0])
    }
    outMap(snakeHead){
        return (snakeHead.x > 21 || snakeHead.x < 1) || (snakeHead.y > 21 || snakeHead.y < 1) 
    }
    tailBite(snakeHead){
        return this.snakeTail.some((tail,index) => {
            if(index === 0) return false;
            return tail.x === snakeHead.x && tail.y === snakeHead.y
        })
    }
}

//Fruit class 
class Fruit{
    constructor(){
        this.location = { x: 0 ,y: 0 };
    }
    draw(gameContainer){
        const foodElement = document.createElement('div');
        foodElement.style.gridRowStart = this.location.y;
        foodElement.style.gridColumnStart = this.location.x;
        foodElement.classList.add('fruit');
        gameContainer.appendChild(foodElement);
    }
    getFoodLocation(){
        this.location.x = Math.floor(Math.random()* GRID_SIZE) + 1;
        this.location.y = Math.floor(Math.random()* GRID_SIZE) + 1;
    }
}

//Game container
const gameContainer = document.getElementById('container');

const snake = new Snake();
const fruit = new Fruit();

// Direction Inputs
window.addEventListener('keydown',event => {
    if(event.keyCode == 37 && direction !== 'Right'){
        direction = 'Left';
    }
    if(event.keyCode == 38 && direction !== 'Down'){
        direction = 'Up';
    }
    if(event.keyCode == 39 && direction !== 'Left'){
        direction = 'Right';
    }
    if(event.keyCode == 40 && direction !== 'Up'){
        direction = 'Down';
    }
})

//New Food Location
fruit.getFoodLocation();

//Start all functions every 100 ms
let gameInterval = setInterval(() => {
    gameContainer.innerHTML='';
    snake.update();
    snake.draw(gameContainer);
    fruit.draw(gameContainer);
},gameSpeedRender)
