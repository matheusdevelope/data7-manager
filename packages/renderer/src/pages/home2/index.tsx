/* eslint-disable no-undef */
import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
} from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";
import { FiMenu, FiSearch } from "react-icons/fi";
import React, { useState } from "react";
import SideBarContent from "/@/components/Home/SideBar";
import { MdHome } from "react-icons/md";
import { HiCode } from "react-icons/hi";
import { BsGearFill, BsWhatsapp } from "react-icons/bs";
import type { IconType } from "react-icons";
import HomeContent from "/@/components/Home/Content/Home";
import ConfigContent from "/@/components/Home/Content/Configuration";
import ServicesContent from "../../components/Home/Content/Services/PIX";
import ServicesPixContent from "../../components/Home/Content/Services/PIX";
import ServicesWhatsContent from "/@/components/Home/Content/Services/Whatsapp";
export interface IMenuItem {
  id: string;
  label: string;
  icon: IconType;
  order: number;
  isVisible: boolean;
  expanded?: boolean;
  expansible_items?: IMenuItem[];
  content: JSX.Element;
  // eslint-disable-next-line no-unused-vars
  onClick: (index: number, index_sub_menu?: number) => void;
}

export default function Home2() {
  const sidebar = useDisclosure();
  const [Content, setContent] = useState(<HomeContent />);
  const ServicesMenu: IMenuItem[] = [
    {
      id: "pix" + new Date().toISOString(),
      label: "PIX",
      icon: MdHome,
      order: 1,
      isVisible: false,
      content: <ServicesPixContent />,
      onClick: ChangeContent,
    },
    {
      id: "whatsapp" + new Date().toISOString(),
      label: "Whatsapp",
      icon: BsWhatsapp,
      order: 2,
      isVisible: false,
      content: <ServicesWhatsContent />,
      onClick: ChangeContent,
    },
  ];

  const DefaultMenus: IMenuItem[] = [
    {
      id: "home" + new Date().toISOString(),
      label: "Tela Inicial",
      icon: MdHome,
      order: 1,
      isVisible: true,
      expanded: false,
      expansible_items: [],
      content: <HomeContent />,
      onClick: ChangeContent,
    },
    {
      id: "services" + new Date().toISOString(),
      label: "Serviços",
      icon: HiCode,
      order: 2,
      isVisible: false,
      expanded: true,
      expansible_items: ServicesMenu,
      content: <ServicesContent />,
      onClick: ChangeContent,
    },
    {
      id: "configs" + new Date().toISOString(),
      label: "Configurações",
      icon: BsGearFill,
      order: 3,
      isVisible: false,
      expanded: false,
      expansible_items: [],
      content: <ConfigContent />,
      onClick: ChangeContent,
    },
  ];
  const [Menus, setMenus] = useState(DefaultMenus);

  function ChangeContent(index: number, index_sub_menu?: number) {
    function Subs(menus?: IMenuItem[]) {
      return menus?.map((sub_menu, key_sub) => {
        if (
          Number(Menus[index].expansible_items?.length) > 0 &&
          sub_menu.isVisible &&
          index_sub_menu == undefined
        )
          return sub_menu;

        if (index_sub_menu !== key_sub)
          return {
            ...sub_menu,
            isVisible: false,
          };
        return {
          ...sub_menu,
          isVisible: true,
        };
      });
    }
    setMenus((Menus) =>
      Menus.map((menu, key) => {
        const Expanded = menu.expanded;
        const isExpansible = Number(menu.expansible_items?.length) == 0;
        if (index_sub_menu != undefined)
          return {
            ...menu,
            isVisible: false,
            expansible_items: Subs(menu.expansible_items),
          };

        if (
          index !== key &&
          Number(Menus[index].expansible_items?.length) > 0 &&
          menu.isVisible
        )
          return {
            ...menu,
            expansible_items: Subs(menu.expansible_items),
          };
        if (index !== key)
          return {
            ...menu,
            isVisible: false,
            expansible_items: Subs(menu.expansible_items),
          };

        return {
          ...menu,
          isVisible: isExpansible,
          expanded: !Expanded,
          expansible_items: Subs(menu.expansible_items),
        };
      })
    );

    const SubMenus = Menus[index].expansible_items;
    if (SubMenus && index_sub_menu !== undefined) {
      sidebar.onClose();
      setContent(SubMenus[index_sub_menu].content);
    } else {
      if (Number(SubMenus?.length) == 0) {
        sidebar.onClose();
        setContent(Menus[index].content);
      }
    }
  }

  return (
    <Box as="section" bg="gray.50" _dark={{ bg: "gray.700" }} minH="100vh">
      <SideBarContent items={Menus} display={{ base: "none", md: "unset" }} />
      <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <SideBarContent items={Menus} w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="full"
          px="4"
          bg="white"
          _dark={{ bg: "gray.800" }}
          borderBottomWidth="1px"
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
            <Input placeholder="Search for articles..." />
          </InputGroup>

          <Flex align="center">
            <Icon color="gray.500" as={FaBell} cursor="pointer" />
          </Flex>
        </Flex>

        <Box as="main" p="4">
          {Content}
        </Box>
      </Box>
    </Box>
  );
}
