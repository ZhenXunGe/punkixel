import { Drawer } from "./draw";
import { DyeIndex } from "./palette";
import { getWorld, World } from "./world";
import { InstanceInfo } from "../server/types";
const individualWidth:number = 250;
const individualHeight:number = 100;
const content_size = individualWidth * individualHeight;

export class Instance {
    drawer: Drawer;
    info: InstanceInfo;
    constructor(drawer: Drawer, info: InstanceInfo) {
      this.drawer = drawer;
      this.info = info;
    }
    setDry(d: boolean) {
      this.drawer.setDry(d);
    }
    addMinion(m: string) {
      this.info.minions.push(m);
    }
    calculateRewards(punkxiels:number, drops:string[]) {
      let share = this.info.ratio * punkxiels;
      let total_contribution = 0;
      let rewards = [];
      for (var x of this.info.minions) {
        let minion = getWorld().getMinion(x);
        total_contribution += minion.contribution;
      };
      for (var m of this.info.minions) {
        let minion = getWorld().getMinion(m);
        let owner = minion.owner;
        let amount = Math.floor(share * minion.contribution / total_contribution);
        getWorld().claimRewardPunkxiel(owner, amount);
        rewards.push({minion: minion, amount:amount});
      }
      for (var m of this.info.minions) {
        getWorld().clearMinionContribute(m);
      }
      let locOwner = this.info.owner;
      getWorld().claimDrop(locOwner, drops);
      return {
        rewards: rewards,
        reserve: Math.floor((1 - this.info.ratio) * punkxiels)
      };
    }
    overView() {
      let dmg = 0;
      this.info.minions.forEach((m)=>{
        let minion = getWorld().getMinion(m);
        dmg = dmg + minion.power;
      });
      let nb_defender = this.info.minions.length;
      let pph = this.info.pph;
      return ({
        dmg: dmg,
        pph: pph,
        nbDefender: nb_defender
      })

    }
    defendingAdvice() {
      let overview = this.overView();
      if (overview.dmg < 40) {
        return {
          brief: "Not enough defending dmg for your instance.",
          description: `Your total defending damage for your instance is ${overview.dmg}" which is too low to knock down aliens.
            You can place your minions to your instance to increase your overall defending effects or you can provid a competitive
            rewarding ratio to attract more defenders. (Currently you have ${overview.nbDefender} defenders protecting your instance)`
        }
      } else {
        return null
      }
    }
    artistAdvice(){
      let overview = this.overView();
      if (overview.pph < 20) {
        return {
          brief: "Your instance has a low pph. Try impoving PPH by painting",
          description: `PPH is a measure of the overall development of your instance. Every time an alien is knocked down in your instance, you and
            instance defenders will get some punkxiels as rewards together with a few rare drops including minions and dyes. The amount of rewards is
            closely related to the PPH of the instance where an alien is knocked down. You can improve your PPH by various methods including sketch your
            instance (gives your instance a base PPH) and painting your instance with normal dye(1 PPH per pixel), rare dye(2 PPH per pixel) or even programmable
            dye(4 PPH per pixel)`
        }
      }
    }
  }
