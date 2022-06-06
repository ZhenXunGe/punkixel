import getWorld from "./world";

interface Drop {
    x: number;
    y: number;
    l: number;
    xs: number;
    ys: number;
  }
  class Rain {
    init: Drop[];
    maxParts: number;
    particles: Drop[];
    w: number;
    h: number;
    constructor(w: number, h: number) {
      this.init = [];
      this.particles = [];
      this.maxParts = 1000;
      this.w = w;
      this.h = w;
      for (var a = 0; a < this.maxParts; a++) {
        this.init.push({
          x: Math.random() * w,
          y: Math.random() * h,
          l: Math.random() * 1,
          xs: -4 + Math.random() * 4 + 2,
          ys: Math.random() * 10 + 10
        })
      }
      for(var b = 0; b < this.maxParts; b++) {
        this.particles.push(this.init[b]);
      }
    }
    move() {
      for(var b = 0; b < this.particles.length; b++) {
        var p = this.particles[b];
        p.x += p.xs;
        p.y += p.ys;
        if(p.x > this.w || p.y > this.h) {
          p.x = Math.random() * this.w;
          p.y = -20;
        }
      }
    }
  }
  
  interface SnowDrop {
    x: number;
    y: number;
    r: number;
    d: number;
  }
  class Snow {
    mp: number;
    particles: SnowDrop[];
    w: number;
    h: number;
    angle: number;
    constructor(w: number, h: number) {
      //snowflake particles
      this.mp = 50; //max particles
      this.particles = [];
    this.w = w;
    this.h = h;
    this.angle = 0;
      for(var i = 0; i < this.mp; i++)
      {
          this.particles.push({
              x: Math.random()*this.w, //x-coordinate
              y: Math.random()*this.h, //y-coordinate
              r: Math.random()*4+1, //radius
              d: Math.random()*this.mp //density
          })
      }
    }
    update() {
      //Function to move the snowflakes
      //angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
          this.angle += 0.01;
          for(var i = 0; i < this.mp; i++)
          {
              var p = this.particles[i];
              //Updating X and Y coordinates
              //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
              //Every particle has its own density which can be used to make the downward movement different for each flake
              //Lets make it more random by adding in the radius
              p.y += Math.cos(this.angle+p.d) + 1 + p.r/2;
              p.x += Math.sin(this.angle) * 2;
              
              //Sending flakes back from the top when it exits
              //Lets make it a bit more organic and let flakes enter from the left and right also.
              if(p.x > this.w+5 || p.x < -5 || p.y > this.h)
              {
                  if(i%3 > 0) //66.67% of the flakes
                  {
                      this.particles[i] = {x: Math.random()*this.w, y: -10, r: p.r, d: p.d};
                  }
                  else
                  {
                      //If the flake is exitting from the right
                      if(Math.sin(this.angle) > 0)
                      {
                          //Enter from the left
                          this.particles[i] = {x: -5, y: Math.random()*this.h, r: p.r, d: p.d};
                      }
                      else
                      {
                          //Enter from the right
                          this.particles[i] = {x: this.w+5, y: Math.random()*this.h, r: p.r, d: p.d};
                      }
                  }
              }
          }
      }
  }
  const rain = new Rain(1000, 400);
  const snow = new Snow(1000, 400);
  
  export function drawWeatherRain(canvas: HTMLCanvasElement) {
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d')!;
      var w = canvas.width;
      var h = canvas.height;
      ctx.strokeStyle = 'rgba(174,194,224,0.5)';
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.clearRect(0, 0, w, h);
      for (var c = 0; c < rain.particles.length; c++) {
        var p = rain.particles[c];
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.l * p.xs, p.y + p.l * p.ys);
        ctx.stroke();
      }
      rain.move();
    }
  };


  export function drawMesh(canvas: HTMLCanvasElement, size: number) {
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d')!;
      var w = canvas.width;
      var h = canvas.height;
      ctx.strokeStyle = 'rgba(174,194,224,0.5)';
      ctx.lineWidth = 1;
      for (var c = 0; c < w; c = c + size) {
        ctx.beginPath();
        ctx.moveTo(c, 0);
        ctx.lineTo(c, 400);
        ctx.stroke();
      }
      for (var y = 400; y > 0; y = y - size) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1000, y);
        ctx.stroke();
      }
      rain.move();
    }
  };
  
  
      
      //Lets draw the flakes
  export function drawWeatherSnow(canvas: HTMLCanvasElement) {
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d')!;
      var w = canvas.width;
      var h = canvas.height;
      ctx.clearRect(0, 0, w, h);
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.beginPath();
          for(var i = 0; i < snow.mp; i++)
          {
              var p = snow.particles[i];
              ctx.moveTo(p.x, p.y);
              ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
          }
          ctx.fill();
          snow.update();
    }
  }

  export function drawWeather(canvas: HTMLCanvasElement) {
    let weather = getWorld().weather;
    if (weather == "rain") {
      drawWeatherRain(canvas);
    } else if (weather == "snow") {
      drawWeatherSnow(canvas);
    } else {
      var ctx = canvas.getContext('2d')!;
      var w = canvas.width;
      var h = canvas.height;
      ctx.clearRect(0, 0, w, h);
    }
  }
    
