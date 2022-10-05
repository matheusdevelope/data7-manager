import {
  EnumKeys,
  EnumKeysHttpServer,
  EnumKeysWhatsappIntegrated,
  EnumServices,
  EnumTabs,
  EnumTypesOptions,
} from "../../../../../../../types/enums/configTabsAndKeys";

const SubCategoryHttpServer = {
  category: EnumTabs.services,
  category_label: "Serviços",
  sub_category: EnumServices.http_server,
  sub_category_label: "Servidor HTTP",
  disabled: false,
  tip: "",
};

export const ServiceHttpServer: IOptionConfig2[] = [
  {
    ...SubCategoryHttpServer,
    key: EnumKeys.status,
    value: false,
    label: "Ativo",
    description:
      "Define se a aplicação vai operar como um servidor HTTP local para requisições de serviços do Data7 Manager.",
    type: EnumTypesOptions.boolean,
    restart_services: true,
    required_configs: [
      {
        category: EnumTabs.services,
        sub_category: EnumServices.whatsapp_send_files,
        key: EnumKeys.status,
        on_value: false,
        key_value: true,
        block: true,
        message:
          'Esse recurso está sendo usado pelo serviço de "Envio Arquivos Whatsapp", desative-o antes para prosseguir.',
      },
      {
        category: EnumTabs.services,
        sub_category: EnumServices.whatsapp_integrated,
        key: EnumKeysWhatsappIntegrated.allow_remote_service_server,
        on_value: false,
        key_value: true,
        block: true,
        message:
          'Esse recurso está sendo usado pelo serviço de "Whatsapp Integrado - Servidor Integração Remota", desative-o antes para prosseguir.',
      },
    ],
  },

  {
    ...SubCategoryHttpServer,
    key: EnumKeysHttpServer.port,
    value: 3000,
    label: "Porta Local",
    description: "Porta local que o servidor vai rodar.",
    type: EnumTypesOptions.number,
  },
];
