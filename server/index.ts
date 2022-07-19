import express, { Request, Response } from "express";
import { connectToDatabase, allInstances, allPlayers, allMinions} from './db';

import cors from "cors";

const app = express();
app.use(cors());
const punkixelRouter = express.Router();
punkixelRouter.use(express.json());
punkixelRouter.get("/info/", async (req: Request, res: Response) => {
  try {
      res.status(200).send({"success": true});
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
const port = 4000;
connectToDatabase(false)
  .then(() => {
    app.use("/punkixel", punkixelRouter);

    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", "error");
    process.exit();
  });
