// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { Container, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fromDrop, getPalette } from "../server/palette";

interface PaletteProps {
  paletteIndex: number;
}

export function PaletteInfo(prop: PaletteProps) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let palette = getPalette(prop.paletteIndex)
  return (

    <>
      <div className="button" onClick={() => handleShow()}>
        {palette.name}
      </div>
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

export function PalettePurchase (prop: PaletteProps) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let palette = getPalette(prop.paletteIndex)
  const dispatch = useAppDispatch();
  return (

    <>
      <div className="palette_purchase_btn" onClick={() => handleShow()}>
        {/*palette.name*/}
      </div>
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
