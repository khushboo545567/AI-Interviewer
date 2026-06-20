import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "ai-interviewer-f0378.firebaseapp.com",
  projectId: "ai-interviewer-f0378",
  storageBucket: "ai-interviewer-f0378.firebasestorage.app",
  messagingSenderId: "845808706550",
  appId: "1:845808706550:web:4f32bef652049c3d721dd7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// now enable authentication in the app
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
