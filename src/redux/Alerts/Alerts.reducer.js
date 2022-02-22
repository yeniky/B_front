import AlertTypes from './Alerts.constants';

const initalStateAlerts = {
  batchAlerts: [],
  materialAlerts: [],
  zoneAlerts: [],
  cleanupAlerts: [],
  inactivityAlerts: [],
  isLoading: false,
  error: false,
  selectedTagAlerts: [],
};

const alertsReducer = (state = initalStateAlerts, action = {}) => {
  switch (action.type) {
    case AlertTypes.LOADING_ALERTS:
      return {
        ...state,
        isLoading: true,
      };
    case AlertTypes.SUCCESS_ALERTS:
      return {
        ...state,
        isLoading: false,
        error: false,
        ...action.payload,
      };
    case AlertTypes.FAIL_ALERTS:
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    case AlertTypes.DEACTIVATE_ALERT:
      return {
        ...state,
        [action.payload.alertName]: action.payload.value,
      };
    case AlertTypes.TAG_ALERTS:
      return {
        ...state,
        selectedTagAlerts: action.payload,
      };
    case AlertTypes.UPDATE_ALERTS_SOCKET:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default alertsReducer;
