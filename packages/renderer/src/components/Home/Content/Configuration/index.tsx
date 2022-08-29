import React, { useEffect, useRef, useState } from "react";
import { Box, Button, useDisclosure } from "@chakra-ui/react";
import AuthenticationModal from "../../AuthenticationModal";
import { HStackScrollBar } from "../../StackScrollBar";
import { Tabs } from "./categories";
import RenderOption from "./option";

const Color = {
  background: "#FFF",
  blackFont1: "#111423",
  blackFont2: "#101220",
  grayFont: "#8E93A5",
  colorFont: "#51608C",
  activeFont: "#383EA6",
  bgToggle: "#434CE7",
  hoverButton: "#EDF3FF",
};

export default function ConfigContent() {
  const auth = useRef(false);
  const authentication = useDisclosure();
  const [currentTab, setCurrentTab] = useState<ITabsConfig>();
  let activeBg = "#9d9d9d55";
  let hoverBg = "#25252533";
  function CreateTabs(Tabs: ITabsConfig[]) {
    return Tabs.map((tab, key) => {
      return (
        <Button
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

  useEffect(() => {
    authentication.onOpen();
  }, []);

  useEffect(() => {
    if (auth.current) {
      setCurrentTab(Tabs[0]);
    }
  }, [auth.current]);

  if (!auth.current) {
    return (
      <Box
        display="flex"
        flex={1}
        alignItems="center"
        justifyContent={"center"}
      >
        <Button
          onClick={authentication.onOpen}
          transition={"0.4s linear"}
          py="2"
          px="6"
          borderRadius="8"
          bg={activeBg}
          _hover={{
            bg: hoverBg,
          }}
        >
          Informar senha
        </Button>

        <AuthenticationModal
          isOpen={authentication.isOpen}
          onClose={authentication.onClose}
          onAuthenticated={() => {
            auth.current = true;
          }}
        />
      </Box>
    );
  }
  console.log("Externo", currentTab?.options);

  return (
    <Box flex={1} p="3" bg={Color.background}>
      <Box border={"1px"} borderRadius="8px" p="1">
        <HStackScrollBar>{CreateTabs(Tabs)}</HStackScrollBar>
      </Box>

      <RenderOption
        options={currentTab?.options || []}
        ChangeValue={(options) => {
          setCurrentTab((prev) => {
            if (prev) {
              return { ...prev, options };
            }
          });
        }}
      />
    </Box>
  );
}
