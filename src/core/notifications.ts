import { FirebaseNotificationProvider, FCMNotificationPayload } from './providers';

export const send_notification_token = async (token: string, payload: FCMNotificationPayload) => {
  return FirebaseNotificationProvider.sendToToken(token, payload);
};

export const send_notification_tokens = async (tokens: string[], payload: FCMNotificationPayload) => {
  return FirebaseNotificationProvider.sendToTokens(tokens, payload);
};

export const send_notification_topic = async (topic: string, payload: FCMNotificationPayload) => {
  return FirebaseNotificationProvider.sendToTopic(topic, payload);
};
