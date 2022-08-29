import express, { Request, Response } from "express";
import { SysEvent} from "./types";
import { registerPlayer, allInstances,
  allPlayers, allMinions,
  loadWorld, fetchEvents,
  getInstanceByIndex, registerMinion,
  getPlayer, getMinion, rerollMinion,
  totalInstance, protectInstance,
  drawInstance,
} from './db';
import { init } from "./init";
import { Simulator }  from "./simulate";

import cors from "cors";

const app = express();
app.use(cors());
const punkixelRouter = express.Router();
punkixelRouter.use(express.json({limit:'2mb'}));


var simulator: Simulator | null = null;

punkixelRouter.get("/info/:playerid/:start", async (req: Request, res: Response) => {
  try {
      let i = await loadWorld();
      let start = parseInt(req.params.start);
      let events: Array<SysEvent> = [];
      let player = await getPlayer(req.params.playerid);
      if (start > 0) {
        events = await fetchEvents(parseInt(req.params.start));
      }
      let simuinfo = simulator?.info();
      let info = {
        ...simuinfo,
        events: events,
        player: player,
        totalEvents: i.totalEvents,
      }
      res.status(200).send({"success": true, result: info});
  } catch (error:any) {
      res.status(500).send({"success": false, "error": error.message});
  }
});

punkixelRouter.get("/instances/", async (req: Request, res: Response) => {
  try {
    const instances = await allInstances();
    res.status(200).send({ success: true, result: instances });
  } catch (error: any) {
    res.status(400).send({ "success": false, "error": error.message });
  }
});

punkixelRouter.get("/players/", async (req: Request, res: Response) => {
  try {
    const instances = await allPlayers();
    res.status(200).send({ success: true, result: instances });
  } catch (error: any) {
    res.status(400).send({ "success": false, "error": error.message });
  }
});


punkixelRouter.get("/minions/", async (req: Request, res: Response) => {
  try {
    const instances = await allMinions();
    res.status(200).send({ success: true, result: instances });
  } catch (error: any) {
    res.status(400).send({ "success": false, "error": error.message });
  }
});

punkixelRouter.get("/minion/:minionId", async (req: Request, res: Response) => {
  try {
    const minion = await getMinion(req.params.minionId);
    console.log(`req: get minion ${req.params.minionId}`);
    res.status(200).send({ success: true, result: minion});
  } catch (error: any) {
    res.status(400).send({ "success": false, "error": error.message });
  }
});

punkixelRouter.post('/minion/protect/', async (req:any, res:any) => {
    console.log("req body:", req.body);
    const instance = await getInstanceByIndex(parseInt(req.body.location));
    const minion = await getMinion(req.body.minionid);
    let m = await protectInstance(minion, instance);
    simulator!.addMinion(minion.id);
    console.log(`req: protect ${instance.index} ${minion.id}`);
    res.status(200).send({ success: true, result: m});
  });

punkixelRouter.post('/draw/:instanceidx/', async (req:any, res:any) => {
    const instance = await getInstanceByIndex(parseInt(req.params.instanceidx));
    console.log("get instance:", instance, req.params.instanceidx);
    const data = req.body.content;
    await drawInstance(instance, data);
    res.status(200).send({ success: true, result: {}});
  });

punkixelRouter.post('/unlock/:playerid/:slot', async (req:any, res:any) => {
    const id = await registerMinion(req.params.playerid, parseInt(req.params.slot));
    const player = await getPlayer(req.params.playerid);
    console.log(`req: unlock minion ${req.params.playerid} ${req.params.slot} ${id}`, player);
    res.status(200).send({ success: true, result: player});
  });

punkixelRouter.post('/reroll/:playerid/:slot', async (req:any, res:any) => {
    const player = await getPlayer(req.params.playerid);
    const mId = player.inventory[parseInt(req.params.slot)];
    const minion = await rerollMinion(mId!);
    console.log(`req: reroll minion ${req.params.playerid} ${req.params.slot}`, player);
    res.status(200).send({ success: true, result: minion});
  });

punkixelRouter.post("/player/register/", async (req: Request, res: Response) => {
  try {
    await registerPlayer(req.body.playerid);
    console.log(`register player: ${req.body.playerid}`);
    let player = await getPlayer(req.body.playerid);
    let nbInstance = await totalInstance();
    simulator!.updateTotalInstance(nbInstance);
    res.status(200).send({ success: true, result: player});
  } catch (error: any) {
    res.status(400).send({ "success": false, "error": error.message });
  }
});


const port = 4000;

init(true)
  .then((sim:Simulator) => {
    simulator = sim;
    app.use("/punkixel", punkixelRouter);

    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", "error");
    process.exit();
  });
