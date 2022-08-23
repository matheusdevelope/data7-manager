import type { BrowserWindow} from "electron";
import { screen } from "electron";
import { createDefaultWindow } from "../handlers/ControlWindows";

let Window: BrowserWindow;

function Create() {
  if (Window && !Window.isDestroyed()) {
    Focus();
    return Window;
  }
  const displays = screen.getAllDisplays();
  const externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0;
  });
  Window = createDefaultWindow(null, {
    show: false,
    alwaysOnTop: import.meta.env.DEV,
    fullscreenable: false,
    frame: false,
    transparent: true,
  });
  if (externalDisplay) {
    Window.setBounds({
      x: externalDisplay.bounds.x + 800,
      y: externalDisplay.bounds.y + 200,
    });
  }
  Window.on("ready-to-show", () => {
    Focus();
  });

  const pageUrl =
    import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_DEV_SERVER_URL
      : new URL(
          "../renderer/dist/index.html",
          "file://" + __dirname,
        ).toString();

  Window.loadURL(pageUrl + "#/home");
  return Window;
}
function Focus() {
  Window.show();
  Window.focus();
}

export function WindowConfigurationPanel() {
  return {
    Window,
    Create,
    Focus,
  };
}
