// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { Button, Container, ListGroup, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectInventory, selectInventoryUpdater, } from "../data/statusSlice";
// import { MinionSelector } from "../components/Inventory";
import { addEvent, selectViewIndex, signalPlaceMinion } from "../dynamic/dynamicSlice";
import { ProtectingEvent } from "../dynamic/event";
import getWorld from "../data/world";
import header from "../images/modal/protect/header.png";
import PROTECT from '../images/world/protect_btn.png';
import CANCEL from '../images/modal/protect/CANCEL.png';
import CHOOSE from '../images/modal/protect/CHOOSE.png';
import './style.scss';
import { getSprite } from "../sprite/spriteSlice";
import {updateInventory} from '../data/statusSlice';
import scroll_btn from '../images/modal/roll_button.png'
import { url } from "inspector";
interface MinionSelector {
  setminion: (m: string) => void;
}

interface SingleSelect {
  current: string;
  setminion: (m: string) => void;
  mId: string;
}

export function SingleListItem(m: SingleSelect) {
  let minion = getWorld().getMinion(m.mId)!;
  let sprites = getSprite("ufo");
  let ufo = sprites.getFrame(minion.type, minion.style).src;
  
  if (minion.location === null) {
    return (
      <li className={`${m.mId === m.current?'selected':'' }`} onClick={() => {m.setminion(m.mId);
      console.log(m.mId,m.current);
      }}
      //  href={"#" + minion.id}
      > <img src={ufo}></img>
        <span>{minion.id} is now idling. [speed: {minion.power}]</span>
      </li>);
  } else {
    return (<li > 
      <img src={ufo}></img> 
      <span>is now protecting block {minion.location}. [contribution:{minion.contribution} ] </span>
      </li>);
  }
}
function MinionSelector(s: MinionSelector) {
  
  const inventory = useAppSelector(selectInventory);
  const [current, setCurrent] = useState("none");
  const [firstPos, setFirstPos] = useState(0); 
  const [lastPos, setLastPos] = useState(2); 
  var unlock_lenth = inventory.filter((m) => m !== null).length;
  const setMinion = (mid: string) => {
    setCurrent(mid);
    s.setminion(mid);
    
  };
  const adjust = (_scroll: number) => {
    unlock_lenth = inventory.filter((m) => m !== null).length;
    if (_scroll == 1) { // up
      if (firstPos > 0) {
        setFirstPos(firstPos - 1);
        setLastPos(lastPos - 1);
      }
    }else if(_scroll == -1){
      if(lastPos < unlock_lenth - 1){
        setFirstPos(firstPos + 1);
        setLastPos(lastPos + 1);
      }
    }
    
  }
  const calcHeight = () => {
    let height = 256;
    if(firstPos == 0){
      return 0;
    }else if(lastPos == unlock_lenth - 1){
      return height-51;
    }else{
     
      return (height/(unlock_lenth-2)*firstPos);
    }
  }
  return (
    <div>

    <ul className="minions"
    // defaultActiveKey={"#" + current}
    >
      {inventory.filter((m) => m !== null).map((m, i) => {

        if( i >= firstPos && i <= lastPos){
        return <SingleListItem current={current} setminion={setMinion} mId={m!} key={m!}></SingleListItem>
        }
      })}
      
    </ul>
    {unlock_lenth>3?<div className="scrollOut">
    <div className="scrollTop" onClick={()=>adjust(1)}></div>
    <div className="scrollIn">
    <div className="scrollButton" style={{
      width:'35px',
      height:'51px',
      float:'left',
      backgroundImage: `url(${scroll_btn})`,
      // backgroundColor:'#fff',
      marginTop: calcHeight(),
    }}> 
    </div>
    </div>
    <div className="scrollBottom" onClick={()=>adjust(-1)}></div>
    </div>:<></>}

    
    </div>
    )
}


export default function Contribute() {
  const [show, setShow] = useState(false);
  const [minionId, setMinionId] = useState<string | null>(null);
  const inventory = useAppSelector(selectInventory);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const inventory_updater = useAppSelector(selectInventoryUpdater);
  let ratio = 4;
  const dispatch = useAppDispatch();
  const viewIndex = useAppSelector(selectViewIndex);
  const handleConfirm = () => {
    console.log({ mId: minionId!, viewIndex: viewIndex })
    dispatch(updateInventory({bol:true}));
    dispatch(signalPlaceMinion({ mId: minionId!, viewIndex: viewIndex }));
    dispatch(addEvent(ProtectingEvent("GruPlayer 1", getWorld().getInstance(viewIndex))));
    setShow(false);
    dispatch(updateInventory({bol:false}));
  }
  return (

    <>
      {/* <Button variant="primary" onClick={handleShow} className="right">
        Protect This Block
      </Button> */}
      <button className="protect_btn" onClick={handleShow}>
        <img src={PROTECT} ></img>
      </button>
      {/* <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Pick a minion to protect this block?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MinionSelector setminion={setMinionId}></MinionSelector>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="Close" onClick={handleClose}>
            Cancel
          </Button>
          <Button active={minionId!==null} variant="Confirm" onClick={handleConfirm}>
            Choose
          </Button>
        </Modal.Footer>
      </Modal> */}
      <Modal show={show} aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-90w">

        <Modal.Body className="show-grid">
          <Container>
            <button className="closeBtn" onClick={handleClose}></button>
            <div className="select_area">
              <div className="protect_area">
                <div className="headerTitle">
                  <img src={header} ></img>
                </div>
                {/* <ul className="minions"> */}
                <MinionSelector  setminion={setMinionId}></MinionSelector>
                
                {/* </ul> */}
                
              </div>
            </div>
            <div className="footer">
              <img onClick={handleClose} className="cancel" src={CANCEL} />
              <img
              //  style={{cursor:minionId!==null?'not-allowed':'pointer',}}
               onClick={handleConfirm} className="choose" src={CHOOSE} />
            </div>
          </Container>
        </Modal.Body>

      </Modal>
    </>
  );
}


