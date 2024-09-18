import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDLJEo0xve44lMFx7h4LiUsOdpcDe9Kylg",
  authDomain: "streamchat-7dece.firebaseapp.com",
  databaseURL: "https://streamchat-7dece-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "streamchat-7dece",
  storageBucket: "streamchat-7dece.appspot.com",
  messagingSenderId: "596141013566",
  appId: "1:596141013566:android:2c7abd997d4eec0b8b2f6f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
