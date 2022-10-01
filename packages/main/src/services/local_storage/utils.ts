import type {
  EnumKeys,
  EnumKeysFirebase,
  EnumKeysHttpServer,
  EnumKeysSendFilesWhats,
  EnumKeysTerminalData,
  EnumKeysWhatsappIntegrated,
  EnumServices,
  EnumTabs,
} from "../../../../../types/enums/configTabsAndKeys";

export function GetIndexConfigOption(
  Configs: IOptionConfig2[],
  key:
    | EnumKeys
    | EnumKeysFirebase
    | EnumKeysHttpServer
    | EnumKeysSendFilesWhats
    | EnumKeysTerminalData
    | EnumKeysWhatsappIntegrated,
  sub_category?: EnumServices,
  category?: EnumTabs,
) {
  if (category && sub_category)
    return Configs.findIndex(
      (obj) =>
        obj.category === category &&
        obj.sub_category == sub_category &&
        obj.key === key,
    );
  if (category)
    return Configs.findIndex(
      (obj) => obj.category === category && obj.key === key,
    );
  if (sub_category)
    return Configs.findIndex(
      (obj) => obj.sub_category == sub_category && obj.key === key,
    );
  return Configs.findIndex((obj) => obj.key === key);
}
