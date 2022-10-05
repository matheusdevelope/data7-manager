import type { BrowserWindow, WebContents } from "electron";
import { clipboard, nativeImage } from "electron";
import { existsSync } from "fs";
import { extname, normalize } from "path";
import Whatsapp from ".";
import {
  EnumKeysWhatsappIntegrated,
  EnumServices,
} from "../../../../../types/enums/configTabsAndKeys";
import { Events } from "../../../../../types/enums/whatsapp";
import ServiceS3 from "../aws/s3";
import { GetKeyValue } from "../local_storage";
import { EventEmitter } from "./eventemitter";
import { FileToBase64, OnlyDataBase64 } from "/@/utils";
import CompressImage from "/@/utils/compress_image";

let Window: BrowserWindow | null;
let Options: IValuesWhatsappService;

function Start() {
  if (Window) return Window;
  const Win = Whatsapp.CreateOrRestoreWindowWhats();
  Win.loadURL(Options.url);
  Win.on("ready-to-show", () => {
    IsLoading();
    RegisterFunctionsWeb(Win.webContents);
  });
  Window = Win;
  EventEmitter.emit(Events.initialized);
}
function Stop() {
  if (Window) Window.destroy();
  Window = null;
  EventEmitter.emit(Events.close);
}
function SetOptions(opt: IValuesWhatsappService) {
  Options = { ...Options, ...opt };
}
function RegisterFunctionsWeb(Web: WebContents) {
  Web.executeJavaScript(`
  const OpenChat = (phone, text) => {
    const link = document.createElement("a");
    link.setAttribute("href", "whatsapp://send?phone=" + phone + "&text=" + text||'');
    document.body.append(link);
    link.click();
    document.body.removeChild(link);
  };
  function GetElementBySelector(selector) {
    return document.querySelector(selector);
  }

  function ClickElementBySelector(selector) {
    const element = document.querySelector(selector);
    element.click();
  }
  `);
}
function ExecJSBrowser(script: string) {
  const Web = Whatsapp.CreateOrRestoreWindowWhats().webContents;
  return Web.executeJavaScript(script);
}
function IsLoading() {
  const Loop = setInterval(() => {
    ExecJSBrowser(
      `GetElementBySelector('${Options.selector_is_loading}').innerHTML`,
    ).catch(() => {
      clearInterval(Loop);
      VerifyIsLogged();
    });
  }, 1000);
}
async function VerifyIsLogged(opt?: IValuesWhatsappService) {
  if (opt) {
    Options = { ...Options, ...opt };
  }
  const script1 = `window.sessionStorage.getItem("${Options.selector_key_storage_is_logged}")`;
  const script2 = `window.localStorage.getItem("${Options.selector_key_storage_is_logged}")`;
  const Interval_Verification = Number(
    GetKeyValue({
      key: EnumKeysWhatsappIntegrated.veryfication_is_logged_interval,
      sub_category: EnumServices.whatsapp_integrated,
    }) || 10,
  );
  const SessionWid = await ExecJSBrowser(script1);
  const StorageWid = await ExecJSBrowser(script2);
  if (SessionWid || StorageWid) {
    EventEmitter.emit(Events.ready);
  }
  const Loop = setInterval(async () => {
    try {
      const SessionWid = await ExecJSBrowser(script1);
      const StorageWid = await ExecJSBrowser(script2);
      if (SessionWid || StorageWid) {
        EventEmitter.emit(Events.ready);
        return Promise.resolve(true);
      }
      clearInterval(Loop);
      EventEmitter.emit(Events.disconnected);
      SyncQrCode();
    } catch (error) {
      EventEmitter.emit(Events.error, error);
      clearInterval(Loop);
    }
  }, Interval_Verification * 1000);
}
function SyncQrCode() {
  setTimeout(() => {
    ExecJSBrowser(
      `GetElementBySelector('${Options.selector_qrcode_img}').getAttribute('data-ref')`,
    )
      .then((result) => {
        EventEmitter.emit(Events.qr, result);
        const Loop = setInterval(() => {
          ExecJSBrowser(
            `GetElementBySelector('${Options.selector_qrcode_img}').getAttribute('data-ref')`,
          )
            .then((result) => {
              EventEmitter.emit(Events.qr, result);
            })
            .catch(() => {
              clearInterval(Loop);
              Stop();
              Start();
            });
        }, 2 * 1000);
      })
      .catch(() => {
        Stop();
        Start();
      });
  }, 5000);
}
export function OpenChatWhatsapp(phone: string, text = "") {
  const StringToExecute = `OpenChat(${phone}, '${text}')`;
  Whatsapp.CreateOrRestoreWindowWhats().webContents.executeJavaScript(
    StringToExecute,
  );
}

async function SendMessage(
  phone: string,
  messages: IMessageWhatsapp[],
): Promise<boolean | IValidation[]> {
  const validation: IValidation[] = [];
  OpenChatWhatsapp(phone);
  await Delay(() => null);
  for (let i = 0; i < messages.length; i++) {
    const { text, image_base64, file_path, expiration, name_file } =
      messages[i];
    try {
      if (text && !image_base64 && !file_path) await SendText(text);
      if (image_base64) await SendImage(image_base64, text);
      if (file_path) await SendFile(file_path, text, expiration, name_file);
    } catch (error) {
      validation.push({
        message: String(error),
      });
    }
  }

  if (validation.length > 0) return Promise.reject(validation);
  return Promise.resolve(true);
}
async function SendText(text: string) {
  await Delay(() => {
    Copy(text);
    Paste();
  });
  await Delay(PressEnter);
}
async function SendFile(
  path: string,
  caption?: string,
  expiration?: number,
  name_file?: string,
) {
  try {
    const path_nomalized = normalize(path);
    if (!existsSync(path_nomalized))
      return Promise.reject(`The provided path doesn't exists [${path}]`);
    const Extension_File = extname(path_nomalized)
      .replaceAll(".", "")
      .toLowerCase();
    if (["png", "jpg", "jpeg"].includes(Extension_File)) {
      const Image = FileToBase64(path_nomalized);
      return SendImage(Image, caption);
    }
    const URL_File = await ServiceS3().create(
      path_nomalized,
      expiration,
      name_file,
    );
    const TextAfterFile = Boolean(
      GetKeyValue({
        key: EnumKeysWhatsappIntegrated.text_after_file,
        sub_category: EnumServices.whatsapp_integrated,
      }),
    );
    let Message = "";
    if (TextAfterFile) {
      Message = URL_File.Location + "\n" + (caption ? caption : "");
    } else {
      Message = (caption ? caption : "") + "\n" + URL_File.Location;
    }
    await Delay(() => {
      Copy(Message);
      Paste();
    });
    await Delay(PressEnter);
  } catch (error) {
    Promise.reject(error);
  }
}
async function SendImage(image_base64: string, caption?: string) {
  const CleanedBase64 = OnlyDataBase64(image_base64);
  const Image = nativeImage.createFromBuffer(
    await CompressImage.fromBase64(CleanedBase64),
  );
  caption &&
    (await Delay(() => {
      Copy(caption);
      Paste();
    }));
  await Delay(() => {
    Copy(Image);
    Paste();
  });
  await Delay(PressEnter);
}
// >>>> UTILS
function Copy(content: string | Electron.NativeImage) {
  if (typeof content === "string") {
    return clipboard.write({
      text: content,
    });
  }
  return clipboard.write({
    image: content,
  });
}
function Paste() {
  if (Window) return Window.webContents.paste();
}
function PressEnter() {
  if (Window)
    return Window.webContents.sendInputEvent({
      keyCode: "Enter",
      type: "keyDown",
    });
}
const Delay = (fn: () => void) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      fn();
      resolve(true);
    }, Number(Options.delay_bots || 0.3) * 1000),
  );
};
// <<<< UTILS
const BotPersonal = {
  Start,
  Stop,
  SetOptions,
  SendMessage,
};

export default BotPersonal;
