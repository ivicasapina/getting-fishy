import Rebase from 're-base';
import firebase from 'firebase';

const app = firebase.initializeApp({
  apiKey: "AIzaSyBfPGrxCiykVL7ncXxBVoaDCPauBXAI2as",
  authDomain: "moke-catch-of-the-day.firebaseapp.com",
  databaseURL: "https://moke-catch-of-the-day.firebaseio.com",
  projectId: "moke-catch-of-the-day",
  storageBucket: "moke-catch-of-the-day.appspot.com",
  messagingSenderId: "529658631115"
});

const base = Rebase.createClass(app.database());

export default base;