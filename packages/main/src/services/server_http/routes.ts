import type { Request, Response } from "express";
import { Router } from "express";
import Upfile from "./controllers/upfile";
import UpFilesS3 from "./controllers/send_files_s3";
import SendMessageWhatsapp from "./controllers/send_message_whatsapp";
import multer from "multer";
import { existsSync, mkdirSync } from "fs";
import {
  EnumKeysTerminalData,
  EnumTabs,
} from "../../../../../types/enums/configTabsAndKeys";
import { GetKeyValue } from "../local_storage";
const multer_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const TempDir = String(
      GetKeyValue({
        key: EnumKeysTerminalData.temp_files,
        category: EnumTabs.terminal_data,
      }),
    );
    const dir = `${TempDir}/${req.query.dir || "general"}/`;
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: multer_storage });

export default function ApiRoute() {
  const router = Router();

  router.get("/data7/", (req: Request, res: Response) => {
    res.send("Data7 Manager is Working!");
  });
  router.post("/data7/", (req: Request, res: Response) => {
    console.log(req.body);
    console.log(req.params);
    res.send("Data7 POST Manager is Working!");
  });
  router.post("/data7/upfile", upload.array("files"), Upfile.post);

  router.post("/data7/send_file_s3", UpFilesS3.post);
  router.get("/data7/send_file_s3", UpFilesS3.get);

  router.post("/data7/send_message_whatsapp", SendMessageWhatsapp.post);
  router.get("/data7/send_message_whatsapp", SendMessageWhatsapp.get);
  return router;
}
