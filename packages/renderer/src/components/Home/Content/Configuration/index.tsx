import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Text, useDisclosure } from "@chakra-ui/react";
import AuthenticationModal from "../../AuthenticationModal";
import ConfigContent from "./RenderTabs";

export default function MainConfig() {
  const auth = useRef(false);
  const authentication = useDisclosure();
  const [Tabs, setTabs] = useState<ITabsConfig[]>();
  let activeBg = "#9d9d9d55";
  let hoverBg = "#25252533";

  useEffect(() => {
    authentication.onOpen();
  }, []);

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
    if (!auth.current) {
      window.__electron_preload__GetLocalConfigTabs().then((config) => {
        setTabs([...GroupTabs(config)]);
      });
    }
  }, [auth.current]);
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
    return <ConfigContent tabs={Tabs} mainCategory="" />;
  }
  return <Text>Loading...</Text>;
}
