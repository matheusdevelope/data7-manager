import React, { useEffect, useState } from "react";
import { Box, BoxProps, Button } from "@chakra-ui/react";
import { HStackScrollBar } from "../../StackScrollBar";
import RenderOption from "./option";
import ConfirmationModal from "../../Confirmation";

const Color = {
  background: "#FFF",
  blackFont1: "#111423",
  blackFont2: "#101220",
  grayFont: "#61678C",
  colorFont: "#51608C",
  activeFont: "#383EA6",
  bgToggle: "#434CE7",
  hoverButton: "#EDF3FF",
};
interface IProps extends BoxProps {
  tabs: ITabsConfig[];
  mainCategory: string;
  isSubCategory?: boolean;
}

export default function ConfigContent({
  tabs,
  mainCategory,
  isSubCategory,
  ...props
}: IProps) {
  const [currentTab, setCurrentTab] = useState<ITabsConfig>();
  const [messageModal, setMessageModal] = useState("");
  useEffect(() => {
    if (tabs) setCurrentTab({ ...tabs[0] });
  }, []);

  function CreateTabs(Tabs: ITabsConfig[]) {
    return Tabs.map((tab, key) => {
      return (
        <Button
          size={"sm"}
          onClick={() => setCurrentTab(tab)}
          key={key}
          mx="1"
          color={
            currentTab?.category == tab.category
              ? Color.activeFont
              : Color.grayFont
          }
          bg={
            currentTab?.category == tab.category ? Color.hoverButton : "inherit"
          }
          _hover={{ bg: Color.hoverButton }}
        >
          {tab.label}
        </Button>
      );
    });
  }

  async function SetValueOnStorage({ key, value }: IOptionConfig) {
    const ActualConfig = await window.__electron_preload__GetLocalConfigTabs();

    if (isSubCategory) {
      const index = ActualConfig.findIndex((opt) => {
        return (
          opt.category === mainCategory &&
          opt.sub_category === currentTab?.category &&
          opt.key === key
        );
      });
      ActualConfig.splice(index, 1, { ...ActualConfig[index], value: value });

      window.__electron_preload__SetLocalConfigTabs([...ActualConfig]);
    } else {
      const index = ActualConfig.findIndex((opt) => {
        return opt.key === key;
      });

      ActualConfig.splice(index, 1, { ...ActualConfig[index], value: value });

      window.__electron_preload__SetLocalConfigTabs([...ActualConfig]);
    }
  }

  async function ValidateRequirideKeys(options: IOptionConfig) {
    let CanGo = true;
    if (options.validate_keys) {
      const config = await window.__electron_preload__GetLocalConfigTabs();
      for (let i = 0; i < options.validate_keys.length; i++) {
        const validate = options.validate_keys[i];
        const ObjToValidate = config.find(
          (oldTab) =>
            oldTab.category === validate.category &&
            oldTab.key === validate.key &&
            (oldTab.sub_category && validate.sub_category
              ? oldTab.sub_category === validate.sub_category
              : true)
        );
        if (validate.onvalue !== options.value) return CanGo;
        if (!ObjToValidate) {
          setMessageModal(
            "Valor para validação não encontrado, reinicie a aplicação."
          );
          CanGo = false;
          return CanGo;
        }
        if (ObjToValidate.value === validate.keyvalue) {
          setMessageModal(validate.message);
          if (validate.block === true) {
            CanGo = false;
            return CanGo;
          }
        }
      }
    }
    return CanGo;
  }

  async function ChangeValue(options: IOptionConfig) {
    if (!(await ValidateRequirideKeys(options))) return;
    SetValueOnStorage(options);
    if (currentTab?.options) {
      const index = currentTab.options.findIndex(
        (op) => op.key === options.key
      );
      if (index >= 0) {
        let newOptions = currentTab.options;
        newOptions.splice(index, 1, options);
        setCurrentTab((prev) => {
          if (prev) return { ...prev, options: newOptions };
        });
      }
    }
  }

  return (
    <Box flex={1} p="3" pt="2" bg={Color.background} {...props}>
      <Box border={"1px"} borderRadius="8px" p="1">
        <HStackScrollBar>{CreateTabs(tabs)}</HStackScrollBar>
      </Box>

      {currentTab?.options?.map((option, key) => (
        <RenderOption key={key} option={option} ChangeValue={ChangeValue} />
      ))}
      {currentTab && currentTab?.sub_categories?.length > 0 && (
        <ConfigContent
          tabs={currentTab.sub_categories}
          mainCategory={currentTab.category}
          isSubCategory
          p="1"
        />
      )}
      <ConfirmationModal
        isOpen={Boolean(messageModal)}
        onClose={() => setMessageModal("")}
        labels={{
          message: messageModal,
        }}
      />
    </Box>
  );
}
