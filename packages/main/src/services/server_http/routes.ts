import type { Request, Response } from "express";
import { Router } from "express";
import UpFilesS3 from "./controllers/send_files_s3";

export default function ApiRoute() {
  const router = Router();

  router.get("/data7/", (req: Request, res: Response) => {
    res.send("Data7 Manager is Working!");
  });

  router.post("/data7/send_file_s3", UpFilesS3.post);
  router.get("/data7/send_file_s3", UpFilesS3.get);
  return router;
}
