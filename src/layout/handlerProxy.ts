class cHandler {
  constructor(public key:string, public top:number, public left:number, public width:number, public height:number, public handler:(left:number, top:number)=>void) {
  }
  withinRange(x:number, y:number) {
    return (x>this.left && x<this.left+this.width && y>this.top && y<this.height+this.top);
  }
  getPoint(x:number, y:number) {
    return {left: x-this.left, top: y-this.top};
  }
}

class sHandler {
  constructor(public key:string, public top:number, public left:number, public width:number, public height:number, public handler:(direction:boolean)=>void) {
  }
  withinRange(x:number, y:number) {
    return (x>this.left && x<this.left+this.width && y>this.top && y<this.height+this.top);
  }
  getPoint(x:number, y:number) {
    return {left: x-this.left, top: y-this.top};
  }
}

export class HandlerProxy {
  clickHandlerMap: Map<string, cHandler>;
  hoverHandlerMap: Map<string, cHandler>;
  scrollHandlerMap: Map<string, sHandler>;

  constructor() {
    this.clickHandlerMap = new Map<string, cHandler>();
    this.hoverHandlerMap = new Map<string, cHandler>();
    this.scrollHandlerMap = new Map<string, sHandler>();
  }
  registerClick(key: string, element: HTMLElement, handler: (left:number, top:number) => void) {
    const h = new cHandler(key, element.offsetTop, element.offsetLeft, element.offsetWidth, element.offsetHeight, handler);
    console.log(`event handler ${key} registered for element ${element.offsetTop}, ${element.offsetLeft}, ${element.offsetWidth}, ${element.offsetHeight}`);
    this.clickHandlerMap.set(key, h);
  }

  registerHover(key: string, element: HTMLElement, handler: (left:number, top:number) => void) {
    const h = new cHandler(key, element.offsetTop, element.offsetLeft, element.offsetWidth, element.offsetHeight, handler);
    console.log(`event handler ${key} registered for element ${element.offsetTop}, ${element.offsetLeft}, ${element.offsetWidth}, ${element.offsetHeight}`);
    this.hoverHandlerMap.set(key, h);
  }

  registerScroll(key: string, element: HTMLElement, handler: (direction:boolean) => void) {
    const h = new sHandler(key, element.offsetTop, element.offsetLeft, element.offsetWidth, element.offsetHeight, handler);
    console.log(`event handler ${key} registered for element ${element.offsetTop}, ${element.offsetLeft}, ${element.offsetWidth}, ${element.offsetHeight}`);
    this.scrollHandlerMap.set(key, h);
  }




  clickHandler(e: React.MouseEvent<HTMLElement>, hover:HTMLElement) {
    let x = e.clientX - hover.offsetLeft;
    let y = e.clientY - hover.offsetTop + hover.offsetHeight/2;
    console.log(x,y, hover.offsetLeft, hover.offsetTop, e.clientX, e.clientY);
    this.clickHandlerMap.forEach((v, k) => {
      if (v.withinRange(x,y)) {
        let p = v.getPoint(x,y);
        v.handler(p.left, p.top);
      }
    });
  }

  hoverHandler(e: React.MouseEvent<HTMLElement>, hover:HTMLElement) {
    let x = e.clientX - hover.offsetLeft;
    let y = e.clientY - hover.offsetTop + hover.offsetHeight/2;
    this.hoverHandlerMap.forEach((v, k) => {
      if (v.withinRange(x,y)) {
        let p = v.getPoint(x,y);
        v.handler(p.left, p.top);
      }
    });
  }

  scrollHandler(e: React.WheelEvent<HTMLElement>, hover:HTMLElement) {
    this.scrollHandlerMap.forEach((v, k) => {
      v.handler(e.deltaY>0);
    });
  }


}
