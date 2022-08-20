import type { BrowserWindow } from "electron";
import { dialog } from "electron";
import { screen } from "electron";
import { Global_State } from "../global_state";
import ControlTray from "../handlers/ControlTray";
import { createDefaultWindow, ToggleWindow } from "../handlers/ControlWindows";
import { CreateNotification } from "../handlers/notifications";
import { Storage } from "../services/local_storage";
import { WindowConfigurationPanel } from "./configuration";

let Window: BrowserWindow;

function Create(cb_ready?: (Window: BrowserWindow) => void) {
  if (Global_State.localConfig().cnpj.length == 0) {
    dialog
      .showMessageBox({
        type: "info",
        title: Global_State.name_app,
        message:
          "Você não possui nenhum CNPJ cadastrado, por gentileza acesse as configurações e informe o CNPJ. \nSem o CNPJ você será incapaz de receber PIX nesse terminal.",
      })
      .then(() => {
        WindowConfigurationPanel().Create();
      });
  }
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

  Window = createDefaultWindow(null, {
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
    alwaysOnTop: import.meta.env.DEV,
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
    RegisterMenusOnTray();
    // if (import.meta.env.DEV) {
    //   Window?.webContents.openDevTools({ mode: "detach" });
    // }
  });

  const pageUrl =
    import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL
      : new URL(
          "../renderer/dist/index.html",
          "file://" + __dirname,
        ).toString();

  Window.loadURL(pageUrl + "#/qrcode");
  cb_ready && cb_ready(Window);
  return Window;
}
const MenuItemTray = {
  id: "toggle-pix-window",
  label: "Mostrar área PIX",
  click: () => {
    ToggleWindow(Create(), (isVisible) => {
      ControlTray().ReplaceMenuItem({
        ...MenuItemTray,
        label: isVisible ? "Ocultar área PIX" : MenuItemTray.label,
      });
    });
  },
};

function RegisterMenusOnTray() {
  ControlTray().AddAction(MenuItemTray);
}

export function WindowPix() {
  return {
    Window,
    Create,
  };
}
