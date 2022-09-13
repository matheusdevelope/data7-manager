import type { Request, Response } from "express";
// function BadRequest(res: Response, message: string) {
//   return res.status(400).send(message);
// }
async function get(req: Request, res: Response) {
  res.send("Files to S3 GET");
}

async function post(req: Request, res: Response) {
  const qrcode = req.body;
  res.send({ message: "Files to S3 POST", data: qrcode });
}

async function put(req: Request, res: Response) {
  res.send("Files to S3 PUT");
}

async function deleteFile(req: Request, res: Response) {
  res.send("Files to S3 DELETE");
}
export default { get, post, put, deleteFile };
