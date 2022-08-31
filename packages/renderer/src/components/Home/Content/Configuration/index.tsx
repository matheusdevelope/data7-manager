import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import AuthenticationModal from "../../AuthenticationModal";
import ConfigContent from "./RenderTabs";
import ConfirmationModal from "../../Confirmation";

export default function MainConfig() {
  const auth = useRef(false);
  const authentication = useDisclosure();
  const reset = useDisclosure();
  const refresh = useDisclosure();
  const [Tabs, setTabs] = useState<ITabsConfig[]>();

  const [refreshh, setRefresh] = useState(false);
  let activeBg = "#9d9d9d55";
  let hoverBg = "#25252533";

  function GroupTabs(Tabs: IOptionConfig2[]) {
    const KeysCategory = [...new Set(Tabs.map((obj) => obj.category))];

    function Mount(
      keys: string[],
      Tabs: IOptionConfig2[],
      subCategory: boolean
    ) {
      let newTabs: ITabsConfig[] = [];
      keys.forEach((category) => {
        const OnlyThisCategory = !subCategory
          ? Tabs.filter((opt) => opt.category === category)
          : Tabs.filter((opt) => opt.sub_category === category);
        const OnlyOptions = !subCategory
          ? OnlyThisCategory.filter(
              (obj) => !obj.sub_category && !obj.sub_category_label
            )
          : OnlyThisCategory.filter(
              (obj) => obj.sub_category && obj.sub_category_label
            );
        const OnlySubCategory = !subCategory
          ? OnlyThisCategory.filter(
              (obj) => obj.sub_category && obj.sub_category_label
            )
          : [];
        const KeysSubCategory = [
          ...new Set(
            OnlySubCategory.map((obj) =>
              obj.sub_category ? obj.sub_category : ""
            ).filter((value) => value.length > 0)
          ),
        ];
        const NewTab: ITabsConfig = {
          category: !subCategory
            ? OnlyThisCategory[0].category
            : OnlyThisCategory[0].sub_category || "",
          label: !subCategory
            ? OnlyThisCategory[0].category_label
            : OnlyThisCategory[0].sub_category_label || "",
          options: [
            ...OnlyOptions.map((opt) => {
              const NewOpt: IOptionConfig = {
                key: opt.key,
                value: opt.value,
                disabled: opt.disabled,
                tip: opt.tip,
                label: opt.label,
                description: opt.description,
                type: opt.type,
                validate_keys: opt.validate_keys,
              };
              return NewOpt;
            }),
          ],
          sub_categories:
            OnlySubCategory.length > 0
              ? Mount(KeysSubCategory, OnlySubCategory, true)
              : [],
        };
        newTabs.push(NewTab);
      });
      return newTabs;
    }

    return Mount(KeysCategory, Tabs, false);
  }
  useEffect(() => {
    authentication.onOpen();
  }, []);
  useEffect(() => {
    if (refreshh) {
      window.__electron_preload__GetLocalConfigTabs().then((config) => {
        setTabs([...GroupTabs(config)]);
        setRefresh(false);
      });
    }
  }, [refreshh]);

  useEffect(() => {
    if (!auth.current) {
      window.__electron_preload__GetLocalConfigTabs().then((config) => {
        setTabs([...GroupTabs(config)]);
      });
    }
  }, [auth.current]);
  console.log("refresh", Tabs);

  if (!auth.current) {
    return (
      <Box
        display="flex"
        flex={1}
        alignItems="center"
        justifyContent={"center"}
      >
        <Button
          onClick={authentication.onOpen}
          transition={"0.4s linear"}
          py="2"
          px="6"
          borderRadius="8"
          bg={activeBg}
          _hover={{
            bg: hoverBg,
          }}
        >
          Informar senha
        </Button>

        <AuthenticationModal
          isOpen={authentication.isOpen}
          onClose={authentication.onClose}
          onAuthenticated={() => {
            auth.current = true;
          }}
        />
      </Box>
    );
  }
  if (Tabs) {
    return (
      <Flex flex={1} direction={"column"} justifyContent="space-between">
        {!refreshh && <ConfigContent tabs={Tabs} mainCategory="" />}

        <Button
          bg="gray.300"
          mx="auto"
          my="2"
          size={"xs"}
          onClick={reset.onOpen}
        >
          Resetar Configurações {String(refreshh)}
        </Button>
        <ConfirmationModal
          isOpen={reset.isOpen}
          onClose={reset.onClose}
          labels={{
            title: "Tem certeza que deseja prosseguir?",
            message:
              " Essa ação irá redefinir TODAS as configurações da aplicação para os padrões iniciais e não pode ser desfeita.",
            buttonLeft: "Cancelar",
            buttonRight: "Redefinir",
          }}
          onClickRight={() => {
            window.__electron_preload__ResetLocalConfigTabs();
            // refresh.onToggle();
            setRefresh(true);
          }}
        />
      </Flex>
    );
  }
  return <Text>Loading...</Text>;
}
