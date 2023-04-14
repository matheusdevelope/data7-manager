import express from "express";
import cors from "cors";
import http from "http";
import { resolve } from "path";
const app = express();
const server = http.createServer(app);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());
app.use(express.static(resolve(__dirname, "public", "dispatch_panel")));

app.get("/ping", (req, res) => {
  res.status(200).send("Server Ok");
});

app.get("*", (req, res) => {
  res.sendFile(resolve(__dirname, "public", "dispatch_panel", "index.html"));
});


export default function HTTP_Server_Dispatch() {
  return {
    execute: (port: number, cb?: () => void) => {
      !server.listening && server.listen(port, () => cb && cb());
      return server;
    },
    stop(cb: (e: Error | undefined) => void) {
      const listening = server.listening;
      server.close((e) => listening && cb(e));
    },
    server,
  };
}
