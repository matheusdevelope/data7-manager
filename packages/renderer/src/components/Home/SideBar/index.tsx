import type { BoxProps } from "@chakra-ui/react";
import { Box, Collapse, Flex, Icon, Text } from "@chakra-ui/react";
import { MdKeyboardArrowRight } from "react-icons/md";
import React from "react";
import NavItem from "../NavItem/indext";
import type { IMenuItem } from "/@/pages/home2";

interface ISideBarContent extends BoxProps {
  items: IMenuItem[];
}
export default function SideBarContent(props: ISideBarContent) {
  const { items: menus } = props;

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
      bg="white"
      _dark={{ bg: "gray.800" }}
      border={"1px"}
      color="inherit"
      borderRightWidth="1px"
      w="60"
      {...props}
    >
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
        direction="column"
        as="nav"
        fontSize="sm"
        color="gray.600"
        aria-label="Main Navigation"
      >
        {menus.map((menu, key) => (
          <Box key={key}>
            <NavItem
              icon={menu.icon}
              bg={menu.isVisible ? "gray.700" : "inherit"}
              onClick={() => {
                menu.onClick(key);
              }}
            >
              {menu.label}
              {menu.expansible_items && menu.expansible_items.length > 0 && (
                <Icon
                  as={MdKeyboardArrowRight}
                  ml="auto"
                  transform={menu.expanded ? "rotate(90deg)" : "none"}
                />
              )}
            </NavItem>
            {menu.expansible_items && menu.expansible_items.length > 0 && (
              <Collapse in={menu.expanded}>
                {menu.expansible_items.map((menu, key_sub) => (
                  <NavItem
                    key={key_sub}
                    icon={menu.icon}
                    bg={menu.isVisible ? "gray.700" : "inherit"}
                    pl="12"
                    py="2"
                    onClick={() => {
                      menu.onClick(key, key_sub);
                    }}
                  >
                    {menu.label}
                  </NavItem>
                ))}
              </Collapse>
            )}
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
