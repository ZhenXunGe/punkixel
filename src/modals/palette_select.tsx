import { useState, useEffect, useRef } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { render } from "react-dom";
import { useAppSelector } from "../app/hooks";
import { individualWidth } from "../data/draw";
import { selectPalettes } from "../data/statusSlice";
import getWorld from "../data/world";
import { getSprite } from "../sprite/spriteSlice";
import scroll_btn from '../images/modal/roll_button.png'
interface IProps {
  show: boolean;
  onHide: () => void;
  setPickedPalette: (val: number) => void;
  setPickedCategory: (val: number) => void;
  pickedCategory: number;
  pickedPalette: number;
}

export function PaletteSelect(props: IProps) {
  const palettes = useAppSelector(selectPalettes);
  // const [pickedCategory, setPickedCategory] = useState(0);
  // const [pickedPalette, setPickedPalette] = useState(0);
  var [firstPos, setFirstPos] = useState(0);
  var [lastPos, setLastPos] = useState(7);
  
  const { show, onHide, setPickedPalette, setPickedCategory, pickedCategory, pickedPalette } = props;
  var paletteLenth = palettes[pickedCategory].palettes.length;
  const canvasRef = useRef<HTMLCanvasElement>();
  const [alertContext, setAlertContext] = useState("");
  const adjust = (_scroll: number) => {
    paletteLenth = palettes[pickedCategory].palettes.length;
    if (_scroll == 1) { // up
      if (firstPos > 0) {
        setFirstPos(firstPos - 1);
        setLastPos(lastPos - 1);
      }
    }else if(_scroll == -1){
      if(lastPos < paletteLenth - 1){
        setFirstPos(firstPos + 1);
        setLastPos(lastPos + 1);
      }
    }
    
  }
  const calcHeight = () => {
    let height = 364;
    if(firstPos == 0){
      return 0;
    }else if(lastPos == paletteLenth - 1){
      return height-51;
    }else{
     
      return (height/(paletteLenth-7)*firstPos);
    }
  }
  useEffect(() => {
    const spriteSketch = getSprite("sketch");
    if (canvasRef.current) {
      for (var i = 0; i < getWorld().instances.length; i++) {
        let d = getWorld().getInstance(i * individualWidth).drawer;
        d.resetSketch();
        d.sketchWithStyle(canvasRef.current, spriteSketch, "building", "road");
      }
    }
  }, [canvasRef]);
  return (
    <>

      <Modal show={show} aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-90w">

        {/* <Modal.Header >
          <Modal.Title id="contained-modal-title-vcenter">
            Pick a minion to protect this block?
          </Modal.Title>
        </Modal.Header> */}
        <Modal.Body className="show-grid">
          <Container>
            <button className="closeBtn" onClick={() => { props.onHide(); }}></button>
            <div className="select_area">
              <div className="left">
                <ul>
                  {palettes.map((p, idx) =>
                    <li className={`category ${idx == pickedCategory ? 'selected' : ''}`} onClick={() => { setPickedPalette(0); setPickedCategory(idx);paletteLenth = palettes[pickedCategory].palettes.length; }}>{palettes[idx].name}</li>
                  )
                  }
                </ul>
              </div>
              <div className="right">
                <ul className="scroll">
                  {palettes[pickedCategory].palettes.map((p, idx) =>{
                    console.log(idx,firstPos,lastPos);
                    if (idx >= firstPos && idx <= lastPos) {
                      
                    
                    return (<li className={`palette ${idx == pickedPalette ? 'selected' : ''}`} onClick={() => {
                      setAlertContext(`${palettes[pickedCategory].name} / ${palettes[pickedCategory].palettes[pickedPalette].name}`);
                      setPickedPalette(idx);
                    }}
                      onDoubleClick={() => {
                        onHide();
                      }}
                    >
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
                    </li>)

                  }
                }
                  )
                  }

                </ul>
                {paletteLenth > 8 ? <div className="scrollOut">
                  <div className="scrollTop" onClick={() => adjust(1)}></div>
                  <div className="scrollIn">
                    <div className="scrollButton" style={{
                      width: '35px',
                      height: '51px',
                      float: 'left',
                      backgroundImage: `url(${scroll_btn})`,
                      // backgroundColor:'#fff',
                      marginTop: calcHeight(),
                    }}>
                    </div>
                  </div>
                  <div className="scrollBottom" onClick={() => adjust(-1)}></div>
                </div> : <></>}
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

