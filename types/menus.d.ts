interface ITabsConfig {
  category: string;
  label: string;
  options: IOptionConfig[];
  sub_categories: ITabsConfig[];
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
  validate_keys?: IObjValidationKey[];
}
interface IObjValidationKey {
  category: string;
  sub_category?: string;
  key: string;
  keyvalue: boolean;
  onvalue: boolean;
  block: boolean;
  message: string;
}
interface IOptionConfig2 extends ITabsConfig2 {
  key: string;
  value: string | number | string[] | boolean;
  min_value_lenght?: number[];
  disabled: boolean;
  tip: string;
  label: string;
  description: string;
  type: EnumTypesOptions;
  validate_keys?: IObjValidationKey[];
}

interface ITabsConfig2 {
  category: string;
  category_label: string;
  sub_category?: string;
  sub_category_label?: string;
}
