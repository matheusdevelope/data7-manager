import type { MenuItemConstructorOptions } from "electron";
import { app, BrowserWindow, dialog, Menu, Tray } from "electron";
import { resolve } from "path";
import { Global_State } from "../global_state";
import { SendWhatsappMessage } from "../services/whatsapp";
import { WindowConfigurationPanel } from "../windows/configuration";
import { ToggleWindow } from "./ControlWindows";
import { RemoveAllNotifications } from "./notifications";
let AppTray: Tray;
const Path = "C:\\Data7\\TempFiles\\";
const phone = "556696971841";

let Menus: MenuItemConstructorOptions[] = [
  {
    id: "config-window",
    label: "Painel",
    click: () => {
      WindowConfigurationPanel().Create();
      WindowConfigurationPanel().Focus();
    },
  },
  {
    label: "Enviar Mensagens Whats",
    click: async () => {
      try {
        await SendWhatsappMessage(phone, [
          {
            text: "Inicio do Teste",
          },
          {
            text: "Arquivo JGP",
            file_path: Path + "foto.jpg",
          },
          {
            text: "Fim do Teste",
          },
        ]);
      } catch (error) {
        console.log(error);
      }
    },
  },
  // {
  //   label: "Enviar Mensagens Remoto",
  //   click: async () => {
  //     try {
  //       const base64 = FileToBase64(Path + "foto.jpg");
  //       await SendMessageWhatsappRemoteProvider(phone, [
  //         {
  //           text: "Inicio do Teste",
  //         },
  //         {
  //           text: "Arquivo 1",
  //           file_path: Path + "PDF.pdf",
  //         },
  //         {
  //           text: "Arquivo PNG",
  //           file_path: Path + "foto.png",
  //         },
  //         {
  //           text: "Arquivo PNG",
  //           file_path: Path + "foto.jpg",
  //         },
  //         {
  //           text: "Arquivo Videos",
  //           file_path: Path + "video.mp4",
  //         },
  //         {
  //           text: "Arquivo GIF",
  //           file_path: Path + "giphy.gif",
  //         },
  //         {
  //           text: "Imagem BASE64",
  //           image_base64: base64,
  //         },
  //         {
  //           text: "Fim do Teste",
  //         },
  //       ]);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
  // },

  {
    label: "Reiniciar",
    click: () => {
      BrowserWindow.getAllWindows().map((Window) => {
        Window.removeAllListeners();
        Window.destroy();
      });
      app.relaunch();
      app.exit();
    },
  },
  {
    label: "Encerrar",
    click: () => {
      dialog
        .showMessageBox({
          title: "Ateção",
          message: "Tem certeza que deseja encerrar a aplicação?",
          buttons: ["Voltar", "Encerrar"],
        })
        .then((ret) => {
          if (ret.response == 1) {
            BrowserWindow.getAllWindows().map((Window) => {
              Window.removeAllListeners();
              Window.destroy();
            });
            app.quit();
          }
        });
    },
  },
  {
    label: "Sobre",
    click: () => {
      dialog.showMessageBox({
        type: "info",
        title: "Sobre",
        message:
          "Data7 Manager v" +
          app.getVersion() +
          "\nIP Local: " +
          Global_State.local_ip +
          "\nEstação de Trabalho: " +
          Global_State.hostname +
          "\nUsuario Logado: " +
          Global_State.username_machine,
      });
    },
  },
];

export default function ControlTray() {
  function Create(path_icon?: string, tool_tip = "") {
    const default_path_icon = resolve(__dirname, "icon.png");
    if (!AppTray) {
      AppTray = new Tray(path_icon ? path_icon : default_path_icon);
    }
    AppTray.setToolTip(tool_tip);
    AppTray.setContextMenu(BuildMenu(Menus));
    AppTray.on("click", () => {
      RemoveAllNotifications();
      ToggleWindow(WindowConfigurationPanel().Create());
    });

    return AppTray;
  }

  function BuildMenu(Menus: MenuItemConstructorOptions[]) {
    return Menu.buildFromTemplate(Menus);
  }

  function AddAction(MenuItem: MenuItemConstructorOptions) {
    Menus = MenuItem.id
      ? Menus.filter((item) => item.id !== MenuItem.id)
      : Menus;
    Menus.reverse().push(MenuItem);
    if (AppTray) {
      AppTray.setContextMenu(BuildMenu(Menus.reverse()));
    }
  }
  function RemoveMenu(id: string) {
    Menus = Menus.filter((item) => item.id !== id);
    AppTray.setContextMenu(BuildMenu(Menus));
  }
  function ReplaceMenuItem(menu: MenuItemConstructorOptions) {
    const indexITemMenu = Menus.findIndex((item) => item.id === menu.id);
    if (indexITemMenu >= 0) {
      Menus.splice(indexITemMenu, 1, menu);
      AppTray.setContextMenu(BuildMenu(Menus));
    }
  }

  return {
    Create,
    Tray: AppTray,
    AddAction,
    RemoveMenu,
    ReplaceMenuItem,
  };
}
