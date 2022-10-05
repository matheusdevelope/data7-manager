import {
  EnumServices,
  EnumKeys,
  EnumTypesOptions,
  EnumKeysWhatsappIntegrated,
  EnumTabs,
} from "../../../../../../../types/enums/configTabsAndKeys";
import { EnumWindowsID } from "../../../../../../../types/enums/windows";
import { categoryService } from "../comum_categories";

export const SubCatgoryWhatsIntegrated = {
  ...categoryService,
  id_window: EnumWindowsID.whatsapp,
  sub_category: EnumServices.whatsapp_integrated,
  sub_category_label: "Whatsapp Integrado",
  disabled: true,
  tip: "",
};

export const ServiceWhatsIntegrated: IOptionConfig2[] = [
  {
    ...SubCatgoryWhatsIntegrated,
    key: EnumKeys.status,
    value: false,
    label: "Ativo",
    description:
      "Esse recurso permite que os serviços de comunicação com o Whatsapp usem o bot interno de whatsapp para fazer o envio de mensagens abrir o app/site. \nAtenção: Esse recurso oferece risco de suspensão se do numero de whatsapp por não se tratar de uma integração oficial da plataforma, recomenda-se usar um número exclusivo para envio afim de evitar possíveis perca de números oficias da empresa.",
    type: EnumTypesOptions.boolean,
    disabled: false,
    restart_services: true,
  },
  {
    ...SubCatgoryWhatsIntegrated,
    key: EnumKeysWhatsappIntegrated.allow_remote_service_server,
    value: false,
    label: "Servidor Integração Remota",
    description:
      "Esse recurso vai permitir que outro Data7 Manager na rede use o serviço de Whatsapp Integrado dessa máquina. Isso será necessário quando o limite de 4 conexões simultâneas do Whatsapp for atingido. ",
    type: EnumTypesOptions.boolean,
    disabled: false,
    configs_dependencies: [
      {
        category: EnumTabs.services,
        sub_category: EnumServices.whatsapp_integrated,
        key: EnumKeys.status,
        value: true,
        on_value: true,
      },
      {
        category: EnumTabs.services,
        sub_category: EnumServices.http_server,
        key: EnumKeys.status,
        value: true,
        on_value: true,
      },
      {
        category: EnumTabs.services,
        sub_category: EnumServices.whatsapp_integrated,
        key: EnumKeysWhatsappIntegrated.use_remote_service,
        value: false,
        on_value: true,
      },
    ],
  },
  {
    ...SubCatgoryWhatsIntegrated,
    key: EnumKeysWhatsappIntegrated.use_remote_service,
    value: false,
    label: "Integração Remota",
    description:
      "Esse recurso vai se conectar em outro Data7 Manager que esteja executando o serviço de Whatsapp Integrado. \n Isso será necessário quando o limite de 4 conexões simultâneas do Whatsapp for atingido. ",
    type: EnumTypesOptions.boolean,
    disabled: false,
    restart_services: true,
    configs_dependencies: [
      {
        category: EnumTabs.services,
        sub_category: EnumServices.whatsapp_integrated,
        key: EnumKeysWhatsappIntegrated.allow_remote_service_server,
        value: false,
        on_value: true,
      },
      {
        category: EnumTabs.services,
        sub_category: EnumServices.whatsapp_integrated,
        key: EnumKeys.status,
        value: true,
        on_value: true,
      },
    ],
    required_configs: [
      {
        category: EnumTabs.services,
        sub_category: EnumServices.whatsapp_integrated,
        key: EnumKeysWhatsappIntegrated.remote_service_address,
        on_value: true,
        key_value: "",
        block: true,
        message:
          "Para usar o serviço de outra máquina, primeiro informe o endereço IP do provedor do serviço no campo 'IP Integração Remota'.",
      },
    ],
  },
  {
    ...SubCatgoryWhatsIntegrated,
    key: EnumKeysWhatsappIntegrated.remote_service_address,
    value: "",
    label: "IP Integração Remota",
    description:
      "Esse é o IP da máquina que será o servidor do Whatsapp Integrado.",
    type: EnumTypesOptions.text,
    disabled: false,
  },

  {
    ...SubCatgoryWhatsIntegrated,
    key: EnumKeysWhatsappIntegrated.use_bot,
    value: true,
    label: "Usar BOT 2.0 (Enviar arquivos sem link)",
    description:
      "Esse recurso usa uma lib externa para lidar com o Whatsapp, ela permite fazer o envio de arquivos sem ser através do link de compartilhamento que é usado por padrão.",
    type: EnumTypesOptions.boolean,
    disabled: false,
    restart_services: true,
  },
  {
    ...SubCatgoryWhatsIntegrated,
    key: EnumKeysWhatsappIntegrated.show_window_on_start,
    value: false,
    label: "Abrir Janela Whatsapp Ao Iniciar Serviço",
    description:
      "Habilitando essa opção, a tela do whatsapp irá abrir automaticamente ao iniciar o serviço.",
    type: EnumTypesOptions.boolean,
    disabled: false,
  },
  {
    ...SubCatgoryWhatsIntegrated,
    key: EnumKeysWhatsappIntegrated.delay_bots,
    value: 0.5,
    label: "Delay em segundos para Interação ",
    description:
      "Esse valor define o intervalo entre cada operação do BOT interno para que simule a o tempo de interação de um usuário real. \nValor minimo de 0.5 segundos será aplicado por padrão.",
    type: EnumTypesOptions.number,
    disabled: false,
  },
  {
    ...SubCatgoryWhatsIntegrated,
    key: EnumKeysWhatsappIntegrated.text_after_file,
    value: true,
    label: "Mensagem após arquivo (Arquivo ou Link do mesmo)",
    description:
      "Esse valor define se a mensagem complementar ao arquivo irá ser enviada acima ou abaixo do arquivo. Em caso onde seja gerado o link do arquivo a mesma configuração se aplica.",
    type: EnumTypesOptions.boolean,
    disabled: false,
  },
  {
    ...SubCatgoryWhatsIntegrated,
    key: EnumKeysWhatsappIntegrated.veryfication_is_logged_interval,
    value: 20,
    label: "Intervalo de verificação se o whatsapp está logado",
    description: "",
    type: EnumTypesOptions.number,
    disabled: false,
  },
  {
    ...SubCatgoryWhatsIntegrated,
    key: EnumKeysWhatsappIntegrated.user_agent,
    value:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36",
    label: EnumKeysWhatsappIntegrated.user_agent,
    description: "Agente Chrome para versão do whatsapp.",
    type: EnumTypesOptions.text,
  },
  {
    ...SubCatgoryWhatsIntegrated,
    key: EnumKeysWhatsappIntegrated.whats_session,
    value: "persist:whatsappscrap",
    label: EnumKeysWhatsappIntegrated.whats_session,
    description: "Sessão Chrome do whatsapp.",
    type: EnumTypesOptions.text,
  },
  {
    ...SubCatgoryWhatsIntegrated,
    key: EnumKeysWhatsappIntegrated.url,
    value: "https://web.whatsapp.com/",
    label: EnumKeysWhatsappIntegrated.url,
    description: "URL whatsapp web.",
    type: EnumTypesOptions.text,
  },

  {
    ...SubCatgoryWhatsIntegrated,
    key: EnumKeysWhatsappIntegrated.selector_key_storage_is_logged,
    value: "last-wid-md",
    label: EnumKeysWhatsappIntegrated.selector_key_storage_is_logged,
    description: "key_storage_is_logged selector whatsapp web.",
    type: EnumTypesOptions.text,
  },
  {
    ...SubCatgoryWhatsIntegrated,
    key: EnumKeysWhatsappIntegrated.selector_qrcode_img,
    value:
      "#app > div > div > div.landing-window > div.landing-main > div > div._25pwu > div",

    label: EnumKeysWhatsappIntegrated.selector_qrcode_img,
    description: "qrcode_img selector whatsapp web.",
    type: EnumTypesOptions.text,
  },
  {
    ...SubCatgoryWhatsIntegrated,
    key: EnumKeysWhatsappIntegrated.selector_is_loading,
    value: "#app > div > div > div._2dfCc",
    label: EnumKeysWhatsappIntegrated.selector_is_loading,
    description: "is_loading selector whatsapp web.",
    type: EnumTypesOptions.text,
  },
  {
    ...SubCatgoryWhatsIntegrated,
    key: EnumKeysWhatsappIntegrated.selector_find_when_useragent_failed,
    value: "#window > div > div.window-text > div.action > a",
    label: EnumKeysWhatsappIntegrated.selector_find_when_useragent_failed,
    description: "find_when_useragent_failed selector whatsapp web.",
    type: EnumTypesOptions.text,
  },
  {
    ...SubCatgoryWhatsIntegrated,
    key: EnumKeysWhatsappIntegrated.selector_link_chrome,
    value: "http://www.google.com/chrome",
    label: EnumKeysWhatsappIntegrated.selector_link_chrome,
    description: "link_chrome selector whatsapp web.",
    type: EnumTypesOptions.text,
  },
  {
    ...SubCatgoryWhatsIntegrated,
    key: EnumKeysWhatsappIntegrated.selector_mini_profile_photo,
    value:
      "#app > div > div > div.ldL67._2i3T7 > header > div.YtmXM > div > img",

    label: EnumKeysWhatsappIntegrated.selector_mini_profile_photo,
    description: "mini_profile_photo selector whatsapp web.",
    type: EnumTypesOptions.text,
  },
  {
    ...SubCatgoryWhatsIntegrated,
    key: EnumKeysWhatsappIntegrated.selector_profile_photo,
    value:
      "#app > div > div > div._3ArsE > div.ldL67._2i3T7._1cpSb > span > div > span > div > div > div.p357zi0d.tvf2evcx.oq44ahr5.lb5m6g5c.ac2vgrno.ignnouf6.bibl1e27.rgztdhlt.d30yvege.eb9g83lr.kl1dhzdn > div > div > div > div > div > img",
    label: EnumKeysWhatsappIntegrated.selector_profile_photo,
    description: "profile_photo selector whatsapp web.",
    type: EnumTypesOptions.text,
  },

  {
    ...SubCatgoryWhatsIntegrated,
    key: EnumKeysWhatsappIntegrated.selector_profile_name,
    value:
      "#app > div > div > div._3ArsE > div.ldL67._2i3T7._1cpSb > span > div > span > div > div > div:nth-child(2) > div._10Mbz.q_gDO._1spDM > div > div._3ZVCn._2-B71 > div > div._13NKt.copyable-text.selectable-text",
    label: EnumKeysWhatsappIntegrated.selector_profile_name,
    description: "profile_name selector whatsapp web.",
    type: EnumTypesOptions.text,
  },
  {
    ...SubCatgoryWhatsIntegrated,
    key: EnumKeysWhatsappIntegrated.selector_close_profile,
    value:
      "#app > div > div > div._3ArsE > div.ldL67._2i3T7._1cpSb > span > div > span > div > header > div > div._2-1k7 > button > span",
    label: EnumKeysWhatsappIntegrated.selector_close_profile,
    description: "selector_close_profile selector whatsapp web.",
    type: EnumTypesOptions.text,
  },
];
