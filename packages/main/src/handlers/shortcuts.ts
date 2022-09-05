import type { BrowserWindow} from 'electron';
import { globalShortcut } from 'electron';

function RegisterShortcuts(Window?: BrowserWindow) {
  function F5() {
    globalShortcut.register('f5', () => {
      Window && Window.reload();
    });
  }
  function AltF4() {
    globalShortcut.register('Alt+F4', () => {
      console.log('Alt + F4');
      return false;
    });
  }
  function unregisterAll() {
    globalShortcut.unregisterAll();
  }
  return { F5, AltF4, unregisterAll };
}

export { RegisterShortcuts };
