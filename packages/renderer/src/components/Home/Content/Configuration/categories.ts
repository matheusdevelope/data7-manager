import { EnumTypesOptions } from "../../../../../../../types/enums";
//: IOptionConfig[]
export const OptionsTerminalData = [
  {
    key: "identification",
    value: "Machine Name",
    disabled: false,
    tip: "",
    label: "Identificação do Terminal",
    description: "",
    type: EnumTypesOptions.text,
  },
  {
    key: "cnpj_cpf",
    value: [],
    disabled: false,
    tip: "11.111.111/1111-01",
    label: "CNPJ / CPF",
    description:
      "Para usar serviços como PIX ou Whastapp esse campo precisa ser informado.",
    type: EnumTypesOptions.array,
  },
  {
    key: "use_whatsapp_integrated",
    value: false,
    disabled: true,
    tip: "",
    label: "Whatsapp Integrado",
    description:
      "Esse recurso permite que os serviços que de comunicação com o Whatsapp usem o bot interno de whatsapp para fazer o envio de mensagens abrir o app/site. \nAtenção: Esse recurso oferece risco de suspensão se do numero de whatsapp por não se tratar de uma integração oficial da plataforma, recomenda-se usar um número exclusivo para envio afim de evitar possíveis perca de números oficias da empresa.",
    type: EnumTypesOptions.boolean,
  },
];
//: IOptionConfig[]
export const OptionsServices = [
  {
    key: "identification",
    value: "Machine Name",
    disabled: false,
    tip: "",
    label: "Identificação do Terminal",
    description: "",
    type: EnumTypesOptions.text,
  },
];
// : ITabsConfig[]
export const Tabs = [
  {
    category: "terminal_data",
    label: "Dados Terminal",
    options: OptionsTerminalData,
    sub_categories: [],
  },
  {
    category: "services",
    label: "Serviços",
    options: OptionsServices,
    sub_categories: [],
  },
];
