import type { BrowserWindow } from "electron";
import { createDefaultWindow } from "../handlers/ControlWindows";

let Window: BrowserWindow;

function Create() {
  if (Window && !Window.isDestroyed()) {
    Focus();
    return Window;
  }
  Window = createDefaultWindow(null, {
    show: false,
    fullscreenable: false,
  });
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

  Window.loadURL(pageUrl);
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
