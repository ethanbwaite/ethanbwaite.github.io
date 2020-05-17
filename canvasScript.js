const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = 800;
const canvasHeight = 600;

ctx.canvas.width = canvasWidth;
ctx.canvas.height = canvasHeight;

var numXCells;
var numYCells;

var cellX = 25;
var cellY = 25;

calculateNumCells();

var drawNom = false;
var nomX = 100;
var nomY = 100;
var nomAlpha = 0;
var nomDelta = 1;

var score = 0;

var interval;

var foodX = 0;
var foodY = 0;


var direction = 1;
var snakeMoved = true;
var snakeStep = 20; //number of intervals to wait before moving
var currentStep = 0;
var snakeSpeed = .5; //value from slider to modify snake speed

function Seg(x, y) {
    this.xPos = x;
    this.yPos = y;
}

var startColor = [10,178,240];
var endColor = [242,33,61];
var foodColor = [255,255,255];



var segments = [new Seg(Math.floor(numXCells/2)*cellX, Math.floor(numYCells/2)*cellY), new Seg(Math.floor(numXCells/2)*cellX, (Math.floor(numYCells/2) + 1)*cellY)];

//disable scrollbars
document.documentElement.style.overflow = 'hidden';  

function calculateNumCells(){
    numXCells = Math.floor(canvasWidth / cellX);
    numYCells = Math.floor(canvasHeight / cellY);
    
    ctx.canvas.width = cellX * (numXCells+1);
    ctx.canvas.height = cellY * (numYCells+1);
}

function animateNom(){
    if (drawNom = true){
        ctx.fillStyle = "rgba(255,255,255,"+nomAlpha+")";
        ctx.font = "12px 'Press Start 2P'";
        ctx.fillText("NOM", nomX, nomY);
        nomY -= nomDelta;
        nomAlpha -= 0.01;
        if (nomDelta > 0){
            nomDelta -= 0.01;
        } else {
            drawNom = false;
        }
    }
}

function resetNom(){
    nomAlpha = 1;
    nomDelta = 1;
}

function drawSquare(){
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
    
    //Draw Snake Segments, fading from startColor to endColor
    for (i=0; i < segments.length; i++){
        ctx.fillStyle = 'rgb(' + interpolateRGB(startColor[0],endColor[0],i,segments.length) + ',' + interpolateRGB(startColor[1],endColor[1],i,segments.length)+ ',' + interpolateRGB(startColor[2],endColor[2],i,segments.length) + ')';
        
        ctx.fillRect(segments[i].xPos, segments[i].yPos, cellX, cellY);
    }
    
    //Draw Food
    ctx.fillStyle = 'rgb(' + foodColor[0] + ', ' + foodColor[1] + ', ' + foodColor[2] + ')';
    ctx.fillRect(foodX, foodY, cellX, cellY);
}

function startClicked(){
    interval = setInterval(snake, 10);
    document.getElementById("buttonStart").style.display = "none";
    document.getElementById("gameOver").textContent = "";
    document.getElementById("buttonSettings").style.display = "none";
    resetsnake();
    placeFood();
    setScore(0);
    
}

function resetsnake(){
    segments = [new Seg(Math.floor(numXCells/2)*cellX, Math.floor(numYCells/2)*cellY), new Seg(Math.floor(numXCells/2)*cellX, (Math.floor(numYCells/2) + 1)*cellY)];
    direction = 1;
}

//Main Snake Step Handler
function snake(){
    console.log("snakeX: " + segments[0].xPos + "snakeY: " + segments[0].yPos);
    currentStep++;
    drawSquare();
    animateNom();
    if (currentStep > Math.floor(snakeStep * snakeSpeed)){
        currentStep = 0;
        checkFood();

        shiftSegs(segments);
        switch (direction){
            case 0:
                //alert('Left Pressed');
                segments[0].xPos -= cellX;
                break;
            case 1:
                //alert('Right Pressed');
                segments[0].xPos += cellX;
                break;
            case 2:
                //alert('Up Pressed');
                segments[0].yPos -= cellY;
                break;
            case 3:
                //alert('Down Pressed');
                segments[0].yPos += cellY;
                break;
        }
        checkFailureConditions();
        snakeMoved = true;
    }
}

//Handle keyboard input
document.onkeydown = function(event) {
    if (snakeMoved){
        switch (event.keyCode){
            //Arrow Keys
            case 37:
                //Left Pressed
                if (direction != 1){
                    direction = 0;
                }
                break;
            case 39:
                //Right Pressed
                if (direction != 0){
                    direction = 1;
                }
                break;
            case 38:
                //Up Pressed
                if (direction != 3){
                    direction = 2;
                }
                break;
            case 40:
                //Down Pressed
                if (direction != 2){
                    direction = 3;
                }
                break;

            //WASD    
            case 65:
                //Left Pressed
                if (direction != 1){
                    direction = 0;
                }
                break;
            case 68:
                //Right Pressed
                if (direction != 0){
                    direction = 1;
                }
                break;
            case 87:
                //Up Pressed
                if (direction != 3){
                    direction = 2;
                }
                break;
            case 83:
                //Down Pressed
                if (direction != 2){
                    direction = 3;
                }
                break;    
        }
    }
    event.preventDefault();
    snakeMoved = false;
}

function shiftSegs(s){
    for (i = s.length-1; i > 0; i--){
        s[i].xPos = s[i-1].xPos;
        s[i].yPos = s[i-1].yPos;
    }
}

//Create new food after eating
function placeFood(){
    foodX = Math.floor(Math.random() * (numXCells-2)) * cellX;
    foodY = Math.floor(Math.random() * (numYCells-2)) * cellY;
    
    for (i=0;i<segments.length;i++){
        if (segments[i].xPos == foodX && segments[i].yPos == foodY){
            foodX = Math.floor(Math.random() * (numXCells-2)) * cellX;
            foodY = Math.floor(Math.random() * (numYCells-2)) * cellY;
            
            i=0;
        }
    }
    
    console.log("Food placed: " + foodX + ", " + foodY);
}

//Check game end conditions
function checkFailureConditions(){
    
    //Collided with self
    for (i=1; i < segments.length; i++){
        if (segments[0].xPos == segments[i].xPos && segments[0].yPos == segments[i].yPos){
            endGame();
        }
    }
    
    //Collided with wall
    if (segments[0].xPos < 0 || segments[0].xPos > (numXCells * cellX) || segments[0].yPos < 0 || segments[0].yPos > (numYCells * cellY)) {
        endGame();
    }
}

//Check if snake has collided with a food
function checkFood(){
    if (segments[0].xPos == foodX && segments[0].yPos == foodY){
        for (i=0;i<5;i++){
            segments.push(new Seg(segments[segments.length-1].xPos,segments[segments.length-1].yPos));
        }
        
        //Little "nom" animation
        resetNom();
        nomX = foodX;
        nomY = foodY;
        drawNom = true; 
        
        placeFood();
        setScore(score+1);
    }
}

//Stop game and display end screen
function endGame() {
    clearInterval(interval);
    document.getElementById("buttonStart").style.display = "inline-block";
    document.getElementById("buttonSettings").style.display = "inline-block";
    document.getElementById("gameOver").textContent = "GAME OVER.";
}

function setScore(newScore){
    score = newScore;
    document.getElementById("score").textContent = "SCORE: " + score + "\n";
}

function interpolateRGB(start,end,step,totalSteps){
    return Math.floor(start + ((step/totalSteps) * (end - start)));
}

// Settings Modal controls
//Majority of the setup for this section section is adapted from w3schools modal tutorial
var modal = document.getElementById("myModal");
var btn = document.getElementById("buttonSettings");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//Snake size and speed slider settings
var cellSlider = document.getElementById("cellSizeSlider");

cellSlider.oninput = function(){
    document.getElementById("cellSizeText").textContent = "CELL SIZE: " + cellSlider.value + "px";
    cellX = parseInt(cellSlider.value);
    cellY = parseInt(cellSlider.value);
    calculateNumCells();
    resetsnake();
    console.log("cellX: " + cellX + "cellY: " + cellY + "numXCells: " + numXCells + "numYCells: " + numYCells );
}

var speedSlider = document.getElementById("snakeSpeedSlider");

speedSlider.oninput = function(){
    document.getElementById("snakeSpeedText").textContent = "SPEED: " + speedSlider.value + "%";
    snakeSpeed = 1 - (parseInt(speedSlider.value) / 250);
}