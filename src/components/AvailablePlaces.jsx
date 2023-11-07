import { useEffect, useState } from 'react';
import { fetchAvailablePlaces } from '../http.js';
import { sortPlacesByDistance } from '../loc.js';
import Error from './Error.jsx';
import Places from './Places.jsx';

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState(null);
  // useEffect(()=>{
  //   fetch('http://localhost:3000/places')
  //   .then(res=>res.json())
  //   .then(data=>setAvailablePlaces(data.places));
  // },[])
  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        const places = await fetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition(position => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude
          );
          // setAvailablePlaces(resData.places);
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
        // setAvailablePlaces(resData.places);
      } catch (error) {
        setError({
          message:
            error.message || 'Could not fetch places, please try again later!'
        });
        setIsFetching(false);
      }

      // setIsFetching(false);
    }
    fetchPlaces();
  }, []);

  if (error)
    return <Error title="An Error Occurred!" message={error.message} />;

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText={'Data loading...'}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
