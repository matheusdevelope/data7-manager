import { useEffect, useRef, useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { CancelIcon, RefreshIcon, WhatsIcon } from "../../svg";
import DoneAnimation from "../../svg/animations/done.json";
import LoadingAnimation from "../../svg/animations/loading.json";
import CancelAnimation from "../../svg/animations/canceled.json";
import ErrorAnimation from "../../svg/animations/error.json";
import {
  AreaQrCode,
  ButtonHeader,
  Column,
  Container,
  Footer,
  Form,
  Header,
  ImgQrCode,
  SubHeader,
} from "./style";
import Dialog from "../../components/modal_dialog";
import { InputGroup, Input, Button, InputLeftElement } from "@chakra-ui/react";
import { MaskMoney } from "/@/utils/masks";
import {
  EnumKeysPix,
  EnumServices,
} from "../../../../../types/enums/configTabsAndKeys";
const { innerHeight: height } = window;
const InitialPix: IDataQrCode = {
  action: "",
  id: "",
  portion: "",
  price: 0,
  img: "",
  link: "",
  phone: "",
  awaiting_payment: true,
  confirmed_payment: false,
  canceled: false,
  message: "Aguardando Ação",
  created_at: new Date(),
  doc_id: "",
};
const DefaultDialog: IDialog = {
  isOpen: false,
  title: "Atenção",
  message: "",
  onClickOK: () => null,
  onClickCancel: undefined,
};
function RenderAreaQrCode(dataQrCode: IDataQrCode) {
  function Awaiting() {
    return (
      <Column>
        <ImgQrCode src={dataQrCode.img} />
        <p>{dataQrCode.message}</p>
        <Player
          src={LoadingAnimation}
          autoplay
          loop
          style={{ height: 60, margin: 0 }}
        />
      </Column>
    );
  }
  function Confirmed() {
    return (
      <Column>
        <Player
          src={DoneAnimation}
          autoplay
          loop
          speed={1.5}
          style={{ height: Math.floor(height * 0.6) }}
        />
        <p>{dataQrCode.message}</p>
      </Column>
    );
  }
  function Canceled() {
    return (
      <Column>
        <Player
          src={CancelAnimation}
          autoplay
          loop
          speed={1.8}
          style={{ height: Math.floor(height * 0.6) }}
        />
        <p>{dataQrCode.message}</p>
      </Column>
    );
  }
  function Error() {
    return (
      <Column>
        <Player
          src={ErrorAnimation}
          autoplay
          loop
          style={{ height: Math.floor(height * 0.6) }}
        />
        <p>{dataQrCode.message}</p>
      </Column>
    );
  }

  function SelectAnimation() {
    if (
      !dataQrCode.id ||
      (!dataQrCode.img && dataQrCode.action !== "close") ||
      !dataQrCode.action
    )
      return Error();
    if (dataQrCode.confirmed_payment) return Confirmed();
    if (dataQrCode.canceled) return Canceled();
    if (dataQrCode.error) return Error();
    return Awaiting();
  }

  return (
    <AreaQrCode>
      <SubHeader>
        {dataQrCode.portion ? "Parcela " + dataQrCode.portion : ""}{" "}
        {dataQrCode.portion && dataQrCode.price ? " - " : ""}
        {dataQrCode.price ? "R$ " + MaskMoney(dataQrCode.price) : ""}
      </SubHeader>

      {SelectAnimation()}
    </AreaQrCode>
  );
}
function maskPhone(valor: string) {
  valor = valor.replace(/\D/g, "");
  valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
  valor = valor.replace(/(\d)(\d{4})$/, "$1-$2");
  return valor;
}
function MessageBasedInStatus(qrcode: IDataQrCode) {
  if (!qrcode.action) return "A Ação não foi infomarda, verifique!";
  if (!qrcode.id) return "O ID do PIX não foi infomardo, verifique!";
  if (!qrcode.img && qrcode.action !== "close")
    return "O QrCode não foi infomardo, verifique!";
  if (qrcode.message) return qrcode.message;
  if (qrcode.confirmed_payment) return "Pix recebido com sucesso!";
  if (qrcode.canceled) return "O pagamento por PIX foi cancelado.";
  if (qrcode.error) return "Houve um erro ao processar a solicitação.";
  if (qrcode.awaiting_payment) return "Aguardando recebimento Pix...";
  return "Status não informado";
}
export default function QrCode() {
  const [dataQrCode, setDataQrcode] = useState<IDataQrCode>(InitialPix);
  const [phone, setPhone] = useState(maskPhone(dataQrCode.phone || ""));
  const [sendingWhats, setSendigWhats] = useState(false);
  const [sendedWhats, setSendedWhats] = useState(false);
  const [dialog, setDialog] = useState<IDialog>(DefaultDialog);
  const phoneRef = useRef<HTMLInputElement>(null);
  function AddListennersInApp() {
    window.__electron_preload__RegisterEventUpdateQr(
      "update-qrcode",
      (qrcode: IDataQrCode) => {
        setDataQrcode({
          ...qrcode,
          message: MessageBasedInStatus(qrcode),
        });
        setPhone(maskPhone(qrcode.phone || ""));
        if (qrcode.action === "close") return CloseWindow();
        return window.__electron_preload__OpenQr();
      }
    );
  }

  function CloseWindow(time: number = 500) {
    setTimeout(() => {
      window.__electron_preload__CloseQr();
      setDataQrcode(InitialPix);
      setPhone(dataQrCode.phone);
      setDialog({ ...DefaultDialog });
    }, time);
  }

  function NewStatus(message: string) {
    return {
      ...dataQrCode,
      message: message,
      awaiting_payment: false,
      confirmed_payment: false,
      canceled: false,
      error: undefined,
    };
  }

  function CancelPix() {
    setDialog({
      ...dialog,
      isOpen: true,
      message: "Tem certeza que deseja solicitar o cancelamento?",
      onClickOK: () => {
        setDialog({ ...DefaultDialog });
        CallCancel();
      },
      onClickCancel: () => {
        setDialog({ ...DefaultDialog });
        phoneRef.current?.focus();
      },
      textbuttonOK: "Sim",
    });

    async function CallCancel() {
      const result = await window.__electron_preload__CancelQr(
        dataQrCode.doc_id
      );
      if (result.canceled) {
        setDataQrcode({
          ...NewStatus(result.message),
        });
      }
    }
  }

  async function RefreshPix() {
    const result = await window.__electron_preload__RefreshQr(dataQrCode.id);
    if (result.confirmed_payment) {
      setDataQrcode({
        ...NewStatus("Pix recebido com sucesso!"),
        confirmed_payment: true,
      });
      CloseWindow();
      return;
    }
    if (result.canceled) {
      setDataQrcode({ ...NewStatus(result.message), canceled: true });
      CloseWindow();
      return;
    }

    if (result.error) {
      setDataQrcode({ ...NewStatus(result.message), error: result.error });
      AlertDialog(
        "Houve um erro ao processar a solicitação: " +
          JSON.stringify(result.error, null, 2)
      );
      return;
    }
    if (result.awaiting_payment) {
      setDataQrcode({ ...NewStatus(result.message), awaiting_payment: true });
      AlertDialog("Aguardando confirmação do recebimento do Pix.");
      return;
    }
  }

  async function SendMessageToWhats(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (phone.length < 15) {
      AlertDialog("Telefone Inválido, verifique!");
      return;
    }
    setSendigWhats(true);
    const ModelMessage = String(
      (await window.__electron_preload__Config_GetKeyValue({
        key: EnumKeysPix.message_whats,
        sub_category: EnumServices.pix,
      })) || ""
    );
    const Link = `https://data7-pix-web.vercel.app//?id=${dataQrCode.doc_id}`;
    const Message = ModelMessage.includes("{link@pix}")
      ? ModelMessage.replaceAll("{link@pix}", Link)
      : ModelMessage + "\n\n" + Link;
    try {
      const ret = await window.__electron_preload__SendWhats("55" + phone, [
        {
          text: Message,
        },
      ]);
      if (ret !== true) {
        setDialog({
          ...dialog,
          isOpen: true,
          title: "Ouve uma falha ao enviar a mensagem no Whatsapp, VERIFIQUE!",
          message: String(ret),
          onClickOK: () => {
            setDialog({ ...DefaultDialog });
          },
          textbuttonOK: "OK",
        });
      } else {
        setSendedWhats(true);
      }

      setSendigWhats(false);
      console.log(ret);
    } catch (error) {
      console.log(error);
    }
  }

  function AlertDialog(message: string, callback?: Function) {
    setDialog({
      ...dialog,
      isOpen: true,
      message: message,
      onClickOK: () => {
        setDialog({ ...DefaultDialog });
        callback && callback();
        phoneRef.current?.focus();
      },
    });
  }

  useEffect(() => {
    AddListennersInApp();
  }, []);

  useEffect(() => {
    phoneRef.current?.focus();
  }, [dataQrCode.img]);

  return (
    <Container className="App">
      <Header>
        <ButtonHeader disabled={dataQrCode.id.length == 0} onClick={RefreshPix}>
          <RefreshIcon />
        </ButtonHeader>
        <p> Se7e Sistemas - PIX </p>
        <ButtonHeader
          onClick={() => {
            dataQrCode.id.length == 0 ? CloseWindow(0) : CancelPix();
          }}
        >
          <CancelIcon />
        </ButtonHeader>
      </Header>
      {RenderAreaQrCode(dataQrCode)}
      {dataQrCode.link && (
        <Footer>
          <Form onSubmit={SendMessageToWhats}>
            <InputGroup size={"sm"} variant="filled">
              <InputLeftElement children={<WhatsIcon />} />

              <Input
                borderRadius={"4"}
                ref={phoneRef}
                value={phone}
                onChange={(e) => {
                  setPhone(maskPhone(e.target.value));
                }}
                type="text"
                placeholder="Whatsapp"
                fontSize={"18"}
              />
            </InputGroup>

            <Button
              _hover={{ bg: "gray.300" }}
              px="8"
              mx="4"
              bg="gray.200"
              size={"sm"}
              type="submit"
            >
              {sendingWhats
                ? "Enviando..."
                : sendedWhats
                ? "Enviar Novamente"
                : "Enviar Link"}
            </Button>
          </Form>
        </Footer>
      )}
      <Dialog {...dialog} />
    </Container>
  );
}
