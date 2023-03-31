import React, { useEffect, useState } from "react";
import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import {
  EnumKeysDispatchPanel,
  EnumServices,
} from "../../../../../../../../types/enums/configTabsAndKeys";
import { BsClipboardPlus } from "react-icons/bs";
const Color = {
  background: "#FFF",
  blackFont1: "#111423",
  blackFont2: "#101220",
  grayFont: "#3A3F65",
  colorFont: "#51608C",
  activeFont: "#383EA6",
  bgToggle: "#434CE7",
  hoverButton: "#EDF3FF",
};
export default function DispatchPanelContent() {
  const [GlobalState, setGlobalState] = useState<IGlobalState>();
  const [config, setConfig] = useState<IOptionConfig2[]>();
  const [copied, setCopied] = useState(false);

  const PORT_Http_Server = String(
    config?.find(
      (obj) =>
        obj.sub_category === EnumServices.dispatch_panel &&
        obj.key === EnumKeysDispatchPanel.server_port
    )?.value
  );
  const URL_API = `http://${GlobalState?.local_ip}:${PORT_Http_Server}`;
  useEffect(() => {
    window.__electron_preload__GetLocalConfigTabs().then((config) => {
      setConfig(config);
    });
    window.__electron_preload__GetGlobalState().then((global_state_string) => {
      setGlobalState(JSON.parse(global_state_string));
    });
  }, []);

  return (
    <Flex flex={"1"} direction={"column"} justifyContent="space-between" p="2">
      <Flex direction={"column"} gap="2" flex="1">
        <Text color={Color.blackFont1} bg="#f3f3f3" borderRadius={"8"} p="1">
          URL Painel Expedição:
          <HStack justifyContent={"space-between"} alignContent="center">
            <Text color={Color.grayFont} fontWeight="bold">
              {URL_API}
            </Text>
            {copied ? (
              <Text fontSize={14}>Copiado para a área de transferência</Text>
            ) : null}
            <Box
              px="8px"
              onClick={() => {
                navigator.clipboard.writeText(URL_API);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 3000);
              }}
            >
              <BsClipboardPlus color={copied ? "green" : "black"} />
            </Box>
          </HStack>
        </Text>
      </Flex>
      <Flex>
        <Flex flex="1">
          <Flex p="1" flexDirection={"column"} gap="2" w={"190px"}></Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
