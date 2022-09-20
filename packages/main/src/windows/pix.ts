import type { BrowserWindow } from "electron";
import { dialog } from "electron";
import { screen } from "electron";
import { EnumKeysTerminalData } from "../../../../types/enums/configTabsAndKeys";
import { Global_State } from "../global_state";
import { createDefaultWindow } from "../handlers/ControlWindows";
import { CreateNotification } from "../handlers/notifications";
import { GetConfigTabs, Storage } from "../services/local_storage";
import { WindowConfigurationPanel } from "./configuration";

let Window: BrowserWindow;

function Create(cb_ready?: (Window: BrowserWindow) => void) {
  const Config = GetConfigTabs();
  const ObjCNPJ = Config
    ? Config.find((obj) => obj.key === EnumKeysTerminalData.cnpj_cpf)
    : undefined;
  const CNPJs = ObjCNPJ && Array.isArray(ObjCNPJ.value) ? ObjCNPJ.value : [];
  if (CNPJs.length == 0) {
    dialog
      .showMessageBox({
        type: "info",
        title: Global_State.name_app,
        message:
          "Você não possui nenhum CNPJ cadastrado, por gentileza acesse as configurações e informe o CNPJ. \nSem o CNPJ você será incapaz de receber PIX nesse terminal.",
      })
      .then(() => {
        WindowConfigurationPanel().Create().focus();
      });
  }
  if (CNPJs.length == 0) return;
  if (Window && !Window.isDestroyed()) return Window;
  const screenElectron = screen;
  const display = screenElectron.getPrimaryDisplay();
  const dimensions = display.workAreaSize;

  const DimensionsUSer: IDimensions = Storage.has("dimensions")
    ? (Storage.get("dimensions") as unknown as IDimensions)
    : {
        width: Math.floor(dimensions.width * 0.25),
        height: Math.floor(dimensions.height * 0.45),
      };

  Window = createDefaultWindow({
    id: "pix",
    WindowOptions: {
      width: DimensionsUSer.width,
      height: DimensionsUSer.height,
      minWidth: 400,
      minHeight: 460,
      maxWidth: dimensions.width,
      maxHeight: dimensions.height,
      closable: false,
      frame: false,
      fullscreenable: false,
      transparent: true,
      alwaysOnTop: true,
    },
  });

  Window.on("minimize", function (event: { preventDefault: () => void }) {
    event.preventDefault();
    return false;
  });

  Window.on("close", function (event) {
    event.preventDefault();
    return false;
  });

  Window.on("resized", () => {
    const { height, width } = screen.getPrimaryDisplay().workAreaSize;
    const position = Window.getBounds();
    const newX = width / 2 - position.width / 2;
    const newY = height / 2 - position.height / 2;
    Window.setBounds({ x: Math.floor(newX), y: Math.floor(newY) });
    Storage.set("dimensions", {
      width: position.width,
      height: position.height,
    });
  });

  Window.on("ready-to-show", () => {
    CreateNotification({
      silent: true,
      title: Global_State.name_app,
      body: "O serviço PIX está ativo, aguardando atualizações.",
    });
    cb_ready && cb_ready(Window);
  });

  const pageUrl =
    import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL
      : new URL(
          "../renderer/dist/index.html",
          "file://" + __dirname,
        ).toString();

  Window.loadURL(pageUrl + "#/qrcode");

  return Window;
}
function Stop() {
  if (Window && !Window.isDestroyed()) {
    Window.removeAllListeners();
    Window.destroy();
  }
}
// const MenuItemTray = {
//   id: "toggle-pix-window",
//   label: "Mostrar área PIX",
//   click: () => {

//     ToggleWindow(Create(), (isVisible) => {
//       ControlTray().ReplaceMenuItem({
//         ...MenuItemTray,
//         label: isVisible ? "Ocultar área PIX" : MenuItemTray.label,
//       });
//     });
//   },
// };

// function RegisterMenusOnTray() {
//   ControlTray().AddAction(MenuItemTray);
// }

export function WindowPix() {
  return {
    Window,
    Create,
    Stop,
  };
}
