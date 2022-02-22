<<<<<<< HEAD
import { createSelector } from "reselect";

const selectMetricsStore = (state) => state.metrics;

export const selectZoneMetrics = createSelector(
  [selectMetricsStore],
  (metrics) => metrics.zones
);
export const selectAssociationMetrics = createSelector(
  [selectMetricsStore],
  (metrics) => metrics.association
);
export const selectHistoryMetrics = createSelector(
  [selectMetricsStore],
  (metrics) => metrics.alert_history
);
=======
qimport { createSelector } from "reselect";

const selectMetricsStore = (state) => state.metrics;

export const selectZoneMetrics = createSelector(
  [selectMetricsStore],
  (metrics) => metrics.zones
);
export const selectAssociationMetrics = createSelector(
  [selectMetricsStore],
  (metrics) => metrics.association
);
export const selectHistoryMetrics = createSelector(
  [selectMetricsStore],
  (metrics) => metrics.alert_history
);
>>>>>>> 53256862e4effbb3423cd11b50a241f4cb89b1ca
