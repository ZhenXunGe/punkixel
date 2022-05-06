import { createRef, useState } from "react";

interface ScrollProps {
    show: boolean;
    onPageChange: (n:number) => void;
    rangeStart: number;
    rangeEnd: number;
    pos: number;
  }
  export function PageScroller(props: ScrollProps) {
    const [pos, setPos] = useState(props.pos);
    const divRef = createRef<HTMLDivElement>();
    const clickHandler = (e:React.MouseEvent) => {
      const rect = divRef.current!.getBoundingClientRect();
      const x = e. clientX - rect.left;
      const y = e. clientY - rect.top;
      console.log("<x,y>:", x, y, e.clientX, e.clientY);
      console.log(props.rangeStart, props.rangeEnd);
      if (y>divRef.current!.offsetHeight/2) {
        if (pos<props.rangeEnd) {
          props.onPageChange(pos+1);
          console.log("down");
          setPos(pos+1);
        }
      } else {
        if (pos > props.rangeStart) {
          props.onPageChange(pos-1);
          console.log("up");
          setPos(pos-1);
        }
      }
    };
    return ((props.show === true) ?
      <div className="scrollOut" ref={divRef} onClick={(e)=>clickHandler(e)}>
        <div className="scrollUp"/>
        <div className="scrollDown"/>
        <div className="cover"/>
      </div> : <></>
    );
  }
  