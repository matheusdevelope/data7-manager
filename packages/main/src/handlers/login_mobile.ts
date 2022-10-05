import { app } from "electron";
import { machineIdSync } from "node-machine-id";
import {
  EnumKeysPix,
  EnumKeysTerminalData,
  EnumServices,
  EnumTabs,
} from "../../../../types/enums/configTabsAndKeys";
import { Global_State } from "../global_state";
import { GetKeyValue } from "../services/local_storage";
import { MakeParamsFromObj } from "../utils";

function DataToLoginMobile(): IDataToLoginMobile {
  const ObjCNPJ = GetKeyValue({
    key: EnumKeysTerminalData.cnpj_cpf,
    category: EnumTabs.terminal_data,
  });
  const Identification = String(
    GetKeyValue({
      key: EnumKeysTerminalData.identification,
      category: EnumTabs.terminal_data,
    }) || "",
  );
  const OrderAsc = Boolean(
    GetKeyValue({
      key: EnumKeysPix.order_asc,
      sub_category: EnumServices.pix,
    }),
  );
  const CNPJs = ObjCNPJ && Array.isArray(ObjCNPJ) ? ObjCNPJ : [];
  return {
    id_machine: machineIdSync(),
    hostname: Global_State.hostname,
    username_machine: Global_State.username_machine,
    ip: Global_State.local_ip,
    terminal_identification: Identification,
    cnpj_cpf: CNPJs,
    order_asc: OrderAsc,
    version: app.getVersion(),
  };
}

const URL_Login_Mobile = (DataToLoginMobile: IDataToLoginMobile) => {
  const baseURL = "data7://login?";
  const params = MakeParamsFromObj(DataToLoginMobile).join("&");
  return `${baseURL}${params}`;
};

export { URL_Login_Mobile, DataToLoginMobile };
