import * as admin from 'firebase-admin';
import * as path from 'path';

const serviceAccount = require(path.join(process.cwd(), 'promotoria-58026-firebase-adminsdk-fbsvc-02192bb420.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const messaging = admin.messaging();
export default admin;