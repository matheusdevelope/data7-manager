import type { Request, Response } from "express";
import { readdirSync, existsSync } from "fs";
import { join, normalize } from "path";
import {
  EnumKeysSendFilesWhats,
  EnumServices,
} from "../../../../../types/enums/configTabsAndKeys";
import { GetConfigTabs, GetService } from "../local_storage";
import { SendWhatsappMessage } from "../whatsapp";
import { error, Convert_UTF16_To_Emoji } from "./s3/utils";
import { OnlyNumbersString } from "/@/utils";

interface IFileExtra {
  name: string;
  pretty_name: string;
  description_name: string;
  description_after_link: string;
}

function ValidateRequisition(body: { [key: string]: string | IComumObject[] }) {
  const errors: {
    [key: string]:
      | string
      | { [key: string]: string | number | boolean | IComumObject };
  }[] = [];

  function CheckFiles() {
    if (!body.files) return;
    if (body.files.length < 1)
      errors.push({
        propriedade: "files",
        message:
          "Você precisa enviar um array contendo os dados dos arquivos, o array enviado está vazio.",
      });
    CheckName();
  }
  function CheckName() {
    if (!body.files) return;
    Array.isArray(body.files) &&
      body.files.forEach((element) => {
        if (!element.name)
          errors.push({
            propriedade: "files[i].name",
            message: "Você precisa enviar o nome do arquivo",
            expected: {
              name: "nome-arquivo.png",
            },
            received: element,
          });
        if (element.name && String(element.name).split(".").length < 2)
          errors.push({
            propriedade: "files[i].name",
            message:
              "Você precisa enviar o nome do arquivo com a extensão (.ext)",
            received: element,
          });
      });
  }
  CheckFiles();
  if (!body.phone)
    errors.push({
      message: "Phone to send to whatsapp not provided",
      fix: "send a propertie [phone:'66999999999'].",
    });

  if (!body.requester)
    errors.push({
      message:
        "Requester not provided, you need send that information to use this API",
      fix: "send a propertie [requester:'your_name'] with your info",
    });

  return {
    message: "Invalid request body, errors: ",
    erros: errors,
    body_received: body,
  };
}
function ConvertToMessage(
  Messages: IMessageWhatsapp[],
  Dir_Path: string,
  Files_Dir: string[],
  ExtraDataFiles: IFileExtra[],
) {
  Files_Dir.forEach((file_name_dir) => {
    const ExtraData = ExtraDataFiles.find(
      (file) => file.name === file_name_dir,
    );
    if (ExtraData) {
      Messages.push({
        text: Convert_UTF16_To_Emoji(ExtraData.description_name).trim(),
        file_path: join(normalize(Dir_Path), ExtraData.name),
        name_file: ExtraData.pretty_name,
      });
    } else {
      Messages.push({
        file_path: join(normalize(Dir_Path), file_name_dir),
      });
    }
  });

  return Messages;
}

export async function UploadAndSendToWhats(req: Request, res: Response) {
  let retorno = {
    message:
      "Humm... não houveram erros de validação porém nenhum resultado foi retornado. Acho que deu ruim",
    data: {},
    exceptions: "none",
    requester: "",
  };

  const path_files =
    req.body.path_files ||
    String(
      GetConfigTabs().find(
        (obj) =>
          obj.sub_category === EnumServices.whatsapp_send_files &&
          obj.key === EnumKeysSendFilesWhats.path_files,
      )?.value,
    ) ||
    "";

  try {
    const ServiceActivated = GetService(
      EnumServices.whatsapp_send_files,
    )?.value;
    if (ServiceActivated !== true) {
      return await error({
        message: "The requested service is disabled.",
      });
    }
    const body = req.body as unknown as { [key: string]: string };
    const Validation = ValidateRequisition(body);
    if (Validation.erros.length > 0) return res.status(400).send(Validation);
    if (!path_files)
      return await error({
        message:
          "You need to provide a valid path of files in the request body (path_files:'C:\\yout_path') or in the configuration of the service.",
      });
    if (!existsSync(normalize(path_files)))
      return await error({
        message: "The informed path does not exist or could not be accessed.",
      });

    const List_Dir = readdirSync(normalize(path_files), {
      withFileTypes: true,
    });
    const Files_Dir = List_Dir.filter((obj) => obj.isFile()).map(
      (file) => file.name,
    );

    const ExtraDataFiles = (req.body.files as IFileExtra[]) || [];

    if (!Files_Dir || Files_Dir.length <= 0)
      return await error({
        message: "The informed path returns a empty list os files.",
      });

    const Messages: IMessageWhatsapp[] = [];
    const HeaderMessage = req.body.header_message;
    if (HeaderMessage && String(HeaderMessage).trim())
      Messages.push({
        text: Convert_UTF16_To_Emoji(HeaderMessage).trim(),
      });
    const MessagesWithFiles = ConvertToMessage(
      Messages,
      path_files,
      Files_Dir,
      ExtraDataFiles,
    );
    const FooterMessage = req.body.footer_message;
    if (FooterMessage && String(FooterMessage).trim())
      MessagesWithFiles.push({
        text: Convert_UTF16_To_Emoji(FooterMessage).trim(),
      });
    const ret = await SendWhatsappMessage(
      OnlyNumbersString(req.body.phone),
      MessagesWithFiles,
    );

    retorno = {
      message: ret === true ? "Success!" : "Falha no envio",
      data: ret,
      exceptions: "none",
      requester: req.body.requester,
    };
  } catch (e) {
    return res.status(400).send(e);
  }

  return res.send(retorno);
}
