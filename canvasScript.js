const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width = 800;//window.innerWidth - 100;
ctx.canvas.height = 600;//window.innerHeight - 300;

var numXCells;
var numYCells;

var cellX = 25;
var cellY = 25;

calculateNumCells();

ctx.canvas.width -= ctx.canvas.width % cellX;
ctx.canvas.height -= ctx.canvas.height % cellY;

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
var snekMoved = true;
var snekStep = 20;//number of intervals to wait before moving
var currentStep = 0;
var snekSpeed = .5;//value from slider to modify snake speed

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


/*for (i=1;i<400;i++){
    segments.push(new Seg(Math.floor(numXCells/2)*cellX, (Math.floor(numYCells/2) + 1)*cellY));
}*/
function calculateNumCells(){
    numXCells = Math.floor(ctx.canvas.width / cellX) - 1;
    numYCells = Math.floor(ctx.canvas.height / cellY) - 1;
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
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    for (i=0; i < segments.length; i++){
        //Draw Cell
        //ctx.fillStyle = 'hsl(' + 360 * i/segments.length + ', 75%, 50%)';
        //ctx.fillStyle = 'hsl(207, 75%, ' + 100 * i/segments.length + '%)';
        ctx.fillStyle = 'rgb(' + interpolateRGB(startColor[0],endColor[0],i,segments.length) + ',' + interpolateRGB(startColor[1],endColor[1],i,segments.length)+ ',' + interpolateRGB(startColor[2],endColor[2],i,segments.length) + ')';
        
        ctx.fillRect(segments[i].xPos, segments[i].yPos, cellX, cellY);
    }
    
    //Draw Food
    ctx.fillStyle = 'rgb(' + foodColor[0] + ', ' + foodColor[1] + ', ' + foodColor[2] + ')';
    ctx.fillRect(foodX, foodY, cellX, cellY);
}

function startClicked(){
    calculateNumCells();
    interval = setInterval(snek, 10);
    document.getElementById("buttonStart").style.display = "none";
    document.getElementById("gameOver").textContent = "";
    document.getElementById("buttonSettings").style.display = "none";
    resetSnek();
    placeFood();
    setScore(0);
    
}

function resetSnek(){
    segments = [new Seg(Math.floor(numXCells/2)*cellX, Math.floor(numYCells/2)*cellY), new Seg(Math.floor(numXCells/2)*cellX, (Math.floor(numYCells/2) + 1)*cellY)];
    direction = 1;
}

//snek step
function snek(){
    console.log("snekX: " + segments[0].xPos + "snekY: " + segments[0].yPos);
    calculateNumCells();
    currentStep++;
    drawSquare();
    animateNom();
    if (currentStep > Math.floor(snekStep * snekSpeed)){
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
        checkSnek();
        snekMoved = true;
    }
}

//Handle keyboard input
document.onkeydown = function(event) {
    if (snekMoved){
        switch (event.keyCode){
            //Arrow Keys
            case 37:
                //alert('Left Pressed');
                if (direction != 1){
                    direction = 0;
                }
                break;
            case 39:
                //alert('Right Pressed');
                if (direction != 0){
                    direction = 1;
                }
                break;
            case 38:
                //alert('Up Pressed');
                if (direction != 3){
                    direction = 2;
                }
                break;
            case 40:
                //alert('Down Pressed');
                if (direction != 2){
                    direction = 3;
                }
                break;

            //WASD    
            case 65:
                //alert('Left Pressed');
                if (direction != 1){
                    direction = 0;
                }
                break;
            case 68:
                //alert('Right Pressed');
                if (direction != 0){
                    direction = 1;
                }
                break;
            case 87:
                //alert('Up Pressed');
                if (direction != 3){
                    direction = 2;
                }
                break;
            case 83:
                //alert('Down Pressed');
                if (direction != 2){
                    direction = 3;
                }
                break;    

            //Spacebar
            case 32:
                //setInterval(snek, 100);
                break;
        }
    }
    event.preventDefault();
    snekMoved = false;
}

function shiftSegs(s){
    for (i = s.length-1; i > 0; i--){
        s[i].xPos = s[i-1].xPos;
        s[i].yPos = s[i-1].yPos;
    }
}

//create new food after eating
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
    
    /*foodColor[0] = Math.floor(Math.random()*255);
    foodColor[1] = Math.floor(Math.random()*255);
    foodColor[2] = Math.floor(Math.random()*255);*/

}

//Check failure conditions
function checkSnek(){
    
    for (i=1; i < segments.length; i++){
        if (segments[0].xPos == segments[i].xPos && segments[0].yPos == segments[i].yPos){
            //game end event
            //alert("Game Over: Snek");
            endGame();
        }
    }
    
    if (segments[0].xPos < 0 || segments[0].xPos > (numXCells * cellX) || segments[0].yPos < 0 || segments[0].yPos > (numYCells * cellY)) {
        //alert("Game Over: Wall");
        endGame();
    }
}

//snek eat food?
function checkFood(){
    if (segments[0].xPos == foodX && segments[0].yPos == foodY){
        for (i=0;i<5;i++){
            segments.push(new Seg(segments[segments.length-1].xPos,segments[segments.length-1].yPos));
        }
        
        resetNom();
        nomX = foodX;
        nomY = foodY;
        drawNom = true;
        
        placeFood();
        setScore(score+1);
        
        
    }
}

function endGame() {
    //End game event, reset snek
    
    clearInterval(interval);
    document.getElementById("buttonStart").style.display = "inline-block";
    document.getElementById("buttonSettings").style.display = "inline-block"
    document.getElementById("gameOver").textContent = "DED SNEK"

}

function setScore(newScore){
    score = newScore;
    document.getElementById("score").textContent = "SNEK: " + score + "\n";
}

function interpolateRGB(start,end,step,totalSteps){
    return Math.floor(start + ((step/totalSteps) * (end - start)));
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("buttonSettings");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

var cellSlider = document.getElementById("cellSizeSlider");

cellSlider.onchange = function(){
    document.getElementById("cellSizeText").textContent = "SNEK CELL SIZE: " + cellSlider.value + "px";
    cellX = parseInt(cellSlider.value);
    cellY = parseInt(cellSlider.value);
    calculateNumCells();
    resetSnek();
    console.log("cellX: " + cellX + "cellY: " + cellY + "numXCells: " + numXCells + "numYCells: " + numYCells );
}

var speedSlider = document.getElementById("snekSpeedSlider");

speedSlider.onchange = function(){
    document.getElementById("snekSpeedText").textContent = "SNEK SPEED: " + speedSlider.value + "%";
    snekSpeed = 1 - (parseInt(speedSlider.value) / 250);
}