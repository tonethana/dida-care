


import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyArjWo5Zn0rn15T9fC4k6lClqItrtMete0",
    authDomain: "did-care.firebaseapp.com",
    projectId: "did-care",
    storageBucket: "did-care.appspot.com",
    messagingSenderId: "5630868304",
    appId: "1:5630868304:web:334382c4dc74a94c7aca55",
    measurementId: "G-LXWZFTG96L"
  };
  const firebaseApp=firebase.initializeApp(firebaseConfig);
  const db=firebase.firestore();
  
export default db;
