const button = document.querySelector("button");
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const scale = 0.25;
const penguinOffset = {x: -185, y: -312};

var mouse = {x: 0, y: 0}
var mouseClick = {x: 0, y: 0}
var currentRoom = 2;

/*August 22, 2005*/
const image = new Image();
image.src = "Town4/Shapes/2.svg";
image.onload
const image2 = new Image();
image2.src = "Town4/Shapes/53.svg";
//image2.onload

/*August 22, 2005*/
const image3 = new Image();
image3.src = "Dock10/shapes/7.svg";
const image4 = new Image();
image4.src = "Dock10/shapes/14.svg";
const image5 = new Image();
image5.src = "Dock10/shapes/23.svg";
image5.onload;


/*const s = new XMLSerializer();
const str = s.serializeToString(image5.src);
console.log(fileContent);*/

// Read the file
/*var fileContent = "";
const reader = new FileReader();
reader.readAsText(image5.toBlob(blob));
reader.onload = () => {fileContent = reader.result;};
reader.onerror = () => {showMessage("Error reading the file. Please try again.", "error");};
console.log(fileContent);*/

class Penguin
{
    constructor(_drawScale)
    {
        this.speed = 10;
        this.drawScale = _drawScale;
        this.penguinPos = {x: canvas.width/2, y: canvas.height/2};

        const bodyColor = new Image();
        bodyColor.src = "penguin/shapes/6.svg";
        bodyColor.onload = () => { this.bodyColor = bodyColor; }

        this.tummyOffset = {x: 98, y: 146};
        const tummy = new Image();
        tummy.src = "penguin/shapes/8.svg";
        tummy.onload = () => { this.tummy = tummy; }

        this.shadowsFeetEyesOffset = {x: -0.5, y: 77};
        const shadowsFeetEyes = new Image();
        shadowsFeetEyes.src = "penguin/shapes/10.svg";
        shadowsFeetEyes.onload = () => { this.shadowsFeetEyes = shadowsFeetEyes; }
    }
    draw({_clickPos})
    {
        if(this.bodyColor)
        {
            if (this.penguinPos.x < _clickPos.x)
            {
                this.penguinPos.x += (1 * this.speed);
            }
            if (this.penguinPos.x > _clickPos.x)
            {
                this.penguinPos.x -= (1 * this.speed);
            }
            if (this.penguinPos.y < _clickPos.y)
            {
                this.penguinPos.y += (1 * this.speed);
            }
            if (this.penguinPos.y > _clickPos.y)
            {
                this.penguinPos.y -= (1 * this.speed);
            }


            var bodyColorPos = {x: this.penguinPos.x + penguinOffset.x * this.drawScale, y: this.penguinPos.y + penguinOffset.y * this.drawScale}
            var tummyPos = {x: this.penguinPos.x + (penguinOffset.x + this.tummyOffset.x) * this.drawScale, y: this.penguinPos.y + (penguinOffset.y + this.tummyOffset.y) * this.drawScale}
            var shadowsFeetEyesPos = {x: this.penguinPos.x + (penguinOffset.x + this.shadowsFeetEyesOffset.x) * this.drawScale, y: this.penguinPos.y + (penguinOffset.y + this.shadowsFeetEyesOffset.y) * this.drawScale}

            context.imageSmoothingEnabled = false;
            context.drawImage(this.bodyColor, bodyColorPos.x, bodyColorPos.y, this.bodyColor.width * this.drawScale, this.bodyColor.height * this.drawScale);
            context.drawImage(this.tummy, tummyPos.x, tummyPos.y, this.tummy.width * this.drawScale, this.tummy.height * this.drawScale);
            context.drawImage(this.shadowsFeetEyes, shadowsFeetEyesPos.x, shadowsFeetEyesPos.y, this.shadowsFeetEyes.width * this.drawScale, this.shadowsFeetEyes.height * this.drawScale);
        }
        else
        {
            context.beginPath();
            context.fillStyle = "#ff00ff";
            context.fillRect(_clickPos.x, _clickPos.y, 1, 1);
        }
    }
    GetPosition()
    {
        return this.penguinPos;
    }
}

penguin = new Penguin(scale);

// Animation Loop
function animate() 
{
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.imageSmoothingEnabled = false;


    if (currentRoom == 1)
    {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        context.drawImage(image2, 0, 0, canvas.width, canvas.height);
    }
    else if (currentRoom == 2)
    {
        context.drawImage(image3, 0, 0, canvas.width, canvas.height);
        context.drawImage(image4, 100, 500, image4.width * 2, image4.height * 2);
        context.drawImage(image5, 0, 0, image5.width, image5.height);
        
    }
    else if (currentRoom == 3)
    {
        context.drawImage(image3, 0, 0, canvas.width, canvas.height);
        context.drawImage(image4, 100, 500, image4.width * 2, image4.height * 2);
    }
    else
    {
    }

    if (currentRoom == 1 && penguin.GetPosition().x < 280)
    {
        currentRoom = 2;
    }
    else if (currentRoom == 2 && penguin.GetPosition().x > 1337)
    {
        currentRoom = 1;
    }
    else
    {
    }

    penguin.draw({_clickPos: {x: mouseClick.x, y: mouseClick.y}});

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
    mouseClick.x = (event.pageX - canvas.offsetLeft);
    mouseClick.y = (event.pageY - canvas.offsetTop);
    console.log(mouseClick);
}