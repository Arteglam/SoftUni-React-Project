import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { environment } from '../environments/environment.development';

export const app = initializeApp(environment.firebase);
export const db = getFirestore(app);
export const storage = getStorage(app);