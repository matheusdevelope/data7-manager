import type { BrowserWindow } from "electron";
import { screen } from "electron";
import { EnumWindowsID } from "../../../../types/enums/windows";
import { createDefaultWindow } from "../handlers/ControlWindows";
import { Storage } from "../services/local_storage";

let Window: BrowserWindow;

function Create() {
  if (Window && !Window.isDestroyed()) {
    return Window;
  }
  const key_dimensions_config = "dimensions_config";
  const screenElectron = screen;
  const display = screenElectron.getPrimaryDisplay();
  const dimensions = display.workAreaSize;

  const DimensionsUSer: IDimensions = Storage.has(key_dimensions_config)
    ? (Storage.get(key_dimensions_config) as unknown as IDimensions)
    : {
        width: Math.floor(dimensions.width * 0.25),
        height: Math.floor(dimensions.height * 0.45),
      };

  const displays = screen.getAllDisplays();
  const externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0;
  });
  Window = createDefaultWindow({
    id: EnumWindowsID.panel_config,
    WindowOptions: {
      width: DimensionsUSer.width,
      height: DimensionsUSer.height,
      minWidth: 600,
      minHeight: 400,
      alwaysOnTop: import.meta.env.DEV,
      fullscreenable: false,
      frame: false,
      transparent: true,
    },
  });
  if (externalDisplay && import.meta.env.DEV) {
    Window.setBounds({
      x: externalDisplay.bounds.x + 600,
      y: externalDisplay.bounds.y + 200,
    });
  }

  Window.on("resized", () => {
    const position = Window.getBounds();
    Storage.set(key_dimensions_config, {
      width: position.width,
      height: position.height,
    });
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
  Window.moveTop();
}

export function WindowConfigurationPanel() {
  return {
    Window,
    Create,
    Focus,
  };
}
