// Select the canvas and context for both players
const canvas1 = document.querySelector("#canvas1");
const context1 = canvas1.getContext("2d");
const canvas2 = document.querySelector("#canvas2");
const context2 = canvas2.getContext("2d");

// Select the timer and score display elements for both players
const timerText = document.querySelector("#timer");
const scoreText1 = document.querySelector("#scoretext1");
const scoreText2 = document.querySelector("#scoretext2");

// Game constants and variables
const gameWidth = canvas1.width;
const gameHeight = canvas1.height;
const boardBackground = "lightgreen";
const snakeColor1 = "red";
const snakeColor2 = "blue";
const snakeBorder = "black";
const points = "yellow";
const unitSize = 25;
let running = false;
let xVelocity1 = unitSize;
let yVelocity1 = 0;
let xVelocity2 = unitSize;
let yVelocity2 = 0;
let foodX, foodY;
let score1 = 0;
let score2 = 0;
let timeLeft = 100;
let timerInterval;

// Initial snake positions for both players
let snake1 = [
    {x: unitSize * 4, y: 0},
    {x: unitSize * 3, y: 0},
    {x: unitSize * 2, y: 0},
    {x: unitSize, y: 0},
    {x: 0, y: 0}
];

let snake2 = [
    {x: unitSize * 4, y: gameHeight - unitSize},
    {x: unitSize * 3, y: gameHeight - unitSize},
    {x: unitSize * 2, y: gameHeight - unitSize},
    {x: unitSize, y: gameHeight - unitSize},
    {x: 0, y: gameHeight - unitSize}
];

// Event listener for key presses
window.addEventListener("keydown", changeDirection);

// Start the game when the start button is clicked
function Glabbyclicked(){
    gameStart();
};


function gameStart() {
    running = true;
    // Update the score and timer display
    scoreText1.textContent = "Arrow-Key-Control-Red-Snake-Player 1: " + score1;
    scoreText2.textContent = "WASD-Control-Blue-Snake-Player 2: " + score2;
    timerText.textContent = "Time: " + timeLeft;
    // Create and draw the initial food
    createFood();
    drawFood();
    // Start the game loop
    nextTick();
    // Start the timer countdown
    startTimer();
};

function nextTick() {
    if (running) {
        // Set a timeout for the next game frame
        setTimeout(() => {
            // Clear both boards
            clearBoard(context1);
            clearBoard(context2);
            // Draw the food
            drawFood();
            // Move and draw both snakes
            moveSnake(snake1, xVelocity1, yVelocity1);
            moveSnake(snake2, xVelocity2, yVelocity2);
            drawSnake(context1, snake1, snakeColor1);
            drawSnake(context2, snake2, snakeColor2);
            // Check for game over conditions
            checkGameOver();
            // Call nextTick again for the next frame
            nextTick();
        }, 75);
    } else {
        // Display game over message
        displayGameOver();
    }
};

function clearBoard(context) {
    // Fill the canvas with the background color
    context.fillStyle = boardBackground;
    context.fillRect(0, 0, gameWidth, gameHeight);
};

function createFood() {
    // Generate random coordinates for the food
    function randomFood(min, max) {
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    // Set the food coordinates
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameHeight - unitSize);
    console.log(foodX, foodY);
};

function drawFood() {
    // Draw the food on both canvases
    context1.fillStyle = points;
    context1.fillRect(foodX, foodY, unitSize, unitSize);
    context2.fillStyle = points;
    context2.fillRect(foodX, foodY, unitSize, unitSize);
};

function moveSnake(snake, xVelocity, yVelocity) {
    // Create a new head for the snake
    const head = {x: snake[0].x + xVelocity, y: snake[0].y + yVelocity};
    snake.unshift(head);
    // If the snake eats the food, increase score and create new food
    if (head.x === foodX && head.y === foodY) {
        if (snake === snake1) {
            score1 += 1;
            scoreText1.textContent = "Player 1: " + score1;
        } else {
            score2 += 1;
            scoreText2.textContent = "Player 2: " + score2;
        }
        createFood();
    } else {
        // Remove the last part of the snake to simulate movement
        snake.pop();
    }
};

function drawSnake(context, snake, color) {
    // Draw each part of the snake
    context.fillStyle = color;
    context.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        context.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        context.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    });
};

function changeDirection(event) {
    // Get the key code of the pressed key
    const keyPressed = event.keyCode;
    const LEFT1 = 37, UP1 = 38, RIGHT1 = 39, DOWN1 = 40;
    const A = 65, W = 87, D = 68, S = 83;

    const goingUp1 = (yVelocity1 === -unitSize);
    const goingDown1 = (yVelocity1 === unitSize);
    const goingRight1 = (xVelocity1 === unitSize);
    const goingLeft1 = (xVelocity1 === -unitSize);

    const goingUp2 = (yVelocity2 === -unitSize);
    const goingDown2 = (yVelocity2 === unitSize);
    const goingRight2 = (xVelocity2 === unitSize);
    const goingLeft2 = (xVelocity2 === -unitSize);

    // Change direction for Player 1
    switch(true) {
        case(keyPressed === LEFT1 && !goingRight1):
            xVelocity1 = -unitSize;
            yVelocity1 = 0;
            break;
        case(keyPressed === UP1 && !goingDown1):
            xVelocity1 = 0;
            yVelocity1 = -unitSize;
            break;
        case(keyPressed === RIGHT1 && !goingLeft1):
            xVelocity1 = unitSize;
            yVelocity1 = 0;
            break;
        case(keyPressed === DOWN1 && !goingUp1):
            xVelocity1 = 0;
            yVelocity1 = unitSize;
            break;
        // Change direction for Player 2
        case(keyPressed === A && !goingRight2):
            xVelocity2 = -unitSize;
            yVelocity2 = 0;
            break;
        case(keyPressed === W && !goingDown2):
            xVelocity2 = 0;
            yVelocity2 = -unitSize;
            break;
        case(keyPressed === D && !goingLeft2):
            xVelocity2 = unitSize;
            yVelocity2 = 0;
            break;
        case(keyPressed === S && !goingUp2):
            xVelocity2 = 0;
            yVelocity2 = unitSize;
            break;
    }
};

function checkGameOver() {
    function isGameOver(snake) {
        switch(true) {
            case(snake[0].x < 0):
            case(snake[0].x >= gameWidth):
            case(snake[0].y < 0):
            case(snake[0].y >= gameHeight):
                return true;
        }
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
                return true;
            }
        }
        return false;
    }
    if (isGameOver(snake2) ) {
        context1.fillText("Player 1 Wins!", gameWidth / 2, gameHeight / 2);
        running = false;
    }
    if (isGameOver(snake1)) {
        context1.fillText("Player 2 Wins!", gameWidth / 2, gameHeight / 2);
        running = false;
    }
};

function displayGameOver() {
    context1.font = "50px MV Boli";
    context1.fillStyle = "black";
    context1.textAlign = "center";
    if (score1 > score2) {
        context1.fillText("Player 1 Wins!", gameWidth / 2, gameHeight / 2);
    }   
    if (score2 > score1) {
        context1.fillText("Player 2 Wins!", gameWidth / 2, gameHeight / 2);
    }
    running = false;
};

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerText.textContent = "Time: " + timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            running = false;
            displayGameOver();
        }
    }, 1000);
};

function resetGame(){
    score1 = 0;
    score2 = 0;
    xVelocity1 = unitSize;
    yVelocity1 = 0;
    xVelocity2 = unitSize;
    yVelocity2 = 0;
    timeLeft = 100;
    snake1 = [
        {x: unitSize * 4, y: 0},
        {x: unitSize * 3, y: 0},
        {x: unitSize * 2, y: 0},
        {x: unitSize, y: 0},
        {x: 0, y: 0}
    ];
    snake2 = [
        {x: unitSize * 4, y: gameHeight - unitSize},
        {x: unitSize * 3, y: gameHeight - unitSize},
        {x: unitSize * 2, y: gameHeight - unitSize},
        {x: unitSize, y: gameHeight - unitSize},
        {x: 0, y: gameHeight - unitSize}
    ];
    gameStart(); 
};
