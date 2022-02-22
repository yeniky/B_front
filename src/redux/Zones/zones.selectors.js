import { createSelector } from 'reselect';

const selectZone = (state) => state.zones;

export const selectZones = createSelector(
  [selectZone],
  (zone) => zone.allZones
);

export const selectZoneNames = createSelector([selectZone], (zone) =>
  zone.allZones.map((z) => z.name)
);
