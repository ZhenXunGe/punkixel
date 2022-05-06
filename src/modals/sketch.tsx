// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MutableRefObject, useState } from "react";
import { Button, Container, Dropdown, DropdownButton, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import getWorld from "../data/world";
import { signalSketch } from "../dynamic/dynamicSlice";
import { mainCategory, roadCategory } from "../sketch/sketch";
import { getSprite } from "../sprite/spriteSlice";
import sketch_btn from '../images/home/sketch_btn.png';
import CANCEL from '../images/modal/sketch/CANCEL.png';
import CONFIRM from '../images/modal/sketch/CONFIRM.png';
import SKETCH from '../images/modal/sketch/SKETCH.png';
interface SketchProps {
  main: string;
  road: string;
  background: number;
  canvas: MutableRefObject<HTMLCanvasElement | undefined>;
}

export default function Sketch(prop: SketchProps) {
  const [show, setShow] = useState(false);
  const [road, setRoad] = useState(prop.road);
  const [main, setMain] = useState(prop.main);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let ratio = 4;
  const dispatch = useAppDispatch();
  const handleConfirm = () => {
    const spriteSketch = getSprite("sketch");
    /*
    for (var i = 0; i < getWorld().instances.length; i++) {
      let d = getWorld().getInstanceByIndex(i).drawer;
      d.resetSketch();
      d.sketchWithStyle(prop.canvas.current!, spriteSketch, main, road);
    }
    */
    let homeIndex = getWorld().getPlayer("solo")!.homeIndex;
    let instance = getWorld().getInstanceByIndex(homeIndex);
    instance.info.basePPH = 200;
    let d = instance.drawer;
    d.resetSketch();
    d.sketchWithStyle(prop.canvas.current!, spriteSketch, main, road);
    dispatch(signalSketch());
    setShow(false);
  };
  return (

    <>
      <div className="sketch_btn" onClick={() => handleShow()}>
        <img src={sketch_btn}></img>
      </div>
      <Modal show={show} aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-90w">

        <Modal.Body className="show-grid">
          <Container>
            <button className="closeBtn" onClick={handleClose}></button>
            <div className="sketch_area">
              <div className="sketch_header">

              </div>
              <div className="sketch_drop">
                <DropdownButton className="mainTheme" title={main}>
                  {mainCategory.map((p) =>
                    <Dropdown.Item className="dropItem" onClick={() => setMain(p)}>{p}</Dropdown.Item>
                  )
                  }
                </DropdownButton>
                <DropdownButton className="frontTheme" title={road}>
                  {roadCategory.map((p) =>
                    <Dropdown.Item onClick={() => setRoad(p)}>{p}</Dropdown.Item>
                  )
                  }
                </DropdownButton>
                <DropdownButton className="frontTheme" title='background'>
                  {roadCategory.map((p) =>
                    <Dropdown.Item onClick={() => setRoad(p)}>{p}</Dropdown.Item>
                  )
                  }
                </DropdownButton>
              </div>
            </div>
            <div className="footerSketch">
              <img onClick={handleClose} className="cancel" src={CANCEL} />
              <img onClick={handleConfirm} className="sketch2" src={SKETCH} />
              <img onClick={handleConfirm} className="confirm" src={CONFIRM} />
            </div>
          </Container>
        </Modal.Body>

      </Modal>
    </>
  );
}