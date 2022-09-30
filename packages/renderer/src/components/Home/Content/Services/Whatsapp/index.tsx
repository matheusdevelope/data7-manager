import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  EnumKeysHttpServer,
  EnumKeysWhatsappIntegrated,
  EnumServices,
} from "../../../../../../../../types/enums/configTabsAndKeys";
import RenderButtonsToggleWindowsServices from "/@/components/ButtonToggleWindowService";
import { StackScrollBar } from "../../../StackScrollBar";
import ConfirmationModal from "../../../Confirmation";
import RenderQrCode from "/@/components/QrCode";
import { Events } from "../../../../../../../../types/enums/whatsapp";
import CopyButton from "/@/components/CopyButton";
interface IRemoteProviderStatus {
  online: boolean;
  status: number;
  message: string;
}
export default function ServicesWhatsContent() {
  const [ServiceOptions, setServiceOptions] = useState<IOptionConfig2[]>();
  const [WhatsState, setWhatsState] = useState<IDataListenerWhatsapp>();
  const [WhatsService, setWhatsService] = useState<IOptionConfig2>();
  const [PortServer, setPortServer] = useState<number>();
  const [GlobalState, setGlobalState] = useState<IGlobalState>();
  const [RemoteProviderStatus, setRemoteProviderStatus] =
    useState<IRemoteProviderStatus>();
  const ResetDisclosure = useDisclosure();

  const URL_API = `${GlobalState?.local_ip}:${PortServer}`;
  const IsServiceProvider = ServiceOptions?.find(
    (obj) => obj.key === EnumKeysWhatsappIntegrated.allow_remote_service_server
  )?.value;
  const UseRemoteProvider = Boolean(
    ServiceOptions?.find(
      (obj) => obj.key === EnumKeysWhatsappIntegrated.use_remote_service
    )?.value
  );
  const AddressRemoteProvider = String(
    ServiceOptions?.find(
      (obj) => obj.key === EnumKeysWhatsappIntegrated.remote_service_address
    )?.value
  );

  function ResetLocalStorage() {
    window.__electron_preload__ResetLocalStorageWhats();
  }

  function RegisterListener() {
    window.__electron_preload__ListenerWhatsappBot((data) => {
      setWhatsState((prev) => {
        if (prev)
          return {
            ...prev,
            ...data,
          };
        return data;
      });
    });
  }

  function StatusDescription() {
    return (WhatsState?.ready ? false : WhatsState?.is_loading)
      ? "CONECTANDO..."
      : WhatsState?.logged
      ? "ONLINE"
      : "OFFLINE";
  }
  async function GetStatusService() {
    try {
      const data = await fetch(
        `http://${AddressRemoteProvider}/data7/send_message_whatsapp`
      );
      const Body = await data.json();
      if (data.status === 200) {
        setWhatsState({
          ...WhatsState,
          ready: Body.ready,
          is_loading: Body.is_loading,
          event: Events.initialized,
          logged: Body.is_logged,
          name_profile: Body.name_profile,
          url_profile: Body.url_image_profile,
        });
        setRemoteProviderStatus({
          online: true,
          status: data.status,
          message: "Provedor online.",
        });
        return;
      }
      setRemoteProviderStatus({
        online: false,
        status: data.status,
        message: Body.message,
      });
    } catch (error) {
      setRemoteProviderStatus({
        online: false,
        status: 500,
        message: "Erro ao se conectar ao provedor: " + error,
      });
    }
  }

  useEffect(() => {
    window
      .__electron_preload__Config_GetServiceOptions(
        EnumServices.whatsapp_integrated
      )
      .then(setServiceOptions);
  }, []);
  useEffect(() => {
    if (ServiceOptions) {
      if (UseRemoteProvider) {
        GetStatusService();
      } else {
        RegisterListener();
        window.__electron_preload__GetStatusWhatsapp().then((data) => {
          setWhatsState({
            ...WhatsState,
            ready: data.ready,
            is_loading: data.is_loading,
            event: Events.initialized,
            logged: data.is_logged,
            name_profile: data.name_profile,
            url_profile: data.url_image_profile,
          });
        });
        window
          .__electron_preload__Config_GetService(
            EnumServices.whatsapp_integrated
          )
          .then(setWhatsService);
      }
    }
  }, [ServiceOptions, UseRemoteProvider]);

  useEffect(() => {
    if (IsServiceProvider) {
      window
        .__electron_preload__Config_GetKeyValue(
          EnumKeysHttpServer.port,
          EnumServices.http_server
        )
        .then((port) => setPortServer(Number(port)));
      window
        .__electron_preload__GetGlobalState()
        .then((global_state) => setGlobalState(JSON.parse(global_state)));
    }
  }, [IsServiceProvider]);

  return (
    <StackScrollBar flex="1" p={2}>
      <Box alignItems={"center"} justifyContent="center" pb="2">
        <Flex alignItems={"center"} justifyContent="space-around">
          {WhatsState?.url_profile && (
            <Image
              src={WhatsState.url_profile}
              border={"1px"}
              borderRadius="50%"
              maxW={150}
            />
          )}
          {WhatsState?.qrcode && !WhatsState?.url_profile && (
            <Box maxW={170}>
              <Text align={"center"} fontWeight="bold">
                Escaneie o QRCode no Whatsapp
              </Text>
              <RenderQrCode
                data={WhatsState?.qrcode}
                border={"1px"}
                borderRadius="8px"
              />
            </Box>
          )}
        </Flex>
        {WhatsState?.name_profile && (
          <Text textAlign={"center"} mt="2" fontWeight="bold">
            {WhatsState.name_profile}
          </Text>
        )}

        <Text
          textAlign={"center"}
          fontSize="12"
          mt="1"
          fontWeight="bold"
          color={
            (WhatsState?.ready ? false : WhatsState?.is_loading)
              ? "gray.600"
              : WhatsState?.logged
              ? "green"
              : "red"
          }
        >
          {StatusDescription()}
        </Text>
      </Box>
      <Box>
        <Flex direction={"column"} gap="2" flex="1">
          {!UseRemoteProvider && WhatsService?.id_window && (
            <RenderButtonsToggleWindowsServices
              service={WhatsService}
              label="Janela Whatsapp"
            />
          )}
          {UseRemoteProvider && (
            <Button size="sm" my="2" onClick={GetStatusService}>
              Você está usando um provedor remoto (clique para atualizar)
            </Button>
          )}
        </Flex>
      </Box>

      <Box fontSize="14" my="2">
        {IsServiceProvider && (
          <>
            <Text>IP Local para Integração remota:</Text>
            <Flex
              flex={1}
              flexDirection="row"
              justifyContent={"space-between"}
              alignItems="center"
            >
              <Text fontWeight={"bold"}> {URL_API}</Text>
              <CopyButton text={URL_API} h="30px" minW="40px" />
            </Flex>
          </>
        )}
        {UseRemoteProvider && (
          <>
            <Text>IP Servidor Integração Remota:</Text>
            <Flex
              flex={1}
              flexDirection="row"
              justifyContent={"space-between"}
              alignItems="center"
            >
              <Text fontWeight={"bold"}> {AddressRemoteProvider}</Text>
              <CopyButton text={AddressRemoteProvider} h="30px" minW="40px" />
            </Flex>
          </>
        )}
      </Box>
      {UseRemoteProvider && (
        <Box fontSize="14" my="1">
          <Text>Status: {RemoteProviderStatus?.status}</Text>
          <Text>Mensagem: {RemoteProviderStatus?.message}</Text>
        </Box>
      )}

      <Flex
        display={!UseRemoteProvider ? "inherit" : "none"}
        flex="1"
        justifyContent={"flex-end"}
        direction={"column"}
        gap="4"
      >
        {WhatsState?.ready ||
          (!WhatsState?.is_loading &&
            Boolean(WhatsState?.disconnected || !WhatsState?.logged) && (
              <Button size="md">
                Sua conta está desconectada, login necessário.
              </Button>
            ))}
        {
          <Button size={"sm"} mx="auto" onClick={ResetDisclosure.onOpen}>
            Redefinir Conexão Whatsapp
          </Button>
        }
      </Flex>
      <ConfirmationModal
        isOpen={ResetDisclosure.isOpen}
        onClose={ResetDisclosure.onClose}
        onClickRight={ResetLocalStorage}
        labels={{
          message:
            "Essa ação irá desconectar a sua sessão do whatsapp, você precisará fazer login novamente.",
          buttonLeft: "Cancelar",
        }}
      />
    </StackScrollBar>
  );
}
