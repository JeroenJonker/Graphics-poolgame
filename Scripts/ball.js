class Ball 
{
    constructor(sphereColor, positionx, positiony)
    {
        var sphereMaterial = new THREE.MeshLambertMaterial({color: sphereColor});
        this.ballmesh = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings),sphereMaterial);
        this.ballmesh.position.x = positionx;
        this.ballmesh.position.y = positiony;
        this.ballspeedx = 0;
        this.ballspeedy = 0;
        this.time = 0;
        this.collision = [];
        this.test = -1;
    }
    
    get Positionx()
    {
        return this.ballmesh.position.x;
    }
    
    set Positionx(positionx)
    {
        this.ballmesh.position.x = positionx;
    }
    
    get Positiony()
    {
        return this.ballmesh.position.y;
    }
    
    set Positiony(positiony)
    {
        this.ballmesh.position.y = positiony;
    }
    
    get Speedx()
    {
        return this.ballspeedx;
    }
    
    set Speedx(ballspeedx)
    {
        this.ballspeedx = ballspeedx;
    }
    
    get Speedy()
    {
        return this.ballspeedy;
    }
    
    set Speedy(ballspeedy)
    {
        this.ballspeedy = ballspeedy;
    }
    
    get Time()
    {
        return this.time;
    }
    
    set Time(time)
    {
        this.time = time;
    }
    
    get Collision()
    {
        return this.collision;
    }
    
    set Collision(collision)
    {
        this.collision = collision;
    }
    
    CollisionWith(nr)
    {
        for (var k = 0; k < this.collision.length; k++)
            {
                if (this.collision[k] == nr)
                    return true;
            }
        return false;
    }
    
    RemoveElement(nr)
    {
        var k = [];
        for (var m = 0; m < this.collision.length; m++)
            {
                if (this.collision[m] != nr)
                    {
                        k.push(this.collision[m]);
                    }
            }
        this.collision = k;
    }
    
}