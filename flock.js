
const height = 800;
const width  = 800;

const boidSize = 8  ;
const density  = 100;
const maxSpeed = 2  ;
const turnVelocity = 100;


const TRAIL_LENGTH = 75;
const RADIUS = 20;
const ACCELERATION_RATE = 0.0001;



class Boid 
{
    constructor(pos, vel, accelaration)
    {
        this.pos = pos;
        this.vel = vel;
        this.accelaration = accelaration;

    }

    getDistance(boid)
    {
        return Math.sqrt((this.pos.x-boid.pos.x)**2 + (this.pos.y-boid.pos.y)**2);
    }

    align(boids, cohesion_rate = 0, seperation_rate = 1, alignment_rate=0, range_value)
    {

        let accSum = {x:0, y:0}

        let diff_posSum = {x:0, y:0}

        let posSum = {x:0, y:0}

        let totalDistance = 0

        let numBoids = 0

        for(let boid of boids)
        {
            const distance = this.getDistance(boid)

            totalDistance += distance

            if(boid!==this && distance<range_value)
            {

                accSum.x += boid.vel.x - this.vel.x 
                accSum.y += boid.vel.y - this.vel.y

                diff_posSum.x += boid.pos.x - this.pos.x
                diff_posSum.y += boid.pos.y - this.pos.y

                posSum.x += boid.pos.x 
                posSum.y += boid.pos.y 


               

                numBoids+=1

            }
            
        }


        if(numBoids > 0)
        {
            console.log("accumulated vel ",accSum)
            
            this.accelaration.x += accSum.x / numBoids * alignment_rate ;
            this.accelaration.y += accSum.y / numBoids * alignment_rate ;

            this.accelaration.x -=  (diff_posSum.x  / numBoids)  * seperation_rate ;
            this.accelaration.y -=  (diff_posSum.y  / numBoids)  * seperation_rate ;

            this.accelaration.x +=  (diff_posSum.x  / numBoids)  * cohesion_rate ;
            this.accelaration.y +=  (diff_posSum.y  / numBoids)  * cohesion_rate ;
        }

        


        console.log("accelaration",this.vel)
        
    }

    draw(sprite)
    {
        ctx.save()

        if(sprite)
        {
            ctx.translate(this.pos.x, this.pos.y );
            ctx.rotate(-(Math.atan2(this.vel.x, this.vel.y) + Math.PI));
            ctx.translate(-this.pos.x, -this.pos.y);
            ctx.drawImage(sprite, this.pos.x - boidSize/2, this.pos.y - boidSize/2, boidSize, boidSize);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        
       else
        {
            ctx.fillStyle = `rgb(0,0,0)`;
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, boidSize, 0, 2 * Math.PI);
            ctx.fill()
        }

        ctx.restore()
    }

    move()
    {

        console.log("Velocity ",this.vel)

        console.log("VelMagnitude",Math.sqrt((this.vel.x)**2,(this.vel.y)**2))

        
        

        this.vel.x += this.accelaration.x * ACCELERATION_RATE;
        this.vel.y += this.accelaration.y * ACCELERATION_RATE;

        
        this.vel.x = (this.vel.x/Math.sqrt((this.vel.x)**2+(this.vel.y)**2))*maxSpeed
        this.vel.y = (this.vel.y/Math.sqrt((this.vel.x)**2+(this.vel.y)**2))*maxSpeed
        
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        
        if(this.pos.x>width)  this.vel.x -= turnVelocity
        if(this.pos.x<0)      this.vel.x += turnVelocity

        if(this.pos.y>height) this.vel.y -= turnVelocity
        if(this.pos.y<0)      this.vel.y += turnVelocity

        this.accelaration.x = 0
        this.accelaration.y = 0
        
    }




}


function check_existence(boid, boids)
{
    if (boids.length > 0)
    {
        console.log(boids)

        for (let i = 0; i < boids.length; i++)
        {
            if (boids[i].pos.x == boid.pos.x && boids[i].pos.y == boid.pos.y) return true;
        }
    }
    return false;
}

/***_____________________________________________________________________________________________________________***/

const boids = []

const boid_path_history = []

for (let i=0; i<density; i++)
{
    current_boid = null;

    while(true)
    {
        x_position = Math.random() * (width  - 200 ) + width/2;
        y_position = Math.random() * (height - 200 ) + height/2;
        current_boid = new Boid
        (
            {x : x_position, y : y_position},
            {x:  Math.random() * 2 - 1 ,   y : Math.random() * 2 - 1},
            {x : 0, y : 0}

        )
        if(!check_existence(current_boid, boids)) break;
    }
    

    boids.push(current_boid)
    boid_path_history.push([]);
    
}

const canvas = document.createElement("canvas");
canvas.id = "canvas";
canvas.width = width;
canvas.height = height;
canvas.style.backgroundColor="#fefefe"

var body = document.getElementsByTagName("body")[0];
body.appendChild(canvas);

const sprite = new Image();
sprite.src = "assets/arrow.png";




const ctx=canvas.getContext("2d");

function update()
{
    const seperation_slider_value = document.getElementById("seperation_slider").value;
    const cohesion_slider_value   = document.getElementById("cohesion_slider"  ).value;
    const alignment_slider_value  = document.getElementById("alignment_slider" ).value;
    const range_slider_value      = document.getElementById("range_slider" ).value;

    ctx.clearRect(0, 0, width, height);

    for(let boid of boids){
        boid.align(boids,
            cohesion_slider_value,
            seperation_slider_value,
            alignment_slider_value,
            range_slider_value);
            
            
            boid_index = boids.indexOf(boid);
            
            boid_path_history[boid_index].push({x : boid.pos.x, y : boid.pos.y });
            
            if(boid_path_history[boid_index] . length > TRAIL_LENGTH) boid_path_history[boid_index].shift();
            
            boid.move();
            
            for (let i = 1; i < boid_path_history[boid_index].length; i++)
            {
                ctx.lineWidth = (i / boid_path_history[boid_index].length) * 3
                ctx.strokeStyle = `rgb(0,50,${(i / boid_path_history[boid_index].length) * 200 + Math.random()*55 })`
                ctx.beginPath()
                ctx.moveTo(boid_path_history[boid_index][i].x , boid_path_history[boid_index][i].y);
                ctx.lineTo(boid_path_history[boid_index][i-1].x, boid_path_history[boid_index][i-1].y)
                ctx.stroke();
            }
            
            boid.draw(sprite);
    }

    requestAnimationFrame(update)
}



update();
