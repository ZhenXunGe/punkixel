// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { Button, Container, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fromDrop, getPalette } from "../data/palette";

interface PaletteProps {
  paletteId: string;
}

export default function PaletteInfo(prop: PaletteProps) {
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
      {/* <Modal show={show} onHide={handleClose} centered>
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
      </Modal> */}
      <Modal show={show} aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-90w">

        <Modal.Body className="show-grid">
          <Container>
            <button className="closeBtn" onClick={handleClose}></button>
            <div className="dyeDrop_area">
              <div className="dye_area">
                <div className="palette_info">
                  <div className="dyeTop">
                  <div className="paletteName">
                  {palette.name} palette
                  </div>
                  <div className="categoryName">
                    Basic
                  </div>
                  </div>
                  <ul className="palettePreview">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                  </ul>
                  <div className="pph">{palette.pph}</div>
                </div>
              </div>
            </div>

          </Container>
        </Modal.Body>

      </Modal>
    </>
  );
}