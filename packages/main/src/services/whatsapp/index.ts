import type { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import { app } from "electron";
import { createDefaultWindow } from "/@/handlers/ControlWindows";
import { EnumWindowsID } from "../../../../../types/enums/windows";
import { Events } from "../../../../../types/enums/whatsapp";
import { EventEmitter, on } from "./eventemitter";
import BotPuppeteer from "./bot_puppeteer";
import { GetKeyValue, GetServiceOptions } from "../local_storage";
import {
  EnumKeys,
  EnumKeysWhatsappIntegrated,
  EnumServices,
  EnumTabs,
} from "../../../../../types/enums/configTabsAndKeys";
import BotPersonal from "./bot_personal";
import { CreateNotification } from "/@/handlers/notifications";
import { WindowConfigurationPanel } from "/@/windows/configuration";
import { OnlyNumbersString } from "/@/utils";
import { EnumIpcEvents } from "../../../../../types/enums/GlobalState";
import { Global_State } from "/@/global_state";
import { SendMessageWhatsappRemoteProvider } from "./remote_provider";
import { createAsyncQueue } from "./queue";
import { unlinkSync } from "fs";
import axios from "axios";
import { ConvertMessagesWhatsToOne } from "./convert_list_messages_to_one";
import { SendMessageWhatsExternal } from "../protocoll_events";
let Options: IValuesWhatsappService;
let Window: BrowserWindow;
const QueueSendMessages = createAsyncQueue();

function CreateOrRestoreWindowWhats(
  WindowOptions?: BrowserWindowConstructorOptions,
) {
  const WinOptions = WindowOptions ? WindowOptions : {};
  if (Window && !Window.isDestroyed()) {
    return Window;
  }

  Window = createDefaultWindow({
    id: EnumWindowsID.whatsapp,
    WindowOptions: {
      show: false,
      webPreferences: {
        partition: Options.whats_session,
      },
      ...WinOptions,
    },
  });
  Window.on("ready-to-show", () => {
    Options.is_ready_to_show = true;
  });
  Window.on("close", (e) => {
    e.preventDefault();
    Window.hide();
  });
  Window.on("show", () => {
    Options.visible = true;
  });
  Window.on("hide", () => {
    Options.visible = false;
  });
  return Window;
}
async function Start() {
  const UseRemoteServer = Boolean(
    GetKeyValue({
      key: EnumKeysWhatsappIntegrated.use_remote_service,
      sub_category: EnumServices.whatsapp_integrated,
    }) || false,
  );

  Options = { ...GetOptionsStorage(), is_loading: true };
  if (UseRemoteServer) {
    try {
      Options = { ...(await GetOptionsRemote()) };
    } catch (error) {
      EventEmitter.emit(Events.error, error);
    }
  } else {
    app.userAgentFallback = Options.user_agent;
    StartListenerEvents();
    try {
      if (Options.use_bot) {
        BotPuppeteer.Start();
      } else {
        BotPersonal.SetOptions(Options);
        BotPersonal.Start();
      }
    } catch (error) {
      EventEmitter.emit(Events.error, error);
    }
  }

  return Window;
}
function Stop() {
  const UseRemoteServer = Boolean(
    GetKeyValue({
      key: EnumKeysWhatsappIntegrated.use_remote_service,
      sub_category: EnumServices.whatsapp_integrated,
    }) || false,
  );
  const UseBot = Boolean(
    GetKeyValue({
      key: EnumKeysWhatsappIntegrated.use_bot,
      sub_category: EnumServices.whatsapp_integrated,
    }) || false,
  );
  if (!UseRemoteServer) {
    UseBot ? BotPuppeteer.Stop() : BotPersonal.Stop();
    if (Window) Window.destroy();
  }
  EventEmitter.emit(Events.close);
  EventEmitter.events.clear();
}
function GetOptionsStorage() {
  const ServiceOptions = GetServiceOptions(EnumServices.whatsapp_integrated);
  const TempOptions: IComumObject = {};
  ServiceOptions.forEach((service) => {
    const value = service.value;
    if (
      service.key &&
      value !== null &&
      value !== undefined &&
      !Array.isArray(value)
    ) {
      if (service.key === EnumKeysWhatsappIntegrated.delay_bots) {
        const delay = Number(value);
        TempOptions[service.key] = delay && delay > 0.5 ? delay : 0.5;
      } else {
        TempOptions[service.key] = value;
      }
    }
  });
  return TempOptions as unknown as IValuesWhatsappService;
}
async function GetOptionsRemote() {
  try {
    const AddressRemoteServer = String(
      GetKeyValue({
        key: EnumKeysWhatsappIntegrated.remote_service_address,
        sub_category: EnumServices.whatsapp_integrated,
      }),
    );
    const data = await axios.get(
      `http://${AddressRemoteServer}/data7/send_message_whatsapp`,
    );
    Options = { ...data.data };
    return Promise.resolve(data.data);
  } catch (error) {
    EventEmitter.emit(Events.error, error);
    return Promise.reject(error);
  }
}
function SendDataToFrontEnd(data: IDataListenerWhatsapp) {
  const ConfigWin = WindowConfigurationPanel().Create();
  if (!ConfigWin.isVisible() && data.event === Events.qr) {
    const pageUrl =
      import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
        ? import.meta.env.VITE_DEV_SERVER_URL
        : new URL(
            "../renderer/dist/index.html",
            "file://" + __dirname,
          ).toString();
    ConfigWin.loadURL(pageUrl + "#/home/services/whatsapp");
    ConfigWin.on("ready-to-show", () => {
      ConfigWin.webContents.send(EnumIpcEvents.listener_whatsapp_bot, {
        ...data,
      });
    });
    WindowConfigurationPanel().Focus();
    CreateNotification({
      body: `Você precisa fazer login para usar o Whatsapp Integrado.\n Scaneie o QRCode nas configurações do ${Global_State.name_app} para fazer login.`,
    });
  }
  ConfigWin.webContents.send(EnumIpcEvents.listener_whatsapp_bot, {
    ...data,
  });
}
function StartListenerEvents() {
  on(Events.error, (e) => {
    SendDataToFrontEnd({
      logged: Options.is_logged,
      event: Events.auth_failure,
      message: String(e || ""),
    });
  });
  on(Events.initialized, () => {
    Options = {
      ...Options,
      is_ready_to_show: false,
      is_logged: false,
      is_loading: true,
    };
    SendDataToFrontEnd({ logged: false, event: Events.initialized });
    OnInitialization();
  });
  on(Events.ready, () => {
    if (!Options.name_profile && !Options.url_image_profile) {
      Options.use_bot;
      setTimeout(
        async () => {
          const profile = await GetProfile();
          Options = {
            ...Options,
            name_profile: profile.name_profile,
            url_image_profile: profile.url_profile,
          };
          SendDataToFrontEnd({
            logged: true,
            ready: true,
            is_loading: false,
            event: Events.ready,
            ...profile,
          });
        },
        Options.use_bot ? 1000 : 0.5,
      );
    }
    SendDataToFrontEnd({
      logged: true,
      ready: true,
      is_loading: false,
      event: Events.ready,
    });

    OnReady();
  });
  on(Events.qr, (qr) => {
    SendDataToFrontEnd({
      logged: false,
      event: Events.qr,
      qrcode: String(qr || ""),
    });
  });
  on(Events.auth_failure, (message) => {
    SendDataToFrontEnd({
      logged: false,
      is_loading: false,
      event: Events.auth_failure,
      message: String(message || ""),
    });
  });
  on(Events.disconnected, (e) => {
    CreateNotification({
      body: "O Whatsapp foi desconectado, faça login novamente para continuar usando os serviços de envio de mensagens integrado.",
    });
    Options = {
      ...Options,
      is_ready_to_show: false,
      is_logged: false,
      is_loading: false,
      name_profile: "",
      url_image_profile: "",
    };
    SendDataToFrontEnd({
      logged: false,
      is_loading: false,
      event: Events.disconnected,
      message: String(e || ""),
      url_profile: "",
      name_profile: "",
    });
  });
  on(Events.close, (e) => {
    Options = {
      ...Options,
      visible: false,
      is_ready_to_show: false,
      is_logged: false,
    };
    SendDataToFrontEnd({
      logged: false,
      event: Events.close,
      message: String(e || ""),
    });
  });
}
function OnInitialization() {
  const Loop = setInterval(() => {
    Window.webContents
      .executeJavaScript(
        `document.querySelector('${Options.selector_find_when_useragent_failed}').getAttribute('href')`,
      )
      .then((result) => {
        if (result && String(result).includes(Options.selector_link_chrome)) {
          clearInterval(Loop);
          ResetLocalStorage();
        }
      })
      .catch(() => clearInterval(Loop));
  }, 5000);
}
async function OnReady() {
  if (Options.is_logged) return;
  Options = {
    ...Options,
    ready: true,
    is_ready_to_show: true,
    is_logged: true,
    is_loading: false,
  };
  if (
    GetKeyValue({
      key: EnumKeysWhatsappIntegrated.show_window_on_start,
      sub_category: EnumServices.whatsapp_integrated,
    })
  ) {
    Window.show();
    Window.focus();
  }
  CreateNotification({
    body: "O Whatsapp está conectado e pronto para uso.",
  });
}
async function GetProfile() {
  const Click = `document.querySelector('${Options.selector_mini_profile_photo}').click()`;
  const GetURL = `document.querySelector('${Options.selector_profile_photo}').getAttribute('src')`;
  const GetNameProfile = `document.querySelector('${Options.selector_profile_name}').innerText`;
  const CloseProfileMenu = `document.querySelector('${Options.selector_close_profile}').click()`;

  try {
    await Window.webContents.executeJavaScript(Click);
    const URL_Profile = await Window.webContents.executeJavaScript(GetURL);
    const Name_Profile = await Window.webContents.executeJavaScript(
      GetNameProfile,
    );
    try {
      await Window.webContents.executeJavaScript(CloseProfileMenu);
    } catch (error) {
      console.log("Error on close profile menu:", error);
    }
    return Promise.resolve({
      url_profile: String(URL_Profile || ""),
      name_profile: String(Name_Profile || ""),
    });
  } catch (error) {
    EventEmitter.emit(Events.error, error);
  }
  return Promise.resolve({
    url_profile: "",
    name_profile: "",
  });
}
function ResetLocalStorage() {
  Window && Window.webContents.session.clearStorageData();
  Stop();
  Start();
}
export async function SendWhatsappMessage(
  phone: string,
  messages: IMessageWhatsapp[],
) {
  const validation: IValidation[] = [];

  try {
    const StatusService = Boolean(
      GetKeyValue({
        key: EnumKeys.status,
        sub_category: EnumServices.whatsapp_integrated,
      }) || false,
    );
    const UseRemoteServer = Boolean(
      GetKeyValue({
        key: EnumKeysWhatsappIntegrated.use_remote_service,
        sub_category: EnumServices.whatsapp_integrated,
      }) || false,
    );
    const WhatsIntegrated = Boolean(
      GetKeyValue({
        key: EnumKeys.status,
        sub_category: EnumServices.whatsapp_integrated,
        category: EnumTabs.services,
      }),
    );

    const SanitizedPhone = OnlyNumbersString(phone).trim();

    if (messages.length == 0) {
      validation.push({
        message: "list of messages is empty",
        index: 0,
      });
      return Promise.resolve(validation);
    }
    if (SanitizedPhone.length == 0) {
      validation.push({
        message: "Invalid Phone Number",
      });
      return Promise.resolve(validation);
    }

    if (!WhatsIntegrated) {
      const message = await ConvertMessagesWhatsToOne(messages);
      if (typeof message == "string") {
        await SendMessageWhatsExternal(SanitizedPhone, message);
        return Promise.resolve(true);
      }
    }

    if (UseRemoteServer) await GetOptionsRemote();

    const IsLogged = Options?.is_logged;
    if (!StatusService)
      return Promise.resolve(
        `Você não pode enviar mensagens com esse serviço desativado. ${
          UseRemoteServer ? "(Você está usando um provedor REMOTO)" : ""
        } `,
      );
    if (!IsLogged) {
      const message = `Você não pode enviar mensagens sem estar logado no Whatsapp. ${
        UseRemoteServer ? "(Você está usando um provedor REMOTO)" : ""
      } `;

      return Promise.resolve(message);
    }

    await QueueSendMessages.push(async () => {
      if (UseRemoteServer) {
        await SendMessageWhatsappRemoteProvider(SanitizedPhone, messages);
      } else {
        Options.use_bot
          ? await BotPuppeteer.SendMessage(SanitizedPhone, messages)
          : await BotPersonal.SendMessage(SanitizedPhone, messages);
      }
    });
    messages.forEach((message) => {
      message.file_path && unlinkSync(message.file_path);
    });
    return Promise.resolve(true);
  } catch (error) {
    EventEmitter.emit(Events.error, error);
    validation.push({
      message: typeof error === "string" ? error : JSON.stringify(error),
    });
    return Promise.resolve(validation);
  }
}

const Whatsapp = {
  Start,
  Stop,
  SendWhatsappMessage,
  values: () => Options,
  on,
  ResetLocalStorage,
  CreateOrRestoreWindowWhats,
  Window: () => Window,
};

export default Whatsapp;
