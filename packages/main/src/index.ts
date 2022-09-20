import { app } from "electron";
import { Global_State } from "./global_state";
import { RegisterShortcuts } from "./handlers/shortcuts";
import "./security-restrictions";
import { InitializeInterface } from "./InitializeInteface";
import {
  HandleDeepLinkProtocoll,
  RegisterDeepLink,
} from "./handlers/deeplink_protocoll";
import { GetConfigTabs } from "./services/local_storage";
import {
  EnumKeysTerminalData,
  EnumTabs,
} from "../../../types/enums/configTabsAndKeys";

// Prevent electron from running multiple instances.
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    return HandleDeepLinkProtocoll(event, commandLine, workingDirectory);
  });
}
const StartInBoot = Boolean(
  GetConfigTabs().find(
    (obj) =>
      obj.category === EnumTabs.terminal_data &&
      obj.key === EnumKeysTerminalData.start_in_boot,
  )?.value,
);

app.setLoginItemSettings({
  openAtLogin: StartInBoot,
});
RegisterDeepLink(app);
// Disable Hardware Acceleration to save more system resources.
app.disableHardwareAcceleration();

//Don´t Shout down background process if all windows was closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    // app.quit();
  }
});

app.on("activate", InitializeInterface);

app.on("will-quit", () => {
  RegisterShortcuts().unregisterAll();
});

// Create the application window when the background process is ready.
app
  .whenReady()
  .then(InitializeInterface)
  .catch((e) => console.error("Failed create window:", e));

// Check for new version of the application - production mode only.
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import("electron-updater"))
    .then(({ autoUpdater }) => {
      // IF enable pre release the update in the same day don't work.
      autoUpdater.allowPrerelease = false;
      autoUpdater.checkForUpdatesAndNotify({
        title: Global_State.name_app,
        body: Global_State.notification_update,
      });
    })
    .catch((e) => console.error("Failed check updates:", e));
}
