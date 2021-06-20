import './App.css';
import GoogleMapReact from 'google-map-react';

function App() {
  const props = {
      center: {lat: 40.73, lng: -73.93}, 
      zoom: 12
  }

  const AnyReactComponent = ({ text }) => <div>{text}</div>

  return (
    <div className="App" style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
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
      />
    </div>
  );
}

export default App;
