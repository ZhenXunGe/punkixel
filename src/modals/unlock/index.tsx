// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { useState, useEffect } from "react";
import { Container, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Minion } from "../../server/types";
import { createMinion } from "../../server/generator";
import { getBulletFrame, getMinionFrame } from '../../sprite/spriteSlice';
import { getWorld } from "../../data/world";

import {
  selectPlayer,
} from '../../data/statusSlice';

import Unlock_ from "../../images/protectors/Unlock.png";
import UNKNOWN_ICON from "../../images/protectors/unknown.png";

import "./style.scss";

interface UnlockProps {
  index: number;
  avator: string;
}

interface InfoProps {
  index: number;
  minion: Minion;
}

interface MinionInfoProps {
  show: boolean;
  handleClose: ()=> void;
  handleConfirm: () => Promise<Minion | null>;
  position: number;
  minion: Minion | null;
  topic: string;
  btnClass: string;
}


export function MinionInfoBox(props: MinionInfoProps) {
  let [minion, setMinion] = useState(props.minion);
  let [icon, setIcon] = useState(UNKNOWN_ICON);
  let [modifierIcon0, setModifierIcon0] = useState(UNKNOWN_ICON);
  let [modifierIcon1, setModifierIcon1] = useState(UNKNOWN_ICON);
  let [status, setStatus] = useState(0); //0 is normal, 1 is waiting, 2 is done

  useEffect(() => {
    if (props.minion) {
      setIcon(getMinionFrame(props.minion).src)
      setModifierIcon0(getBulletFrame(props.minion.modifier[0]).src);
      setModifierIcon1(getBulletFrame(props.minion.modifier[1]).src);
    };
  }, [minion]);


  function confirm() {
    props.handleConfirm().then((m)=>{setMinion(m); setStatus(2);});
    setStatus(1);
  }

  return(
      <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-90w">
        <Modal.Body className="show-grid">
          <Container>
            <button className="closeBtn" onClick={props.handleClose}></button>
            <div className="unlock-area">
              <div className="info-left">
                <img src={icon}></img>
                <div className="advisor"></div>
              </div>
              <div className="minion_pro">
                  <div className="title"> {props.topic} </div>
                  <ul className="minion_proto">
                    <li>{minion === null ? "???" : minion.power}</li>
                    <li>{minion === null ? "???" : minion.frequency}</li>
                    <li>{minion === null ? "???" : minion.contribution}</li>
                  </ul>
                  <ul className="minion_modifier">
                    <li><img src={modifierIcon0}></img></li>
                    <li><img src={modifierIcon1}></img></li>
                  </ul>
                </div>
              <div className="info-right">
                { (status === 0) && <div onClick={confirm} className={props.btnClass}></div> }
                { (status === 1) && <div>loading...</div> }
                { (status === 2) && <div onClick={props.handleClose} className={props.btnClass}></div> }
              </div>
            </div>
          </Container>
        </Modal.Body>
      </Modal>
  );
}

export function Unlock(prop: UnlockProps) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const player = useAppSelector(selectPlayer)!;
  let m = createMinion(player.id);
  const handleConfirm = async () => {
    getWorld().spentPunkxiel(player.id, 1000);
    let minion = await getWorld().unlockMinion(player.id, prop.index);
    return minion;
  }
  return (
    <>
      <div className='action' onClick={() => handleShow()}>
        <img src={Unlock_}></img>
      </div>
      <MinionInfoBox show={show} handleClose={handleClose}
            handleConfirm={handleConfirm} position={0} minion={null}
            btnClass="unlock"
            topic="Unlock a minion to join your force"></MinionInfoBox>
    </>
  );
}

export function Reroll(prop: InfoProps) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const player = useAppSelector(selectPlayer)!;
  const handleConfirm = async () => {
    getWorld().spentPunkxiel(player.id, 1000);
    let minion = await getWorld().rerollMinion(player.id, prop.index);
    return minion;
  }
  return (
    <>
      <div className='inventory-pick' onClick={() => handleShow()}>
      </div>
      <MinionInfoBox show={show} handleClose={handleClose} handleConfirm={handleConfirm}
            position={0} minion={prop.minion}
            btnClass="reroll"
            topic={`${prop.minion.id} is idling)`}></MinionInfoBox>
    </>
  );
}
