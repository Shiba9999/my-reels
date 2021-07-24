import firebase from "firebase"
import 'firebase/auth';
import 'firebase/firestore';
import "firebase/storage";
var firebaseConfig = {
    apiKey: "AIzaSyBFmBvppksVg8AbsczS8X3AjOqLLtQT5DI",
    authDomain: "my-reel.firebaseapp.com",
    projectId: "my-reel",
    storageBucket: "my-reel.appspot.com",
    messagingSenderId: "540682759909",
    appId: "1:540682759909:web:7dd9da0ce1c2f62607ae0c",
    measurementId: "G-ZBXEQ8VF1X"
  };
  const firebaseApp=firebase.initializeApp(firebaseConfig);
  export const db=firebase.firestore();
  
  export const database = {
    users: db.collection("users"),
    posts:db.collection("posts"),
    getUserTimeStamp: firebase.firestore.FieldValue.serverTimestamp
}

  export const auth=firebase.auth();
  export const storage = firebase.storage();
  export default auth;

