// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fromDrop, getPalette } from "../data/palette";

interface PaletteProps {
  paletteId: string;
}

export default function PaletteInfo(prop:PaletteProps) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let paletteIndex = fromDrop(prop.paletteId);
  let palette = getPalette(paletteIndex)
  const dispatch = useAppDispatch();
  return (

    <>
      <div className="button" onClick={() => handleShow()}>
            {prop.paletteId}
      </div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Palette {palette.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Name: {palette.name}</p>
          <p>PPH: {palette.pph}</p>
          <p>PPH: {palette.dye.length}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="Close" onClick={handleClose}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}