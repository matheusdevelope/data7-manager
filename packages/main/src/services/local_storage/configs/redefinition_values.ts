import { EnumKeysWhatsappIntegrated } from "../../../../../../types/enums/configTabsAndKeys";
import { SubCatgoryWhatsIntegrated } from "./tabs/whats_integrated";

export const ForceRedefinitionValues = [
  {
    ...SubCatgoryWhatsIntegrated,
    key: EnumKeysWhatsappIntegrated.selector_is_loading,
  },
  {
    ...SubCatgoryWhatsIntegrated,
    key: EnumKeysWhatsappIntegrated.selector_profile_photo,
  },
];
