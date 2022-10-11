import { HandlerProxy } from "./handlerProxy";
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectCursor, updateDynamic, setCursor, updateTimeClockAsync } from '../dynamic/dynamicSlice';

interface HoverProp {
    bgurl: string;
}

export function Hover(prop: HoverProp) {
    return (<div className="hover" style={{ backgroundImage: 'url(' + prop.bgurl + ')' }}></div>);
}

const handlerProxy = new HandlerProxy();

export const getHandlerProxy = () => {return handlerProxy};

interface HoverProxyProps {
  proxy: HandlerProxy,
  ele: () => HTMLElement | null,
}

export function HoverProxy(props: HoverProxyProps) {
  const cursorClass = useAppSelector(selectCursor);
  const dispatch = useAppDispatch();
  //const ratio = useAppSelector(selectRatio);

  return <div
  onClick={(e)=> {
    const ele = props.ele();
    if (ele) {
      props.proxy.clickHandler(e, ele);
    } else {
      console.log(ele);
    }
  }}

  onMouseDown ={(e)=> {
    const ele = props.ele();
    if (ele) {
      props.proxy.mouseDownHandler(e, ele);
    } else {
      console.log(ele);
    }
  }}

  onMouseUp ={(e)=> {
    const ele = props.ele();
    if (ele) {
      props.proxy.mouseUpHandler(e, ele);
    } else {
      console.log(ele);
    }
  }}


  onMouseMove={(e)=>{
    const ele = props.ele();
    if (ele) {
      let style = props.proxy.hoverHandler(e, ele);
      dispatch(setCursor(style));
    } else {
      return (ele);
    }
  }}

  onWheel={(e)=> {
    const ele = props.ele();
    if (ele) {
      props.proxy.scrollHandler(e, ele)
    } else {
      //console.log("wheel");
    }
  }} className={`hover ${cursorClass}`}>
  </div>
}

