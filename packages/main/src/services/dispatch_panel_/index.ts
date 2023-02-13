// import { Server } from "socket.io";
import { Server } from "socket.io";
const server = require("http").createServer();

const IO: Server | null = null;

// function FakeDataMake(
//   id: number,
//   codcliente: number,
//   nomecliente: string,
//   uf: string,
//   municipio: string,
//   data: Date,
// ) {
//   return {
//     id,
//     codcliente,
//     nomecliente,
//     uf,
//     municipio,
//     data,
//   };
// }
let timer: NodeJS.Timer;

function execute() {
  const io = new Server(server);

  io.on("connection", (client) => {
    client.on("event", (data) => {
      console.log(data);
    });
    client.on("disconnect", (data) => {
      console.log(data);
    });
  });
  server.listen(3002);

  // console.log("Into Socket Service");
  // if (IO) return IO;
  // IO = new Server({});
  // console.log("After");
  // IO.on("error", (e) => {
  //   console.log(e);
  // });
  // IO.on("connection", (socket) => {
  //   console.log();

  //   const FakeData = [
  //     FakeDataMake(1, 1, "Matheus", "MT", "Sinop", new Date()),
  //     FakeDataMake(2, 2, "Matheus 1", "MT", "Sorriso", new Date()),
  //     FakeDataMake(3, 3, "Matheus 2", "MG", "Goias", new Date()),
  //     FakeDataMake(4, 4, "Matheus 3", "SP", "São Paulo", new Date()),
  //     FakeDataMake(5, 5, "Matheus 4", "RJ", "Rio de Janeiro", new Date()),
  //     FakeDataMake(6, 6, "Matheus 5", "RO", "Boa Vista", new Date()),
  //     FakeDataMake(7, 7, "Matheus 6", "PA", "Santarém", new Date()),
  //   ];
  //   timer = setInterval(() => {
  //     socket.emit("data_dispath_panel", FakeData);
  //   }, 5 * 1000);

  //   socket.on("refresh_data_dispath_panel", (...data) => {
  //     socket.emit("data_dispath_panel", [...FakeData, ...FakeData]);
  //     console.log("refresh_data_dispath_panel", data);
  //   });
  //   socket.on("disconnect", (reason, description) => {
  //     clearInterval(timer);
  //     console.log("Client desconnected: " + description, reason);
  //   });
  // });
  // IO.listen(3002);
  // return IO;
}
function stop() {
  clearInterval(timer);
  IO?.close((e) => {
    console.log(e);
  });
}

export default function SocketService() {
  return {
    execute,
    stop,
  };
}

// Cliente , Data, Municio, Vendedor (Opcional)
