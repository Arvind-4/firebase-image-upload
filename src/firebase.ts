import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

import { env } from "./env";

const firebaseConfig = {
  apiKey: env.VITE_API_KEY,
  authDomain: env.VITE_AUTH_DOMAIN,
  projectId: env.VITE_PROJECT_ID,
  storageBucket: env.VITE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_MESSAGING_SENDER_ID,
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
