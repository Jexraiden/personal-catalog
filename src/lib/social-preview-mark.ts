import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

export async function getSocialPreviewMarkDataUrl(assetPath: string) {
  const markPath = join(process.cwd(), "public", assetPath.replace(/^\//, ""));
  const markSvg = await readFile(markPath);
  const markWebp = await sharp(markSvg)
    .resize(300, 300, { fit: "contain" })
    .webp({ quality: 80 })
    .toBuffer();

  return `data:image/webp;base64,${markWebp.toString("base64")}`;
}
