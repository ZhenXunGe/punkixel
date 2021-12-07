import React, { useState } from 'react';
import './Component.css';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//<li> big <FontAwesomeIcon icon={faCoffee} /></li>
export function ToolBar() {
  return (
    <div className="tool-bar">
        <ul>
            <li> Dye </li>
            <li> small </li>
            <li> undo </li>
            <li> reclaim </li>
        </ul>
    </div>
  );
}
