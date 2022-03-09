import { Sprite } from "../sprite/sprite";

const distance = (a:[number, number], b:[number, number]) => {
    let dx = a[0] - b[0];
    let dy = a[1] - b[1];
    return Math.sqrt((dx * dx) + (dy * dy));
  } 
  
  export interface BulletInfo {
    x: number;
    y: number;
    source: number;
    power:number;
    speed: number;
    rotate: number;
    getFront: () => number[];
    getBack: () => number[];
    approach: (x:number, y:number) => boolean;
    paint: (canvas:CanvasRenderingContext2D, ins:Sprite) => void;
  }
  
  export class TrackBullet implements BulletInfo {
    x: number;
    y: number;
    width: number;
    source: number;
    power: number;
    speed: number;
    rotate: number;
    constructor(x:number, y:number, width:number, power:number, speed:number, rotate:number, source:number) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.speed = speed;
      this.power = power;
      this.rotate = rotate;
      this.source = source;
    }
    getFront(): number[] {
      return [
        this.x + this.width*Math.cos(this.rotate * Math.PI/180),
        this.y + this.width*Math.sin(this.rotate * Math.PI/180)
      ];
    };
    getBack (): number[] {
      return [this.x, this.y];
    }
    approach (x: number, y: number): boolean {
      var [front_x, front_y] = this.getFront();
      let r = this.rotate * Math.PI/180;
      let next_x = this.x + (Math.cos(r))*this.speed;
      let next_y = this.y + (Math.sin(r))*this.speed;
      this.speed +=1;
      // adjust omega
      this.x = next_x;
      this.y = next_y;
      [front_x, front_y] = this.getFront();
      let ratio = this.width/distance([this.x, this.y],[x,y]);
      //let aim_x = (x - this.x) * ratio + this.x;
      //let aim_y = (y - this.y) * ratio + this.y;
      let omega = Math.atan2(y-this.y, x-this.x) * 180 / Math.PI;
      if(Math.abs(omega - this.rotate) > 10) {
        this.rotate = this.rotate + 5*Math.sign(omega-this.rotate);
      } else {
        this.rotate = omega;
      }
      //throw("Exception ERRE");
      if (ratio > 1) {
        return true;
      } else {
        return false;
      }
    }
    paint(canvas:CanvasRenderingContext2D, ins:Sprite){
      canvas.save();
      canvas.translate(this.x, this.y);
      canvas.rotate(this.rotate*(Math.PI)/180);
      let img = ins.getFrame("missle",0);
      canvas?.drawImage(img,0,0,16,7)
      canvas?.restore();      
    }
  
  }
