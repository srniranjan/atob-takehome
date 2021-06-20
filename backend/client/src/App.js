import './App.css';
import GoogleMapReact from 'google-map-react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyD4F5OZb1NTtkY422pe58CpQFd5wlgIFZU",
  authDomain: "atob-takehome.firebaseapp.com",
  projectId: "atob-takehome",
  storageBucket: "atob-takehome.appspot.com",
  messagingSenderId: "117907608442",
  appId: "1:117907608442:web:06630c7df7f1af5725bcc3"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function App() {
  const props = {
      center: {lat: 40.73, lng: -73.93}, 
      zoom: 12
  }

  const [user] = useAuthState(auth);

  return (
    <div className="App" style={{ height: '100vh', width: '100%' }}>
      {user ? <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyDYSiy0JBx9SqSsahYAe3wDecvX2JYaOyo' }}
        defaultCenter={props.center}
        defaultZoom={props.zoom}
        onGoogleApiLoaded={({map, maps}) => {let marker = new maps.Marker({
          position: { lat: 40.73, lng: -73.93 },
          map,
          title: 'Hello World!'
          });
          return marker;
         }}
        yesIWantToUseGoogleMapApiInternals
      /> : <SignIn />}
    </div>
  );
}

export default App;
