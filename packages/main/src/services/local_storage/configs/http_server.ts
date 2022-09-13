import {
  EnumKeys,
  EnumKeysHttpServer,
  EnumServices,
  EnumTabs,
  EnumTypesOptions,
} from "../../../../../../types/enums/configTabsAndKeys";

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
