import {
  EnumServices,
  EnumKeys,
  EnumTypesOptions,
  EnumTabs,
} from "../../../../../../../types/enums/configTabsAndKeys";
import { EnumWindowsID } from "../../../../../../../types/enums/windows";
import { categoryService } from "../comum_categories";

export const ServicePix: IOptionConfig2[] = [
  {
    ...categoryService,
    sub_category: EnumServices.pix,
    sub_category_label: "PIX",
    key: EnumKeys.status,
    value: false,
    disabled: false,
    tip: "",
    label: "Ativo",
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
];
