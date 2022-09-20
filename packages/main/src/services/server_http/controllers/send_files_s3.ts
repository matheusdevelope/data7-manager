import type { Request, Response } from "express";
import { UploadAndSendToWhats } from "../../aws";
import { Help_Send_Files_S3 } from "../../aws/hepl";

async function post(req: Request, res: Response) {
  UploadAndSendToWhats(req, res);
}
async function get(req: Request, res: Response) {
  res.send(Help_Send_Files_S3);
}

export default { post, get };
