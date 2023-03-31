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
import { resolve } from "path";

let IO: Server | null = null;
let timer: NodeJS.Timer;
let connections_count = 0;

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

    IO.on("error", (e) => {
      CreateNotification({
        title: "Painel de Expedição",
        body:
          "Erro ao no serviço de socket do painel de expedição: \n" + String(e),
      });
    });

    IO.on("connection", (socket) => {
      CreateNotification({
        title: "Painel de Expedição",
        body: "Painel conectado.",
      });
      connections_count++;
      socket.on("refresh_data_dispath_panel", async (..._) => {
        const ret = await DB.query(config[EnumKeysDispatchPanel.query]);
        socket.emit("data_dispath_panel", ret);
      });
      socket.on("disconnect", () => {
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
  IO = null;
  HTTP_Server_Dispatch().stop(() => console.log);
}

export default function SocketService() {
  return {
    execute,
    stop,
  };
}
