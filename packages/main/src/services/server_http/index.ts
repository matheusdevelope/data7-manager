import express from "express";
import cors from "cors";
import http from "http";

import ApiRoute from "./routes";
import { Global_State } from "/@/global_state";
const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(ApiRoute());
export default function HTTP_Server(
  port: number = Global_State.port_server_http,
) {
  return {
    execute: (cb: () => void) => {
      server.listen(port, () => cb());
    },
    stop(cb: (e: Error | undefined) => void) {
      server.close((e) => cb(e));
    },
  };
}
