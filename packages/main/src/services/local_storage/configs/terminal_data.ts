import { hostname } from "os";
import {
  EnumTabs,
  EnumKeys,
  EnumTypesOptions,
} from "../../../../../../types/enums/configTabsAndKeys";

export const CategoryTerminal = {
  category: EnumTabs.terminal_data,
  category_label: "Dados Terminal",
};
export const OptionsTerminalData: IOptionConfig2[] = [
  {
    ...CategoryTerminal,
    key: EnumKeys.identification,
    value: hostname(),
    disabled: false,
    tip: "",
    label: "Identificação do Terminal",
    description: "",
    type: EnumTypesOptions.text,
  },
  {
    ...CategoryTerminal,
    key: EnumKeys.cnpj_cpf,
    value: [],
    disabled: false,
    tip: "11.111.111/1111-01",
    label: "CNPJ / CPF",
    description:
      "Para usar serviços como PIX ou Whastapp esse campo precisa ser informado.",
    type: EnumTypesOptions.array,
  },
];
