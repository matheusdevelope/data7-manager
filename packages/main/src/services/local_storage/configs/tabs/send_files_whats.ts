import { tmpdir } from "os";
import { join } from "path";
import {
  EnumServices,
  EnumKeys,
  EnumTypesOptions,
  EnumKeysSendFilesWhats,
  EnumTabs,
  EnumKeysTerminalData,
} from "../../../../../../../types/enums/configTabsAndKeys";
import { categoryService } from "../comum_categories";

export const SubCategorySendFilesWhats = {
  ...categoryService,
  sub_category: EnumServices.whatsapp_send_files,
  sub_category_label: "Envio Arquivos Whatsapp",
  disabled: false,
};
export const ServiceSendFilesWhats: IOptionConfig2[] = [
  {
    ...SubCategorySendFilesWhats,
    key: EnumKeys.status,
    value: false,
    tip: "",
    label: "Ativo",
    description:
      "Esse serviço habilita a integração para o processamento e envio de arquivos através do Data7. ",
    type: EnumTypesOptions.boolean,
    restart_services: true,
    configs_dependencies: [
      {
        category: EnumTabs.services,
        sub_category: EnumServices.http_server,
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
          "Para usar o serviço Envio Arquivos Whatsapp você precisa informar pelo menos um CNPJ/CPF nos Dados do Terminal.",
      },
    ],
  },
  {
    ...SubCategorySendFilesWhats,
    key: EnumKeysSendFilesWhats.path_files,
    value: join(tmpdir(), "data7_manager/files_whatsapp"),
    tip: "",
    label: "Pasta pré-definida dos arquivos para envio.",
    description:
      "Lembre-se, após o envio, todos os arquivos dessa pasta serão apagados, tenha certeza de que haverão apenas os arquivos temporarios para envio.",
    type: EnumTypesOptions.text,
  },
  {
    ...SubCategorySendFilesWhats,
    key: EnumKeysSendFilesWhats.disable_auto_format,
    value: true,

    tip: "",
    label: "Auto Formatar Mensagem",
    description:
      "Ao usar esse recurso, a aplicação irá fazer a pré formatação da mensagem, caso desabilite, você vai precisar formatar manualmente o conteúdo da mensagem, caso contrário ela será apenas concatenada.",
    type: EnumTypesOptions.boolean,
  },
  {
    ...SubCategorySendFilesWhats,
    key: EnumKeysSendFilesWhats.expiration,
    value: 30,

    tip: "",
    label: "Expiração Arquivos online.",
    description:
      "Essa configuração define o tempo de vida do arquivo para download, após esse periodo o arquivo será apagado do servidor online e o cliente não terá mais acesso. ",
    type: EnumTypesOptions.number,
  },
];
