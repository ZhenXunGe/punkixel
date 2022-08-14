// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { Button, Container, ListGroup, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
// import { MinionSelector } from "../components/Inventory";
import PUNKXIEL from "../../images/modal/advisor/punkixel.png";
import './style.scss';
import { getMinionFrame } from "../../sprite/spriteSlice";
import { RewardInfo, SourceObject } from "../../server/types";
import { getWorld } from "../../data/world";
interface RewardBoxProps {
  sources: Array<SourceObject>;
}

export function extractRewardInfo(source: Array<SourceObject>) {
  let reserve = source[2].amount;
  let rewardInfo: RewardInfo = {
    reserve: source[2].amount,
    rewards: [],
  };
  for (var i=3; i<source.length; i++) {
    let rewarditem = {
      minion: getWorld().getMinion(source[i].objId),
      amount: source[i].amount,
    };
    rewardInfo.rewards.push(rewarditem);
  }
  return rewardInfo;
}

export default function RewardBox(props: RewardBoxProps) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const rewardInfo = extractRewardInfo(props.sources);

  const handleConfirm = () => {
    setShow(false);
  }
  return (

    <>
      <div className="details" onClick={handleShow}></div>
      <Modal show={show} aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-90w">
        <Modal.Body className="show-grid">
          <Container>
            <button className="closeBtn" onClick={handleClose}></button>
            <div className="reward-area">
              <div className="info-left">
                <img src={PUNKXIEL}></img>
                <div className="reward-punkxiels"></div>
              </div>
              <div className="info">
                <div className="title">200 Punkxiels Dropped</div>
                <ul className="skill">
                  {rewardInfo.rewards.map((m)=>{
                    let minion = getWorld().getMinion(m.minion.id)!;
                    let ufo = getMinionFrame(minion).src;
                    return (<li key={`contributor-${m.minion.id}`}>
                      <img className="reward-avator" src={ufo}></img>
                      {m.amount} for [{m.minion.id}]
                    </li>);
                  })}
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
