import {Storage} from "@google-cloud/storage"

export const storage = new Storage({
    projectId: 'tu-project-id',
    keyFilename: 'path/to/service-account-key.json',
});

export const bucket = storage.bucket("retailink");