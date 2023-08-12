import {
  FETCH_BOOKING_LOCATION,
  FETCH_BOOKING_LOCATION_SUCCESS,
  FETCH_BOOKING_LOCATION_FAILED,
  STOP_LOCATION_FETCH,
  FETCH_MOSTUFFA_LOCATION,
  FETCH_MANUAL_COORDS,
} from "../store/types";

const INITIAL_STATE = {
  coords: null,
  loading: false,
  savedPlaces: [],
  error: {
    flag: false,
    msg: null,
  },
};

export const locationreducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_BOOKING_LOCATION:
      return {
        ...state,
        loading: true,
      };
    case FETCH_BOOKING_LOCATION_SUCCESS:
      return {
        ...state,
        coords: action.payload,
        loading: false,
      };
    case FETCH_MOSTUFFA_LOCATION:
      return {
        ...state,
        savedPlaces: action.payload,
      };
    case FETCH_MANUAL_COORDS:
      return {
        ...state,
        coords: action.payload,
      };
    case FETCH_BOOKING_LOCATION_FAILED:
      return {
        ...state,
        loading: false,
        error: {
          flag: true,
          msg: action.payload,
        },
      };
    case STOP_LOCATION_FETCH:
      return INITIAL_STATE;
    default:
      return state;
  }
};
