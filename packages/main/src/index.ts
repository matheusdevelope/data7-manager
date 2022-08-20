import { app } from 'electron';
import { Global_State } from './global_state';
import { RegisterShortcuts } from './handlers/shortcuts';
import './security-restrictions';
import { InitializeInterface } from './InitializeInteface';
import { HandleDeepLinkProtocoll } from './handlers/deeplink_protocoll';

// Prevent electron from running multiple instances.
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on('second-instance', (event, commandLine, workingDirectory) => {
  return HandleDeepLinkProtocoll(event, commandLine, workingDirectory);
});

app.setLoginItemSettings({
  openAtLogin: true,
});
// Disable Hardware Acceleration to save more system resources.
app.disableHardwareAcceleration();

// Shout down background process if all windows was closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // app.quit();
  }
});

app.on('activate', InitializeInterface);

app.on('will-quit', () => {
  RegisterShortcuts().unregisterAll();
});

// Create the application window when the background process is ready.
app
  .whenReady()
  .then(InitializeInterface)
  .catch((e) => console.error('Failed create window:', e));

// Check for new version of the application - production mode only.
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import('electron-updater'))
    .then(({ autoUpdater }) => {
      // IF enable pre release the update in the same day don't work.
      autoUpdater.allowPrerelease = false;
      autoUpdater.checkForUpdatesAndNotify({
        title: Global_State.name_app,
        body: Global_State.notification_update,
      });
    })
    .catch((e) => console.error('Failed check updates:', e));
}
