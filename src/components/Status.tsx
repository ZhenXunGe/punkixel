import React, { useState } from 'react';
import './Component.css';

export function Status () {
  return (
    <div className="status">
        <ul>
        <li>Energy: 100</li>
        <li>Punkixel: 100</li>
        <li>Rate: 100</li>
        <li>Voucher: 1</li>
        <li>PPH: 20</li>
        </ul>
    </div>
  );
}
