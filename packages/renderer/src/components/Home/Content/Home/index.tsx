import React, { useEffect, useState } from "react";
import { Text } from "@chakra-ui/react";
import { StackScrollBar } from "../../StackScrollBar";

export default function HomeContent() {
  // const [config, setConfig] = useState<IGlobalState>();
  // useEffect(() => {
  //   window.__electron_preload__GetGlobalState().then((text_config) => {
  //     setConfig(JSON.parse(text_config));
  //   });
  // }, []);

  return (
    <StackScrollBar>
      <Text>Home Page </Text>
    </StackScrollBar>
  );
}
