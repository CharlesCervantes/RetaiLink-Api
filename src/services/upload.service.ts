import { Storage } from "@google-cloud/storage";
import sharp from "sharp";


const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEY_FILE,
});

const bucket = storage.bucket(process.env.GCP_BUCKET_NAME!);

export class UploadService {

    static async uploadProductImage(
    id_client: number,
    id_product: number,
    fileBuffer: Buffer
  ): Promise<string> {
    
    // Optimizar imagen
    const optimizedBuffer = await sharp(fileBuffer)
      .webp({ quality: 80 })
      .resize(800, 800, { fit: "inside", withoutEnlargement: true })
      .toBuffer();

    const path = `clients/${id_client}/products/${id_product}/main.webp`;
    const file = bucket.file(path);

    await file.save(optimizedBuffer, {
      metadata: {
        contentType: "image/webp",
        cacheControl: "public, max-age=31536000",
      },
    });

    return `https://storage.googleapis.com/${process.env.GCP_BUCKET_NAME}/${path}`;
  }

  static async deleteProductImage(id_client: number, id_product: number): Promise<void> {
    const path = `clients/${id_client}/products/${id_product}/main.webp`;
    
    try {
      await bucket.file(path).delete();
    } catch (error) {
      console.log("Imagen no encontrada o ya eliminada");
    }
  }
}