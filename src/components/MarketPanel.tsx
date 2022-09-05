import { Market } from './Market';
import React, { useState } from 'react';
import { HandlerProxy } from '../layout/handlerProxy';
interface MarketPanelProp {
  handlerProxy: HandlerProxy;
}
export function MarketPanel(props: MarketPanelProp) {
  return (
    <>
    <Market></Market>
    </>
  );
}

