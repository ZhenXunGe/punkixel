import InfoBox from "../modals/info/index";
import './style.scss';
import ARTIST_ADVISOR_AVATOR from '../images/modal/advisor/artistadvisor.png';
import DEFEND_ADVISOR_AVATOR from '../images/modal/advisor/defendadvisor.png';
import { getWorld } from "../data/world";
import { InfoContent } from "../modals/info";
import React from "react";
import { DialogProps } from "../layout/layoutSlice";

/* Advice Event will not be submitted to Server */
export function AdviceHint(advisor: string, brief: string, advice: string, arrow: string, avator: string) {
    return {
      content: <InfoContent avator={avator} title={advisor}>{(<div>{advice}</div>)}</InfoContent>,
      arrow: arrow,
    };
}

export function getHomeAdviceHints(homeIndex: number) {
    let instance = getWorld().getInstance(homeIndex);
    let artistAdvice = instance.artistAdvice();
    let hints:Array<DialogProps> = [];
    if(artistAdvice!==null) {
      hints.push(AdviceHint("Artist Advise", artistAdvice!.brief, artistAdvice!.description, "north", ARTIST_ADVISOR_AVATOR));
    }
    let defendingAdvice = instance.defendingAdvice();
    if(defendingAdvice!==null) {
      hints.push(AdviceHint("Defending Advise", defendingAdvice!.brief, defendingAdvice!.description, "north",DEFEND_ADVISOR_AVATOR));
    }
    return hints;
}


export function getWorldAdviceHints(homeIndex: number) {
  let instance = getWorld().getInstance(homeIndex);
  let hints:Array<DialogProps> = [];
  let defendingAdvice = instance.defendingAdvice();
  if(defendingAdvice!==null) {
    hints.push(AdviceHint("Defending Advise", defendingAdvice!.brief, defendingAdvice!.description, "north-east", DEFEND_ADVISOR_AVATOR));
  }
  return hints;
}