import {
  Box,
  Button,
  ButtonProps,
  Collapse,
  Text,
  TextProps,
} from "@chakra-ui/react";
import { Flex, Icon } from "@chakra-ui/react";
import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";
import Separator from "../Separator";
import { IRouteNavBar } from "/@/pages/home3/routes";

export default function CreateMenus(
  menus: IRouteNavBar[],
  drawerOnClose: () => void
): any {
  const [state, setState] = React.useState("");
  let activeBg = "#9d9d9d55";
  let hoverBg = "#25252533";
  let inactiveTextColor = "#393939";

  const activeRoute = (routeName: string) => {
    return useLocation().pathname === routeName;
  };
  function TextDefault({ children, ...props }: TextProps) {
    return (
      <Text fontWeight="bold" ps={"1"} fontSize="sm" {...props}>
        {children}
      </Text>
    );
  }
  function ButtonNavItem({ children, ...props }: ButtonProps) {
    return (
      <Button
        onClick={drawerOnClose}
        boxSize="initial"
        w="full"
        justifyContent="flex-start"
        alignItems="center"
        transition={"0.4s linear"}
        py="2"
        px="1"
        my="1"
        borderRadius="8"
        bg="transparent"
        _hover={{
          bg: hoverBg,
        }}
        {...props}
      >
        {children}
      </Button>
    );
  }
  function RenderNavItemActiveRoute(menu: IRouteNavBar) {
    return (
      <ButtonNavItem bg={activeBg} py="2">
        <Icon mx="1" boxSize="6" as={menu.icon} />
        <TextDefault fontSize="md">{menu.name}</TextDefault>
      </ButtonNavItem>
    );
  }
  function RenderNavItem(menu: IRouteNavBar) {
    return (
      <ButtonNavItem color={inactiveTextColor}>
        <Icon mx="1" boxSize="4" as={menu.icon} />
        <TextDefault ms="1">{menu.name}</TextDefault>
      </ButtonNavItem>
    );
  }

  function RenderNavItemCategory(menu: IRouteNavBar) {
    return (
      <Box>
        <TextDefault my="2">{menu.name}</TextDefault>
        {CreateMenus(menu.views, drawerOnClose)}
      </Box>
    );
  }

  function RenderNavItemCategoryExpansible(menu: IRouteNavBar) {
    const nameRoute = menu.layout + menu.path;
    return (
      <Box>
        <Flex
          alignItems={"center"}
          cursor="pointer"
          onClick={() =>
            setState((prevName) => (nameRoute === prevName ? "." : nameRoute))
          }
        >
          <TextDefault>{menu.name}</TextDefault>
          {menu.views.length > 0 && (
            <Icon
              as={MdKeyboardArrowRight}
              mr="12px"
              ml="auto"
              transform={
                !(state === nameRoute) ? "rotate(90deg)" : "rotate(270deg)"
              }
            />
          )}
        </Flex>
        <Collapse in={state === nameRoute}>
          {CreateMenus(menu.views, drawerOnClose)}
        </Collapse>
        <Separator display={state === nameRoute ? "inherit" : "none"} />
      </Box>
    );
  }

  return menus.map((menu, key) => {
    if (menu.category) {
      if (menu.expansible) return RenderNavItemCategoryExpansible(menu);
      return RenderNavItemCategory(menu);
    }
    return (
      <NavLink to={menu.layout + menu.path} key={key}>
        {activeRoute(menu.layout + menu.path)
          ? RenderNavItemActiveRoute(menu)
          : RenderNavItem(menu)}
      </NavLink>
    );
  });
}
