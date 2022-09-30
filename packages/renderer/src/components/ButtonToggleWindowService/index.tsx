import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Button, ButtonProps } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface IProps extends ButtonProps {
  service: IOptionConfig2;
  label?: string;
}

export default function RenderButtonsToggleWindowsServices({
  service,
  label,
  ...props
}: IProps) {
  const [visible, setVisible] = useState(false);
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

  useEffect(() => {
    window
      .__electron_preload__VisibilityWindow(service.id_window)
      .then(setVisible);
  }, []);

  return (
    <Button
      size="sm"
      bg={visible ? "gray.300" : "gray.100"}
      color={visible ? Color.activeFont : Color.grayFont}
      _hover={{ bg: Color.hoverButton }}
      onClick={() => {
        window
          .__electron_preload__ToggleWindow(service.id_window)
          .then(setVisible);
      }}
      rightIcon={
        visible ? <ViewOffIcon boxSize={"4"} /> : <ViewIcon boxSize={"4"} />
      }
      {...props}
    >
      {label || service.sub_category_label || service.label}
    </Button>
  );
}
