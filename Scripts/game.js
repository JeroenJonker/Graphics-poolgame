function setup()
{

  draw();
}


// set the scene size
var WIDTH = 640,
HEIGHT = 360;

// create a WebGL renderer, camera
// and a scene
var renderer = new THREE.WebGLRenderer();

// start the renderer
renderer.setSize(WIDTH, HEIGHT);

var VIEW_ANGLE = 50,
	  ASPECT = WIDTH / HEIGHT,
	  NEAR = 0.1,
	  FAR = 10000;

camera = new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR);

scene = new THREE.Scene();

// add the camera to the scene
scene.add(camera);
camera.position.z = 100;

//--- TEXTURE LOADER ---
var textureLoader = new THREE.TextureLoader();
var woodmaterial = new THREE.MeshPhongMaterial({map: textureLoader.load('textures/photos-2016-9-1-fst_840fcd2b47a-9065-4481-98e1-9d5d4f66b32e.jpg')});
var sheetmaterial = new THREE.MeshPhongMaterial({map: textureLoader.load('textures/green_sheet.jpg')});
var undersheetmaterial = new THREE.MeshPhongMaterial({color: 0x000000});

//---PLAYERS ---
var players = [new Player(1), new Player(2)];
var currentplayer = 1;

/* ----BALLS -- */
// lower 'segment' and 'ring' values will increase performance
var radius = 5,
segments = 6,
rings = 6;

var initballlocations = [[-100,0],[50,0],[59,-7],[59,7],[68,0],[68,14],[68,-14],[77,7], [77,-7], [77,21],[77,-21],[86,0],[86,14],[86,-14],[86,28],[86,-28]];
var balls =[];

for (var i = 0; i < 16; i++)
    {
        if (i == 0)
        {
            var ball = new Ball(0xffffff, (initballlocations[i][0]),(initballlocations[i][1]));
        }
        else if (i == 4)
        {
            var ball = new Ball(0x000000, (initballlocations[i][0]),(initballlocations[i][1]));
        }
        else if (i % 2 == 1)
        {
            var ball = new Ball(0xD43001, (initballlocations[i][0]),(initballlocations[i][1]));
        }
        else
        {
            var ball = new Ball(0xFFFF00, (initballlocations[i][0]),(initballlocations[i][1]));
        }
        balls.push(ball);
        scene.add(ball.ballmesh);
    }

//balls[0].Speedx = 1;
var ballslength = balls.length;

//-- HOLES ---
var hole1 = new Ball(0xffffff, -190,90);
var hole2 = new Ball(0xffffff, 0,90);
var hole3 = new Ball(0xffffff, 190,90);
var hole4 = new Ball(0xffffff, 190,-90);
var hole5 = new Ball(0xffffff, 0,-90);
var hole6 = new Ball(0xffffff, -190,-90);

var holes = [hole1, hole2, hole3, hole4, hole5, hole6];

// ----LIGHTPOINT --
pointLight = new THREE.PointLight(0xF8D898);

// set its position
pointLight.position.x = 0;
pointLight.position.y = 0;
pointLight.position.z = 275;
pointLight.intensity = 1.3;
pointLight.distance = 10000;

// add to the scene
scene.add(pointLight);

// ---PLANE --
var planeMaterial =
new THREE.MeshLambertMaterial(
{
    color: 0x4BD121
});

var planeWidth = 400,
    planeHeight = 200,
    planeQuality = 10;

// create the playing surface plane
var plane = new THREE.Mesh(
    new THREE.PlaneGeometry(
    planeWidth * 0.95,	// 95% of table width, since we want to show where the ball goes out-of-bounds
    planeHeight,
    planeQuality,
    planeQuality),
    planeMaterial);

//--- BOX PLANE --
var underbox = new THREE.Mesh( new THREE.BoxGeometry( 400, 200, 0.2 ) );
underbox.material = undersheetmaterial;
underbox.position.z = -8;
scene.add(underbox);
var box = new THREE.Mesh( new THREE.BoxGeometry( 400, 200, 0.2 ) );
var cube_bsp = new ThreeBSP( box );

var cutgeo = new THREE.SphereGeometry( radius + 5, 0, 0 );

var coordinates = [[-190,-90,0],[190,0,0], [190,0,0],[0,180,0],[-190,0,0], [-190,0,0]]
var result;


for (var i = 0; i < 6; i ++)
{
    var coords = coordinates[i];

    var matrix = new THREE.Matrix4();
        matrix.setPosition( new THREE.Vector3(coords[0],coords[1], coords[2]) );	
        cutgeo.applyMatrix( matrix );

    var sub =  new THREE.Mesh( cutgeo );
    var substract_bsp  = new ThreeBSP( sub );
    var subtract_bsp  = cube_bsp.subtract( substract_bsp );
    cube_bsp = subtract_bsp;

    result = subtract_bsp.toMesh(); 
}

    result.geometry.computeVertexNormals();
	var ceilingMaterial = new THREE.MeshPhongMaterial ( {
			color:0x4BD121, 
        	shading: THREE.FlatShading,
		} );
//    var sheetmaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('textures/green_sheet.jpg') } );
    
    result.material = sheetmaterial;
    
    scene.add( result );
result.position.z = -6;

//scene.add(plane);
plane.position.z = -6;

//-- BORDERS ---
var border = new THREE.Mesh( new THREE.BoxGeometry( 390, 10, 10 ) );
border.material = woodmaterial;
scene.add(border);
border.position.y = 100;
border.position.z = -2;

var border = new THREE.Mesh( new THREE.BoxGeometry( 390, 10, 10 ) );
border.material = woodmaterial;
scene.add(border);
border.position.y = -100;
border.position.z = -2;

var border = new THREE.Mesh( new THREE.BoxGeometry( 10, 210, 10 ) );
border.material = woodmaterial;
scene.add(border);
border.position.x = 200;
border.position.z = -2;

var border = new THREE.Mesh( new THREE.BoxGeometry( 10, 210, 10 ) );
//border.material = ceilingMaterial;
border.material = woodmaterial;
scene.add(border);
border.position.x = -200;
border.position.z = -2;

//-- KEU ---
var cyl_width = 5;
var cyl_height = 150;
var cylGeometry = new THREE.CylinderGeometry(cyl_width, 1, cyl_height, 20, 1, false);
// translate the cylinder geometry so that the desired point within the geometry is now at the origin
cylGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, cyl_height/2, 0 ) );
var cylinder = new THREE.Mesh(cylGeometry, woodmaterial);
cylinder.rotation.z = Math.PI/2;
cylinder.rotation.y = Math.PI/8;
var pivot = new THREE.Object3D();
balls[0].ballmesh.add(pivot);
pivot.add( cylinder );

var movingballsstate = false;
var rotationresetstate = true;
var clicks = 0;

//--- BACKGROUND IMAGE --
// Load the background texture
var backgroundmaterial = new THREE.MeshBasicMaterial({map: textureLoader.load('textures/WP_20161016_027.jpg')});
var backgroundMesh = new THREE.Mesh(
new THREE.PlaneGeometry(2, 2, 0), backgroundmaterial);

backgroundMesh.material.depthTest = false;
backgroundMesh.material.depthWrite = false;

// Create your background scene
var backgroundScene = new THREE.Scene();
var backgroundCamera = new THREE.Camera();
backgroundScene .add(backgroundCamera );
backgroundScene .add(backgroundMesh );

//--- DRAW ---
//Constant herhalende functie.
function draw()
{
// attach the render-supplied DOM element (the gameCanvas)
var c = document.getElementById("gameCanvas");
c.appendChild(renderer.domElement);
    // draw THREE.JS scene
    renderer.render(scene, camera);
    
    //background image //
    renderer.autoClear = false;
    renderer.clear();
    renderer.render(backgroundScene , backgroundCamera );
    renderer.render(scene, camera);
    
    // begin new turn
    if (!(movingballsstate) && rotationresetstate)
    {
        if (balls[0].Positionx == 1000 && balls[0].Positiony == 1000)
            {
                balls[0].Positionx = -50;
                balls[0].Positiony = 0;
                players[currentplayer].scored = false;
            }
        if (players[currentplayer].scored == false)
            {
                currentplayer = (currentplayer + 1) % 2;
                document.getElementById("player").innerHTML = players[currentplayer].playername;
            }
        players[currentplayer].scored = false;
        balls[0].Speedx = 1;
        balls[0].Speedy = 0;
        cylinder.visible = true;
//        cylinder.rotation.z = Math.PI/2; ;
        balls[0].ballmesh.rotation.z = 0; 
        rotationresetstate = false;
        clicks = 0;
        
        for (x = 0; x < balls.length; x++)
            {
                if (balls[x].collision.length != 0)
                    {
                        console.log(balls[x].collision + " " + x);
                    }
                else
                    {
                        console.log("no problems with ballnr: " + x);
                    }
            }
            
        // camera position //
        if (balls[0].Positionx <= -25)
        {
            camera.position.x = -275;
            camera.rotation.z = -90 * Math.PI/180;
            camera.rotation.y = -60 * Math.PI/180;
        }
        if (balls[0].Positionx >= 25)
        {
            camera.position.x = 275;
            camera.rotation.z = 90 * Math.PI/180;
            camera.rotation.y = 60 * Math.PI/180;
        }
    }
    
    if (Key.isDown(Key.SPACE) && !movingballsstate)	
    {
        balls[0].Speedx *= 5; 
        balls[0].Speedy *= 5; 
        movingballsstate = true;
    }
    
    if ((Key.isDown(Key.A) || Key.isDown(Key.D)) && !movingballsstate)	
    {
        balls[0].Speedx = Math.cos( clicks );
        balls[0].Speedy = Math.sin( clicks );
        if (Key.isDown(Key.A))
        {
            balls[0].ballmesh.rotation.z -= Math.PI/100;    
            clicks -= Math.PI/100;
        }
        else
        {
            balls[0].ballmesh.rotation.z += Math.PI/100 ;
            clicks += Math.PI/100;
        }
    }
    
    if (movingballsstate)
        {
        cylinder.visible = false;
        cylinder.rotation.z = Math.PI/2;
        for (j=0; j < ballslength; j++)
            {
                if (balls[j].Speedx == 0)
                    {
                        continue;
                    }
                balls[j].Time++;
                if (Math.abs(balls[j].Speedx) < 0.15 && Math.abs(balls[j].Speedy) < 0.15 )
                    {
                        balls[j].Speedx = 0;
                        balls[j].Speedy = 0;
                        balls[j].Time = 0;
                        continue;
                    }
                balls[j].Speedx = MoveBalls(balls[j], balls[j].Speedx, balls[j].Time, true);
                balls[j].Speedy = MoveBalls(balls[j], balls[j].Speedy, balls[j].Time, false);
                ballCollision(balls[j], j);
            }
        
            for (j=0; j < ballslength; j++)
            {
                holeCollision(balls[j], j);
            }
            var j = 0;
            while (balls[j].Speedx == 0 && balls[j].Speedy == 0 )
                {
                    if (j == (ballslength - 1))
                        {
                            movingballsstate = false;
                            rotationresetstate = true;
                            break;
                        }
                    j++;
                }
        }

    // loop the draw() function
    requestAnimationFrame(draw);
}

//--- MoveBalls ---
//geeft de nieuwe speed in x of y as.
function MoveBalls(ball, ballspeed, balltijd, boolx)
{
    if (ballspeed < 0)
    {
        ballspeed += Math.pow(((balltijd * ballspeed) * 0.0004),2);
    }
    else if (ballspeed > 0)
    {
        ballspeed -= Math.pow(((balltijd * ballspeed) * 0.0004),2);
    }
    if (boolx)
    {
        ballspeed *= WallCollision(ball.Positionx, 191);
        ball.Positionx += ballspeed;
    }
    else
    {
        ballspeed *= WallCollision(ball.Positiony, 91);
        ball.Positiony += ballspeed
    }
    return ballspeed;
}

//--- BallenColission --
//als er collission is veranderd de ballrichting en snelheid.
function ballCollision(ball, nr)
{
    for (i=0; i< ballslength; i++)
        {
            if (!(i == nr))
                {
                    if (checkCollision(ball, balls[i]))
                    {
                        bal1posx = ball.Positionx;
                        bal2posx = balls[i].Positionx;
                        
                        bal1posy = ball.Positiony;
                        bal2posy = balls[i].Positiony;
                        
                        var xv = bal1posx - bal2posx;
				        var zv = bal1posy - bal2posy;
                        
                        distance = Math.sqrt(
                        Math.pow((bal1posx - bal2posx),2) + Math.pow((bal1posy - bal2posy),2));
                        var incollision = balls[nr].CollisionWith(i);
                        if (distance < (radius + radius) && !(incollision))
                        {
                            distance *= distance;
				            var factor = (balls[nr].Speedx-balls[i].Speedx) * xv + (balls[nr].Speedy -  balls[i].Speedy) * zv;
				            xv *= factor/distance;
				            zv *= factor/distance;
				            balls[nr].Speedx -= xv;
				            balls[nr].Speedy -= zv;
				            balls[i].Speedx += xv;
				            balls[i].Speedy += zv;
                            balls[i].Time = balls[nr].Time;
                            balls[nr].Time = 0;
                            balls[nr].Collision.push(i);
                            balls[i].Collision.push(nr);
                        }
                        else if (distance < (radius + radius) && incollision)
                        {
                             continue;
                        }
                        else
                        {
                            balls[nr].RemoveElement(i);
                            balls[i].RemoveElement(nr);
                        }
                    }
                    else
                    {
                        balls[nr].RemoveElement(i);
                        balls[i].RemoveElement(nr);
                    }
                }
        }
}

//--- Wallcollision 
//geeft negatieve waarde wanneer collission met de muur
function WallCollision(ballposition, collsionposition)
{
    if (ballposition > collsionposition || ballposition < -(collsionposition) )
    {
         return -1;   
    }
    return 1;
}

//--- holeCollision --
//als er collission is met een hole.
function holeCollision(ball, nr)
{
    for (i=0; i<6; i++)
        {
            if (checkCollision(ball, holes[i]))
                    {
                        bal1posx = ball.Positionx;
                        bal2posx = holes[i].Positionx;
                        
                        bal1posy = ball.Positiony;
                        bal2posy = holes[i].Positiony;
                        
                        var xv = bal1posx - bal2posx;
				        var zv = bal1posy - bal2posy;
                        

                        distance = Math.sqrt(
                        Math.pow((bal1posx - bal2posx),2) + Math.pow((bal1posy - bal2posy),2));
                        if (distance < (radius + radius))
                        {
                            if (nr != 0)
                            {
	                            players[currentplayer].score++;
                                players[currentplayer].scored = true;
                            }
                            
	                       document.getElementById("scores").innerHTML = players[0].score + "-" + players[1].score;
                            balls[nr].Positionx = 1000;
                            balls[nr].Positiony = 1000;
                            balls[nr].Speedx = 0;
                            balls[nr].Speedy = 0;
                            balls[nr].Time = 0;
                        }
                    }
        }
}

function checkCollision(ballcheck, roundcheck)
{
    if(ballcheck.Positionx + radius + radius > roundcheck.Positionx 
        && ballcheck.Positionx < roundcheck.Positionx + radius + radius
        && ballcheck.Positiony + radius + radius > roundcheck.Positiony 
        && ballcheck.Positiony < roundcheck.Positiony + radius + radius)
    {
        return true;
    }
    return false;
}