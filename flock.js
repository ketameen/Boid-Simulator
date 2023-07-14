
const height=500;
const width=1000;

const boidSize=5;

const density=60;

const maxSpeed=5;

const ACCELERATION_RATE=0.5

const RADIUS=10



class Boid 
{
    constructor(pos,vel,accelaration)
    {
        this.pos=pos;
        this.vel=vel;
        this.accelaration=accelaration;

    }

    getDistance(boid)
    {
        return Math.sqrt((this.pos.x-boid.pos.x)**2,(this.pos.y-boid.pos.y)**2);
    }

    align(boids)
    {

        let accSum={x:0,y:0}

        //totalMagnitude=0

        for(let boid of boids)
        {
            const distance=this.getDistance(boid)

            if(boid!==this && distance<RADIUS)
            {
            //accSum.x+=boid.accelaration.x/distance
            //accSum.y+=boid.accelaration.y/distance

            accSum.x+=boid.vel.x
            accSum.y+=boid.vel.y

            //accSum.x+=Math.abs(this.pos.x-boid.pos.x)/distance
            //accSum.y+=Math.abs(this.pos.y-boid.pos.y)/distance
            }
            
        }

        this.accelaration.x+=accSum.x/boids.length-this.vel.x
        this.accelaration.y+=accSum.y/boids.length-this.vel.y

        //this.vel.x=accSum.x/boids.length-this.vel.x
        //this.vel.y=accSum.y/boids.length-this.vel.y

        console.log("accelaration",this.vel)
        
    }

    draw()
    {
        //ctx.fillRect(this.pos.x,this.pos.y,boidSize,boidSize);
        ctx.save()
        /*ctx.beginPath();
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(this.pos.x+boidSize, this.pos.y+boidSize);
        ctx.lineTo(this.pos.x-boidSize, this.pos.y+boidSize);
        
        ctx.fill();*/
        
        
        //ctx.translate(this.pos.x,this.pos.y)
        //ctx.rotate(Math.atan2(this.vel.y,this.vel.x));
        //ctx.rotate((Math.PI / 180) * 25);
        ctx.fillRect(this.pos.x,this.pos.y,boidSize,boidSize);
        //ctx.translate(0,0)

        ctx.restore()
    }

    move()
    {

        
        
        if(Math.sqrt((this.vel.x)**2,(this.vel.y)**2)<maxSpeed)
        {
            this.vel.x+=this.accelaration.x * ACCELERATION_RATE;
            this.vel.y+=this.accelaration.y * ACCELERATION_RATE;
        }
        

        this.pos.x+=this.vel.x;
        this.pos.y+=this.vel.y;

        if(this.pos.x>width) this.pos.x=0
        if(this.pos.x<0) this.pos.x=width

        if(this.pos.y>height) this.pos.y=0
        if(this.pos.y<0) this.pos.y=height
    }




}



const boids=[]

for (let i=0;i<density;i++)
{
    boids.push
    (
        new Boid
        (
            {x:Math.random()*width, y:Math.random()*height},
            {x:0,y:0},
            {x:Math.random() * ACCELERATION_RATE,   y:Math.random() * ACCELERATION_RATE}

        )
    )
}

const canvas=document.createElement("canvas");
canvas.id = "canvas";
canvas.width = width;
canvas.height = height;
canvas.style.backgroundColor="lightgray"

var body = document.getElementsByTagName("body")[0];
body.appendChild(canvas);


const ctx=canvas.getContext("2d");

function update()
{

    ctx.clearRect(0,0,width,height);

    for(let boid of boids){
        boid.draw();
        boid.align(boids);
        boid.move();
    }
    requestAnimationFrame(update)
}
update();
