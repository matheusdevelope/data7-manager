import {
  EnumServices,
  EnumKeys,
  EnumTypesOptions,
} from "../../../../../../../types/enums/configTabsAndKeys";
import { EnumWindowsID } from "../../../../../../../types/enums/windows";
import { categoryService } from "../comum_categories";

export const ServiceWhatsIntegrated: IOptionConfig2[] = [
  {
    ...categoryService,
    sub_category: EnumServices.whatsapp_integrated,
    sub_category_label: "Whatsapp Integrado",
    key: EnumKeys.status,
    value: false,
    disabled: false,
    tip: "",
    label: "Ativo",
    id_window: EnumWindowsID.whatsapp,
    description:
      "Esse recurso permite que os serviços de comunicação com o Whatsapp usem o bot interno de whatsapp para fazer o envio de mensagens abrir o app/site. \nAtenção: Esse recurso oferece risco de suspensão se do numero de whatsapp por não se tratar de uma integração oficial da plataforma, recomenda-se usar um número exclusivo para envio afim de evitar possíveis perca de números oficias da empresa.",
    type: EnumTypesOptions.boolean,
  },
];
