import React, { useState } from 'react';
import './Component.css';

export function LeftMenu() {
  return (
    <div className="left-menu">
        <div className="padding-top"></div>
        <button> Home </button>
        <button> World </button>
        <button> Vote </button>
        <button> Monster List </button>
        <button> Chest </button>
    </div>
  );
}
