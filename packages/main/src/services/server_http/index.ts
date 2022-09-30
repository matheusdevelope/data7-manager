import express from "express";
import cors from "cors";
import http from "http";
import ApiRoute from "./routes";
const app = express();
const server = http.createServer(app);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());
app.use(ApiRoute());
export default function HTTP_Server() {
  return {
    execute: (port: number, cb: () => void) => {
      !server.listening && server.listen(port, () => cb());
    },
    stop(cb: (e: Error | undefined) => void) {
      const listening = server.listening;
      server.close((e) => listening && cb(e));
    },
  };
}
