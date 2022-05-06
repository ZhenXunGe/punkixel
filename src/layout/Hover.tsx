import { HandlerProxy } from "./handlerProxy";

interface HoverProp {
    bgurl: string;
}

export function Hover(prop: HoverProp) {
    return (<div className="hover" style={{ backgroundImage: 'url(' + prop.bgurl + ')' }}></div>);
}

const handlerProxy = new HandlerProxy();

export const getHandlerProxy = () => {return handlerProxy};