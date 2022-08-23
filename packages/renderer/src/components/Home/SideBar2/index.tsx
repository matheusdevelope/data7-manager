import { BoxProps, Button, Stack } from "@chakra-ui/react";
import { Box, Collapse, Flex, Icon, Text } from "@chakra-ui/react";
import { MdKeyboardArrowRight } from "react-icons/md";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { IRouteNavBar } from "/@/pages/home3/routes";

interface ISideBarContent extends BoxProps {
  items: IRouteNavBar[];
}

export default function SideBarContent2(props: ISideBarContent) {
  const [state, setState] = React.useState("");
  const { items: menus } = props;
  let variantChange = "0.2s linear";
  const activeRoute = (routeName: string) => {
    return useLocation().pathname === routeName;
  };
  const createLinks = (routes: IRouteNavBar[]): any => {
    let activeBg = "#1A1F37";
    let activeColor = "white";
    let inactiveColor = "white";
    let sidebarActiveShadow = "none";

    return routes.map((prop, key) => {
      const nameRoute = prop.layout + prop.path;
      if (prop.category) {
        if (prop.expansible) {
          return (
            <Box>
              <Flex
                alignItems={"center"}
                cursor="pointer"
                onClick={() =>
                  setState((prevName) =>
                    nameRoute === prevName ? "." : nameRoute
                  )
                }
              >
                <Text
                  color={activeColor}
                  fontWeight="bold"
                  ps={{
                    sm: "10px",
                    xl: "16px",
                  }}
                  py="12px"
                >
                  {prop.name}
                </Text>

                {prop.views.length > 0 && (
                  <Icon
                    as={MdKeyboardArrowRight}
                    mr="12px"
                    ml="auto"
                    transform={
                      !(state === nameRoute)
                        ? "rotate(90deg)"
                        : "rotate(270deg)"
                    }
                  />
                )}
              </Flex>

              <Collapse in={state === nameRoute}>
                {createLinks(prop.views)}
              </Collapse>
              <Flex
                display={state === nameRoute ? "inherit" : "none"}
                h="2px"
                w="100%"
                bg="linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #1a1c1e 47.22%, rgba(30, 33, 36, 0.156) 94.44%)"
              />
            </Box>
          );
        } else {
          return (
            <Box>
              <Text
                color={activeColor}
                fontWeight="bold"
                ps={{
                  sm: "10px",
                  xl: "16px",
                }}
                py="12px"
              >
                {prop.name}
              </Text>
              {createLinks(prop.views)}
            </Box>
          );
        }
      }
      return (
        <NavLink to={prop.layout + prop.path} key={key}>
          {activeRoute(prop.layout + prop.path) ? (
            <Button
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
              boxShadow={sidebarActiveShadow}
              bg={activeBg}
              transition={variantChange}
              backdropFilter="blur(42px)"
              mb={{
                xl: "12px",
              }}
              mx={{
                xl: "auto",
              }}
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              py="12px"
              borderRadius="15px"
              w="100%"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "0px 7px 11px rgba(0, 0, 0, 0.04)",
              }}
            >
              <Flex>
                <Flex
                  alignItems={"center"}
                  justifyContent={"center"}
                  borderRadius={"12px"}
                  bg="brand.200"
                  color="white"
                  h="30px"
                  w="30px"
                  me="12px"
                  transition={variantChange}
                >
                  <Icon mx="2" boxSize="4" as={prop.icon} />
                </Flex>
                <Text color={activeColor} my="auto" fontSize="sm">
                  {prop.name}
                </Text>
              </Flex>
            </Button>
          ) : (
            <Button
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
              bg="transparent"
              mb={{
                xl: "12px",
              }}
              mx={{
                xl: "auto",
              }}
              py="12px"
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              borderRadius="15px"
              // _hover="none"
              w="100%"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "none",
              }}
            >
              <Flex>
                <Icon mx="2" boxSize="4" as={prop.icon} />

                <Text color={inactiveColor} my="auto" fontSize="sm">
                  {prop.name}
                </Text>
              </Flex>
            </Button>
          )}
        </NavLink>
      );
    });
  };

  var links = <>{createLinks(menus)}</>;
  let sidebarBg =
    "linear-gradient(111.84deg, rgba(6, 11, 38, 0.94) 59.3%, rgba(26, 31, 55, 0) 100%)";

  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      color="inherit"
      w="250px"
      //  bg={sidebarBg}
      bg={sidebarBg}
      backdropFilter="blur(10px)"
      transition={variantChange}
      {...props}
    >
      <Box>
        <Flex px="4" py="5" align="center">
          <Text
            fontSize="2xl"
            ml="2"
            color="brand.500"
            _dark={{ color: "white" }}
            fontWeight="semibold"
          >
            Data7 Manager
          </Text>
        </Flex>
        <Flex
          h="1px"
          w="100%"
          bg="linear-gradient(90deg, rgba(224, 225, 226, 0) 0%, #E0E1E2 47.22%, rgba(224, 225, 226, 0.15625) 94.44%)"
        />
      </Box>
      <Stack direction="column">
        <Box>{links}</Box>
      </Stack>
    </Box>
  );
}
