/* eslint-disable no-undef */
import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import SideBar from "../../components/Home/SideBar";
import { RouteObject, useRoutes } from "react-router-dom";
import RoutesNavBar, { IRouteNavBar } from "./routes";
import WindowBar from "/@/components/WindowBar";

export default function Home3() {
  const sidebar = useDisclosure();
  const getActiveRoute = (routes: IRouteNavBar[]): any => {
    let activeRoute = "Data7 Manager";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].category) {
        let categoryActiveRoute = getActiveRoute(routes[i].views);
        if (categoryActiveRoute !== activeRoute) {
          return categoryActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };

  // This changes navbar state(fixed or not)
  const getActiveNavbar = (routes: IRouteNavBar[]): any => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].category) {
        let categoryActiveNavbar = getActiveNavbar(routes[i].views);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          if (routes[i].secondaryNavbar) {
            return routes[i].secondaryNavbar;
          }
        }
      }
    }
    return activeNavbar;
  };

  const RoutesObject: RouteObject[] = [];

  const getRoutes = (routes: IRouteNavBar[]): any => {
    return routes.map((prop, key) => {
      if (prop.category) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/home") {
        return RoutesObject.push({
          element: prop.component,
          path: prop.path,
        });
      } else {
        return null;
      }
    });
  };
  getRoutes(RoutesNavBar);
  const Routes = useRoutes(RoutesObject);

  return (
    <Box
      as="section"
      bg=" #F7FAFC"
      minH="100vh"
      borderRadius={"8px"}
      border="1px"
      borderColor={"#76767671"}
    >
      <WindowBar />
      <SideBar items={RoutesNavBar} display={{ base: "none", md: "unset" }} />
      {/* <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <SideBar items={RoutesNavBar} w="full" borderRight="none" />
        </DrawerContent>
      </Drawer> */}
      <Box ml={{ base: 0, md: "250px" }} transition=".3s ease">
        {/* <Flex
          as="header"
          align="center"
          justify="space-between"
          w="full"
          px="4"
          bg="white"
          _dark={{ bg: "gray.800" }}
          borderBottomWidth="1px"
          borderTopRadius={"4px"}
          color="inherit"
          h="14"
        >
          <IconButton
            aria-label="Menu"
            display={{ base: "inline-flex", md: "none" }}
            onClick={sidebar.onOpen}
            icon={<FiMenu />}
            size="sm"
          />
          <InputGroup w="96" display={{ base: "none", md: "flex" }}>
            <InputLeftElement color="gray.500">
              <FiSearch />
            </InputLeftElement>
            <Input placeholder={getActiveRoute(RoutesNavBar)} />
          </InputGroup>

          <Flex align="center">
            <Icon color="gray.500" as={FaBell} cursor="pointer" />
          </Flex>
        </Flex> */}

        <Box p="4" flex={1}>
          {Routes}
        </Box>
      </Box>
    </Box>
  );
}
