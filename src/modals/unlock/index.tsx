// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { Container, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Minion, randomMinion } from "../../data/minion";
import { getBulletFrame, getMinionFrame } from '../../sprite/spriteSlice';
import { getWorld } from "../../data/world";
import Unlock_ from "../../images/protectors/Unlock.png";
import "./style.scss";

interface UnlockProps {
  uid: string;
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
  handleConfirm: ()=> void;
  position: number;
  minion: Minion | null;
  topic: string;
}


export function MinionInfoBox(props: MinionInfoProps) {
  if (props.minion === null) { return(<></>);}
  let ufo = getMinionFrame(props.minion).src;
  return(
      <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-90w">
        <Modal.Body className="show-grid">
          <Container>
            <button className="closeBtn" onClick={props.handleClose}></button>
            <div className="unlock-area">
              <div className="info-left">
                <img src={ufo}></img>
                <div className="advisor"></div>
              </div>
              <div className="minion_pro">
                  <div className="title"> {props.topic} </div>
                  <ul className="minion_proto">
                    <li>{props.minion.power}</li>
                    <li>{props.minion.frequency}</li>
                    <li>{props.minion.contribution}</li>
                  </ul>
                  <ul className="minion_modifier">
                    <li><img src={getBulletFrame(props.minion.modifier[0]).src}></img></li>
                    <li><img src={getBulletFrame(props.minion.modifier[1]).src}></img></li>
                  </ul>
                </div>
              <div className="info-right">
                <div onClick={props.handleConfirm} className="unlock"></div>
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
  let m = randomMinion("solo", getWorld());
  const handleConfirm = () => {
    getWorld().spentPunkxiel("solo", 1000);
    getWorld().unlockMinion(m, prop.index);
    setShow(false);
  }
  return (
    <>
      <div className='action' onClick={() => handleShow()}>
        <img src={Unlock_}></img>
      </div>
      <MinionInfoBox show={show} handleClose={handleClose} handleConfirm={handleConfirm} position={0} minion={m} topic="Unlock a minion to join your force"></MinionInfoBox>
    </>
  );
}

export function Reroll(prop: InfoProps) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let m = prop.minion;
  const handleConfirm = () => {
    getWorld().spentPunkxiel("solo", 1000);
    getWorld().rerollMinion(m, prop.index);
    setShow(false);
  }
  return (
    <>
      <div className='inventory-pick' onClick={() => handleShow()}>
      </div>
      <MinionInfoBox show={show} handleClose={handleClose} handleConfirm={handleConfirm} position={0} minion={m} topic={`${m.id} is ready to take order)`}></MinionInfoBox>
    </>
  );
}
