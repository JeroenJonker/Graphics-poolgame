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

// set a default position for the camera
// not doing this somehow messes up shadow rendering
camera.position.z = 320;


//---PLAYER ---
var score1 = 0;
var score2 = 0;
var players = [new Player(1), new Player(2)];
var currentplayer = 1;

for (var i = 0; i < 2; i++)
    {
       console.log(players[i]); 
    }

/* ----BALLS -- */
// lower 'segment' and 'ring' values will increase performance
var radius = 5,
segments = 6,
rings = 6;

//var ball1 = new Ball(0xffffff, -50,0);
//var ball2 = new Ball(0xD43001, 9,0);
//var ball3 = new Ball(0xD43001, 18,-7);
//var ball4 = new Ball(0xD43001, 18,7);
//var ball5 = new Ball(0xFFFF00, 27,0);
//var ball6 = new Ball(0xFFFF00, 27,14);
//var ball7 = new Ball(0xFFFF00, 27,-14);
//var ball8 = new Ball(0xFFFF00, 36,7);
//var ball9 = new Ball(0xFFFF00, 36,-7);
//var ball10 = new Ball(0xFFFF00, 36,21);
//var ball11 = new Ball(0xFFFF00, 36,-21);

var initballlocations = [[-50,0],[9,0],[18,-7],[18,7],[27,0],[27,14],[27,-14],[36,7], [36,-7], [36,21],[36,-21],[45,0],[45,14],[45,-14],[45,28],[45,-28]];
//var balls = [ball1, ball2, ball3, ball4, ball5, ball6, ball7, ball8, ball9, ball10, ball11];
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

//for (i = 0; i < balls.length; i++)
//    {
//        scene.add(balls[i].ballmesh);
//    }
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
pointLight.position.x = -1000;
pointLight.position.y = 0;
pointLight.position.z = 1000;
pointLight.intensity = 2.9;
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

//--- BBOX PLANE --
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
    
    result.material = ceilingMaterial;
    
    scene.add( result );
result.position.z = -6;

//scene.add(plane);
plane.position.z = -6;

//-- BORDERS ---
var border = new THREE.Mesh( new THREE.BoxGeometry( 390, 10, 10 ) );
border.material = ceilingMaterial;
scene.add(border);
border.position.y = 100;

var border = new THREE.Mesh( new THREE.BoxGeometry( 390, 10, 10 ) );
border.material = ceilingMaterial;
scene.add(border);
border.position.y = -100;

var border = new THREE.Mesh( new THREE.BoxGeometry( 10, 210, 10 ) );
border.material = ceilingMaterial;
scene.add(border);
border.position.x = 200;

var border = new THREE.Mesh( new THREE.BoxGeometry( 10, 210, 10 ) );
border.material = ceilingMaterial;
scene.add(border);
border.position.x = -200;

//-- KEU ---
var cyl_material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
var cyl_width = 5;
var cyl_height = 50;
// THREE.CylinderGeometry(bottomRadius, topRadius, height, segmentsRadius, segmentsHeight, openEnded )
var cylGeometry = new THREE.CylinderGeometry(cyl_width, 1, cyl_height, 20, 1, false);
// translate the cylinder geometry so that the desired point within the geometry is now at the origin
cylGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, cyl_height/2, 0 ) );
var cylinder = new THREE.Mesh(cylGeometry, cyl_material);
cylinder.rotation.z = Math.PI/2;
//cylinder.position.y = balls[0].Positiony;
//cylinder.position.x = balls[0].Positionx;
cylinder.rotation.y = Math.PI/6;
var pivot = new THREE.Object3D();
//ball1.ballmesh.add(pivot);
balls[0].ballmesh.add(pivot);
pivot.add( cylinder );

//	camera.position.x = ball1.Positionx - 350;
//	camera.position.y += (ball1.Positiony - camera.position.y) * 0.05;
//	camera.position.z = ball1.ballmesh.position.z + 100 + 0.04 * (-ball2.Positionx + ball1.Positionx);
//
//	// rotate to face towards the opponent
//	camera.rotation.x = -0.01 * (ball2.Positiony) * Math.PI/180;
//	camera.rotation.y = -60 * Math.PI/180;
//	camera.rotation.z = -90 * Math.PI/180;

//cameramultiplierx = 10;
//cameramultipliery = -10;

var movingballsstate = false;
var rotationresetstate = true;
var clicks = 0;

//--- DRAW ---
//Constant herhalende functie.
function draw()
{
// attach the render-supplied DOM element (the gameCanvas)
var c = document.getElementById("gameCanvas");
c.appendChild(renderer.domElement);
    // draw THREE.JS scene
    renderer.render(scene, camera);
    
//    camera.position.x = -260;
//    camera.position.z = 100;
//    camera.rotation.z = -90 * Math.PI/180;
//    camera.rotation.y = -60 * Math.PI/180;
    
//console.log(balls[0].collision);
//    console.log(balls[2].collision);
//    
    
//        camera.position.z = 10;
    if (!(movingballsstate) && rotationresetstate)
    {
//        cylinder.position.y = balls[0].Positiony;
//        cylinder.position.x = balls[0].Positionx;
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
            
//        console.log(balls[0].Speedx);
//        console.log(balls[0].Speedy);
    }
    
    if (Key.isDown(Key.SPACE) && !movingballsstate)	
    {
        balls[0].Speedx *= 5; 
        balls[0].Speedy *= 5; 
        movingballsstate = true;
    }
    
    if (Key.isDown(Key.A) && !movingballsstate)	
    {
        balls[0].Speedx = Math.cos( clicks );
        balls[0].Speedy = Math.sin( clicks );
        balls[0].ballmesh.rotation.z -= Math.PI/100;    
        clicks -= Math.PI/100;
    }
    
    if (Key.isDown(Key.D) && !movingballsstate)	
    {
        balls[0].Speedx = Math.cos( clicks );
        balls[0].Speedy = Math.sin( clicks );
        balls[0].ballmesh.rotation.z += Math.PI/100 ;
        clicks += Math.PI/100;
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
//                ballCollision(balls[j], j);
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
                    if (ball.Positionx + radius + radius > balls[i].Positionx 
                        && ball.Positionx < balls[i].Positionx + radius + radius
                        && ball.Positiony + radius + radius > balls[i].Positiony 
                        && ball.Positiony < balls[i].Positiony + radius + radius)
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
                    if (ball.Positionx + radius + radius > holes[i].Positionx 
                        && ball.Positionx < holes[i].Positionx + radius + radius
                        && ball.Positiony + radius + radius > holes[i].Positiony 
                        && ball.Positiony < holes[i].Positiony + radius + radius)
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
//                            balls[nr].ballmesh.visible = false;
                            
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