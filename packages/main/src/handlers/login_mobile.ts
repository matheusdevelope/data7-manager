import { machineIdSync } from "node-machine-id";
import { EnumKeys } from "../../../../types/enums/configTabsAndKeys";
import { Global_State } from "../global_state";
import { GetConfigTabs } from "../services/local_storage";
import { GenerateApplicationID } from "../services/local_storage/Applications_IDs_By_Username";
import { MakeParamsFromObj } from "../utils";

function DataToLoginMobile(): IDataToLoginMobile {
  const config = GetConfigTabs();
  const ObjCNPJ = config
    ? config.find((obj) => obj.key === EnumKeys.cnpj_cpf)
    : undefined;
  const CNPJs = ObjCNPJ && Array.isArray(ObjCNPJ.value) ? ObjCNPJ.value : [];
  return {
    id_machine: machineIdSync(),
    hostname: Global_State.hostname,
    username_machine: Global_State.username_machine,
    ip: Global_State.local_ip,
    terminal_identification: !config
      ? ""
      : String(
          config.find((obj) => obj.key === EnumKeys.identification)?.value || "",
        ),
    cnpj_cpf: CNPJs,
  };
}

const URL_Login_Mobile = (DataToLoginMobile: IDataToLoginMobile) => {
  GenerateApplicationID(DataToLoginMobile.username_machine);
  const baseURL = "data7://login?";
  const params = MakeParamsFromObj(DataToLoginMobile).join("&");
  return `${baseURL}${params}`;
};

export { URL_Login_Mobile, DataToLoginMobile };
