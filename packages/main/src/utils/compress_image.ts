import { readFile } from "fs/promises";
import sharp from "sharp";
import { OnlyDataBase64 } from ".";

async function fromPath(path: string) {
  return await sharp(await readFile(path))
    .resize(1920, null, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .toFormat("png")
    .toBuffer();
}
async function fromBase64(data_base64: string) {
  return await sharp(Buffer.from(OnlyDataBase64(data_base64), "base64"))
    .resize(1920, null, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .toFormat("png")
    .toBuffer();
}
async function fromBuffer(buffer: Buffer) {
  return await sharp(buffer)
    .resize(1920, null, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .toFormat("png")
    .toBuffer();
}

const CompressImage = {
  fromPath,
  fromBase64,
  fromBuffer,
};

export default CompressImage;
