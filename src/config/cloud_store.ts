import {Storage} from "@google-cloud/storage"
import dotenv from 'dotenv'

dotenv.config();

export const storage = new Storage();

export const bucket = storage.bucket(process.env.BUCKET_NAME || "retailink");