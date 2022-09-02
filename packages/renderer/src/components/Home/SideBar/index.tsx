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
  drawerIsOpen: boolean;
  drawerOnClose: () => void;
}

export default function Sidebar(props: ISideBarContent) {
  const { items: menus, drawerIsOpen, drawerOnClose } = props;
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
          <>{CreateMenus(menus, drawerOnClose)}</>
        </StackScrollBar>
      </Stack>
    );
  }

  return (
    <>
      <ContentSideBar display={{ base: "none", md: "unset" }} {...props} />
      <Drawer
        isOpen={drawerIsOpen}
        onClose={drawerOnClose}
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
