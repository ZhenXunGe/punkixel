// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { Button, Container, ListGroup, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
// import { MinionSelector } from "../components/Inventory";
import { selectUpcomingAlien } from "../../dynamic/dynamicSlice";
import './style.scss';
import { getSprite } from "../../sprite/spriteSlice";
interface MORE {
}




export default function More(props: MORE) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleConfirm = () => {
    setShow(false);
  }
  const alien = useAppSelector(selectUpcomingAlien);
  const sketch = getSprite(alien.sprite).getFrame("run", 0);
  return (

    <>
      {/* <Button variant="primary" onClick={handleShow} className="right">
        Protect This Block
      </Button> */}
      <button className="more" onClick={handleShow}>
        {/* <img src={PROTECT} ></img> */}
      </button>
      <Modal show={show} aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-90w">
        <Modal.Body className="show-grid">
          <Container>
            <button className="closeBtn" onClick={handleClose}></button>
            <div className="more-area">
              <div className="info-left">
                <img src={sketch.src}  ></img>
                <div className="advisor"></div>
              </div>
              <div className="info">
                <div className="title">{alien.name}</div>
                <div className="proto">
                  <div>{alien.speed}</div>
                  <div>{alien.favourate}</div>
                </div>
                <div className="desc">
                  This alien comes from planet XX and carries a rich source of punkxiels together with a few rare shining rocks can be used to produce
                  [{alien.drop[0]}]. Under extream attack, it can be caputured and become a minion to help you defending Z cities.
                </div>
                <ul className="skill">
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>
              </div>
              <div className="info-right">
                <div onClick={handleConfirm} className="unlock"></div>
              </div>
            </div>

          </Container>
        </Modal.Body>

      </Modal>
    </>
  );
}