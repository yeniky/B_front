import { createSelector } from 'reselect';

export const selectMap = (state) => state.map;

export const selectMapZoom = createSelector([selectMap], (map) => map.zoom);

export const selectMapCenter = createSelector([selectMap], (map) => map.center);

export const selectMapRotationAngle = createSelector(
  [selectMap],
  (map) => map.rotationAngle
);
