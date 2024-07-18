import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from 'firebase/analytics';


const firebaseConfig = {
  apiKey: "AIzaSyDrOYoAk_aqTUaSkwCltuplLZ2B1oCkZCY",
  authDomain: "snapshare-fb222.firebaseapp.com",
  projectId: "snapshare-fb222",
  storageBucket: "snapshare-fb222.appspot.com",
  messagingSenderId: "497554392951",
  appId: "1:497554392951:web:b989a0ca4f52f822334372",
  measurementId: "G-VPGB3ZDRNH"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()
export const analytics = getAnalytics();