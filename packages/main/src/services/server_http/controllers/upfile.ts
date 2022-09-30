import type { Request, Response } from "express";

async function post(req: Request, res: Response) {
  if (req.files?.length || 0 > 0)
    return res.send({ message: "Successfully uploaded files" });
  return res.status(400).send({ message: "Files not sent or not created" });
}

export default { post };
