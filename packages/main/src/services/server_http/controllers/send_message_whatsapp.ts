import type { Request, Response } from "express";
// import { basename, join } from "path";
import {
  // EnumKeysTerminalData,
  EnumKeysWhatsappIntegrated,
  EnumServices,
  // EnumTabs,
} from "../../../../../../types/enums/configTabsAndKeys";
import { GetKeyValue } from "../../local_storage";
import Whatsapp, { SendWhatsappMessage } from "../../whatsapp";

async function post(req: Request, res: Response) {
  // const TempDir = String(
  //   GetKeyValue({
  //     key: EnumKeysTerminalData.temp_files,
  //     category: EnumTabs.terminal_data,
  //   }),
  // );
  // const dir = `${TempDir}/${req.query.dir || "general"}/`;

  const Messages = req.body.messages as IMessageWhatsapp[];
  const NewMessages = Messages;
  // .map((message) => {
  //   return {
  //     ...message,
  //     file_path: message.file_path
  //       ? join(dir, basename(message.file_path))
  //       : undefined,
  //   };
  // });

  try {
    const result = await SendWhatsappMessage(req.body.phone, NewMessages);
    if (result === true) {
      res.send("Messages sent successfully");
    } else {
      res.status(400).json({
        message: "Error on sent messages",
        error: result,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Error on sent messages",
      error: error,
    });
  }
}
async function get(req: Request, res: Response) {
  const IsProviderRemote = Boolean(
    GetKeyValue({
      key: EnumKeysWhatsappIntegrated.allow_remote_service_server,
      sub_category: EnumServices.whatsapp_integrated,
    }),
  );

  if (IsProviderRemote) {
    const ret: IValuesWhatsappService = Whatsapp.values();
    return res.send(ret);
  }
  return res.status(400).send({
    message: "This Service is disabled.",
  });
}

export default { post, get };
