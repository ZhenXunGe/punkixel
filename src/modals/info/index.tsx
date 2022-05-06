// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from "react";
import { Container, Modal } from "react-bootstrap";
import "./style.scss";
interface InfoProps {
  children?:  React.ReactNode;
  title: string;
  avator: string;
  hint: string;
}


export default function InfoBox(props: InfoProps) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleConfirm = () => {
        setShow(false);
    }
    return (
        <>
            <div className={props.hint} onClick={handleShow}></div>
            <Modal show={show} aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-90w">
                <Modal.Body className="show-grid">
                    <Container>
                        <button className="closeBtn" onClick={handleClose}></button>
                        <div className="info-area">
                            <div className="info-left">
                                <img src={props.avator}></img>
                                <div className="advisor"></div>
                            </div>
                            <div className="info-right">
                                <div className="head">{props.title}</div>
                                {props.children}
                            </div>
                        </div>
                    </Container>
                </Modal.Body>

            </Modal>
        </>
    );
}