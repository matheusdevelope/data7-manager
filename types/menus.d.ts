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
  configs_dependencies?: IDependenciesConfigs[];
  services_dependencies?: IServicesDependencies[];
}
interface IOptionConfig2 extends IOptionConfig, ITabsConfig2 {}
interface IServicesDependencies {
  category: string;
  sub_category: string;
  key: string;
  start?: boolean;
  stop?: boolean;
  on_value: string | number | boolean | string[];
}
interface IDependenciesConfigs {
  category: string;
  sub_category?: string;
  key: string;
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
