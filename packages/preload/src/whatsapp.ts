import { ipcRenderer } from "electron";
import { EnumIpcEvents } from "../../../types/enums/GlobalState";

function ResetLocalStorageWhats() {
  ipcRenderer.send(EnumIpcEvents.reset_localstorage_whatsapp);
}
async function GetStatusWhatsapp() {
  const value = ipcRenderer.invoke(EnumIpcEvents.get_status_whatsapp);
  return value;
}
async function ListenerWhatsappBot(cb: (logged: boolean) => void) {
  ipcRenderer.on(
    EnumIpcEvents.listener_whatsapp_bot,
    async (_, logged: boolean) => {
      return cb(logged);
    },
  );
}

export { GetStatusWhatsapp, ResetLocalStorageWhats, ListenerWhatsappBot };
