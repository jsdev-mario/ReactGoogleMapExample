import React, {Component} from 'react';
import {DirectionsRenderer, GoogleMap, withGoogleMap, Marker} from "react-google-maps";
const google = window.google;


const DirectionsGoogleMap = withGoogleMap(props => (
    <GoogleMap
        defaultZoom={10}
        defaultCenter={props.center}>
        {
            props.directions && 
            <DirectionsRenderer 
                directions={props.directions}
                options={{
                    suppressMarkers: true
                }}
            />
        }
        {props.markers}
    </GoogleMap>
));


class App extends Component {
	constructor(props) {
        super(props);
        this.state = {
            addresses: [
				{
					latitude: 33.833582,
					longitude: -84.649460,
				},
				{
					latitude: 33.853582,
					longitude: -84.849460,
				},
				{
					latitude: 33.813582,
					longitude: -82.649460,
				},
				{
					latitude: 34.843582,
					longitude: -84.149460,
				},
				{
					latitude: 32.836582,
					longitude: -84.849460,
				},
			],
            directions: null,
            prevAddresses: null
        };
    }

    componentDidMount() {
        this.getDirections(this.state.addresses);
    }

    getDirections(addresses){
        const DirectionsService = new google.maps.DirectionsService();
        const waypoints = [];
        addresses.forEach((element, index) => {
            if (index > 0 && index < addresses.length - 1){
                waypoints.push({
                    location: new google.maps.LatLng(Number(element.latitude), Number(element.longitude))
                })
            }
		});
		const len = this.state.addresses.length;
        DirectionsService.route({
            origin: new google.maps.LatLng(Number(addresses[0].latitude), Number(addresses[0].longitude)),
            destination: new google.maps.LatLng(Number(addresses[len-1].latitude), Number(addresses[len-1].longitude)),
            travelMode: google.maps.TravelMode.DRIVING,
            waypoints: waypoints,
        }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                this.setState({
                    directions: result,
                });
            } else {
                this.setState({
                    directions: null,
                });
            }
        });
    }

    onMarkerDragEnd(e, index){
		console.log("drag end")
		let newAddress = {...this.state.addresses[index]};
		newAddress.latitude = e.latLng.lat();
		newAddress.longitude = e.latLng.lng();
		const newAddresses = [...this.state.addresses];
		newAddresses[index] = newAddress;
		this.setState({
			addresses: newAddresses
		})
		this.getDirections(newAddresses);
    }
        
    onMarkerDragStart(e, index){
        console.log("drag start")
    }

    render() {
        
        const generalMaker = () => {
            let markers = this.state.addresses.map((element, index) => {
                if (!element.latitude || !element.longitude){
                    return ''
                }
                let label = {
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px'
                };
                if (index === 0){
                    label.text = 'S'
                }else if (index === this.state.addresses.length - 1){
                    label.text = 'E'
                }else{
                    label.text = String(index);
                }
                return <Marker
                    key={index} 
                    options={{icon: null}}
                    position={{lat: Number(element.latitude ), lng: Number(element.longitude)}} 
                    onDragEnd={(e)=>{
                        this.onMarkerDragEnd(e, index);
                    }}
                    onDragStart={(e)=>{
                        this.onMarkerDragStart(e, index);
                    }}
                    label={label}
                    labelClass="font-weight-bold"
                    draggable={ true }
                />;
            });
            return markers;
        }
        

        const center = {
            latitude: 33.833582,
            longitude: -84.649460
        }

		return (
            <DirectionsGoogleMap
                containerElement={
                    <div style={{width: "100vw", height: "100vh"}}/>
                }
                mapElement={<div style={{width: "100%", height: "100%"}}/>}
                center={new google.maps.LatLng(center.latitude, center.longitude)}
                directions={this.state.directions}
                markers = { generalMaker()}
            />
        );
    }
}

export default App;