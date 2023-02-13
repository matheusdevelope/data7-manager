import { safeStorage } from "electron";
import type { Schema } from "electron-store";
import Store from "electron-store";
import type {
  EnumKeysHttpServer,
  EnumKeysSendFilesWhats,
  EnumKeysTerminalData,
  EnumKeysWhatsappIntegrated,
} from "../../../../../types/enums/configTabsAndKeys";
import {
  EnumKeys,
  EnumKeysFirebase,
  EnumServices,
  EnumTabs,
} from "../../../../../types/enums/configTabsAndKeys";
import { ForceRedefinitionValues } from "./configs/redefinition_values";
import { DefaultConfigTabs } from "./configs";
const Schema_Storage: Schema<Record<string, string>> = {
  application_pass: {
    type: "string",
  },
  dimensions: {
    type: "object",
    properties: {
      width: { type: "number" },
      height: { type: "number" },
    },
  },
};

const Storage = new Store({
  name: "config",
  watch: true,
  encryptionKey: "process.env.encryptionKey",
  schema: Schema_Storage,
});

function CreateTabsConfig() {
  if (Storage.has("config_tabs")) {
    const OldConfig = Storage.get("config_tabs") as unknown as IOptionConfig2[];
    const NewConfig = DefaultConfigTabs.map((Tab) => {
      const OldTab = OldConfig.find(
        (oldTab) =>
          oldTab.category === Tab.category &&
          oldTab.key === Tab.key &&
          (oldTab.sub_category && Tab.sub_category
            ? oldTab.sub_category === Tab.sub_category
            : true),
      );
      const NeedRefinitionValue = ForceRedefinitionValues.find(
        (oldTab) =>
          oldTab.category === Tab.category &&
          oldTab.key === Tab.key &&
          (oldTab.sub_category && Tab.sub_category
            ? oldTab.sub_category === Tab.sub_category
            : true),
      );
      if (OldTab && !NeedRefinitionValue) {
        return { ...Tab, value: OldTab.value };
      } else {
        return Tab;
      }
    });
    Storage.set("config_tabs", NewConfig);
  } else {
    Storage.set("config_tabs", DefaultConfigTabs);
  }
}
CreateTabsConfig();

const SafeStorage = {
  setPassword(key: string, password: string) {
    try {
      const buffer = safeStorage.encryptString(password);
      Storage.set(key, buffer.toString("latin1"));
      return true;
    } catch (error) {
      return new Error(String(error));
    }
  },
  getPassword(key: string) {
    if (Storage.has(key)) {
      try {
        return safeStorage.decryptString(
          Buffer.from(Storage.get(key), "latin1"),
        );
      } catch (error) {
        return new Error(String(error));
      }
    }
    return false;
  },
};
function SetConfigTabs(configs: IOptionConfig2[]) {
  try {
    Storage.set("config_tabs", configs);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
function SetKeyValue(
  value: string | number | boolean | string[],
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
  const Configs = GetConfigTabs();

  function GetIndex() {
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
  const index = GetIndex();

  if (index >= 0) {
    Configs.splice(index, 1, {
      ...Configs[index],
      value: value,
    });
    return SetConfigTabs(Configs);
  }
  return false;
}
function GetConfigTabs(): IOptionConfig2[] {
  if (!Storage.has("config_tabs")) return [];
  try {
    const Config = Storage.get("config_tabs") as unknown as IOptionConfig2[];
    return Config;
  } catch (err) {
    console.error(err);
    return DefaultConfigTabs;
  }
}
function GetService(service: EnumServices) {
  const config = GetConfigTabs();
  if (config) {
    return config.find(
      (opt) =>
        opt.category === EnumTabs.services &&
        opt.key === EnumKeys.status &&
        opt.sub_category === service,
    );
  }
}
function GetServices(): IOptionConfig2[] {
  const config = GetConfigTabs();
  if (config) {
    return config.filter(
      (opt) => opt.category === EnumTabs.services && opt.key === EnumKeys.status,
    );
  }
  return [];
}
function GetServiceOptions(service: EnumServices) {
  const config = GetConfigTabs();
  if (config) {
    return config.filter(
      (opt) =>
        opt.category === EnumTabs.services && opt.sub_category === service,
    );
  }
  return DefaultConfigTabs.filter(
    (opt) => opt.category === EnumTabs.services && opt.sub_category === service,
  );
}

function GetKey(filter_config: ICommonConfigIdentification) {
  const { key, sub_category, category } = filter_config;
  if (category && sub_category)
    return GetConfigTabs().find(
      (obj) =>
        obj.category === category &&
        obj.sub_category == sub_category &&
        obj.key === key,
    );
  if (category)
    return GetConfigTabs().find(
      (obj) => obj.category === category && obj.key === key,
    );
  if (sub_category)
    return GetConfigTabs().find(
      (obj) => obj.sub_category == sub_category && obj.key === key,
    );
  return GetConfigTabs().find((obj) => obj.key === key);
}
function GetKeyValue(filter_config: ICommonConfigIdentification) {
  return GetKey(filter_config)?.value;
}

function GetValuesFirebase(): IFirebaseTypeValues {
  const ObjFirebase: ObjFirebase = {};
  const Config = GetConfigTabs();
  if (Config) {
    const ConfigFirebase = Config.filter(
      (opt) => opt.sub_category === EnumServices.firebase,
    );

    ConfigFirebase.forEach((config) => {
      if (!Array.isArray(config.value)) {
        ObjFirebase[config.key] =
          typeof config.value === "string"
            ? config.value.toLowerCase()
            : config.value;
      }
    });
    return ObjFirebase as unknown as IFirebaseTypeValues;
  }
  Object.values(EnumKeysFirebase).forEach((prop) => {
    const ObjConfig = DefaultConfigTabs.find(
      (obj) => obj.sub_category === EnumServices.firebase && obj.key === prop,
    );
    if (!ObjConfig) return;
    ObjFirebase[prop] = !Array.isArray(ObjConfig.value)
      ? ObjConfig.value === "string"
        ? ObjConfig.value.toLowerCase()
        : ObjConfig.value
      : "";
  });
  return ObjFirebase as unknown as IFirebaseTypeValues;
}

export {
  SafeStorage,
  Storage,
  SetConfigTabs,
  GetConfigTabs,
  GetService,
  GetServices,
  GetServiceOptions,
  SetKeyValue,
  GetKey,
  GetKeyValue,
  GetValuesFirebase,
};
