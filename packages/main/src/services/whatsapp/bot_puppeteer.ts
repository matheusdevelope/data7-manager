import { app } from "electron";
import pie from "puppeteer-in-electron";
import type { Browser } from "puppeteer-core";
import puppeteer from "puppeteer-core";
import type { Chat} from "whatsapp-web-electron.js";
import { Client, MessageMedia } from "whatsapp-web-electron.js";
import { EventEmitter } from "./eventemitter";
import { Events } from "../../../../../types/enums/whatsapp";
import Whatsapp from ".";
import { FileToBase64, OnlyDataBase64 } from "/@/utils";
import { extname, normalize } from "path";
import { existsSync } from "fs";
let client: Client | null;
let browser: Browser;

function RegisterEvents(client: Client) {
  client.on("disconnected", (e) => {
    EventEmitter.emit(Events.disconnected, e);
  });
  client.on("qr", (qr: string) => {
    EventEmitter.emit(Events.qr, qr);
  });
  client.on("ready", () => {
    EventEmitter.emit(Events.ready);
  });
  client.on("auth_failure", (message) => {
    EventEmitter.emit(Events.auth_failure, message);
  });
  EventEmitter.listen(Events.close, () => {
    Stop();
  });
}
function Stop() {
  // browser.close();
  // browser.disconnect();
  client = null;
  // client.destroy();
}
async function SendMessage(phone: string, messages: IMessageWhatsapp[]) {
  const validation: IValidation[] = [];
  try {
    const chatId = phone + "@c.us";
    const client = await Start();
    const chat = await client.getChatById(chatId);
    for (let e = 0; e < messages.length; e++) {
      const { text, image_base64, file_path } = messages[e];
      try {
        if (text && !image_base64 && !file_path) await chat.sendMessage(text);
        if (image_base64) await SendImage(chat, image_base64, text);
        if (file_path) await SendFile(chat, file_path, text);
      } catch (error) {
        validation.push({
          message: String(error),
          index: e,
        });
      }
    }
  } catch (error) {
    validation.push({
      message: String(error),
    });
  }

  if (validation.length > 0) return Promise.reject(validation);
  return Promise.resolve();
}
async function SendImage(chat: Chat, image_base64: string, caption?: string) {
  try {
    const data = OnlyDataBase64(image_base64);
    const media = new MessageMedia("image/png", data);
    if (caption?.trim())
      return Promise.resolve(
        await chat.sendMessage(media, { caption: caption }),
      );
    return Promise.resolve(await chat.sendMessage(media));
  } catch (error) {
    Promise.reject(error);
  }
}
async function SendFile(chat: Chat, path: string, caption?: string) {
  try {
    const path_nomalized = normalize(path);
    if (!existsSync(path_nomalized))
      return Promise.reject(`The provided path doesn't exists [${path}]`);
    const Extension_File = extname(path_nomalized)
      .replaceAll(".", "")
      .toLowerCase();
    if (["png", "jpg", "jpeg"].includes(Extension_File)) {
      const Image = FileToBase64(path_nomalized);
      return SendImage(chat, Image, caption);
    }
    const media = MessageMedia.fromFilePath(path_nomalized);
    if (caption?.trim()) {
      const message = await chat.sendMessage(media);
      return Promise.resolve(await message.reply(caption));
    }
    return Promise.resolve(await chat.sendMessage(media));
  } catch (error) {
    return Promise.reject(error);
  }
}
async function Start() {
  try {
    if (!client) {
      browser = await pie.connect(app, puppeteer);
      const window = Whatsapp.CreateOrRestoreWindowWhats();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      client = new Client(browser, window);
      RegisterEvents(client);
      client.initialize();
      EventEmitter.emit(Events.initialized);
      return Promise.resolve(client);
    }
    return Promise.resolve(client);
  } catch (error) {
    EventEmitter.emit(Events.error, error);
    return Promise.reject(error);
  }
}
const BotPuppeteer = {
  Start,
  Stop,
  SendMessage,
};
export default BotPuppeteer;
