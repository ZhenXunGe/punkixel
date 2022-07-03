// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getWorld } from "../data/world";

interface UnlockProps {
  uid: string;
}

export default function AlienInfo(prop:UnlockProps) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (

    <>
      <div className="button" onClick={() => handleShow()}>
            UNLOCK
      </div>
      <Modal show={show} onHide={handleClose} centered>
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
        </Modal.Footer>
      </Modal>
    </>
  );
}
