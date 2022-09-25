// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { Container, Modal } from "react-bootstrap";
import { getMinionFrame } from "../../sprite/spriteSlice";
import { addressAbbreviation } from "../../utils/address";
import './style.scss';

import { getWorld } from "../../data/world";

interface PlayerProps {
  children?: React.ReactNode;
  playerId: string;
  avator: string;
  hint: string;
}

export function PlayerInfo(props: PlayerProps) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleConfirm = () => {
      setShow(false);
  }
  let player = getWorld().getPlayer(props.playerId);
  return (
      <>
          <div className="button" onClick={() => handleShow()}>
              {addressAbbreviation(props.playerId, 5)}
          </div>
          <Modal show={show} aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-90w">
              <Modal.Body className="show-grid">
                  <Container>
                      <button className="closeBtn" onClick={handleClose}></button>
                      <div className="reward-area">
                          <div className="info-left">
                              <img src={props.avator}></img>
                              <div className="advisor"></div>
                          </div>
                          <div className="info">
                            <div className="title"> {addressAbbreviation(props.playerId, 5)} </div>
                            <ul className="skill">
                              {player.inventory.map((mid)=>{
                                if (mid) {
                                  let minion = getWorld().getMinion(mid)!;
                                  let ufo = getMinionFrame(minion).src;
                                  return (<li key={`contributor-${mid}`}>
                                    <img className="reward-avator" src={ufo}></img>
                                    {minion.contribution}
                                  </li>);
                                } else {
                                  return (<></>)
                                }
                              })}
                            </ul>
                          </div>
                          <div className="info-right">
                          </div>
                      </div>
                  </Container>
              </Modal.Body>

          </Modal>
      </>
  );
}
