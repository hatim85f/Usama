import {
  FETCH_BOOKING_LOCATION,
  FETCH_BOOKING_LOCATION_SUCCESS,
  FETCH_BOOKING_LOCATION_FAILED,
  STOP_LOCATION_FETCH,
  FETCH_MOSTUFFA_LOCATION,
  FETCH_MANUAL_COORDS,
} from "../store/types";
import store from "../store/store";
import { firebase } from "../config/configureFirebase";
import { query, onValue, set, off, push, limitToLast } from "firebase/database";

export const saveTracking = (bookingId, location) => {
  const { trackingRef } = firebase;
  push(trackingRef(bookingId), location);
};

// function added to be used instead of google apis
// the function is returning data array in postman
// should take place text and pass it to the link GET
// should log here and make sure text is being passed, the resData return is correct
export const fetchMostuffaApi = (place) => async (dispatch) => {
  const response = await fetch(
    `https://apps.salekmasr.com/ar/api/findplacefromtext/16/${place}`
  );
  const resData = await response.json();

  dispatch({
    type: FETCH_MOSTUFFA_LOCATION,
    payload: resData.data,
  });
};

// should log and make sure neededCoords are properly distrubuted

export const getPlaceCoords = (placeId) => async (dispatch, getState) => {
  const { savedPlaces } = getState().locationdata;

  const neededCoords = savedPlaces.find((a) => a.place_id === placeId).geometry;

  // checking the savedPlaces and send the geometry which is lat and lang to coords object in reducer

  dispatch({
    type: FETCH_MANUAL_COORDS,
    payload: neededCoords,
  });
};

export const fetchBookingLocations = (bookingId) => (dispatch) => {
  const { trackingRef } = firebase;

  dispatch({
    type: FETCH_BOOKING_LOCATION,
    payload: bookingId,
  });
  onValue(query(trackingRef(bookingId), limitToLast(1)), (snapshot) => {
    if (snapshot.val()) {
      let data = snapshot.val();
      const locations = Object.keys(data).map((i) => {
        return data[i];
      });
      if (locations.length == 1) {
        dispatch({
          type: FETCH_BOOKING_LOCATION_SUCCESS,
          payload: locations[0],
        });
      } else {
        dispatch({
          type: FETCH_BOOKING_LOCATION_FAILED,
          payload:
            store.getState().languagedata.defaultLanguage.location_fetch_error,
        });
      }
    } else {
      dispatch({
        type: FETCH_BOOKING_LOCATION_FAILED,
        payload:
          store.getState().languagedata.defaultLanguage.location_fetch_error,
      });
    }
  });
};

export const stopLocationFetch = (bookingId) => (dispatch) => {
  const { trackingRef } = firebase;

  dispatch({
    type: STOP_LOCATION_FETCH,
    payload: bookingId,
  });
  off(trackingRef(bookingId));
};

export const saveUserLocation = (location) => {
  const { auth, userLocationRef } = firebase;
  const uid = auth.currentUser.uid;
  set(userLocationRef(uid), location);
};
