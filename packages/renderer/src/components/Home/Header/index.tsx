import { Flex, FlexProps, Icon, IconButton } from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import Brand from "../Brand";

interface IHeader extends FlexProps {
  title: string;
  onClickMenu: () => void;
}

export function Header({ title, onClickMenu, ...props }: IHeader) {
  return (
    <Flex
      align="center"
      justify="space-between"
      w="full"
      px="4"
      borderBottomWidth="1px"
      borderBottomColor={"gray.300"}
      {...props}
    >
      <Icon
        as={FiMenu}
        display={{ base: "flex", md: "none" }}
        onClick={onClickMenu}
      />
      {/* <IconButton
        display={{ base: "flex", md: "none" }}
        aria-label="Menu"
        onClick={onClickMenu}
        icon={<FiMenu />}
        // size="md"
      /> */}
      <Brand title={title} fontSize="md" />
      <Flex align="center">
        <Icon as={FaBell} cursor="pointer" />
      </Flex>
    </Flex>
  );
}
