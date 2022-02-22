import {
  SET_MAP_CENTER,
  SET_MAP_ZOOM,
  SET_MAP_ROTATION_ANGLE,
  SET_MAP_STATUS,
  SET_UNLOADED_MAP,
} from './map.constants';

const initialMapState = {
  center: [650, 500],
  rotationAngle: 0,
  zoom: 0,
  isLoaded: false,
};

const mapReducer = (state = initialMapState, action = {}) => {
  switch (action.type) {
    case SET_MAP_CENTER:
      return {
        ...state,
        center: action.payload,
      };
    case SET_MAP_ZOOM:
      return {
        ...state,
        zoom: action.payload,
      };
    case SET_MAP_ROTATION_ANGLE:
      return {
        ...state,
        rotationAngle: action.payload,
      };
    case SET_MAP_STATUS:
      return {
        ...action.payload,
        isLoaded: true,
      };
    case SET_UNLOADED_MAP:
      return {
        ...initialMapState,
      };
    default:
      return state;
  }
};

export default mapReducer;
