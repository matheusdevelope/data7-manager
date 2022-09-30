import { hostname } from "os";
import {
  EnumTabs,
  EnumTypesOptions,
  EnumKeysTerminalData,
} from "../../../../../../types/enums/configTabsAndKeys";
import { tmpdir } from "os";
import { join } from "path";
export const CategoryTerminal = {
  category: EnumTabs.terminal_data,
  category_label: "Dados Terminal",
};
export const OptionsTerminalData: IOptionConfig2[] = [
  {
    ...CategoryTerminal,
    key: EnumKeysTerminalData.identification,
    value: hostname(),
    disabled: false,
    tip: "",
    label: "Identificação do Terminal",
    description: "",
    type: EnumTypesOptions.text,
  },
  {
    ...CategoryTerminal,
    key: EnumKeysTerminalData.temp_files,
    value: join(tmpdir(), "data7_manager/"),
    disabled: false,
    tip: "",
    label: "Pasta Arquivos Temporários",
    description: "",
    type: EnumTypesOptions.text,
  },
  {
    ...CategoryTerminal,
    key: EnumKeysTerminalData.cnpj_cpf,
    value: [],
    disabled: false,
    tip: "11.111.111/1111-01",
    label: "CNPJ / CPF",
    description:
      "Para usar serviços como PIX ou Whatsapp esse campo precisa ser informado.",
    type: EnumTypesOptions.array,
  },
  {
    ...CategoryTerminal,
    key: EnumKeysTerminalData.start_in_boot,
    value: true,
    disabled: false,
    tip: "",
    label: "Inicio Automático",
    description:
      "Ao ativar essa opção o Data7 Manager irá iniciar seus serviços junto com o sistema operacional.",
    type: EnumTypesOptions.boolean,
    alert: "Você precisa reiniciar a aplicação pra aplicar essa configuração.",
  },
];
