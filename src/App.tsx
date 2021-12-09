import React from 'react';
import logo from './logo.svg';
import { LeftMenu } from './components/LeftMenu';
import { RightPanel } from './layout/RightPanel';

import './App.css';

function App() {
  return (
    <>
    <LeftMenu></LeftMenu>
    <RightPanel></RightPanel>
    </>
  );
}

export default App;
