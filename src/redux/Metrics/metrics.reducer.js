import {
  FAIL_METRICS,
  SUCCESS_METRICS,
  LOADING_METRICS,
} from "./metrics.constants";

const initialStateMetrics = {
  zones: [],
  association: [],
  alert_history: [],
  isLoading: false,
  error: null,
};

const MetricsReducer = (state = initialStateMetrics, action = {}) => {
  switch (action.type) {
    case LOADING_METRICS:
      return {
        ...state,
        isLoading: true,
      };
    case SUCCESS_METRICS:
      return {
        ...state,
        isLoading: false,
        error: null,
        ...action.payload,
      };
    case FAIL_METRICS:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default MetricsReducer;
