// // Import the functions you need from the SDKs you need

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFRq5REdAre0hdEf5wnVD-IYZFJzhbNe8",
  authDomain: "cloudmanagementsyr.firebaseapp.com",
  projectId: "cloudmanagementsyr",
  storageBucket: "cloudmanagementsyr.appspot.com",
  messagingSenderId: "929668148093",
  appId: "1:929668148093:web:abfc7fdb2ba374f3007a14",
  measurementId: "G-DWP5H3Z9YC"
};

firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
export {auth , firebase};

// export default firebaseConfig;