const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
context.imageSmoothingEnabled = false;

var date = "August 22, 2005";

var mouse = {x: 0, y: 0}
var clicked = false;
var mouseClick = {x: 0, y: 0}

// Animation Loop
function animate()
{
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(animate);
}
animate();

canvas.addEventListener("mousemove", MousePos);
function MousePos(event)
{
    mouse.x = (event.pageX - canvas.offsetLeft);
    mouse.y = (event.pageY - canvas.offsetTop);
}

canvas.addEventListener("click", MouseClickPos);
function MouseClickPos(event)
{
    clicked = true;
    mouseClick.x = (event.pageX - canvas.offsetLeft);
    mouseClick.y = (event.pageY - canvas.offsetTop);
}