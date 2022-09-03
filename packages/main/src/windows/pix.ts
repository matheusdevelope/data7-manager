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
      alwaysOnTop: import.meta.env.DEV,
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
    // CallQrCode({
    //   qrcode: {
    //     action: "open",
    //     id: "123456789",
    //     link: "http://google.com",
    //     phone: "66996971841",
    //     awaiting_payment: true,
    //     confirmed_payment: false,
    //     canceled: false,
    //     portion: "1",
    //     price: 1,
    //     created_at: new Date(),
    //     message: "Aguardando pagamento Pix..!",
    //     img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKwSURBVO3BQa7jSAwFwXyE7n/lHC+5KkCQ7OlPMCJ+sMYo1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKNUqxRijXKxUNJ+CWVJ5LQqZwk4ZdUnijWKMUapVijXLxM5U1JuCMJnUqn8oTKm5LwpmKNUqxRijXKxZcl4Q6VO5JwkoQTlSeScIfKNxVrlGKNUqxRLoZT6ZLQJaFT+cuKNUqxRinWKMUapVijFGuUYo1y8WUqv6TSJaFT6ZLwhMq/pFijFGuUYo1y8bIkTJaEf1mxRinWKMUaJX7whyXhTSp/WbFGKdYoxRrl4qEkdCpdEt6k0qmcJKFT6ZJwkoQ3qXxTsUYp1ijFGuXiIZUTlS4JncodSehUuiS8SaVLQqfSJeGOJHQqTxRrlGKNUqxR4gcvSkKn0iXhRKVLQqfSJeEJlS4JncpJEp5QeVOxRinWKMUaJX7woiScqDyRhE7lJAmdyhNJeELlm4o1SrFGKdYo8YMHktCpdEn4JZWTJHQqXRI6lZMknKh0SehU3lSsUYo1SrFGiR/8YUk4UemS8CaVkyTcofJEsUYp1ijFGuXioST8kkqn0iWhS0Kn0iWhU+mScEcSOpUuCZ3Km4o1SrFGKdYoFy9TeVMSTpJwotIl4SQJJyp3JKFT6ZLQqTxRrFGKNUqxRrn4siTcofJNKl0SOpWTJHQqJypdEjqVNxVrlGKNUqxRLoZR+SaVLgknSehUvqlYoxRrlGKNcjFMEjqVLgmdSpeETqVLQqdykoRfKtYoxRqlWKNcfJnKN6ncoXKicqJykoT/U7FGKdYoxRrl4mVJ+KUkdCpdEk5UuiR0KneonCShU3lTsUYp1ijFGiV+sMYo1ijFGqVYoxRrlGKNUqxRijVKsUYp1ijFGqVYoxRrlGKNUqxRijXKf3weEuTKsbeUAAAAAElFTkSuQmCC",
    //   },
    //   callback: (a) => {
    //     console.log("callback: ", a);
    //   },
    // });
    // RegisterMenusOnTray();
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
function Stop() {
  if (Window && !Window.isDestroyed()) {
    Window.removeAllListeners();
    Window.destroy();
  }
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
