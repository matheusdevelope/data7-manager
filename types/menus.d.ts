interface ITabsConfig {
  category: string;
  label: string;
  options: IOptionConfig[];
}

interface IOptionConfig {
  key: string;
  value: string | number | string[] | boolean;
  min_value_lenght?: number[];
  tip: string;
  label: string;
  description?: string;
  type: EnumTypesOptions;
  order: number;
}
