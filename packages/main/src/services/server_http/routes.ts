import type { Request, Response } from "express";
import { Router } from "express";
import UpFilesS3 from "./controllers/send_files_s3";

export default function ApiRoute() {
  const router = Router();

  router.get("/", (req: Request, res: Response) => {
    res.send("Data7 Manager is Working!");
  });

  router.get("/qrcode", UpFilesS3.get);
  router.post("/qrcode", UpFilesS3.post);
  router.put("/qrcode", UpFilesS3.put);
  router.delete("/qrcode", UpFilesS3.deleteFile);
  return router;
}
