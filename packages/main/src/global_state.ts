import * as ip from "ip";
import { machineIdSync } from "node-machine-id";
import { hostname, userInfo } from "os";

const Global_State: IGlobalState = {
  machine_id: machineIdSync(),
  name_app: "Data7 Manager",
  isDev: process.env.IS_DEV === "true",
  local_ip: ip.address("public"),
  username_machine: userInfo().username,
  hostname: hostname(),
  protocoll_register: "data7",
  notification_update:
    "A versão v{version} está Dispovível, ela será automaticamente instalada na próxima inicialização do aplicativo.\nVocê pode reiniciar a aplicação a qualquer momento para aplicar as mudanças.",
};

export { Global_State };
