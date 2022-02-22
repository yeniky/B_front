import {
  LOADING_METRICS,
  SUCCESS_METRICS,
  FAIL_METRICS,
} from './metrics.constants';

import tagService from 'services/tags';

export const fetchMetrics = () => async (dispatch) => {
  dispatch({ type: LOADING_METRICS });
  try {
    // ! remove .items
    const zones = (await tagService.getZoneMetrics()).items;
    const association = (await tagService.getAssociationMetrics()).items;
    const alert_history = await tagService.getHistoryMetrics();
    dispatch({
      type: SUCCESS_METRICS,
      payload: { zones, association, alert_history },
    });
  } catch (error) {
    dispatch({ type: FAIL_METRICS, payload: error });
  }
};
