import {
  BoxProps,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Stack,
  StackProps,
} from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IRouteNavBar } from "../../../pages/home/routes";
import Brand from "../Brand";
import { StackScrollBar } from "../StackScrollBar";
import CreateMenus from "../NavItem/indext";

interface ISideBarContent extends BoxProps {
  items: IRouteNavBar[];
  drawer_is_open: boolean;
  drawer_on_close: () => void;
}

export default function Sidebar({
  items: menus,
  drawer_is_open,
  drawer_on_close,
  ...props
}: ISideBarContent) {
  const navigate = useNavigate();

  useEffect(() => {
    menus.length > 0 &&
      navigate(menus[0].layout + menus[0].path, { replace: true });
  }, [menus]);

  function ContentSideBar(props: StackProps) {
    return (
      <Stack minW={"250px"} maxW={"250px"} {...props}>
        <Box>
          <Brand title="Data7 Manager" />
        </Box>
        <StackScrollBar maxH="calc(100vh - 100px)" px="1">
          <>{CreateMenus(menus, drawer_on_close)}</>
        </StackScrollBar>
      </Stack>
    );
  }

  return (
    <>
      <ContentSideBar display={{ base: "none", md: "unset" }} {...props} />
      <Drawer
        isOpen={drawer_is_open}
        onClose={drawer_on_close}
        placement="left"
        size={"xs"}
      >
        <DrawerOverlay mt="27px" />
        <DrawerContent
          bg=" #F7FAFC"
          mt="27px"
          borderBottomRadius={"8px"}
          maxW="250px"
        >
          <ContentSideBar />
        </DrawerContent>
      </Drawer>
    </>
  );
}
