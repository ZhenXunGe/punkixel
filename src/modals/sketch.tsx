// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MutableRefObject, useState } from "react";
import { Button, Dropdown, DropdownButton, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import getWorld from "../data/world";
import { signalSketch } from "../dynamic/dynamicSlice";
import { mainCategory, roadCategory } from "../sketch/sketch";
import { getSprite } from "../sprite/spriteSlice";
import sketch_btn from '../images/home/sketch_btn.png';
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
    for (var i = 0; i < getWorld().instances.length; i++) {
      let d = getWorld().getInstanceById(i).drawer;
      d.reset();
      d.sketchWithStyle(prop.canvas.current!, spriteSketch, main, road);
    }
    /*
    let d = world.getInstance(homeIndex*individualWidth).drawer;
    d.reset();
    d.sketchWithStyle(canvasRef.current!,spriteSketch);
    //d.resetSketch();
    */
    dispatch(signalSketch())
  };
  return (

    <>
      <div className="sketch_btn" onClick={() => handleShow()}>
        <img src={sketch_btn}></img>
      </div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sketch your block!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Sketch your block and get base PPH
          <div>
            main theme:
          <DropdownButton title={main}>
            {mainCategory.map((p) =>
              <Dropdown.Item onClick={() => setMain(p)}>{p}</Dropdown.Item>
            )
            }
          </DropdownButton>
          </div>
          <div>
            main theme:
          <DropdownButton title={road}>
            {roadCategory.map((p) =>
              <Dropdown.Item onClick={() => setRoad(p)}>{p}</Dropdown.Item>
            )
            }
          </DropdownButton>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="Close" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="Confirm" onClick={handleConfirm}>
            Sketch
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}