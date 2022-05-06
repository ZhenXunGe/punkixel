// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { Button, Container, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import getWorld from "../../data/world";
import Unlock_ from "../../images/protectors/Unlock.png";
import mod_ice from "../../images/modal/unlock/ice.png";
import "./style.scss";
interface UnlockProps {
  uid: string;
  index: number;
  avator: string;
}


export default function Unlock(prop: UnlockProps) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [position, setPosition] = useState(0);
  let ratio = 4;
  const dispatch = useAppDispatch();
  const handleConfirm = () => {
    getWorld().spentPunkxiel("solo", 1000);
    getWorld().unlockMinion(prop.uid, prop.index);
    setShow(false);
  }
  return (

    <>
      {/* <div className="button" onClick={() => handleShow()}>
            UNLOCK
      </div> */}
      <div className='action' onClick={() => handleShow()}>
        <img src={Unlock_}></img>
      </div>
      <Modal show={show} aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-90w">

        <Modal.Body className="show-grid">
          <Container>
            <button className="closeBtn" onClick={handleClose}></button>
            <div className="unlock-area">
              <div className="info-left">
                <img src={prop.avator}></img>
                <div className="advisor"></div>
              </div>
              <div className="minion_pro">
                  <div className="title"> Unlock a minion to join your force</div>
                  <ul className="minion_proto">
                    <li>200</li>
                    <li>17</li>
                  </ul>
                  <div className="minion_position">
                    <div id={`${position == 0 ? 'selected' : ''}`} onClick={() => { console.log('set sky'); setPosition(0) }}></div>
                    <div id={`${position == 1 ? 'selected' : ''}`} onClick={() => { console.log('set land'); setPosition(1) }}></div>
                  </div>
                </div>
              <div className="info-right">
                <div onClick={handleConfirm} className="unlock"></div>
              </div>
            </div>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}

/*
                <div className="bottom">
                  <ul className="modifier">
                    <li>
                      <img style={{ width: '50px', height: '50px', }} src={mod_ice} />
                    </li>
                    <li>
                      <img />
                    </li>
                  </ul>

                </div>
                */