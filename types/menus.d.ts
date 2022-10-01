interface IKeysConfigs {
  key:
    | EnumKeys
    | EnumKeysFirebase
    | EnumKeysHttpServer
    | EnumKeysSendFilesWhats
    | EnumKeysTerminalData
    | EnumKeysWhatsappIntegrated;
}

interface ICommonConfigIdentification extends IKeysConfigs {
  category?: EnumTabs;
  sub_category?: EnumServices;
}
interface ITabsConfig {
  category: string;
  label: string;
  options: IOptionConfig[];
  sub_categories: ITabsConfig[];
}

interface ITabsConfig2 {
  category: string;
  category_label: string;
  sub_category?: string;
  sub_category_label?: string;
}

interface IOptionConfig {
  key: string;
  value: string | number | boolean | string[];
  min_value_lenght?: number[];
  disabled: boolean;
  tip: string;
  label: string;
  description: string;
  type: EnumTypesOptions;
  id_window?: EnumWindowsID;
  alert?: string;
  validate_keys?: IObjValidationKey[];
  required_configs?: IRequiredConfigs[];
  configs_dependencies?: IDependenciesConfigs[];
  restart_services?: boolean;
}
interface IOptionConfig2 extends IOptionConfig, ITabsConfig2 {}

interface IDependenciesConfigs {
  category: EnumTabs;
  sub_category?: EnumServices;
  key:
    | EnumKeys
    | EnumKeysFirebase
    | EnumKeysHttpServer
    | EnumKeysSendFilesWhats
    | EnumKeysTerminalData
    | EnumKeysWhatsappIntegrated;
  value: string | number | boolean | string[];
  on_value: string | number | boolean | string[];
}
interface IObjValidationKey {
  category: string;
  sub_category?: string;
  key: string;
  keyvalue: string | number | boolean;
  onvalue: string | number | boolean;
  block: boolean;
  message: string;
}

interface IRequiredConfigs extends ICommonConfigIdentification {
  message: string;
  key_value: string | number | boolean | string[];
  block: boolean;
  message: string;
  on_value: string | number | boolean | string[];
}

interface IValuesToSetConfigKey {
  value: string | number | boolean | string[];
  key:
    | EnumKeys
    | EnumKeysFirebase
    | EnumKeysHttpServer
    | EnumKeysSendFilesWhats
    | EnumKeysTerminalData
    | EnumKeysWhatsappIntegrated;
  sub_category?: EnumServices;
  category?: EnumTabs;
}

interface IReturnSetConfigKey {
  value_changed: boolean;
  message: string;
  from_config_dependecies?: boolean;
  from_required_dependecies?: boolean;
  value_on_conflict?: ICommonConfigIdentification;
  required_configs?: IRequiredConfigs[];
  new_config?: IOptionConfig2;
  configs?: IOptionConfig2[];
}
interface IReturnRequiredDependencies {
  can_go: boolean;
  message: string;
  value_on_conflict?: ICommonConfigIdentification;
  required_configs: IRequiredConfigs[];
}
