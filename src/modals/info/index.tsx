// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { Container, Modal } from "react-bootstrap";
import { closeDialog, openDialog } from "../../layout/layoutSlice";
import "./style.scss";

interface ContentProps {
  children?:  React.ReactNode;
  title: string;
  avator: string;
}

export function InfoContent(props: ContentProps) {
    const dispatch = useAppDispatch();
    let handleClose = () => dispatch(closeDialog());
    return (<Container>
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
        <div className="guide">
        </div>
    </Container>);
}

interface InfoProps {
  children?:  React.ReactNode;
  title: string;
  avator: string;
  hint: string;
}

export default function InfoBox(props: InfoProps) {
    const dispatch = useAppDispatch();
    const handleShow = () => {
      dispatch(openDialog(<InfoContent title={props.title} avator={props.avator} children={props.children}></InfoContent>));
    }
    return (
      <div className={props.hint} onClick={handleShow}></div>
    );
}
