import {
  EnumKeys,
  EnumKeysDispatchPanel,
  EnumServices,
  EnumTabs,
  EnumTypesOptions,
} from "../../../../../../../types/enums/configTabsAndKeys";

const SubCategoryDispatchPanel = {
  category: EnumTabs.services,
  category_label: "Serviços",
  sub_category: EnumServices.dispatch_panel,
  sub_category_label: "Painel de Expedição",
  disabled: false,
  tip: "",
};

export const ServiceDispatchPanel: IOptionConfig2[] = [
  {
    ...SubCategoryDispatchPanel,
    key: EnumKeys.status,
    value: false,
    label: "Ativo",
    description:
      "Define se a aplicação vai operar como servidor para o Painel de Expedição Remoto.",
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
          'Esse recurso depende do serviço "HTTP", configure e ative o mesmo para prosseguir.',
      },
    ],
  },

  {
    ...SubCategoryDispatchPanel,
    key: EnumKeysDispatchPanel.time_refresh,
    value: 10,
    label: "Intervalo de Atualização",
    description: "Intervalo em segundos para que o Painel seja atualizado.",
    type: EnumTypesOptions.number,
  },
  {
    ...SubCategoryDispatchPanel,
    key: EnumKeysDispatchPanel.database,
    value: "MSSQL",
    label: "RDBMS",
    description: "Define o banco de dados entre MSSQL ou SYBASE. \nUsar a mesma sintaxe das opções apresentadas.",
    type: EnumTypesOptions.text,
  },
  {
    ...SubCategoryDispatchPanel,
    key: EnumKeysDispatchPanel.host,
    value: "localhost",
    label: "Endereço do Banco de Dados",
    description: "Define endereço do banco de dados.",
    type: EnumTypesOptions.text,
  },
  {
    ...SubCategoryDispatchPanel,
    key: EnumKeysDispatchPanel.port,
    value: 1433,
    label: "Porta Banco de Dados",
    description: "Define a porta de acesso do banco de dados.",
    type: EnumTypesOptions.number,
  },
  {
    ...SubCategoryDispatchPanel,
    key: EnumKeysDispatchPanel.dbname,
    value: "Data7",
    label: "Nome do Banco de Dados",
    description: "Define o usuário de acesso do banco de dados.",
    type: EnumTypesOptions.text,
  },
  {
    ...SubCategoryDispatchPanel,
    key: EnumKeysDispatchPanel.user,
    value: "",
    label: "User do Banco de Dados",
    description: "Define o usuário de acesso do banco de dados.",
    type: EnumTypesOptions.text,
  },
  {
    ...SubCategoryDispatchPanel,
    key: EnumKeysDispatchPanel.pass,
    value: "",
    label: "Senha do Banco de Dados",
    description: "Define a senha de acesso do banco de dados.",
    type: EnumTypesOptions.text,
  },
  {
    ...SubCategoryDispatchPanel,
    key: EnumKeysDispatchPanel.query,
    value: "",
    label: "Query SQL",
    description: `Query que retorna os dados que serão enviados para o Painel, a query deve retornar os seguintes valores: 
    ID, CodCliente, NomeCliente, Municipio, UF, DataInclusao, HoraInclusao.`,
    type: EnumTypesOptions.textarea,
  },
];
