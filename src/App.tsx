import React from 'react';
import logo from './logo.svg';
import { MainBoard } from './components/MainBoard';
import { LeftMenu } from './components/LeftMenu';
import { Status } from './components/Status';
import { Thumbnail } from './components/Thumbnail';
import { ToolBar } from './components/ToolBar';

import './App.css';

function App() {
  return (
    <>
    <LeftMenu></LeftMenu>
    <MainBoard></MainBoard>
    <Status></Status>
    <ToolBar></ToolBar>
    <Thumbnail></Thumbnail>
    </>
  );
}

export default App;
