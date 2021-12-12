import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB0YnK75RprIth7SLgJgFu5ZR5zvXQDhKc',
  authDomain: 'traship-2270e.firebaseapp.com',
  projectId: 'traship-2270e',
  storageBucket: 'traship-2270e.appspot.com',
  messagingSenderId: '249145623553',
  appId: '1:249145623553:web:183a0ececae21c8f7dec00',
};

export const db = getFirestore(firebaseApp);
export default app = initializeApp(firebaseConfig);
