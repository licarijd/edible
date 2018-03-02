import firebase from 'firebase'
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCzBxq91PAzwTX_kxs0edUKsgK1Fbl-rQw",
    authDomain: "edible-c1cc0.firebaseapp.com",
    databaseURL: "https://edible-c1cc0.firebaseio.com",
    projectId: "edible-c1cc0",
    storageBucket: "edible-c1cc0.appspot.com",
    messagingSenderId: "156364250639"
  };
var fire = firebase.initializeApp(config);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default fire;