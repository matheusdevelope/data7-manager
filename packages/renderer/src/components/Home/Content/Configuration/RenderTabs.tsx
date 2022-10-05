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
interface Labels {
  title?: string;
  message?: string;
  buttonLeft?: string;
  buttonRight?: string;
}

export default function ConfigContent({
  tabs,
  mainCategory,
  isSubCategory,
  ...props
}: IProps) {
  const [currentTab, setCurrentTab] = useState<ITabsConfig>();
  const [messages, setMessages] = useState<string[]>([]);
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
          minW={"min-content"}
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

  async function ChangeValue(options: IOptionConfig) {
    const ret = await window.__electron_preload__Config_SetKeyValue({
      value: options.value,
      key: options.key,
      sub_category: isSubCategory ? currentTab?.category : undefined,
      category: isSubCategory ? mainCategory : undefined,
    });

    if (!ret.value_changed) {
      let message = "";
      if (ret.required_configs) {
        message = JSON.stringify(ret.required_configs, null, "\n");
        const messages = ret.required_configs.map((obj) => {
          return obj.message;
        });
        setMessages([...messages]);
        return setMessageModal(messages[0]);
      }
      message = `Não foi possivel salvar essa alteração.
        Mensagem: ${ret.message}
        Valores em conflito: ${JSON.stringify(
          ret.value_on_conflict,
          null,
          "\n"
        )}`;

      return setMessageModal(message);
    }

    options.alert && setMessageModal(options.alert);
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
        <HStackScrollBar pb="1">{CreateTabs(tabs)}</HStackScrollBar>
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
        onClose={() => {
          setMessages((prev) => {
            const NewMessages = prev;
            NewMessages.shift();
            setMessageModal(NewMessages[0] || "");
            return NewMessages || [];
          });
        }}
        labels={{
          message: messageModal,
        }}
      />
    </Box>
  );
}
