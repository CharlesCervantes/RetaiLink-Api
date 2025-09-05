import Queue from 'bull';
import { NotificationService, NotificationData } from '../services/notification.service';

export interface NotificationJob {
  fcmToken: string;
  notification: NotificationData;
  type: 'single' | 'multicast';
  fcmTokens?: string[];
}

const notificationQueue = new Queue('notification processing', {
  redis: {
    port: 40522,
    host: 'shinkansen.proxy.rlwy.net',
    password: 'IakPNoYpRDIFyvZlKTXSRSocmCLiKecx',
  },
  settings: {
    retryProcessDelay: 5000,
  },
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

notificationQueue.process('send-notification', async (job) => {
  const { fcmToken, notification, type, fcmTokens }: NotificationJob = job.data;
  
  try {
    console.log(`Processing notification job: ${job.id}`);
    
    if (type === 'multicast' && fcmTokens) {
      await NotificationService.sendMulticastNotification(fcmTokens, notification);
    } else {
      await NotificationService.sendPushNotification(fcmToken, notification);
    }
    
    console.log(`Notification sent successfully for job: ${job.id}`);
    return { success: true };
  } catch (error) {
    console.error(`Failed to send notification for job ${job.id}:`, error);
    throw error;
  }
});

notificationQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed with result:`, result);
});

notificationQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

export const addNotificationJob = async (jobData: NotificationJob) => {
  try {
    const job = await notificationQueue.add('send-notification', jobData, {
      delay: 1000, // Delay de 1 segundo antes de procesar
    });
    
    console.log(`Added notification job: ${job.id}`);
    return job;
  } catch (error) {
    console.error('Error adding notification job:', error);
    throw error;
  }
};

export { notificationQueue };