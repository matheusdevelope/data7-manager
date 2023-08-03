import { Server } from "socket.io";
import { GetServiceOptions } from "../local_storage";
import {
  EnumKeysDispatchPanel,
  EnumServices,
} from "../../../../../types/enums/configTabsAndKeys";
import {
  ConnectionSqlServer,
  ConnectionSybase,
  Database,
} from "repository-data7";
import { CreateNotification } from "/@/handlers/notifications";
import HTTP_Server_Dispatch from "./http";
import { dialog } from "electron";
import path, { resolve } from "path";
import { appendFileSync } from "fs";
import { tmpdir } from "os";

let IO: Server | null = null;
let timer: NodeJS.Timer;
let connections_count = 0;

function generateFileName(base:string) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");
  const fileName = `${base}-${year}-${month}-${day}.txt`;
  return fileName;
}

function LogFile(data:string) {
  try {
    appendFileSync( path.join(tmpdir() , generateFileName("log-data7-panel")),
    `
    ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}
    ${data}
    -------------------------------------------------------------------------


    `);
  } catch (error) {
    console.log(error);
    
  }
  
}


async function SendData(query: string, DB: any) {
  if (connections_count > 0) {
    try {
      const ret = await DB.query(query);
      IO?.emit("data_dispath_panel", ret);
    } catch (error) {
      clearInterval(timer);
      dialog.showMessageBoxSync({
        title: "Error",
        message: String(error),
      });
      CreateNotification({
        title: "Painel de Expedição",
        body:
          "Erro ao executar a query no banco de dados, verifique. \n" +
          String(error),
      });
    }
  }
}

function execute() {
  try {
    if (IO) return IO;
    const list_config = GetServiceOptions(EnumServices.dispatch_panel);
    const config: {
      [key: string]: string | string[] | boolean | number;
    } = {};
    list_config.forEach((opt) => {
      config[opt.key] = opt.value;
    });

    const database = config[EnumKeysDispatchPanel.database];
    const server_port = Number(config[EnumKeysDispatchPanel.server_port] || 0);
    const time_refresh =
      Number(config[EnumKeysDispatchPanel.time_refresh]) * 1000;
    const db_params = {
      user: config[EnumKeysDispatchPanel.user],
      password: config[EnumKeysDispatchPanel.pass],
      dbname: config[EnumKeysDispatchPanel.dbname],
      host: config[EnumKeysDispatchPanel.host],
      port: Number(config[EnumKeysDispatchPanel.port] || 0),
      libJava:
        process.env.MODE === "development"
          ? undefined
          : resolve(
              __dirname,
              "../../../../node_modules/sybase/JavaSybaseLink/dist/JavaSybaseLink.jar",
            ),
    };

    if (!server_port)
      return CreateNotification({
        title: "Painel de Expedição",
        body: "Serviço não iniciado, porta inválida.",
      });

    const connectionDB =
      database.toString().toUpperCase() == "SYBASE"
        ? new ConnectionSybase(db_params)
        : new ConnectionSqlServer(db_params);
    const DB = new Database(connectionDB);
    HTTP_Server_Dispatch().execute(server_port);
    
    IO = new Server(HTTP_Server_Dispatch().execute(server_port), {
      cors: {
        origin: "*",
      },
    });
    LogFile( "--- Socket Service Enabled ");
    // IO.setMaxListeners()

    IO.on("error", (e) => {
      LogFile(
        `Socket Error Event:
         ${String(e)} 
        `);
      CreateNotification({
        title: "Painel de Expedição",
        body:
          "Erro ao no serviço de socket do painel de expedição: \n" + String(e),
      });
    });

    IO.on("connection", (socket) => {
      LogFile(
      `Socket Connection: 
       idDevice: ${socket.handshake.query.idDevice}
       socketId: ${socket.id}
      `);
      CreateNotification({
        title: "Painel de Expedição",
        body: "Painel conectado.",
      });
      connections_count++;
      socket.on("refresh_data_dispath_panel", async (..._) => {
        const ret = await DB.query(config[EnumKeysDispatchPanel.query]);
        socket.emit("data_dispath_panel", ret);
      });
      socket.on("disconnect", (_) => {
        LogFile(
          `Socket Disconnection: 
           idDevice: ${socket.handshake.query.idDevice}
           socketId: ${socket.id}
          `);
        if (connections_count > 0) connections_count--;
        CreateNotification({
          title: "Painel de Expedição",
          body: "Painel desconectado.",
        });
      });
    });

    timer = setInterval(
      () => SendData(String(config[EnumKeysDispatchPanel.query]), DB),
      time_refresh,
    );
    return IO;
  } catch (e) {
    LogFile(
      `Socket Error Execute Method:
       ${String(e)} 
      `);
    CreateNotification({
      title: "Painel de Expedição",
      body: "Erro ao iniciar o serviço do painel de expedição: \n" + String(e),
    });
  }
}

function stop() {
  connections_count = 0;
  clearInterval(timer);
  // IO?.close((e) => {
  //   CreateNotification({
  //     title: "Painel de Expedição",
  //     body: "Erro ao parar o serviço do painel de expedição: \n" + String(e),
  //   });
  // });
  IO?.disconnectSockets();
  IO?.removeAllListeners();
  IO?.close();
  IO = null;
  HTTP_Server_Dispatch().stop(() => console.log);
  LogFile( "--- Socket Service Disabled ");
}

export default function SocketService() {
  return {
    execute,
    stop,
  };
}
