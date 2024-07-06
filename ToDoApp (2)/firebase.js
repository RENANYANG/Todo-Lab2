// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDfj8UveQvbLC54ToHsUeDW1x6hJTN459A",
  authDomain: "reactive-native-12288.firebaseapp.com",
  databaseURL: "https://reactive-native-12288-default-rtdb.firebaseio.com",
  projectId: "reactive-native-12288",
  storageBucket: "reactive-native-12288.appspot.com",
  messagingSenderId: "695719222340",
  appId: "1:695719222340:web:34ffafa8429af77962f011",
  measurementId: "G-LL4L11R9C9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
