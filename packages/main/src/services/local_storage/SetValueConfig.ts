import { GetConfigTabs, SetConfigTabs } from ".";
import { GetIndexConfigOption } from "./utils";

function SetConfigsDependencies(
  configs: IOptionConfig2[],
  values_received: IValuesToSetConfigKey,
  configs_dependencies: IDependenciesConfigs[],
): IReturnSetConfigKey {
  const ret: IReturnSetConfigKey = {
    value_changed: true,
    from_config_dependecies: true,
    message: "Success",
  };
  for (const config of configs_dependencies) {
    if (config.on_value === values_received.value) {
      const TheRet = { ...SetValuesInConfig(configs, { ...config }) };
      if (!TheRet.value_changed) {
        return TheRet;
      }
    }
  }
  return ret;
}
function ValidateRequiredConfigs(
  configs: IOptionConfig2[],
  values_received: IValuesToSetConfigKey,
  required_configs: IRequiredConfigs[],
): IReturnRequiredDependencies {
  const ret: IReturnRequiredDependencies = {
    can_go: true,
    message: "Success!",
    value_on_conflict: values_received,
    required_configs: [],
  };
  for (const config of required_configs) {
    if (config.on_value === values_received.value) {
      const Configs = configs;
      const IndexOption = GetIndexConfigOption(
        Configs,
        config.key,
        config.sub_category,
        config.category,
      );
      if (IndexOption < 0)
        return {
          can_go: false,
          message: "Index of key not found",
          value_on_conflict: values_received,
          required_configs: [{ ...config }],
        };
      const OptionToValidate = Configs[IndexOption];
      if (OptionToValidate.value === config.key_value) {
        if (ret.can_go && config.block) {
          ret.can_go = false;
        }
        ret.required_configs.push({ ...config });
      }
    }
  }
  return ret;
}
function SetValuesInConfig(
  config: IOptionConfig2[],
  values_received: IValuesToSetConfigKey,
): IReturnSetConfigKey {
  let Configs = config;
  const { category, sub_category, key, value } = values_received;
  const IndexOption = GetIndexConfigOption(
    Configs,
    key,
    sub_category,
    category,
  );
  if (IndexOption < 0)
    return {
      value_changed: false,
      message: "No config index find to received parameters.",
      value_on_conflict: values_received,
    };
  const ConfigOption = Configs[IndexOption];
  const ConfigsDependencies = ConfigOption.configs_dependencies;
  const RequiredConfigs = ConfigOption.required_configs;

  if (ConfigsDependencies) {
    const ret = SetConfigsDependencies(
      Configs,
      values_received,
      ConfigsDependencies,
    );
    if (!ret.value_changed) return ret;
    if (ret.configs) {
      Configs = ret.configs;
    }
  }
  if (RequiredConfigs) {
    const ret = ValidateRequiredConfigs(
      Configs,
      values_received,
      RequiredConfigs,
    );
    if (!ret.can_go) {
      return {
        value_changed: false,
        from_required_dependecies: true,
        message: "You have some required configs conflict.",
        value_on_conflict: values_received,
        required_configs: ret.required_configs,
      };
    }
  }

  Configs.splice(IndexOption, 1, {
    ...Configs[IndexOption],
    value: value,
  });

  return {
    value_changed: true,
    message: "Success!",
    configs: Configs,
  };
}

export default function SetConfigKeyValue(
  values_received: IValuesToSetConfigKey,
): IReturnSetConfigKey {
  const Configs = GetConfigTabs();
  const ret = SetValuesInConfig(Configs, values_received);
  const NewConfig = ret.configs;

  if (NewConfig) {
    SetConfigTabs(NewConfig);
  }
  return ret;
}
