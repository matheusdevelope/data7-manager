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
import Separator from "../Separator";
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
    navigate(menus[0].layout + menus[0].path, { replace: true });
  }, []);

  function ContentSideBar(props: StackProps) {
    return (
      <Stack minW={"250px"} maxW={"250px"} borderRight="1px" {...props}>
        <Box>
          <Brand title="Data7 Manager" />
          <Separator bg="linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #8d8d8d 47.22%, rgba(224, 225, 226, 0.15625) 94.44%)" />
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
          bg="white"
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
