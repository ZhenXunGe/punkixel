import { useState,useEffect, useRef } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { render } from "react-dom";
import { useAppSelector } from "../app/hooks";
import { individualWidth } from "../data/draw";
import { selectPalettes } from "../data/statusSlice";
import getWorld from "../data/world";
import { getSprite } from "../sprite/spriteSlice";

interface IProps {
  show: boolean;
  onHide: () => void;
}

export function ProtectSelect(props: IProps) {
  const palettes = useAppSelector(selectPalettes);
  const [pickedCategory, setPickedCategory] = useState(0);
  const [pickedPalette, setPickedPalette] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>();
  const [alertContext, setAlertContext] = useState("");
  useEffect(() => {
    const spriteSketch = getSprite("sketch");
    if (canvasRef.current) {
      for(var i=0;i<getWorld().instances.length;i++){
        let d = getWorld().getInstance(i*individualWidth).drawer;
        d.resetSketch();
        d.sketchWithStyle(canvasRef.current, spriteSketch, "building", "road");
      }
    }
  },[canvasRef]);
  return (
    <>

      <Modal show={props.show} aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-90w">

        <Modal.Body className="show-grid">
          <Container>
            <button className="closeBtn" onClick={() => { props.onHide();}}></button>
            <div className="select_area">
              
            </div>
          </Container>
        </Modal.Body>
      
      </Modal>
    </>
  );
}

