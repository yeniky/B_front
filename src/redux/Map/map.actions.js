import {
  SET_MAP_CENTER,
  SET_MAP_ZOOM,
  SET_MAP_ROTATION_ANGLE,
  SET_MAP_STATUS,
  SET_UNLOADED_MAP,
} from './map.constants';

export const setMapCenter = (center) => (dispatch) =>
  dispatch({ type: SET_MAP_CENTER, payload: center });

export const setMapZoom = (zoom) => (dispatch) =>
  dispatch({ type: SET_MAP_ZOOM, payload: zoom });

export const setMapRotationAngle = (rotationAngle) => (dispatch) =>
  dispatch({ type: SET_MAP_ROTATION_ANGLE, payload: rotationAngle });

export const setMapStatus = (map) => (dispatch) =>
  dispatch({ type: SET_MAP_STATUS, payload: map });

export const setUnloadedMap = () => (dispatch) =>
  dispatch({ type: SET_UNLOADED_MAP });
