const dataP = document.querySelector("#data");
const button = document.querySelector("button");
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

//Have a svg path2d that checks, if you're on this side of the world sprite render the sprite on top otherwise the penguin renders on top
//This.images[]
//This.path2d[]

//Have the RoomData inside a js cause it doesn't need to change during game but player data like cloths bought/wearing, coins will be a json, also igloo data will be in a diffrent json.
//I'll have a player template json then populated it as they play, it'll be save every so often as cookies and they can down load/upload they're files cause it won't persist except cookies.

var mouse = {x: 0, y: 0}
var mouseClick = {x: 0, y: 0}
var currentRoom = 2;

const dockTownPath = "M131 0 L131 137 67 137 0 0 131 0"
const dockTown = new Path2D(dockTownPath);
var dockTownMatrixed = new Path2D();
const dTmatrix = new DOMMatrix();
dTmatrix.translateSelf(1207, 245);
dTmatrix.scaleSelf(2)
dockTownMatrixed.addPath(dockTown, dTmatrix);

//they don't have it listed but they have the beta swf in their archive zip file 
//C:\Users\WestSadow67\Documents\SandwichCP-Project\Working with SWF files\All the Archives of CP\archivesclubpenguinwikiinfo-20241005-wikidump\images\B files\Beta-town.swf

//if I have 2 html pages refrence the same script maybe I can transfer data from fetch, put the json inside the backend html then load it outside the fetch function cause it's async or
//variable can be declared in an outer scope and then assigned a value within the async function. However, this requires careful handling to ensure the async operation has completed before attempting to access the variable.

//https://clubpenguin.fandom.com/wiki/User_blog:Penguin-Pal/Vector_colors_for_all!
//https://www.youtube.com/watch?v=C6AfRRXIg8s
//^Club Penguin - The entire client is being recreated in HTML5!
/*var svgData = fetchData();
async function fetchData() 
{
    try
    {
        const response = await fetch("https://samwichcp.github.io/2005/Dock10/shapes/23.svg")
        if(!response.ok)
        {
            throw new Error("Bad!");

        }

        const data = await response.text();
        return data;
    }
    catch(error)
    {
        console.error(error);
    }
}
console.log(svgData);*/


class Room
{
    constructor(_roomID)
    {
        this.roomID = _roomID;
        this.roomsIndex = _roomID;
        this.images = [];
         this.imagesPositions = [];
        this.imagesScales = [];
    }
    LoadRoom(_roomID)
    {
        this.roomID = _roomID;
        for(var i = 0; i < rooms.length; i++)
        {
            if(rooms[i].roomID == this.roomID)
            {
                this.roomsIndex = i;
            }
        }

        console.log(rooms[this.roomsIndex].images);
        for(var i = 0; i < rooms[this.roomsIndex].images.length; i++)
        {
            const image = new Image();
            image.src = rooms[this.roomsIndex].images[i].path;
            this.images.push(image);
            this.imagesPositions.push({x: rooms[this.roomsIndex].images[i].positionX, y: rooms[this.roomsIndex].images[i].positionY});
            this.imagesScales.push({x: rooms[this.roomsIndex].images[i].scaleX, y: rooms[this.roomsIndex].images[i].scaleY});

        }
    }
    DrawRoom()
    {
        for(var i = 0; i < this.images.length; i++)
        {
            //console.log(this.imagesPositions[0].x + " " + this.imagesPositions[0].y);
            context.drawImage(this.images[i], this.imagesPositions[i].x, this.imagesPositions[i].y, this.images[i].width * this.imagesScales[i].x, this.images[i].height * this.imagesScales[i].y);
        }
    }
}

class Penguin
{
    constructor(_drawScale)
    {
        this.haloPos = {x: 388, y: 68};
        this.speed = 10;
        this.drawScale = _drawScale;
        this.penguinPos = {x: canvas.width/2, y: canvas.height/2};
        this.action = 0;

        this.First;
        this.walkFrame = 0;
        this.walkCounter = 0;
        this.walkRate = 3;

        const ring = new Image();
        ring.src = "2005/penguin/shapes/2.svg";
        ring.onload = () => { this.ring = ring; }

        const body = new Image();
        body.src = "2005/penguin/shapes/6.svg";
        body.onload = () => { this.body = body; }

        const belly = new Image();
        belly.src = "2005/penguin/shapes/8.svg";
        belly.onload = () => { this.belly = belly; }

        const EyesFeets = new Image();
        EyesFeets.src = "2005/penguin/shapes/10.svg";
        EyesFeets.onload = () => { this.EyesFeets = EyesFeets; }
    }
    draw({_clickPos, _mousePos})
    {
        const dockNonWalkPath = "M570.5 89.5 Q380.8 68.85 262.5 74.5 106.7 149.05 136.5 184.5 157.95 192.5 153.5 200.5 147.7 208.5 119.5 216.5 126.1 226.1 96.5 228.5 48.25 216.95 0.0 228.4 L0.0 0.0 760.0 0.0 760.0 344.5 731.5 344.5 728.95 340.95 Q725.55 336.75 721.65 333.1 712.85 324.95 701.4 321.0 689.55 316.9 677.1 317.25 L676.55 309.6 Q673.8 274.5 665.6 240.5 L702.5 240.5 702.5 145.5 601.95 121.35 Q587.7 105.45 570.5 89.5 M33.5 265.5 Q51.0 291.4 100.0 298.0 15.35 349.75 79.5 401.5 L179.5 427.5 267.5 329.5 281.5 329.5 265.5 372.5 Q261.15 400.2 317.5 416.5 349.55 428.4 393.5 416.5 421.5 444.7 460.5 443.5 497.05 443.85 526.5 419.5 572.0 431.8 617.5 419.5 684.55 374.3 759.5 368.5 L760.0 368.5 760.0 480.0 0.0 480.0 0.0 249.5 Q44.5 248.25 33.5 265.5";
        const nonWalk = new Path2D(dockNonWalkPath);
        var nonWalkScaled = new Path2D();
        const matrix2 = new DOMMatrix();
        matrix2.scaleSelf(2)
        nonWalkScaled.addPath(nonWalk, matrix2);

        context.globalAlpha = 0.5;
        context.fillStyle = "red";
        //context.fill(nonWalkScaled);
        context.globalAlpha = 1;
        //check a few pixels in front of the moving penguin so it stops put the penguin pos stays inside the walkable area
        //console.log(context.isPointInPath(nonWalkScaled, this.penguinPos.x, this.penguinPos.y) + " " + _clickPos)

        if(this.body)
        {
            document.body.style.cursor = "pointer";

            var opposite = this.penguinPos.x - _mousePos.x;
            var adjacent = this.penguinPos.y - _mousePos.y;
            const angleInRadians = Math.atan(opposite / adjacent);
            const angleInDegrees = angleInRadians * (180 / Math.PI);
            const angleInDegreesAbs = Math.abs(angleInDegrees);
            
            context.beginPath();
            context.moveTo(this.penguinPos.x, this.penguinPos.y);
            context.lineTo(_mousePos.x, _mousePos.y);
            context.stroke();

            //var bodyscale = 0.2; //comparing the size the pengiun seems to be scaled 0.2 to the play area
            var bodyscale = 0.2;
            var haloSale = bodyscale * 10;

            context.imageSmoothingEnabled = false;

            var flipPenguin = false;
            var seeBelly = true;
            
            var bodyXOffset = 0;
            var bodyYOffset = 0;
            var bellyXOffset = 0;
            var bellyYOffset = 0;
            var eyeFeetXOffset = 0;
            var eyeFeetYOffset = 0;

            if(this.action == 0)
            {
                //22.5 degrees is the angle I switch sprites
                if (angleInDegreesAbs < 22.5 && adjacent < 0)
                {
                    seeBelly = true;
                    bodyXOffset = 0;
                    bodyYOffset = -141.2;
                    bellyXOffset = 1.4;
                    bellyYOffset = 4.4;
                    eyeFeetXOffset = 0;
                    eyeFeetYOffset = -65;

                    this.body.src = "2005/penguin/shapes/6.svg";
                    this.belly.src = "2005/penguin/shapes/8.svg";
                    this.EyesFeets.src = "2005/penguin/shapes/10.svg";
                }
                else if (angleInDegreesAbs > 22.5 && angleInDegreesAbs < 67.5 && opposite > 0 && adjacent < 0)
                {
                    flipPenguin = false;
                    seeBelly = true;
                    bodyXOffset = 20;
                    bodyYOffset = -110;
                    bellyXOffset = -30;
                    bellyYOffset = 31;
                    eyeFeetXOffset = 21;
                    eyeFeetYOffset = -54;

                    this.body.src = "2005/penguin/shapes/12.svg";
                    this.belly.src = "2005/penguin/shapes/14.svg";
                    this.EyesFeets.src = "2005/penguin/shapes/16.svg";
                }
                else if (angleInDegreesAbs > 22.5 && angleInDegreesAbs < 67.5 && opposite < 0 && adjacent < 0)
                {
                    flipPenguin = true;
                    seeBelly = true;
                    bodyXOffset = 20;
                    bodyYOffset = -110;
                    bellyXOffset = -30;
                    bellyYOffset = 31;
                    eyeFeetXOffset = 21;
                    eyeFeetYOffset = -54;

                    this.body.src = "2005/penguin/shapes/12.svg";
                    this.belly.src = "2005/penguin/shapes/14.svg";
                    this.EyesFeets.src = "2005/penguin/shapes/16.svg";
                }
                else if (angleInDegreesAbs > 67.5 && opposite > 0)
                {
                    flipPenguin = false;
                    seeBelly = true;
                    bodyXOffset = 29.5;
                    bodyYOffset = -67;
                    bellyXOffset = -54.5;
                    bellyYOffset = 48.7;
                    eyeFeetXOffset = 20;
                    eyeFeetYOffset = -34;

                    this.body.src = "2005/penguin/shapes/18.svg";
                    this.belly.src = "2005/penguin/shapes/20.svg";
                    this.EyesFeets.src = "2005/penguin/shapes/22.svg";
                }
                else if (angleInDegreesAbs > 67.5 && opposite < 0)
                {
                    flipPenguin = true;
                    seeBelly = true;
                    bodyXOffset = 29.5;
                    bodyYOffset = -67;
                    bellyXOffset = -54.5;
                    bellyYOffset = 48.7;
                    eyeFeetXOffset = 20;
                    eyeFeetYOffset = -34;

                    this.body.src = "2005/penguin/shapes/18.svg";
                    this.belly.src = "2005/penguin/shapes/20.svg";
                    this.EyesFeets.src = "2005/penguin/shapes/22.svg";
                }
                else if (angleInDegreesAbs > 22.5 && angleInDegreesAbs < 67.5 && opposite > 0 && adjacent > 0)
                {
                    flipPenguin = false;
                    seeBelly = false
                    bodyXOffset = 14.3;
                    bodyYOffset = -90;
                    eyeFeetXOffset = 15;
                    eyeFeetYOffset = -75;

                    this.body.src = "2005/penguin/shapes/24.svg";
                    this.EyesFeets.src = "2005/penguin/shapes/26.svg";
                }
                else if (angleInDegreesAbs > 22.5 && angleInDegreesAbs < 67.5 && opposite < 0 && adjacent > 0)
                {
                    flipPenguin = true;
                    seeBelly = false
                    bodyXOffset = 14.3;
                    bodyYOffset = -90;
                    eyeFeetXOffset = 15;
                    eyeFeetYOffset = -75;

                    this.body.src = "2005/penguin/shapes/24.svg";
                    this.EyesFeets.src = "2005/penguin/shapes/26.svg";
                }
                else if (angleInDegreesAbs < 22.5 && adjacent > 0)
                {
                    flipPenguin = false;
                    seeBelly = false
                    bodyXOffset = 0;
                    bodyYOffset = -100;
                    eyeFeetXOffset = 0;
                    eyeFeetYOffset = 58;

                    this.body.src = "2005/penguin/shapes/28.svg";
                    this.EyesFeets.src = "2005/penguin/shapes/30.svg";
                }
                else
                {
                    //console.log("We Shouldn't be here");
                }
            }
            else if(this.action == 1)
            {
                var walkingDir = 0;
                if(walkingDir == 0)
                {
                    //walk cycle in miliseconds is about 300 miliseconds or close to it https://www.youtube.com/watch?v=PG5NCp_jJO4
                    if(this.walkFrame == 0)
                    {
                        this.body.src = "2005/penguin/shapes/32.svg";
                        this.belly.src = "2005/penguin/shapes/41.svg";
                        this.EyesFeets.src = "2005/penguin/shapes/50.svg";
                        this.walkCounter++;
                        if(this.walkCounter >= this.walkRate)
                        {
                            this.First = new Date();
                            this.walkCounter = 0;
                            this.walkFrame = 1;
                        }
                    }
                    else if(this.walkFrame == 1)
                    {
                        this.body.src = "2005/penguin/shapes/33.svg";
                        this.belly.src = "2005/penguin/shapes/42.svg";
                        this.EyesFeets.src = "2005/penguin/shapes/51.svg";
                        this.walkCounter++;
                        if(this.walkCounter >= this.walkRate)
                        {
                            this.walkCounter = 0;
                            this.walkFrame = 2;
                        }
                    }
                    else if(this.walkFrame == 2)
                    {
                        this.body.src = "2005/penguin/shapes/34.svg";
                        this.belly.src = "2005/penguin/shapes/43.svg";
                        this.EyesFeets.src = "2005/penguin/shapes/52.svg";
                        this.walkCounter++;
                        if(this.walkCounter >= this.walkRate)
                        {
                            this.walkCounter = 0;
                            this.walkFrame = 3;
                        }
                    }
                    else if(this.walkFrame == 3)
                    {
                        this.body.src = "2005/penguin/shapes/35.svg";
                        this.belly.src = "2005/penguin/shapes/44.svg";
                        this.EyesFeets.src = "2005/penguin/shapes/53.svg";
                        this.walkCounter++;
                        if(this.walkCounter >= this.walkRate)
                        {
                            this.walkCounter = 0;
                            this.walkFrame = 4;
                        }
                    }
                    else if(this.walkFrame == 4)
                    {
                        this.body.src = "2005/penguin/shapes/36.svg";
                        this.belly.src = "2005/penguin/shapes/45.svg";
                        this.EyesFeets.src = "2005/penguin/shapes/54.svg";
                        this.walkCounter++;
                        if(this.walkCounter >= this.walkRate)
                        {
                            this.walkCounter = 0;
                            this.walkFrame = 5;
                        }
                    }
                    else if(this.walkFrame == 5)
                    {
                        this.body.src = "2005/penguin/shapes/37.svg";
                        this.belly.src = "2005/penguin/shapes/46.svg";
                        this.EyesFeets.src = "2005/penguin/shapes/55.svg";
                        this.walkCounter++;
                        if(this.walkCounter >= this.walkRate)
                        {
                            this.walkCounter = 0;
                            this.walkFrame = 6;
                        }
                    }
                    else if(this.walkFrame == 6)
                    {
                        this.body.src = "2005/penguin/shapes/38.svg";
                        this.belly.src = "2005/penguin/shapes/47.svg";
                        this.EyesFeets.src = "2005/penguin/shapes/56.svg";
                        this.walkCounter++;
                        if(this.walkCounter >= this.walkRate)
                        {
                            this.walkCounter = 0;
                            this.walkFrame = 7;
                        }
                    }
                    else if(this.walkFrame == 7)
                    {
                        this.body.src = "2005/penguin/shapes/39.svg";
                        this.belly.src = "2005/penguin/shapes/48.svg";
                        this.EyesFeets.src = "2005/penguin/shapes/57.svg";
                        this.walkCounter++;
                        if(this.walkCounter >= this.walkRate)
                        {
                            const LastcurrentDate = new Date();
                            var millidiffrence = LastcurrentDate.getTime() - this.First.getTime();
                            console.log(millidiffrence + "ms");
                            this.walkCounter = 0;
                            this.walkFrame = 0;
                        }
                    }
                }
            }
            else
            {

            }

            var clickOpposite = this.penguinPos.x - _clickPos.x;
            var clickAdjacent = this.penguinPos.y - _clickPos.y;
            var clickHypotenuse = Math.sqrt(Math.pow(clickOpposite, 2) + Math.pow(clickAdjacent, 2))
            var clickOppositeNormalized = clickOpposite/clickHypotenuse;
            var clickAdjacentNormalized = clickAdjacent/clickHypotenuse;

            //a^2 + b^2 = c^2

            if (this.penguinPos.x >= _clickPos.x + this.speed || this.penguinPos.x <= _clickPos.x - this.speed)
            {
                //console.log("y: " + this.penguinPos.x + ", " + _clickPos.x + " x: " + this.penguinPos.y + ", " + _clickPos.y);
                this.penguinPos.x -= clickOppositeNormalized * this.speed;
                this.penguinPos.y -= clickAdjacentNormalized * this.speed;
            }

            var ringXCenter = this.ring.width / 2 * haloSale;
            var ringYCenter = this.ring.height / 2 * haloSale;
            var bodyXCenter = this.body.width / 2  * bodyscale;
            var bodyYCenter = this.body.height / 2  * bodyscale;
            var bellyXCenter = this.belly.width / 2  * bodyscale;
            var bellyXToRingX = ringXCenter - bellyXCenter;
            var BodyXToRingX = ringXCenter - bodyXCenter;
            var BodyYToRingY = ringYCenter - bodyYCenter;
            this.haloPos = {x: this.penguinPos.x - ringXCenter, y: this.penguinPos.y - ringYCenter};
            

            var BodyXOffsetToRingX = BodyXToRingX + bodyXOffset * bodyscale;
            var BodyYOffsetToRingY = BodyYToRingY + bodyYOffset * bodyscale;
            var bellyXOffsetToRingX = bellyXToRingX + bellyXOffset * bodyscale;
            var bellyYOffsetToRingY = BodyYToRingY + bellyYOffset * bodyscale;
            var EyesFeetsXOffsetToRingX = BodyXToRingX + eyeFeetXOffset * bodyscale;
            var EyesFeetsYOffsetToRingY = BodyYToRingY + eyeFeetYOffset * bodyscale;

            //this.haloPos.x += (1 * 0.25);
            context.save();
            if(flipPenguin)
            {
                context.translate(canvas.width, 0);
                context.scale(-1, 1);
                this.haloPos = {x: (Math.abs(this.penguinPos.x - canvas.width)) - ringXCenter, y: this.penguinPos.y - ringYCenter};

                context.drawImage(this.ring, this.haloPos.x, this.haloPos.y, this.ring.width * haloSale, this.ring.height * haloSale);
                context.drawImage(this.body, this.haloPos.x + BodyXOffsetToRingX, this.haloPos.y + BodyYOffsetToRingY, this.body.width * bodyscale, this.body.height * bodyscale);
                if(seeBelly)
                {
                    context.drawImage(this.belly, this.haloPos.x + bellyXOffsetToRingX, this.haloPos.y + bellyYOffsetToRingY, this.belly.width * bodyscale, this.belly.height * bodyscale);
                }
                context.drawImage(this.EyesFeets, this.haloPos.x + EyesFeetsXOffsetToRingX, this.haloPos.y + EyesFeetsYOffsetToRingY, this.EyesFeets.width * bodyscale, this.EyesFeets.height * bodyscale);
            }
            else
            {
                context.drawImage(this.ring, this.haloPos.x, this.haloPos.y, this.ring.width * haloSale, this.ring.height * haloSale);
                context.drawImage(this.body, this.haloPos.x + BodyXOffsetToRingX, this.haloPos.y + BodyYOffsetToRingY, this.body.width * bodyscale, this.body.height * bodyscale);
                if(seeBelly)
                {
                    context.drawImage(this.belly, this.haloPos.x + bellyXOffsetToRingX, this.haloPos.y + bellyYOffsetToRingY, this.belly.width * bodyscale, this.belly.height * bodyscale);
                }
                context.drawImage(this.EyesFeets, this.haloPos.x + EyesFeetsXOffsetToRingX, this.haloPos.y + EyesFeetsYOffsetToRingY, this.EyesFeets.width * bodyscale, this.EyesFeets.height * bodyscale);
            }

            
            context.restore();

            const FFDecRulerNumber = 0.12;
            context.beginPath();
            context.arc(this.haloPos.x + ringXCenter, this.haloPos.y + ringYCenter, (FFDecRulerNumber * 10) * bodyscale, 0, 2 * Math.PI); //FFDec ruler display on the frames for the penguin is 10 times what it is in the scene, the player ring is 10 to 12 from the origin times that by ten and you get the canvas radius from the origin
            context.fillStyle = 'blue';
            context.fill();
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

var CurrentRoom = new Room(1);
penguin = new Penguin(1);
CurrentRoom.LoadRoom(1);


// Animation Loop
function animate() 
{
    //console.log(dataP.innerHTML);

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.imageSmoothingEnabled = false;

    //need a draw order array so I can change if something is behind or infront of the player


    CurrentRoom.DrawRoom();

    if (currentRoom == 1 && penguin.GetPosition().x < 280)
    {
        currentRoom = 2;
    }
    else if (currentRoom == 2 && context.isPointInPath(dockTownMatrixed, penguin.GetPosition().x, penguin.GetPosition().y))
    {
        currentRoom = 1;
    }
    else
    {
    }

    context.globalAlpha = 0.5;
    context.fillStyle = "blue";
    //context.fill(dockTownMatrixed);
    context.globalAlpha = 1;

    penguin.draw({_clickPos: {x: mouseClick.x, y: mouseClick.y}, _mousePos: {x: mouse.x, y: mouse.y}});

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
    //console.log(mouseClick);
}