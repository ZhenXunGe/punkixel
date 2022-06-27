import express from "express";
import { DBClient } from './db';

const app = express();

function main() {
  const client = new (DBClient);

  app.get('/punkxiel/:collection_name', async (req:any, res:any) => {
    client.getAll('punkxiel', req.params.collection_name).then((result:any) => {
      res.send(result);
    })
  });

}

main();
