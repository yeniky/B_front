import { createSelector } from 'reselect';

const selectAlert = (state) => state.alerts;

export const selectCountAlerts = createSelector(
  [selectAlert],
  (alert) =>
    alert.batchAlerts.length +
    alert.materialAlerts.length +
    alert.zoneAlerts.length +
    alert.cleanupAlerts.length +
    alert.inactivityAlerts.length
);

export const selectAlerts = createSelector([selectAlert], (alert) => {
  const mergedAlerts = [
    ...alert.batchAlerts,
    ...alert.materialAlerts,
    ...alert.zoneAlerts,
    ...alert.cleanupAlerts,
    ...alert.inactivityAlerts,
  ];
  mergedAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return mergedAlerts;
});

export const selectBatchAlerts = createSelector(
  [selectAlert],
  (alert) => alert.batchAlerts
);
export const selectMaterialAlerts = createSelector(
  [selectAlert],
  (alert) => alert.materialAlerts
);
export const selectZoneAlerts = createSelector(
  [selectAlert],
  (alert) => alert.zoneAlerts
);
export const selectCleanupAlerts = createSelector(
  [selectAlert],
  (alert) => alert.cleanupAlerts
);
export const selectInactivityAlerts = createSelector(
  [selectAlert],
  (alert) => alert.inactivityAlerts
);

export const selectedTagAlerts = createSelector(
  [selectAlert],
  (alert) => alert.selectedTagAlerts
);

const getTagAddress = (_, props) => ({
  address: props.tag.address,
  bin: props.tag.container,
  batch: props.tag.batch,
});

export const tagHasAlerts = createSelector(
  [selectAlerts, getTagAddress],
  (alerts, { address, bin, batch }) => {
    if (bin) {
      return (
        alerts.filter(
          (alert) =>
            alert.active &&
            (alert.data.container === bin ||
              alert.data.container1 === bin ||
              alert.data.batch === batch ||
              alert.data.container2 === bin ||
              alert.data.containerCleanup === bin ||
              alert.data.device_mac === address)
        ).length > 0
      );
    } else {
      return (
        alerts.filter(
          (alert) =>
            alert.active &&
            (alert.data.tag === address || alert.data.device_mac === address)
        ).length > 0
      );
    }
  }
);
