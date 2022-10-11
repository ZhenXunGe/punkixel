// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { useState } from "react";
import { Container, Modal } from "react-bootstrap";
import { useAppSelector} from "../app/hooks";
import { selectDialog } from "./layoutSlice";

interface DialogProps {
}

export default function Dialog(props: DialogProps) {
  const dialogs = useAppSelector(selectDialog);
  console.log("dialogs", dialogs);
  let c = <></>;
  return (
      <>
           <Modal show={dialogs.length !== 0} aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-90w">
              <Modal.Body className="show-grid">
                <Container>
                  {dialogs.length ===0 ? <></> : dialogs[0].content}
                  <div className="dialog-nav"></div>
                  <div className="dialog-hint">
                    <div className={dialogs.length ===0 ? "none" : dialogs[0].arrow}></div>
                  </div>
                </Container>
              </Modal.Body>
          </Modal>
      </>
  );
}
