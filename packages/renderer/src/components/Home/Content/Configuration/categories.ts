import { EnumTypesOptions } from "../../../../../../../types/enums";
interface IOptionConfig {
  key: string;
  value: string | number | string[] | boolean;
  min_value_lenght?: number[];
  tip: string;
  label: string;
  description?: string;
  type: EnumTypesOptions;
  order: number;
}
interface ITabsConfig {
  category: string;
  label: string;
  options: IOptionConfig[];
}

export const OptionsTerminalData: IOptionConfig[] = [
  {
    key: "identification",
    value: "Machine Name",
    tip: "",
    label: "Identificação do Terminal",
    description: "",
    type: EnumTypesOptions.text,
    order: 0,
  },
  {
    key: "identification2",
    value: "Machine Name 2",
    tip: "",
    label: "Identificação do Terminal 2",
    description: "teste",
    type: EnumTypesOptions.text,
    order: 1,
  },
  {
    key: "teste",
    value: [],
    tip: "11.111.111/1111-01",
    // min_value_lenght: [11, 14],
    label: "CNPJ / CPF",
    description:
      "Para usar serviços como PIX ou Whastapp esse campo precisa ser informado.",
    type: EnumTypesOptions.array,
    order: 2,
  },
  {
    key: "use_whatsapp_integrated",
    value: false,
    tip: "",
    label: "Whatsapp Integrado",
    description:
      "Esse recurso permite que os serviços que de comunicação com o Whatsapp usem o bot interno de whatsapp para fazer o envio de mensagens abrir o app/site. \nAtenção: Esse recurso oferece risco de suspensão se do numero de whatsapp por não se tratar de uma integração oficial da plataforma, recomenda-se usar um número exclusivo para envio afim de evitar possíveis perca de números oficias da empresa.",
    type: EnumTypesOptions.boolean,
    order: 3,
  },
];
export const OptionsServices: IOptionConfig[] = [
  {
    key: "identification",
    value: "Machine Name",
    tip: "",
    label: "Identificação do Terminal",
    description: "",
    type: EnumTypesOptions.text,
    order: 1,
  },
];
export const OptionsNotifications: IOptionConfig[] = [
  {
    key: "cnpj_cpf",
    value: [],
    min_value_lenght: [11, 14],
    tip: "11.111.111/1111-01",
    label: "CNPJ / CPF",
    description:
      "Para usar serviços como PIX ou Whastapp esse campo precisa ser informado.",
    type: EnumTypesOptions.array,
    order: 2,
  },
  {
    key: "use_whatsapp_integrated",
    value: true,
    tip: "",
    label: "Whatsapp Integrado",
    description:
      "Esse recurso permite que os serviços que de comunicação com o Whatsapp usem o bot interno de whatsapp para fazer o envio de mensagens abrir o app/site. \nAtenção: Esse recurso oferece risco de suspensão se do numero de whatsapp por não se tratar de uma integração oficial da plataforma, recomenda-se usar um número exclusivo para envio afim de evitar possíveis perca de números oficias da empresa.",
    type: EnumTypesOptions.boolean,
    order: 3,
  },
];
export const Tabs: ITabsConfig[] = [
  {
    category: "terminal_data",
    label: "Dados Terminal",
    options: OptionsTerminalData,
  },
  {
    category: "services",
    label: "Serviços",
    options: OptionsServices,
  },
  {
    category: "notifications",
    label: "Notificações",
    options: OptionsNotifications,
  },
];
