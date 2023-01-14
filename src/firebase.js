import { initializeApp} from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  // apiKey: "AIzaSyDFBFI9g-zwoJ5TfBKUHUtGPNXvgcR7WLY",
  // authDomain: "banking-app-646be.firebaseapp.com",
  // projectId: "banking-app-646be",
  // storageBucket: "banking-app-646be.appspot.com",
  // messagingSenderId: "836641792066",
  // appId: "1:836641792066:web:0ec1e7609d8014154b4ddb",

  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);

