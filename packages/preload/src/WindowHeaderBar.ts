import { ipcRenderer } from "electron";

export function MoveWindow(bounds: IBounds) {
  ipcRenderer.send("move-window", bounds);
}
export function MinimizeWindow() {
  ipcRenderer.send("minimize-window");
}
export function CloseWindow() {
  ipcRenderer.send("close-window");
}
