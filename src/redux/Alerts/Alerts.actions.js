import AlertTypes from './Alerts.constants';

import tagService from 'services/tags';

import {
  selectBatchAlerts,
  selectMaterialAlerts,
  selectZoneAlerts,
  selectCleanupAlerts,
  selectInactivityAlerts,
} from './Alerts.selectors';

export const fetchAlerts = () => (dispatch) => {
  dispatch({ type: AlertTypes.LOADING_ALERTS });
  tagService
    .getAlerts()
    .then((alerts) => {
      dispatch({
        type: AlertTypes.SUCCESS_ALERTS,
        payload: {
          batchAlerts: alerts.batch,
          materialAlerts: alerts.proximity,
          zoneAlerts: alerts.zone,
          cleanupAlerts: alerts.cleanup,
          inactivityAlerts: alerts.inactivity,
        },
      });
    })
    .catch((error) =>
      dispatch({ type: AlertTypes.FAIL_ALERTS, payload: error })
    );
};

export const closeAlert = (type, id) => (dispatch, getState) => {
  tagService.closeAlert({ alert_type: type, id }).then((response) => {
    const { alert_type, id } = response.alert;
    console.log(`ALERT_TYPE: ${alert_type}`);
    switch (alert_type) {
      case 'batch':
        const batchAlerts = selectBatchAlerts(getState());
        dispatch({
          type: AlertTypes.DEACTIVATE_ALERT,
          payload: {
            alertName: 'batchAlerts',
            value: batchAlerts.filter((currentAlert) => currentAlert.id !== id),
          },
        });
        return;
      case 'proximity':
        const materialAlerts = selectMaterialAlerts(getState());
        dispatch({
          type: AlertTypes.DEACTIVATE_ALERT,
          payload: {
            alertName: 'materialAlerts',
            value: materialAlerts.filter(
              (currentAlert) => currentAlert.id !== id
            ),
          },
        });
        return;
      case 'zone':
        const zoneAlerts = selectZoneAlerts(getState());
        dispatch({
          type: AlertTypes.DEACTIVATE_ALERT,
          payload: {
            alertName: 'zoneAlerts',
            value: zoneAlerts.filter((currentAlert) => currentAlert.id !== id),
          },
        });
        return;
      case 'cleanup':
        const cleanupAlerts = selectCleanupAlerts(getState());
        dispatch({
          type: AlertTypes.DEACTIVATE_ALERT,
          payload: {
            alertName: 'cleanupAlerts',
            value: cleanupAlerts.filter(
              (currentAlert) => currentAlert.id !== id
            ),
          },
        });
        return;
      case 'inactivity':
        const inactivityAlerts = selectInactivityAlerts(getState());
        dispatch({
          type: AlertTypes.DEACTIVATE_ALERT,
          payload: {
            alertName: 'inactivityAlerts',
            value: inactivityAlerts.filter(
              (currentAlert) => currentAlert.id !== id
            ),
          },
        });
        return;
      default:
        return;
    }
  });
};

const updateAlertsByTag = (alerts) => ({
  type: AlertTypes.TAG_ALERTS,
  payload: alerts,
});

export const alertsTagSelected = (tag) => (dispatch, getState) => {
  const state = getState();
  const batchAlerts = selectBatchAlerts(state);
  const materialAlerts = selectMaterialAlerts(state);
  const zoneAlerts = selectZoneAlerts(state);
  const cleanupAlerts = selectCleanupAlerts(state);
  const inactivityAlerts = selectInactivityAlerts(state);

  const tagAlerts = [
    ...batchAlerts.filter(
      (batchAlert) =>
        batchAlert.data.container === tag.container ||
        batchAlert.data.batch === tag.batch
    ),
    ...materialAlerts.filter(
      (materialAlert) =>
        materialAlert.data.container1 === tag.container ||
        materialAlert.data.container2 === tag.container
    ),
    ...zoneAlerts.filter(
      (zoneAlert) =>
        zoneAlert.data.container === tag.container ||
        zoneAlert.data.tag === tag.address
    ),
    ...cleanupAlerts.filter(
      (cleanupAlert) =>
        cleanupAlert.data.container === tag.container ||
        cleanupAlert.data.containerCleanup === tag.container
    ),
    ...inactivityAlerts.filter(
      (inactivityAlert) => inactivityAlert.data.device_mac === tag.address
    ),
  ];

  tagAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  dispatch(updateAlertsByTag(tagAlerts));
};

export const updateAlertsSocket = (newAlertsList) => (dispatch, getState) => {
  let updatedAlertList = {
    batchAlerts: selectBatchAlerts(getState()),
    materialAlerts: selectMaterialAlerts(getState()),
    zoneAlerts: selectZoneAlerts(getState()),
    cleanupAlerts: selectCleanupAlerts(getState()),
    inactivityAlerts: selectInactivityAlerts(getState()),
  };

  newAlertsList.forEach((newAlert) => {
    switch (newAlert.alert_type) {
      case 'zone':
        updatedAlertList.zoneAlerts = [
          ...updatedAlertList.zoneAlerts,
          newAlert,
        ];
        break;
      case 'batch':
        updatedAlertList.batchAlerts = [
          ...updatedAlertList.batchAlerts,
          newAlert,
        ];
        break;
      case 'proximity':
        updatedAlertList.materialAlerts = [
          ...updatedAlertList.materialAlerts,
          newAlert,
        ];
        break;
      case 'cleanup':
        updatedAlertList.cleanupAlerts = [
          ...updatedAlertList.cleanupAlerts,
          newAlert,
        ];
        break;
      case 'inactivity':
        updatedAlertList.inactivityAlerts = [
          ...updatedAlertList.inactivityAlerts,
          newAlert,
        ];
        break;

      default:
        break;
    }
  });

  dispatch({
    type: AlertTypes.UPDATE_ALERTS_SOCKET,
    payload: updatedAlertList,
  });
};
