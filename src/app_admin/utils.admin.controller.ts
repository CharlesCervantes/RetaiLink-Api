import { Request, Response } from 'express';
import { bucket } from '../config/cloud_store';

export const upload_file = async(req: Request, res: Response) => {
    try {
        const { fileName, fileType } = req.body;

        const uniqueFileName = `images/${Date.now()}-${fileName}`;

        // URL firmada SOLO para subida (temporal)
        const [signedUrl] = await bucket
        .file(uniqueFileName)
        .getSignedUrl({
            version: 'v4',
            action: 'write',
            expires: Date.now() + 15 * 60 * 1000, // 15 minutos
            contentType: fileType,
        });

        // URL pública PERMANENTE para lectura
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFileName}`;

        res.json({
            signedUrl,        // Para subir (temporal)
            publicUrl,        // Para leer (permanente)
            fileName: uniqueFileName,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generando URLs' });
    }
}