import { config, S3 } from "aws-sdk";
import { createReadStream } from "fs";
import { lookup } from "mime-types";
import { GenererateNameFileUnique } from "./utils";
const CRETENTIALS = require("./certificates/aws.json");

const BUCKET = CRETENTIALS.bucket;
config.update(CRETENTIALS);
const ServerS3 = new S3();

export default function ServiceS3() {
  async function create(
    path_local: string,
    expires = 30,
    pretty_name_file?: string,
  ) {
    try {
      const fileStream = createReadStream(path_local);
      const type = lookup(path_local);
      const uploadParams = {
        Bucket: BUCKET,
        Key: GenererateNameFileUnique(
          pretty_name_file || path_local,
          5,
          expires,
        ),
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
