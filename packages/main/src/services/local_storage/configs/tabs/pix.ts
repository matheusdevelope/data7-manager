import {
  EnumServices,
  EnumKeys,
  EnumTypesOptions,
  EnumTabs,
  EnumKeysPix,
  EnumKeysTerminalData,
} from "../../../../../../../types/enums/configTabsAndKeys";
import { EnumWindowsID } from "../../../../../../../types/enums/windows";
import { categoryService } from "../comum_categories";
const SubCategoryPix = {
  ...categoryService,
  sub_category: EnumServices.pix,
  sub_category_label: "PIX",
  disabled: false,
  tip: "",
};

export const ServicePix: IOptionConfig2[] = [
  {
    ...SubCategoryPix,
    key: EnumKeys.status,
    value: false,
    label: "Ativo",
    id_window: EnumWindowsID.pix,
    description:
      "Esse serviço habilita a integração para o processamento de pagamento via PIX na máquina local.",
    type: EnumTypesOptions.boolean,
    restart_services: true,
    configs_dependencies: [
      {
        category: EnumTabs.services,
        sub_category: EnumServices.firebase,
        key: EnumKeys.status,
        on_value: true,
        value: true,
      },
    ],
    required_configs: [
      {
        category: EnumTabs.terminal_data,
        key: EnumKeysTerminalData.cnpj_cpf,
        on_value: true,
        key_value: [],
        block: true,
        message:
          "Para usar o serviço de pagamento por PIX você precisa informar pelo menos um CNPJ/CPF nos Dados do Terminal.",
      },
    ],
  },
  {
    ...SubCategoryPix,
    key: EnumKeysPix.order_asc,
    value: true,
    label: "Ordem Crescente QRCode",
    description:
      "Ordenação da fila de QRCodes, desmarque para ordenar por ordem decrescente das parcelas de pagamento.",
    type: EnumTypesOptions.boolean,
  },
  {
    ...SubCategoryPix,
    key: EnumKeysPix.message_whats,
    value:
      "Olá, acesse o link abaixo e terá acesso ao código do seu PIX, basta copiar e efetuar o pagamento no seu aplicativo preferido. 👇🏻\n{link@pix}\n\nObrigado.",
    label: "Mensagem Envio Whatsapp",
    description:
      "Aqui você pode definir uma mensagem personalizada para o envio do link de pagamento do PIX. \nLembre-se para indicar onde o link será colocado na mensagem use: {link@pix} . Esse texto será substituido pelo link gerado dinamicamente, caso não informe, o link será aplicado no fim da mensagem definida. ",
    type: EnumTypesOptions.textarea,
  },
];
