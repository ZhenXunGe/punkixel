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

export function PaletteSelect(props: IProps) {
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

        {/* <Modal.Header >
          <Modal.Title id="contained-modal-title-vcenter">
            Pick a minion to protect this block?
          </Modal.Title>
        </Modal.Header> */}
        <Modal.Body className="show-grid">
          <Container>
            <button className="closeBtn" onClick={() => { props.onHide();}}></button>
            <div className="select_area">
              <div className="left">
                <ul>
                  {palettes.map((p, idx) =>
                    <li className={`category ${idx == pickedCategory ? 'selected' : ''}`} onClick={() => setPickedCategory(idx)}>{palettes[idx].name}</li>
                  )
                  }
                </ul>
              </div>
              <div className="right">
                <ul>
                  {palettes[pickedCategory].palettes.map((p, idx) =>
                    <li className={`palette ${idx == pickedPalette ? 'selected' : ''}`} onClick={() => {
                      setAlertContext(`${palettes[pickedCategory].name} / ${palettes[pickedCategory].palettes[pickedPalette].name}`);
                      setPickedPalette(idx);
                    
                  
                    }}>
                      <div className="paletteItem">
                        {p.name}
                      </div>
                      <ul>
                        {palettes[pickedCategory].palettes[idx].dye.map((d, idx) => {
                          let palette = palettes[pickedCategory].palettes[idx];
                          return (

                            <li>
                              <span className={`dye-item`}
                                style={{
                                  backgroundColor: `rgb(${d.color[0]}, ${d.color[1]}, ${d.color[2]})`,
                                }}
                                onClick={() => {

                                }
                                }
                              >
                              </span>
                            </li>
                          )
                        }
                        )
                      }
                      </ul>
                    </li>
                  )
                  }

                </ul>
              </div>
            </div>
          </Container>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
}

