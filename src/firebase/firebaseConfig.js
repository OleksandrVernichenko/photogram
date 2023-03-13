import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDUq3lsK010tyfli45Y6WvYLwx4Tqs0izQ",
  authDomain: "photogram-182.firebaseapp.com",
  projectId: "photogram-182",
  storageBucket: "photogram-182.appspot.com",
  messagingSenderId: "706637791503",
  appId: "1:706637791503:web:58c669bcf2d8f4ab5f3e7a",
  measurementId: "G-191NNV686R",
  storageBucket: "gs://photogram-182.appspot.com",
};

export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const storage = getStorage(app);
