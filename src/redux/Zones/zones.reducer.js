import { SUCCESS_ZONES, LOADING_ZONES, FAIL_ZONES } from "./zones.constants";

const initialStateTags = {
  allZones: [],
  isLoading: false,
  error: false,
};

const zoneReducer = (state = initialStateTags, action = {}) => {
  switch (action.type) {
    case LOADING_ZONES:
      return {
        ...state,
        isLoading: true,
      };
    case SUCCESS_ZONES:
      return {
        ...state,
        isLoading: false,
        allZones: action.payload,
      };
    case FAIL_ZONES:
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    default:
      return state;
  }
};

export default zoneReducer;
