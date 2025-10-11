const dataP = document.querySelector("#data");
const button = document.querySelector("button");
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

//https://www.youtube.com/watch?v=54BmDU2IRwc

//Have a svg path2d that checks, if you're on this side of the world sprite render the sprite on top otherwise the penguin renders on top
//This.images[]
//This.path2d[]

//Have the RoomData inside a js cause it doesn't need to change during game but player data like cloths bought/wearing, coins will be a json, also igloo data will be in a diffrent json.
//I'll have a player template json then populated it as they play, it'll be save every so often as cookies and they can down load/upload they're files cause it won't persist except cookies.

var date = "August 22, 2005";

var mouse = {x: 0, y: 0}
var clicked = false;
var mouseClick = {x: 0, y: 0}

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
    constructor()
    {
        this.roomID = 0;
        this.roomsIndex = 0;
        this.roomSpawn = {x: 0, y:0};
        this.hasMusic = false;
        this.roomMusic;
        this.images = [];
        this.imagesPositions = [];
        this.imagesScales = [];

        this.drawDoors = true;
        this.doors = [];
        this.passRoomIDs = [];
        this.doorSpawns = [];

        this.drawboundary = false;
        this.boundary;
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
        this.roomSpawn = {x: rooms[this.roomsIndex].spawnPosX, y: rooms[this.roomsIndex].spawnPosY};

        this.hasMusic = rooms[this.roomsIndex].hasMusic;
        if (this.hasMusic)
        {
            this.roomMusic = new Audio(rooms[this.roomsIndex].musicPath);
        }

        //console.log(rooms[this.roomsIndex].images);
        this.images.length = 0;
        this.imagesPositions.length = 0;
        this.imagesScales.length = 0;
        for(var i = 0; i < rooms[this.roomsIndex].images.length; i++)
        {
            const image = new Image();
            image.src = rooms[this.roomsIndex].images[i].path;
            this.images.push(image);
            this.imagesPositions.push({x: rooms[this.roomsIndex].images[i].positionX, y: rooms[this.roomsIndex].images[i].positionY});
            this.imagesScales.push({x: rooms[this.roomsIndex].images[i].scaleX, y: rooms[this.roomsIndex].images[i].scaleY});
        }

        
        this.doors.length = 0;
        this.passRoomIDs.length = 0;
        this.doorSpawns.length = 0;
        if( rooms[this.roomsIndex].doors != null)
        {
            for(var i = 0; i < rooms[this.roomsIndex].doors.length; i++)
            {
                const rawPath = new Path2D(rooms[this.roomsIndex].doors[i].pathD);
                const tMValues = rooms[this.roomsIndex].doors[i].transformMatrix.split(",");

                const transMatrix = new DOMMatrix();
                var tempPath = new Path2D();
                var finalPath = new Path2D();
                
                transMatrix.a = tMValues[0];
                transMatrix.b = tMValues[1];
                transMatrix.c = tMValues[2];
                transMatrix.d = tMValues[3];
                transMatrix.e = tMValues[4];
                transMatrix.f = tMValues[5];
                tempPath.addPath(rawPath, transMatrix);

                const tanScaleMatrix = new DOMMatrix();
                tanScaleMatrix.translateSelf(rooms[this.roomsIndex].doors[i].positionX, rooms[this.roomsIndex].doors[i].positionY);
                tanScaleMatrix.scaleSelf(rooms[this.roomsIndex].doors[i].scale)
                finalPath.addPath(tempPath, tanScaleMatrix);
                this.doors.push(finalPath);
                this.passRoomIDs.push(rooms[this.roomsIndex].doors[i].passRoomID);
                this.doorSpawns.push({x: rooms[this.roomsIndex].doors[i].setPosX, y: rooms[this.roomsIndex].doors[i].setPosY});
            }
        }

        this.boundary = null;
        if( rooms[this.roomsIndex].boundary != null)
        {
            const rawPath = new Path2D(rooms[this.roomsIndex].boundary.pathD);
            const tMValues = rooms[this.roomsIndex].boundary.transformMatrix.split(",");

            const transMatrix = new DOMMatrix();
            var tempPath = new Path2D();
            var finalPath = new Path2D();
            
            transMatrix.a = tMValues[0];
            transMatrix.b = tMValues[1];
            transMatrix.c = tMValues[2];
            transMatrix.d = tMValues[3];
            transMatrix.e = tMValues[4];
            transMatrix.f = tMValues[5];
            tempPath.addPath(rawPath, transMatrix);

            const tanScaleMatrix = new DOMMatrix();
            tanScaleMatrix.translateSelf(rooms[this.roomsIndex].boundary.positionX, rooms[this.roomsIndex].boundary.positionY);
            tanScaleMatrix.scaleSelf(rooms[this.roomsIndex].boundary.scale)
            finalPath.addPath(tempPath, tanScaleMatrix);
            this.boundary = finalPath;
        }
    }
    DrawRoom()
    {
        for(var i = 0; i < this.images.length; i++)
        {
            //console.log(this.imagesPositions[0].x + " " + this.imagesPositions[0].y);
            context.drawImage(this.images[i], this.imagesPositions[i].x, this.imagesPositions[i].y, this.images[i].width * this.imagesScales[i].x, this.images[i].height * this.imagesScales[i].y);
        }
        if(this.drawDoors)
        {
            for(var i = 0; i < this.doors.length; i++)
            {
                context.globalAlpha = 0.5;
                context.fillStyle = "blue";
                context.fill(this.doors[i]);
                context.globalAlpha = 1;
            }
        }
        if(this.drawboundary && this.boundary)
        {
            context.globalAlpha = 0.5;
            context.fillStyle = "red";
            context.fill(this.boundary);
            context.globalAlpha = 1;
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
        this.penguinPos = {x: 0, y: 0};
        this.action = 0;

        this.First;
        this.walkFrame = 0;
        this.walkCounter = 0;
        this.walkRate = 3;
        this.cancelMovement = false;
        this.checkNextStep = {x: 0, y: 0};

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
    draw({_clickPos, _mousePos}, _boundary)
    {
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

            if(clicked)
            {
                this.cancelMovement = false;
                console.log(_clickPos);
                var clickOpposite = this.penguinPos.x - _clickPos.x;
                var clickAdjacent = this.penguinPos.y - _clickPos.y;
                var clickHypotenuse = (Math.sqrt(Math.pow(clickOpposite, 2) + Math.pow(clickAdjacent, 2)) / this.speed)
                clickOppositeNormalized = clickOpposite/clickHypotenuse;
                clickAdjacentNormalized = clickAdjacent/clickHypotenuse;
                clicked = false;
            }

            var checkOpposite = this.penguinPos.x - _clickPos.x;
            var checkAdjacent = this.penguinPos.y - _clickPos.y;
            var checkHypotenuse = (Math.sqrt(Math.pow(checkOpposite, 2) + Math.pow(checkAdjacent, 2)) / this.speed);

            //check a few pixels in front of the moving penguin so it stops put the penguin pos stays inside the walkable area
            this.checkNextStep.x = this.penguinPos.x - clickOppositeNormalized;
            this.checkNextStep.y = this.penguinPos.y - clickAdjacentNormalized;
            if(_boundary)
            {
                if(context.isPointInPath(_boundary, this.checkNextStep.x, this.checkNextStep.y))
                {
                    this.cancelMovement = true;
                }
            }

            if (checkHypotenuse > 1 && _clickPos.x != 0 && !this.cancelMovement)
            {
                this.penguinPos.x -= clickOppositeNormalized;
                this.penguinPos.y -= clickAdjacentNormalized;
            }
            else
            {
                if( _clickPos.x != 0 && !this.cancelMovement)
                {
                    this.penguinPos = _clickPos;
                }
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
    SetPosition(_penguinPos)
    {
        this.penguinPos = _penguinPos;
    }
    GetPosition()
    {
        return this.penguinPos;
    }
}

var CurrentRoom = new Room();
CurrentRoom.LoadRoom(100);
if(CurrentRoom.hasMusic)
{
    CurrentRoom.roomMusic.play();
    CurrentRoom.roomMusic.loop = true;
}

penguin = new Penguin(1);
penguin.SetPosition(CurrentRoom.roomSpawn);

var clickOppositeNormalized;
var clickAdjacentNormalized;

// Animation Loop
function animate() 
{
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = false;

    //need a draw order array so I can change if something is behind or infront of the player

    CurrentRoom.DrawRoom();
    penguin.draw({_clickPos: {x: mouseClick.x, y: mouseClick.y}, _mousePos: {x: mouse.x, y: mouse.y}}, CurrentRoom.boundary);

    for(var i = 0; i < CurrentRoom.doors.length; i++)
    {
        if(context.isPointInPath(CurrentRoom.doors[i], penguin.GetPosition().x, penguin.GetPosition().y))
        {
            penguin.cancelMovement = true;
            console.log(CurrentRoom.doorSpawns[i]);
            penguin.SetPosition(CurrentRoom.doorSpawns[i]);
            CurrentRoom.LoadRoom(CurrentRoom.passRoomIDs[i]);
            CurrentRoom.roomMusic.pause();
            CurrentRoom.roomMusic.currentTime = 0;
            if(CurrentRoom.hasMusic)
            {
                CurrentRoom.roomMusic.play();
                CurrentRoom.roomMusic.loop = true;
            }
        }
    }
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