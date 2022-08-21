import type { FlexProps } from "@chakra-ui/react";
import { Flex, Icon, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import type { IconType } from "react-icons";
interface INavItem extends FlexProps {
  icon?: IconType;
  children: React.ReactNode;
}
export default function NavItem(props: INavItem) {
  const { icon, children, ...rest } = props;
  const color = useColorModeValue("gray.600", "gray.300");
  return (
    <Flex
      align="center"
      px="4"
      pl="4"
      py="3"
      cursor="pointer"
      color="inherit"
      _dark={{ color: "gray.400" }}
      _hover={{
        bg: "gray.100",
        _dark: { bg: "gray.900" },
        color: "gray.900",
      }}
      role="group"
      fontWeight="semibold"
      transition=".15s ease"
      {...rest}
    >
      {icon && (
        <Icon
          mx="2"
          boxSize="4"
          _groupHover={{
            color: color,
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  );
}
