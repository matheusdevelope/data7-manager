/* eslint-disable no-undef */
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import SideBar from "../../components/Home/SideBar";
import { RouteObject, useRoutes } from "react-router-dom";
import RoutesNavBar, { IRouteNavBar } from "./routes";
import WindowBar from "/@/components/WindowBar";
import { Header } from "/@/components/Home/Header";
import { StackScrollBar } from "/@/components/Home/StackScrollBar";
import { EnumKeys } from "../../../../../types/enums/configTabsAndKeys";

export default function Home3() {
  const DrawerSideBar = useDisclosure();
  const [routesNavBar, setRoutesNavBar] = useState<IRouteNavBar[]>([]);

  const getActiveRoute = (routes: IRouteNavBar[]): any => {
    let activeRoute = "Data7 Manager";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i] && routes[i].category) {
        let categoryActiveRoute = getActiveRoute(routes[i].views);
        if (categoryActiveRoute !== activeRoute) {
          return categoryActiveRoute;
        }
      } else {
        if (
          routes[i] &&
          window.location.href.includes(
            (routes[i].layout + routes[i].path)
              .replace("*", "")
              .replace("//", "/")
          )
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
    return routes.map((prop) => {
      if (!prop) return null;
      if (prop.category) {
        return getRoutes(prop.views);
      }
      // if (prop.layout === "/home") {
      return RoutesObject.push({
        element: prop.component,
        path: prop.path,
      });
      // } else {
      //   return null;
      // }
    });
  };
  getRoutes(routesNavBar);
  console.log(RoutesObject);
  const Routes = useRoutes(RoutesObject);

  async function FilterServicesActive(routes: IRouteNavBar[]) {
    const Services = (
      await window.__electron_preload__GetLocalConfigTabs()
    ).filter((tab) => tab.key === EnumKeys.status);
    const getRoutes = (routes: IRouteNavBar[]): any => {
      return routes
        .map((prop) => {
          if (
            prop.service
              ? Boolean(
                  Services.find(
                    (tab) =>
                      tab.sub_category === prop.service && tab.value === true
                  )
                )
              : true
          ) {
            return {
              ...prop,
              views: prop.views.length > 0 ? getRoutes(prop.views) : [],
            };
          }
        })
        .filter((tab) => tab !== undefined);
    };

    setRoutesNavBar(getRoutes(routes));
  }

  useEffect(() => {
    FilterServicesActive(RoutesNavBar);
  }, []);

  return (
    <StackScrollBar
      bg="white"
      borderRadius={"8px"}
      border="1px"
      borderColor={"#3333334f"}
      maxW="100vw"
      minH="300px"
    >
      <WindowBar />

      <Flex minH="calc(100vh - 27px)" borderBottomRadius={"8px"}>
        <SideBar
          bg=" #F7FAFC"
          items={routesNavBar}
          drawerIsOpen={DrawerSideBar.isOpen}
          drawerOnClose={DrawerSideBar.onClose}
        />

        <Box flex="1" maxW={{ md: "calc(100vw - 250px)", base: "100vw" }}>
          <Header
            bg="white"
            onClickMenu={DrawerSideBar.onOpen}
            title={getActiveRoute(routesNavBar)}
          />
          <StackScrollBar minH="calc(100vh - 68px)" maxH="calc(100vh - 68px)">
            {Routes}
          </StackScrollBar>
        </Box>
      </Flex>
    </StackScrollBar>
  );
}
