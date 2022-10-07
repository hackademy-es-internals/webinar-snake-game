var canvas = document.getElementById("snakeCanvas");
var context = canvas.getContext("2d");
var score = document.getElementById("score");
var startBtn = document.getElementById("startBtn");
var pauseBtn = document.getElementById("pauseBtn");
var resumeBtn = document.getElementById("resumeBtn");

var head = document.getElementById("head");

var targets = Array.from(document.querySelectorAll('.target'));

var virus, viruses = Array.from(document.querySelectorAll(".virus"));
var points = 0;
var targetsEaten = [];
var target,tocado;
var snakeHeadX, snakeHeadY, targetX, targetY, virusX, virusY, tail, totalTail, directionVar, direction, previousDir;
var speed=1, xSpeed, ySpeed;
var xSpace, ySpace;
var ratio = 15;
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
    xSpace = ratio * -speed;
    ySpace = 0;
    snakeHeadX = 0;
    snakeHeadY = 0;
    targets =  Array.from(document.querySelectorAll('.target'))
    if(targets.length>0){
        target = targets[0];
        targets.splice(0,1);
    }
    virus = viruses[0];
    tocado=false;
    points = 0;
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
    
    playing=false;
}

function resumeGame()
{
    main();
    playing=true;
}

//EventListener to check which arrow key is pressed
window.addEventListener("keydown", pressedKey);

function pressedKey() {
    
    // space to pause and resume
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
            xSpace = 0;
            ySpace = ratio * speed;
        } 
        break;
        
        case "Down":
        //move "down" only when previous direction is not "up"
        if (previousDir !== "Up") {
            direction=directionVar;
            xSpeed = 0;
            ySpeed = scale * speed;
            xSpace = 0;
            ySpace = ratio * -speed;
        } 
        break;
        
        case "Left":
        //move "left" only when previous direction is not "right"
        if (previousDir !== "Right") {
            direction=directionVar;
            xSpeed = scale * -speed;
            ySpeed = 0;
            xSpace = ratio * speed;
            ySpace = 0;
        } 
        break;
        
        case "Right":
        //move "right" only when previous direction is not "left"
        if (previousDir !== "Left") {
            direction=directionVar;
            xSpeed = scale * speed;
            ySpeed = 0;
            xSpace = ratio * -speed;
            ySpace = 0;
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
    let tailCollision=false;
    boundaryCollision=false;
    //with its own tail
    for (let i = 0; i < tail.length; i++) {
        if (snakeHeadX == tail[i].tailX && snakeHeadY == tail[i].tailY) {
            tailCollision=true;
        }
    }
    //with boundaries
    if(snakeHeadX >= canvas.width || snakeHeadX < 0 || snakeHeadY >= canvas.height || snakeHeadY < 0)
    {
        boundaryCollision=true;
    }
    
    // return (tailCollision || boundaryCollision);
    return false;
}

//-----------------------------------------------------SNAKE-----------------------------------------------------------//
function drawSnakeHead(color) {
    context.beginPath();
    context.drawImage(head,snakeHeadX, snakeHeadY)
}

function drawSnakeTail() {
    for (i = 0; i < tail.length-1; i++) {
        context.beginPath();
        context.drawImage(targetsEaten[targetsEaten.length-1-i],tail[i].tailX+scale/4, tail[i].tailY+scale/4);
    }
}

//shift snake's previous positions to next position
function moveSnakeForward() {
    tail0=tail[0];
    for (let i = 0; i < tail.length - 1; i++) {
        tail[i] = tail[i + 1];
        tail[i].tailX += xSpace;
        tail[i].tailY += ySpace;

        
    }
    tail[totalTail] = { tailX: snakeHeadX, tailY: snakeHeadY };
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
}


//------------------------------------------------------VIRUS-----------------------------------------------------------//
function virusPosition() {
    let virus=generateCoordinates();
    virusX=virus.xCoordinate;
    virusY=virus.yCoordinate;
}

function drawVirus() {
    context.drawImage(virus, virusX, virusY, 40, 40);
}

//------------------------------------------------------target-----------------------------------------------------------//
// generate random number in range
function between(min, max) {  
    return Math.floor(
        Math.random() * (max - min) + min
        )
    }
    //generate random target position within canvas boundaries
    function targetPosition() {
        let target=generateCoordinates();
        targetX=target.xCoordinate;
        targetY=target.yCoordinate;
    }
    
    //draw image of target
    function drawTarget() {
        context.drawImage(target, targetX, targetY, 40, 40);
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
            
            // VIRUS OPERATION
            if(virusHit()){
                points--
                virusPosition()
                virus = viruses[between(0,viruses.length)];
            }
            drawVirus();
            
            // TARGET OPERATIONS
            if(targetHit()){
                totalTail++;
                points++;
                targetsEaten.push(target);
                //increase the speed of game after every 20 points
                if(totalTail%3==0 && intervalDuration>minDuration) {
                    clearInterval(gameInterval);
                    window.clearInterval(virusInterval);
                    intervalDuration=intervalDuration-10;
                    main();
                }
                targetPosition();

                if(targets.length > 0){
                    target = targets[0]
                    targets.splice(0,1);
                    tocado = false;
                }else{
                    youWin()
                }
            }
            drawTarget();
            
            // UPDATING SNAKE
            moveSnakeForward();
            drawSnake();
            
            // CHECK GAME OVER
            checkGameOver()

            // UPDATE SCORE
            score.innerText = points;
            
        }, intervalDuration);
    }

    function virusHit(){
        //check if snake hit the virus
        if(Math.abs(snakeHeadX-virusX)<=20 && Math.abs(snakeHeadY-virusY)<=20) {
            return true
        }

        return false
    }

    function targetHit(){
        //check if snake eats the target - increase size of its tail, update score and find new target position
        if (Math.abs(snakeHeadX-targetX)<=20 && Math.abs(snakeHeadY-targetY)<=20) {
            
            return true;
        }

        return false;
    }

    function youWin(){
        clearInterval(gameInterval);
        clearInterval(virusInterval);
        showModal('winModal')
    }

    function checkGameOver(){
        if (checkCollision() || points < 0) {
            clearInterval(gameInterval);
            clearInterval(virusInterval);
            if(boundaryCollision) {
                moveSnakeBack();
            }
            drawSnakeHead();
            setTimeout(()=>{ 
                scoreModal.textContent = points;
                showModal('alertModal');
            }, 1000);
        }
    }
    
    function showModal(modalId){
        const myModalEl = document.getElementById(modalId)
        const modalBtn = myModalEl.querySelector('#modal-btn')
        
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
    }