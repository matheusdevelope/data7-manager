import { config, S3 } from "aws-sdk";
import { createReadStream } from "fs";
import { lookup } from "mime-types";
const CRETENTIALS = require("./certificates/aws.json");

const BUCKET = CRETENTIALS.bucket;
config.update(CRETENTIALS);
const ServerS3 = new S3();

export default function ServiceS3() {
  async function create(path_local: string, key: string, expires: number) {
    try {
      const fileStream = createReadStream(path_local);
      const type = lookup(path_local);
      const uploadParams = {
        Bucket: BUCKET,
        Key: key,
        Body: fileStream,
        ACL: "public-read",
        Tagging: "expires=" + expires,
        ContentType: type || "application/pdf",
      };
      const RetornoS3 = await ServerS3.upload(uploadParams).promise();
      return Promise.resolve(RetornoS3);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  return {
    create,
  };
}
