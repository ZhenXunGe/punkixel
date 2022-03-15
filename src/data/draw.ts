import { Dye, DyeIndex, IsNillDye } from "./palette";
import { drawBuildings, sketchBuildings, drawRoad } from "../sketch/sketch";
import { Sprite } from "../sprite/sprite";
import getWorld from "./world";

/* Size of the individual home */
export const individualWidth:number = 242;
export const individualHeight:number = 100;
export const content_size:number = individualWidth * individualHeight;


/* Three layers for each individual home */
const sketchLayer = 0;
const frontLayer = 1;
const minionLayer = 2;


interface Delta {
  index: number;
  old: DyeIndex;
  new: DyeIndex;
}


export function getCorIndex(x:number, y:number) {
  return (y + x * individualHeight);
}

export function ofCorIndex(idx: number) {
  const y = idx % individualHeight;
  const x = (idx - idx % individualHeight) / individualHeight;
  return [x,y]
}

export type Painter = (x:number, y:number, c:number, alpha:number) => void

export class Drawer {
    pixels: Array<Array<DyeIndex>>;
    delta: Array<Delta>;
    cursor: () => number;
    offset: number;
    dry: boolean;
    constructor(
        pixels: Array<Array<DyeIndex>>,
        offset:number,
        cursor:()=>number,
        dry:boolean = true
        ) {
      this.offset = offset;
      this.cursor = cursor;
      this.dry = dry;
      this.pixels = pixels;
      this.delta = new Array(0);
    }

    paintPixel (paint:Painter, index: number, pos: number = 0) {
      let cursor = this.cursor();
      if (pos !== 0) {
        cursor = pos;
      }
      if(this.dry) {
        return;
      }
      const [x, y] = ofCorIndex(index);
      var dye = this.pixels[minionLayer][index];
      for (var i=1;i>=0;i--) {
        if (IsNillDye(dye)) {
          dye = this.pixels[i][index];
        }
      }
      if (!IsNillDye(dye)) {
        paint(x + this.offset - cursor, y, dye, 255);
      } else {
        paint(x + this.offset - cursor, y, (x + y) %2, 90);
      }
    }


    setDry(dry: boolean) {
      this.dry = dry;
    }

    setPixel(idx: number, dye:DyeIndex) {
      this.pixels[frontLayer][idx] = dye;
    }

    getPixel(idx:number) {
      return this.pixels[frontLayer][idx];
    }

    pushPixelDelta(idx: number, dye:DyeIndex) {
      this.delta.push({
        index: idx,
        old: this.getPixel(idx),
        new: dye,
      });
      this.setPixel(idx, dye);
    }

    popPixelDelta(idx: number, dye:Dye) {
      if (this.delta.length > 0) {
        const ele = this.delta.pop();
        this.setPixel(ele!.index, ele!.old);
      };
    }

    draw(paint: Painter, pos:number=0) {
      //console.log("pos, offset", pos, this.offset);
      for (var i=0; i<2; i++) {
        for (var idx=0; idx<content_size; idx++) {
          this.paintPixel(paint, idx, pos);
        }
      }
    }

    drawPolygon(layer:number, dye:DyeIndex,  x:number, y:number, h:number, w:number) {
      for (var i=0; i<w; i++) {
        let idtop = getCorIndex(x+i, y);
        let idbottom = getCorIndex(x+i, y+h-1);
        this.setPixel(idtop, dye);
        this.setPixel(idbottom, dye);
        for (var j=1; j<h-1; j++) {
          let id = getCorIndex(x+i, y+j);
          this.setPixel(id, 0);
        }
      }
      for (var j=1; j<h-1; j++) {
        let idleft = getCorIndex(x, y+j);
        let idright = getCorIndex(x+w-1, y+j);
        this.setPixel(idleft, dye);
        this.setPixel(idright, dye);
      }
    }

    setPixelByCor(x:number, y:number, dye:DyeIndex) {
      let id = getCorIndex(x,y);
      this.setPixel(id, dye);
    }

    reset() {
      for (var i=0; i<content_size; i++) {
        this.setPixel(i, 0);
      }
    }
    resetSketch() {
      let items_front = sketchBuildings(individualWidth, individualHeight, 30);
      let items_back = sketchBuildings(individualWidth, individualHeight, 30);
      for (var item of items_front) {
        this.drawPolygon(sketchLayer, 1*16 + 6, item.x, item.y, item.h, item.w);
      }
      for (var item of items_back) {
        this.drawPolygon(sketchLayer, 1*16 + 6, item.x, item.y, item.h, item.w);
      }
    }
    sketchWithStyle(canvas:HTMLCanvasElement, template:Sprite, main:string, road: string) {
      for (var i=0; i<content_size; i++) {
        this.setPixel(i, 0);
      }

      let items_front = sketchBuildings(individualWidth, individualHeight, 30, 1);
      let items_back = sketchBuildings(individualWidth, individualHeight, 30,0);
      for (var item of items_back) {
        drawBuildings(this, canvas, template, item.w, item.h, item.x, item.y, -2, main);
      }
      for (var item of items_front) {
        drawBuildings(this, canvas, template, item.w, item.h, item.x, item.y, 0,  main);
      }
      drawRoad(this, template, canvas, road);
    }
}

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



