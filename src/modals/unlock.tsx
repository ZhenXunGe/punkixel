// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { Button, Container, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import getWorld from "../data/world";
import Unlock_ from "../images/protectors/Unlock.png";
interface UnlockProps {
  uid: string;
  index: number;
}

export default function Unlock(prop: UnlockProps) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let ratio = 4;
  const dispatch = useAppDispatch();
  const handleConfirm = () => {
    getWorld().unlockMinion(prop.uid, prop.index);
    setShow(false);
  }
  return (

    <>
      {/* <div className="button" onClick={() => handleShow()}>
            UNLOCK
      </div> */}
      <button className='btn' onClick={() => handleShow()}>
        <img src={Unlock_}></img>
      </button>
      {/* <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Unlock a random new minion to join your force!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You need pay 1000 punkxiels 
        </Modal.Body>
        <Modal.Footer>
          <Button variant="Close" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="Confirm" onClick={handleConfirm}>
            Unlock
          </Button>
        </Modal.Footer>
      </Modal> */}
      <Modal show={show} aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-90w">

        <Modal.Body className="show-grid">
          <Container>
            <button className="closeBtn" onClick={handleClose}></button>
            <div className="unlock_area">
              <img className="minion_avator" ></img>
              <div className="minion_pro">
                <ul className="minion_proto">
                  <li>200</li>
                  <li>night view</li>
                </ul>
                <ul className="minion_position">
                  <li></li>
                  <li></li>
                </ul>
              </div>
              <div className="bottom">
                <ul className="modifier">
                  <li></li>
                  <li></li>
                </ul>
                <img onClick={handleConfirm} className="unlock"></img>
              </div>

            </div>

          </Container>
        </Modal.Body>

      </Modal>
    </>
  );
}