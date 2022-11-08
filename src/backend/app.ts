import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import path from "path";
import cors from "cors";
import { getDocuments, getGLTF } from "./api";
import { opts } from './types/opts';
import * as fs from "fs";
dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());
let router = express.Router();

router.get("/", (req: Request, res: Response) => {
  getDocuments({}, (data: any) => {

    res.send(data);
  })
});
router.get("/gltf", (req: Request, res: Response) => {
  let opts: opts = {
    resource: 'parts',

    d: '9558507b2d8feaea012281be',
    v: 'ef47a69cee64730a99017b43',
    e: 'a8d9da8f108b44b9fa903800',
    subresource: 'partid/JHD/gltf',
    query: req.query
  }
    getGLTF(opts, (data: any) => {
      res.send(data);
    })
});


app.use("/api", router);

const port = process.env.PORT || 30000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});