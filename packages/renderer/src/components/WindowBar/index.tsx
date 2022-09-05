import { Flex, Icon, Stack } from "@chakra-ui/react";
import { MouseEvent } from "react";
import { MdClose, MdMinimize } from "react-icons/md";

export default function WindowBar() {
  let MousePosition = {
    x: 0,
    y: 0,
  };
  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", OnMouseMove, true);
    MousePosition.x = 0;
    MousePosition.y = 0;
  });

  function OnMouseMove(ev: globalThis.MouseEvent) {
    if (MousePosition.x == 0) {
      MousePosition.x = ev.clientX;
    }
    if (MousePosition.y == 0) {
      MousePosition.y = ev.clientY;
    }
    const NewPosition = {
      x: ev.screenX - MousePosition.x,
      y: ev.screenY - MousePosition.y,
    };
    window.__electron_preload__MoveWindow(NewPosition);
  }

  function MoveWindowDown(event: MouseEvent<HTMLDivElement>) {
    document.addEventListener("mousemove", OnMouseMove, true);
  }

  function CloseWindow() {
    window.__electron_preload__CloseWindow();
  }
  function MinizeWindow() {
    window.__electron_preload__MinimizeWindow();
  }

  return (
    <Flex
      h="25px"
      w="100%"
      bg=" #E0E1E2"
      alignItems={"center"}
      justifyContent="flex-end"
      p="2"
      borderTopRadius={"8px"}
      onMouseDown={MoveWindowDown}
    >
      <Stack direction={"row"}>
        <Flex
          _hover={{ bg: "ButtonShadow" }}
          transition={'"0.2s linear"'}
          alignContent="center"
          justifyContent={"center"}
          boxSize={6}
          onClick={MinizeWindow}
        >
          <Icon
            as={MdMinimize}
            color="black"
            boxSize="5"
            alignSelf={"flex-start"}
          />
        </Flex>
        <Flex
          _hover={{ bg: "ButtonShadow" }}
          transition={'"0.2s linear"'}
          boxSize={6}
          alignContent="center"
          justifyContent={"center"}
          onClick={CloseWindow}
        >
          <Icon as={MdClose} color="black" boxSize="5" alignSelf={"center"} />
        </Flex>
      </Stack>
    </Flex>
  );
}
