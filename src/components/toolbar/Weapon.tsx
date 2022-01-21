import React, { useState } from 'react';
import { Weapon } from '../../data/weapon';
interface IProps {
    weapon: Weapon;
}

export function WeaponItem(props: IProps) {
    return (
        <div className="weapon-item">
            {props.weapon.code}
        </div>
    );
}
