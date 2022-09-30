import React, { useEffect, useState } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import {
  EnumKeys,
  EnumKeysTerminalData,
  EnumServices,
  EnumTabs,
} from "../../../../../../../types/enums/configTabsAndKeys";
import { MaskCnpj, MaskCpf } from "/@/utils/masks";
import RenderButtonsToggleWindowsServices from "../../../ButtonToggleWindowService";

export default function HomeContent() {
  const [config, setConfig] = useState<IOptionConfig2[]>();
  const [qrcode, setQrCode] = useState("");
  const Identification =
    config?.find((opt) => opt.key === EnumKeysTerminalData.identification)
      ?.value || "";
  const Services =
    config?.filter(
      (opt) =>
        opt.category === EnumTabs.services &&
        opt.key === EnumKeys.status &&
        opt.value === true
    ) || [];
  const ObjCNPJ = config
    ? config.find((obj) => obj.key === EnumKeysTerminalData.cnpj_cpf)
    : undefined;
  const CNPJs = ObjCNPJ && Array.isArray(ObjCNPJ.value) ? ObjCNPJ.value : [];

  function OrderList(data: IOptionConfig2[], desc?: boolean) {
    let list = data;
    if (desc) {
      list.sort((a, b) =>
        (a.sub_category_label || a.label) < (b.sub_category_label || b.label)
          ? 1
          : (b.sub_category_label || b.label) <
            (a.sub_category_label || a.label)
          ? -1
          : 0
      );
    } else {
      list.sort((a, b) =>
        (a.sub_category_label || a.label) > (b.sub_category_label || b.label)
          ? 1
          : (b.sub_category_label || b.label) >
            (a.sub_category_label || a.label)
          ? -1
          : 0
      );
    }
    return list;
  }
  const Color = {
    background: "#FFF",
    blackFont1: "#111423",
    blackFont2: "#101220",
    grayFont: "#3A3F65",
    colorFont: "#51608C",
    activeFont: "#383EA6",
    bgToggle: "#434CE7",
    hoverButton: "#EDF3FF",
  };

  async function GenerateQrCode() {
    const URL_Login = await window.__electron_preload__GetURLLoginMobile();
    const dataQrCode = await window.__electron_preload__GenerateQrCode(
      URL_Login
    );
    setQrCode(dataQrCode);
  }
  function RenderCNPJ_CPF() {
    const CNPJ_CPF = config?.find(
      (opt) => opt.key === EnumKeysTerminalData.cnpj_cpf
    )?.value;

    if (Array.isArray(CNPJ_CPF))
      return (
        <Box bg="#f3f3f3" borderRadius={"8"} p="1">
          <Text color={Color.blackFont1}>CNPJ / CPF:</Text>
          {CNPJ_CPF.map((value, key) => (
            <Text color={Color.grayFont} fontWeight={"bold"} key={key}>
              {value.length <= 13
                ? MaskCpf(String(value))
                : MaskCnpj(String(value))}
            </Text>
          ))}
        </Box>
      );
    return <></>;
  }
  function RenderServicesActive() {
    if (Services.length > 0)
      return (
        <Box bg="#f3f3f3" borderRadius={"8"} p="1">
          <Text color={Color.blackFont1}>Serviços Ativos:</Text>
          {Services.map((value, key) => (
            <Text color={Color.grayFont} fontWeight={"bold"} key={key}>
              {value.sub_category_label}
            </Text>
          ))}
        </Box>
      );
    return <></>;
  }

  useEffect(() => {
    window.__electron_preload__GetLocalConfigTabs().then((config) => {
      setConfig(config);
      GenerateQrCode();
    });
  }, []);

  return (
    <Flex flex={"1"} direction={"column"} justifyContent="space-between" p="2">
      <Flex direction={"column"} gap="2" flex="1">
        <Box color={Color.blackFont1} bg="#f3f3f3" borderRadius={"8"} p="1">
          <Text>Identificação do Terminal:</Text>
          <Text fontWeight="bold">{Identification}</Text>
        </Box>

        <RenderCNPJ_CPF />
        <RenderServicesActive />
      </Flex>
      <Flex>
        <Flex flex="1">
          <Flex p="1" flexDirection={"column"} gap="2" w={"190px"}>
            {OrderList(Services.filter((obj) => obj.id_window)).map(
              (service, key) => (
                <RenderButtonsToggleWindowsServices
                  service={service}
                  key={key}
                />
              )
            )}
          </Flex>
        </Flex>

        {CNPJs.length > 0 &&
          config?.find(
            (obj) =>
              obj.sub_category === EnumServices.pix &&
              obj.key === EnumKeys.status
          )?.value && (
            <Box>
              <Text align={"center"} fontWeight="bold">
                Terminal Mobile
              </Text>
              <Image
                src={qrcode}
                boxSize="150"
                border={"1px"}
                borderRadius="8px"
              />
            </Box>
          )}
      </Flex>
    </Flex>
  );
}
