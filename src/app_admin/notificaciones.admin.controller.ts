import { Request, Response } from 'express';
import { send_notification_token, send_notification_tokens, send_notification_topic } from '../core/notifications';

export const enviar_notificacion_token = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, title, body, imageUrl, data } = req.body;
    if (!token || !title || !body) {
      res.status(400).json({ message: 'token, title y body son requeridos' });
      return;
    }
    const result = await send_notification_token(token, { title, body, imageUrl, data });
    res.json({ message: 'Notificación enviada', id: result });
  } catch (error: any) {
    console.error('Error enviar_notificacion_token', error);
    res.status(500).json({ message: 'Error al enviar notificación', error: error.message });
  }
};

export const enviar_notificacion_tokens = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tokens, title, body, imageUrl, data } = req.body;
    if (!Array.isArray(tokens) || tokens.length === 0 || !title || !body) {
      res.status(400).json({ message: 'tokens (array), title y body son requeridos' });
      return;
    }
    const result = await send_notification_tokens(tokens, { title, body, imageUrl, data });
    res.json({ message: 'Notificaciones enviadas', result });
  } catch (error: any) {
    console.error('Error enviar_notificacion_tokens', error);
    res.status(500).json({ message: 'Error al enviar notificaciones', error: error.message });
  }
};

export const enviar_notificacion_topic = async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic, title, body, imageUrl, data } = req.body;
    if (!topic || !title || !body) {
      res.status(400).json({ message: 'topic, title y body son requeridos' });
      return;
    }
    const result = await send_notification_topic(topic, { title, body, imageUrl, data });
    res.json({ message: 'Notificación enviada a topic', id: result });
  } catch (error: any) {
    console.error('Error enviar_notificacion_topic', error);
    res.status(500).json({ message: 'Error al enviar notificación a topic', error: error.message });
  }
};
