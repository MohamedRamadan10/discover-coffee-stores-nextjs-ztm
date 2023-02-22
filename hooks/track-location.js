import { useContext, useState } from "react";
import { ACTION_TYPES, StoreContext } from "../context/store-context";

function useTrackLocation() {
	const [locationErrorMsg, setLocationErrorMsg] = useState("");
	const [isFindingLocation, setIsFindingLocation] = useState(false);
	const { dispatch } = useContext(StoreContext);

	const success = (position) => {
		const latitude = position.coords.latitude;
		const longitude = position.coords.longitude;

		dispatch({
			type: ACTION_TYPES.SET_LAT_LONG,
			payload: { latLong: `${latitude},${longitude}` },
		});
		setLocationErrorMsg("");
		setIsFindingLocation(false);
	};

	const error = () => {
		setIsFindingLocation(false);
		setLocationErrorMsg("Unable to retrieve your location");
	};

	const handleTrackLocation = () => {
		setIsFindingLocation(true);
		if (!navigator.geolocation) {
			setIsFindingLocation(false);
			setLocationErrorMsg("Geolocation is not supported by your browser");
		} else {
			navigator.geolocation.getCurrentPosition(success, error);
		}
	};

	return {
		locationErrorMsg,
		handleTrackLocation,
		isFindingLocation,
	};
}

export default useTrackLocation;
