import React from 'react'
import './App.css';
import GoogleMapReact from 'google-map-react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import fileDownload from 'js-file-download';
import haversine from 'haversine';

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

function TruckLocation(props) {
  // console.log(props)
  const width = 20;
  const height = 20;
  const truckStyle = {
    position: 'absolute',
    width,
    height,
    left: -width / 2,
    top: -height / 2,

    border: '2.5px solid #f44336',
    backgroundColor: 'white',
    textAlign: 'center',
    color: '#3f51b5',
    fontSize: 8,
    fontWeight: 'bold',
    padding: 4
  }
  return (<div style={truckStyle}>{props.text}</div>);
}

function MapComponent() {
  const props = {
    center: {lat: 38.0006322, lng: -121.2894793}, 
    zoom: 10
  }

  const locationsRef = firestore.collection('truck_locations');
  const [locations] = useCollectionData(locationsRef);
  console.log(locations)

  const generateCSV = () => {
    if (locations && locations.length > 0) {
      const nearbyTrucks = locations.filter(loc => {
        const start = {
          latitude: props.center.lat,
          longitude: props.center.lng
        }
        const end = {
          latitude: loc.location[0],
          longitude: loc.location[1]
        }
        return (haversine(start, end, {unit: 'meter'}) <= 200 * 1000)
      })
      const truckLines = nearbyTrucks.map(loc => [`"${loc.id}"`, `"${loc.name}"`, `"${loc.location[0]}"`, `"${loc.location[1]}"`])
      const headerLine = ['ID,Name,Lattitude,Longitude']
      const lines = [headerLine, ...truckLines].join('\r\n')
      fileDownload(lines, 'nearby_trucks.csv')
    }
  }
  
  return (
    <div style={{ height: '95vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyDYSiy0JBx9SqSsahYAe3wDecvX2JYaOyo' }}
        defaultCenter={props.center}
        defaultZoom={props.zoom} >
          {locations && locations.map(loc => {
            return <TruckLocation key={loc.id} lat={loc.location[0]} lng={loc.location[1]} text={loc.name} />
          })}
        </GoogleMapReact>
        <button onClick={generateCSV}>Download CSV of nearby trucks</button>
    </div>
    )
}

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      {user ? <MapComponent /> : <SignIn />}
    </div>
  );
}

export default App;
