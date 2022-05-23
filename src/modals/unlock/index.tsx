// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { Container, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Minion, randomMinion } from "../../data/minion";
import { getMinionFrame } from '../../sprite/spriteSlice';
import getWorld from "../../data/world";
import Unlock_ from "../../images/protectors/Unlock.png";
import mod_ice from "../../images/modal/unlock/ice.png";
import "./style.scss";

interface UnlockProps {
  uid: string;
  index: number;
  avator: string;
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
                  </ul>
                  <div className="minion_position">
                    <div id={`${props.position == 0 ? 'selected' : ''}`}></div>
                    <div id={`${props.position == 1 ? 'selected' : ''}`}></div>
                  </div>
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
