import { hostname } from "os";
import {
  EnumKeys,
  EnumServices,
  EnumTabs,
  EnumTypesOptions,
} from "../../../../../types/enums/configTabsAndKeys";
import { EnumWindowsID } from "../../../../../types/enums/windows";
import { ServiceFirebase } from "./configs/firebase";

export const categoryService = {
  category: EnumTabs.services,
  category_label: "Serviços",
};
const CategoryTerminal = {
  category: EnumTabs.terminal_data,
  category_label: "Dados Terminal",
};
const OptionsTerminalData: IOptionConfig2[] = [
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
  {
    ...CategoryTerminal,
    key: EnumKeys.whatsapp_integrated,
    value: false,
    disabled: false,
    tip: "",
    label: "Whatsapp Integrado",
    id_window: EnumWindowsID.whatsapp,
    description:
      "Esse recurso permite que os serviços de comunicação com o Whatsapp usem o bot interno de whatsapp para fazer o envio de mensagens abrir o app/site. \nAtenção: Esse recurso oferece risco de suspensão se do numero de whatsapp por não se tratar de uma integração oficial da plataforma, recomenda-se usar um número exclusivo para envio afim de evitar possíveis perca de números oficias da empresa.",
    type: EnumTypesOptions.boolean,
  },
];

const ServicesTab: IOptionConfig2[] = [
  {
    ...categoryService,
    sub_category: EnumServices.pix,
    sub_category_label: "PIX",
    key: EnumKeys.status,
    value: false,
    disabled: false,
    tip: "",
    label: "Pagamento via PIX",
    id_window: EnumWindowsID.pix,
    description:
      "Esse serviço habilita a integração para o processamento de pagamento via PIX na máquina local.",
    type: EnumTypesOptions.boolean,
    validate_keys: [
      {
        category: EnumTabs.services,
        sub_category: EnumServices.firebase,
        key: EnumKeys.status,
        onvalue: true,
        keyvalue: false,
        block: true,
        message:
          "Esse recurso depende do serviço de sincronização do Firebase, ative-o antes de habilitar esse serviço.",
      },
    ],
  },
  {
    ...categoryService,
    sub_category: EnumServices.whatsapp,
    sub_category_label: "Whatsapp",
    key: EnumKeys.status,
    value: false,
    disabled: false,
    tip: "",
    label: "Envio arquivos via Whatsapp",
    description:
      "Esse serviço habilita a integração para o processamento e envio de arquivos através do Data7. ",
    type: EnumTypesOptions.boolean,
  },
];

export const DefaultConfigTabs: IOptionConfig2[] = [
  ...OptionsTerminalData,
  ...ServicesTab,
  ...ServiceFirebase,
];
