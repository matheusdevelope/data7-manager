import { GetConfigTabs, SetConfigTabs } from ".";
import { GetIndexConfigOption } from "./utils";
import {
  ActivateServicesByConfiguration,
  StopServicesByConfiguration,
} from "/@/InitializeInteface";
let Config: IOptionConfig2[];

function SetConfigsDependencies(
  values_received: IValuesToSetConfigKey,
  configs_dependencies: IDependenciesConfigs[],
): IReturnSetConfigKey | boolean {
  for (const config of configs_dependencies) {
    if (config.on_value === values_received.value) {
      const ret = SetConfigKeyValue({ ...config });
      console.log(ret);

      if (!ret.value_changed) {
        return ret;
      }
    }
  }
  return true;
}
function ValidateRequiredConfigs(
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
      const Configs = GetConfigTabs();
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

export default function SetConfigKeyValue(
  values_received: IValuesToSetConfigKey,
): IReturnSetConfigKey {
  const { category, sub_category, key, value } = values_received;
  const Configs = Config ? Config : GetConfigTabs();
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
    const ret = SetConfigsDependencies(values_received, ConfigsDependencies);
    // console.log(ret);

    if (typeof ret != "boolean") {
      return {
        value_changed: false,
        from_config_dependecies: true,
        message:
          "The config dependencies of this key have some conflicts and need atention.",
        value_on_conflict: values_received,
        required_configs: ret.required_configs,
      };
    }
  }
  if (RequiredConfigs) {
    const ret = ValidateRequiredConfigs(values_received, RequiredConfigs);
    if (!ret.can_go)
      return {
        value_changed: false,
        from_required_dependecies: true,
        message: "You have some required configs conflict.",
        value_on_conflict: values_received,
        required_configs: ret.required_configs,
      };
  }

  Configs.splice(IndexOption, 1, {
    ...Configs[IndexOption],
    value: value,
  });
  const ChangedConfigs = SetConfigTabs(Configs);
  if (ConfigOption.restart_services) {
    StopServicesByConfiguration();
    ActivateServicesByConfiguration();
  }
  console.log(sub_category + " - " + key, value);

  return {
    value_changed: ChangedConfigs,
    message: "Success!",
    // new_config: {
    //   ...Configs[IndexOption],
    //   value: value,
    // },
  };
}
