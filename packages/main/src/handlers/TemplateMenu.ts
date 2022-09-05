export const menuTemplate = [
  {
    label: null,
    enabled: false,
  },
  {
    label: 'Iniciar Serviço Firestore',
    enabled: false,
    click: () => {
      // FirebaseService = StartPixSrvice();
      // menuTemplate[1].enabled = false;
      // menuTemplate[2].enabled = true;
      // buildTrayMenu(menuTemplate);
    },
  },
  {
    label: 'Parar Serviço Firestore',
    enabled: true,
    click: () => {
      // FirebaseService();
      // menuTemplate[1].enabled = true;
      // menuTemplate[2].enabled = false;
      // buildTrayMenu(menuTemplate);
    },
  },
  {
    label: 'Registrar Dispositivo Móvel',
    click: () => {
      // const WindowQR = CreateWindow("login_with_qrcode", {
      //   frame: true,
      // });
      // WindowQR.once("ready-to-show", () => {
      //   WindowQR.webContents.send(
      //     Global_State.events.login_with_qrcode,
      //     URL_Login_Mobile(DataToLoginMobile)
      //   );
      //   WindowQrCode.hide();
      //   WindowQR.show();
      // });
    },
  },
  {
    label: 'Abrir Configurações',
    click: () => {
      // const WindowQR = CreateWindow("/", {
      //   alwaysOnTop: false,
      //   frame: true,
      // });
      // WindowQR.once("ready-to-show", () => {
      //   WindowQrCode.hide();
      //   WindowQR.show();
      // });
    },
  },

  {
    label: 'Buscar Atualizações',
    click: () => {
      // autoUpdater.checkForUpdatesAndNotify({
      //   title: Global_State.name_app,
      //   body: Global_State.notification_update  });
    },
  },
  {
    label: 'Reiniciar',
    click: () => {
      // WindowQrCode.removeAllListeners();
      // WindowQrCode.destroy();
      // app.relaunch();
    },
  },
  {
    label: 'Encerrar',
    click: () => {
      // WindowQrCode.removeAllListeners();
      // WindowQrCode.destroy();
      // app.quit();
    },
  },
  {
    label: 'Sobre',
    click: () => {
      // dialog.showMessageBox({
      //   type: "info",
      //   title: "Sobre",
      //   message:
      //     "Data7 Manager v" +
      //     app.getVersion() +
      //     "\nIP Local: " +
      //     Global_State.local_ip +
      //     "\nEstação de Trabalho: " +
      //     Global_State.hostname +
      //     "\nUsuario Logado: " +
      //     Global_State.username_machine,
      // });
    },
  },
];

// const buildTrayMenu = (menu: any) => {
//   let lblStatusFirestore = "Desativado";
//   let iconStatusFirestore = resolve(assets_path, "red.png");
//   if (menu[2].enabled) {
//     iconStatusFirestore = resolve(assets_path, "green.png");
//     lblStatusFirestore = "Ativo";
//   }
//   const iconStatusPathFirestore = resolve(__dirname, iconStatusFirestore);
//   menu[0].label = `Firestore Status: ${lblStatusFirestore}`;
//   menu[0].icon = nativeImage
//     .createFromPath(iconStatusPathFirestore)
//     .resize({ width: 14, height: 14 });
//   const trayMenu = Menu.buildFromTemplate(menu);
//   tray.setContextMenu(trayMenu);
// };
