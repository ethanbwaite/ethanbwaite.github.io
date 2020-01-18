const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth - 100;
ctx.canvas.height = window.innerHeight - 100;

const cellX = 25;
const cellY = 25;

ctx.canvas.width -= ctx.canvas.width % cellX;
ctx.canvas.height -= ctx.canvas.height % cellY;

const numXCells = Math.floor(ctx.canvas.width / cellX) - 1;
const numYCells = Math.floor(ctx.canvas.height / cellY) - 1;

var score = 0;

var foodX = 500;
var foodY = 500;


var direction = 1;

function Seg(x, y) {
    this.xPos = x;
    this.yPos = y;
}

var startColor = [247,10,196];
var endColor = [247,208,10];



var segments = [new Seg(Math.floor(numXCells/2)*cellX, Math.floor(numYCells/2)*cellY), new Seg(Math.floor(numXCells/2)*cellX, (Math.floor(numYCells/2) + 1)*cellY)];


//for (i=1;i<3;i++){
  //  segments.push(new Seg(Math.floor(numXCells/2)*cellX, (Math.floor(numYCells/2) + 1)*cellY));
//}

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
    ctx.fillStyle = 'white';
    ctx.fillRect(foodX, foodY, cellX, cellY);
}

//snek step
function snek(){
    
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
    
    checkFood();
    checkSnek();
    
    
    
    drawSquare();
}

//Handle keyboard input
document.onkeydown = function(event) {
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
            setInterval(snek, 75);
            break;
    }
    event.preventDefault();
}

function shiftSegs(s){
    for (i = s.length-1; i > 0; i--){
        s[i].xPos = s[i-1].xPos;
        s[i].yPos = s[i-1].yPos;
    }
}

function placeFood(){
    var xCheck = true;
    var yCheck = true;
    
    while(xCheck) {
        xCheck = false;
        foodX = Math.floor(Math.random() * (numXCells-1)) * cellX;
        for (i=0; i < segments.length; i++){
            if (segments[i].xPos == foodX)
                xCheck = true;
                //alert("food conflict x");
        }
    }
    
    while(yCheck) {
        yCheck = false;
        foodY = Math.floor(Math.random() * (numYCells-1)) * cellY;
        for (i=0; i < segments.length; i++){
            if (segments[i].yPos == foodY)
                yCheck = true;
                //alert("food conflict y")
        }
    }
    
}

//Check failure conditions
function checkSnek(){
    
    for (i=1; i < segments.length; i++){
        if (segments[0].xPos == segments[i].xPos && segments[0].yPos == segments[i].yPos){
            //game end event
            alert("Game Over: Snek");
            endGame();
        }
    }
    
    if (segments[0].xPos < 0 || segments[0].xPos > (numXCells * cellX) || segments[0].yPos < 0 || segments[0].yPos > (numYCells * cellY)) {
        alert("Game Over: Wall");
        endGame();
    }
}

function checkFood(){
    if (segments[0].xPos == foodX && segments[0].yPos == foodY){
        segments.push(new Seg(segments[segments.length-1].xPos,segments[segments.length-1].yPos));
        placeFood();
        setScore(score+1);
    }
}

function endGame() {
    //End game event, reset snek
    segments = [new Seg(Math.floor(numXCells/2)*cellX, Math.floor(numYCells/2)*cellY), new Seg(Math.floor(numXCells/2)*cellX, (Math.floor(numYCells/2) + 1)*cellY)];
    placeFood();
    setScore(0);
}

function setScore(newScore){
    score = newScore;
    document.getElementById("score").textContent = "snek: " + score;
}

function interpolateRGB(start,end,step,totalSteps){
    return Math.floor(start + ((step/totalSteps) * (end - start)));
}