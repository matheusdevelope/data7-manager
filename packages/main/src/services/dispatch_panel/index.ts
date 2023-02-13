import { Server } from "socket.io";
import type http from "http";

let IO: Server | null = null;

function FakeDataMake(
  id: number,
  codcliente: number,
  nomecliente: string,
  uf: string,
  municipio: string,
  data: Date,
) {
  return {
    id,
    codcliente,
    nomecliente,
    uf,
    municipio,
    data,
  };
}
let timer: NodeJS.Timer;

function execute(HttpServer: http.Server) {
  if (IO) return IO;
  IO = new Server(HttpServer);
  IO.on("error", (e) => {
    console.log(e);
  });
  IO.on("connection", (socket) => {
    const FakeData = [
      FakeDataMake(1, 1, "Matheus", "MT", "Sinop", new Date()),
      FakeDataMake(2, 2, "Matheus 1", "MT", "Sorriso", new Date()),
      FakeDataMake(3, 3, "Matheus 2", "MG", "Goias", new Date()),
      FakeDataMake(4, 4, "Matheus 3", "SP", "São Paulo", new Date()),
      FakeDataMake(5, 5, "Matheus 4", "RJ", "Rio de Janeiro", new Date()),
      FakeDataMake(6, 6, "Matheus 5", "RO", "Boa Vista", new Date()),
      FakeDataMake(7, 7, "Matheus 6", "PA", "Santarém", new Date()),
    ];
    timer = setInterval(() => {
      socket.emit("data_dispath_panel", FakeData);
    }, 5 * 1000);

    socket.on("refresh_data_dispath_panel", (...data) => {
      socket.emit("data_dispath_panel", [...FakeData, ...FakeData]);
      console.log("refresh_data_dispath_panel", data);
    });
    socket.on("disconnect", (reason, description) => {
      clearInterval(timer);
      console.log("Client desconnected: " + description, reason);
    });
  });
  return IO;
}
function Stop() {
  clearInterval(timer);
  IO?.close((e) => {
    console.log(e);
  });
}

export default function SocketService() {
  return {
    execute,
    Stop,
  };
}

// Cliente , Data, Municio, Vendedor (Opcional)
