import {Storage} from "@google-cloud/storage"
import dotenv from 'dotenv'

dotenv.config();

export const storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

export const bucket = storage.bucket(process.env.BUCKET_NAME || "retailink");