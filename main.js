var canvas = document.getElementById("snakeCanvas");
var context = canvas.getContext("2d");
var score = document.getElementById("score");
var startBtn = document.getElementById("startBtn");
var pauseBtn = document.getElementById("pauseBtn");
var resumeBtn = document.getElementById("resumeBtn");
var target = document.getElementById("target");
var virus = document.getElementById("virus");

var snakeHeadX, snakeHeadY, targetX, targetY, virusX, virusY, tail, totalTail, directionVar, direction, previousDir;
var speed=1, xSpeed, ySpeed;
const scale = 20;
var rows = canvas.height / scale;
var columns = canvas.width / scale;
var min = scale / 10; //for min coordinate of target
var max = rows - min; //for max 
var gameInterval,  //interval after which screen will be updated
    virusInterval, //interval after which virus position will be updated
    intervalDuration=150, //starting screen updation interval
    minDuration=75; //minimum screen updation interval
var playing, gameStarted;
var boundaryCollision;
var tail0;


startBtn.addEventListener("click", startGame);

//reset the variables to starting value
function reset() {
    clearInterval(gameInterval);
    clearInterval(virusInterval);
    intervalDuration=150, 
    minDuration=75;
    tail = [];
    totalTail = 0;
    directionVar = "Right";
    direction = "Right";
    previousDir = "Right";
    xSpeed = scale * speed;
    ySpeed = 0;
    snakeHeadX = 0;
    snakeHeadY = 0;
    // pauseBtn.style.backgroundColor="#fff";
    // resumeBtn.style.backgroundColor="#fff";
    playing=false, gameStarted=false;
    boundaryCollision=false;
}

function startGame() {
    reset();
    gameStarted=true;
    playing=true;
    targetPosition();
    virusPosition();
    main();
}

function pauseGame() {
    window.clearInterval(gameInterval);
    window.clearInterval(virusInterval);
    // pauseBtn.style.backgroundColor="#ccc";
    // resumeBtn.style.backgroundColor="#fff";
    playing=false;
}

function resumeGame()
{
    main();
    pauseBtn.style.backgroundColor="#fff";
    resumeBtn.style.backgroundColor="#ccc";
    playing=true;
}

//EventListener to check which arrow key is pressed
window.addEventListener("keydown", pressedKey);

function pressedKey() {
    if(event.keyCode===32 && gameStarted) {
        if(playing) {
            pauseGame();
        }
        else{
            resumeGame();
        }
    }
    else {
        previousDir = direction;
        directionVar = event.key.replace("Arrow", "");
        changeDirection();
    }
}

//change the direction of snake based on arrow key pressed
function changeDirection() {
    switch (directionVar) {
        case "Up":
            //move "up" only when previous direction is not "down"
            if (previousDir !== "Down") {
                direction=directionVar;
                xSpeed = 0;
                ySpeed = scale * -speed;
            } 
            break;

        case "Down":
            //move "down" only when previous direction is not "up"
            if (previousDir !== "Up") {
                direction=directionVar;
                xSpeed = 0;
                ySpeed = scale * speed;
            } 
            break;

        case "Left":
            //move "left" only when previous direction is not "right"
            if (previousDir !== "Right") {
                direction=directionVar;
                xSpeed = scale * -speed;
                ySpeed = 0;
            } 
            break;

        case "Right":
            //move "right" only when previous direction is not "left"
            if (previousDir !== "Left") {
                direction=directionVar;
                xSpeed = scale * speed;
                ySpeed = 0;
            } 
            break;
    }
}

//random coordinates for target or virus
function generateCoordinates() {
    let xCoordinate = (Math.floor(Math.random() * (max - min) + min)) * scale;
    let yCoordinate = (Math.floor(Math.random() * (max - min) + min)) * scale;
    return {xCoordinate, yCoordinate};
}

//check snake's collision 
function checkCollision() {
    let tailCollision=false, virusCollision=false;
    boundaryCollision=false;
    //with its own tail
    for (let i = 0; i < tail.length; i++) {
        if (snakeHeadX == tail[i].tailX && snakeHeadY == tail[i].tailY) {
            tailCollision=true;
        }
    }
    //with boundaries
    // if(snakeHeadX >= canvas.width || snakeHeadX < 0 || snakeHeadY >= canvas.height || snakeHeadY < 0)
    // {
    //     boundaryCollision=true;
    // }
    // MOD1 - pass the wall
    if(snakeHeadX >= canvas.width)
    {
        snakeHeadX = 0
    }
    if(snakeHeadX < 0 )
    {
        snakeHeadX = canvas.width
    }
    if(snakeHeadY >= canvas.height)
    {
        snakeHeadY = 0
    }
    if(snakeHeadY < 0)
    {
        snakeHeadY = canvas.height
    }
    //with virus
    if(snakeHeadX===virusX && snakeHeadY===virusY) {
        virusCollision=true;
    }
    return (tailCollision || boundaryCollision || virusCollision);
}

//-----------------------------------------------------SNAKE-----------------------------------------------------------//
function drawSnakeHead(color) {
        context.beginPath();
        context.drawImage(target,snakeHeadX, snakeHeadY)
        // context.arc(snakeHeadX+scale/2, snakeHeadY+scale/2, scale/2, 0, 2 * Math.PI);
        // context.rect(snakeHeadX+scale/2, snakeHeadY+scale/2, 30,30);
        // context.fillStyle = "#000000";
        // context.fill();
        //eyes
        // context.beginPath();
        // if(direction==="Up") {
        //     context.arc(snakeHeadX+(scale/5), snakeHeadY+(scale/5), scale/8, 0, 2 * Math.PI);
        //     context.arc(snakeHeadX+scale-(scale/5), snakeHeadY+(scale/5), scale/8, 0, 2 * Math.PI);
        // }
        // else if(direction==="Down") {
        //     context.arc(snakeHeadX+(scale/5), snakeHeadY+scale-(scale/5), scale/8, 0, 2 * Math.PI);
        //     context.arc(snakeHeadX+scale-(scale/5), snakeHeadY+scale-(scale/5), scale/8, 0, 2 * Math.PI);
        // }
        // else if(direction==="Left") {
        //     context.arc(snakeHeadX+(scale/5), snakeHeadY+(scale/5), scale/8, 0, 2 * Math.PI);
        //     context.arc(snakeHeadX+(scale/5), snakeHeadY+scale-(scale/5), scale/8, 0, 2 * Math.PI);
        // }
        // else {
        //     context.arc(snakeHeadX+scale-(scale/5), snakeHeadY+(scale/5), scale/8, 0, 2 * Math.PI);
        //     context.arc(snakeHeadX+scale-(scale/5), snakeHeadY+scale-(scale/5), scale/8, 0, 2 * Math.PI);
        // }
        // context.fillStyle = "#ffed00";
        // context.fill();
}

function drawSnakeTail() {
    let tailRadius = scale;
        for (i = 0; i < tail.length; i++) {
            tailRadius=tailRadius+((scale/2-scale/4)/tail.length); // decreasind size
            context.beginPath();
            // context.fillStyle = "#000";
            // context.arc((tail[i].tailX+scale/2), (tail[i].tailY+scale/2), tailRadius, 0, 2 * Math.PI);
            // context.fill();
            context.drawImage(target,tail[i].tailX+scale/4, tail[i].tailY+scale/4,tailRadius,tailRadius)

        }
}

//shift snake's previous positions to next position
function moveSnakeForward() {
    tail0=tail[0];
    for (let i = 0; i < tail.length - 1; i++) {
        tail[i] = tail[i + 1];
        console.log(tail);
    }
    tail[totalTail - 1] = { tailX: snakeHeadX, tailY: snakeHeadY };
    snakeHeadX += xSpeed;
    snakeHeadY += ySpeed;
}

//only in case of boundary collision
function moveSnakeBack()
{
    context.clearRect(0, 0, 640, 640);
    for (let i = tail.length-1; i >= 1; i--) {
        tail[i] = tail[i - 1];
    }
    if(tail.length>=1) {
        tail[0] = { tailX: tail0.tailX, tailY: tail0.tailY };
    }
    snakeHeadX -= xSpeed;
    snakeHeadY -= ySpeed;
    drawVirus();
    drawTarget();
    drawSnakeTail();
}

//display snake
function drawSnake() {
    drawSnakeHead();
    drawSnakeTail();
    if (checkCollision()) {
        clearInterval(gameInterval);
        clearInterval(virusInterval);
        if(boundaryCollision) {
            moveSnakeBack();
        }
        drawSnakeHead("red");
        setTimeout(()=>{ 
            scoreModal.textContent = totalTail;
            // $('#alertModal').modal('show');
            const myModalEl = document.getElementById('alertModal')
            const modalBtn = document.getElementById('modal-btn')

            var myModal = new bootstrap.Modal(myModalEl, {});

            myModal.show()

            //if modal is shown, remove the keydown event listener so that snake doesn't move 
            myModalEl.addEventListener('show.bs.modal', event => {
                window.removeEventListener("keydown", pressedKey);
            })
            //when modal hides, reset every variable and add keydown event listener again
            myModalEl.addEventListener('hidden.bs.modal', event => {
                context.clearRect(0, 0, 640, 640);
                score.innerText = 0;
                window.addEventListener("keydown", pressedKey);
                reset();
            })
            modalBtn.addEventListener("click", ()=>{
                context.clearRect(0, 0, 640, 640);
                score.innerText = 0;
                myModal.hide()
            });
        }, 1000);
    }
}


//------------------------------------------------------VIRUS-----------------------------------------------------------//
function virusPosition() {
    let virus=generateCoordinates();
    virusX=virus.xCoordinate;
    virusY=virus.yCoordinate;
}

function drawVirus() {
    context.drawImage(virus, virusX, virusY, scale, scale);
}

//------------------------------------------------------target-----------------------------------------------------------//
//generate random target position within canvas boundaries
function targetPosition() {
    let target=generateCoordinates();
    targetX=target.xCoordinate;
    targetY=target.yCoordinate;
}

//draw image of target
function drawTarget() {
    context.drawImage(target, targetX, targetY, scale, scale);
}

//------------------------------------------------------MAIN GAME-----------------------------------------------------------//
function checkSamePosition() {
    if(targetX==virusX && targetY==virusY) {
        virusPosition();
    }
    for(let i=0; i< tail.length; i++){
        if(virusX===tail[i].tailX && virusY===tail[i].tailY)
        {
            virusPosition();
            break;
        }
    }
    for(let i=0; i< tail.length; i++){
        if(targetX===tail[i].tailX && targetY===tail[i].tailY)
        {
            targetPosition();
            break;
        }
    }
}

function main() {
    //update state at specified interval
    virusInterval = window.setInterval(virusPosition, 10000);
    gameInterval = window.setInterval(() => {
        context.clearRect(0, 0, 640, 640);
        checkSamePosition();
        drawVirus();
        drawTarget();
        moveSnakeForward();
        drawSnake();

        //check if snake eats the target - increase size of its tail, update score and find new target position
        if (snakeHeadX === targetX && snakeHeadY === targetY) {
            totalTail++;
            //increase the speed of game after every 20 points
            if(totalTail%20==0 && intervalDuration>minDuration) {
                clearInterval(gameInterval);
                window.clearInterval(virusInterval);
                intervalDuration=intervalDuration-10;
                main();
            }
            targetPosition();
        }
        score.innerText = totalTail;

    }, intervalDuration);
}