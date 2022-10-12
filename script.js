const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];
let adjustX = 10;
let adjustY = 5;

const mouse = {
    x:null,
    y:null,
    radius:150
}

window.addEventListener("mousemove",function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});

ctx.fillStyle = "white";
ctx.font = "30px Verdana";
ctx.fillText("AK",0,30);

const textCordinates = ctx.getImageData(0,0,100,100);

class Particle {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.size = 3;
        this.baseX = x;
        this.baseY = y;
        this.density = (Math.random() * 40) + 5;
        this.color = "white"
    }

    draw(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;

        let maxDistance = mouse.radius;

        let force = (maxDistance - distance) / maxDistance;

        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if(distance < mouse.radius){
            this.color = "red";
            this.x -= directionX;
            this.y -= directionY;
        }else{
            if(this.x !== this.baseX){
                this.color = "white";
                let dx = this.x - this.baseX;
                this.x -= dx/10;
            }
            if(this.y !== this.baseY){
                this.color = "white";
                let dy = this.y - this.baseY;
                this.y -= dy/10;
            }
        }
    }
}

function init(){
    particleArray = [];
    
    for(let y = 0, y2 = textCordinates.height; y< y2; y++){
        for(let x = 0, x2 = textCordinates.width; x < x2; x++){
            if(textCordinates.data[(y * 4 * textCordinates.width) + (x * 4) + 3] > 128){
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                particleArray.push(new Particle(positionX * 20,positionY * 20));
            }
        }
    }

}
init();

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i = 0; i < particleArray.length; i++){
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}
animate();

function connect(){
    let opacityValue = 1;
    for(let a = 0; a< particleArray.length; a++){
        for(let b = a; b < particleArray.length; b++){
            let dx = particleArray[a].x - particleArray[b].x
            let dy = particleArray[a].y - particleArray[b].y
            let distance = Math.sqrt(dx * dx + dy * dy);
            if(distance < 50){
                opacityValue = 1 - (distance/50);
                ctx.strokeStyle = "rgba(255,105,105," + opacityValue + ")";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x,particleArray[a].y);
                ctx.lineTo(particleArray[b].x,particleArray[b].y);
                ctx.stroke();
            }
        }
    }
}
