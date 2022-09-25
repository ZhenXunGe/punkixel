import { useState } from "react";
import { Container, Modal } from "react-bootstrap";
import { useAppSelector } from "../app/hooks";
import { selectPlayer } from "../data/statusSlice";
import { PageScroller } from "./scroll";
import { getCategory, getPalette, toPaletteIndex } from "../server/palette";
interface IProps {
  show: boolean;
  onHide: () => void;
  setPickedPalette: (val: number) => void;
  setPickedCategory: (val: number) => void;
  pickedCategory: number;
  pickedPalette: number;
}

interface PaletteItemProps {
  index: number;
}

export function PaletteSelect(props: IProps) {
  const player = useAppSelector(selectPlayer)!;
  const palettes = player.palettes;
  const pageSize = 8;
  var [pageNumber, setPageNumber] = useState(0);
  const { show, onHide, setPickedPalette, setPickedCategory, pickedCategory, pickedPalette } = props;
  var paletteLenth = palettes[pickedCategory-1].palettes.length;
  function PaletteItem(props: PaletteItemProps) {
    let owned = palettes[pickedCategory-1].palettes;
    let pidx = toPaletteIndex(pickedCategory, props.index);
    let available: boolean = owned.indexOf(pidx) !== -1;
    let palette = getPalette(pidx);
    let idx = props.index;
    let className = "unavailable";
    if(available) {
      if (idx === pickedPalette) {
         className = "selected";
      } else {
         className = "unselected";
      }
    }
    return (
      <li className={`palette ${className}`}
          onClick={() => {
            console.log("picked idx", idx);
            if (available) {
              setPickedPalette(idx);
            }
          }}
          onDoubleClick={() => {
             onHide();
          }}>
          <div className="paletteItem"> {palette.name} </div>
          <ul>
          {
            palette.dye.map((d, idx) => {
            return (
              <li>
                <span className={`dye-item`}
                  style={{
                    backgroundColor: `rgb(${d.color[0]}, ${d.color[1]}, ${d.color[2]})`,
                  }}
                  onClick={() => {}}
                >
                </span>
              </li>
            )
            })
          }
       </ul>
     </li>)
  }
  return (
    <>
      <Modal show={show} aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-90w">
        <Modal.Body className="show-grid">
          <Container>
            <button className="closeBtn" onClick={() => { props.onHide(); }}></button>
            <div className="select_area">
              <div className="left">
                <ul>
                  {palettes.map((p, idx) =>
                    <li className={`category ${(idx+1) == pickedCategory ? 'selected' : ''}`}
                      onClick={() => {
                        setPickedPalette(0);
                        setPickedCategory(idx+1);
                        setPageNumber(0);
                        paletteLenth = palettes[pickedCategory-1].palettes.length;
                      }}
                    >{palettes[idx].name}</li>
                  )}
                </ul>
              </div>
              <div className="right">
                <ul className="scroll">
                  {
                    getCategory(pickedCategory).map((p, idx) => {
                    if (idx >= pageNumber * pageSize && idx <= (pageNumber+1) * pageSize - 1) {
                      return (<PaletteItem index={idx}></PaletteItem>)
                    }
                  }
                  )
                  }
                </ul>
                <PageScroller show={paletteLenth > 9} onPageChange={(n:number) => setPageNumber(n)} rangeStart={0} rangeEnd={Math.floor(paletteLenth/8)} pos={0}></PageScroller>
              </div>
            </div>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}

