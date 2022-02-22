import { fetchTags } from 'redux/Tags/tags.actions';
import { fetchBatchs } from 'redux/Batchs/batchs.actions';
import { fetchZones } from 'redux/Zones/zones.actions';
import { fetchBins, fetchBinTypes } from 'redux/Bins/bins.actions';
import { fetchOrders } from 'redux/Orders/orders.actions';
import { fetchAlerts } from 'redux/Alerts/Alerts.actions';
// import { fetchMaterials } from 'redux/Materials/materials.actions';
// import { fetchMetrics } from 'redux/Metrics/metrics.actions';

export const startFetchs = () => (dispatch) => {
  dispatch(fetchTags());
  dispatch(fetchBatchs());
  dispatch(fetchZones());
  dispatch(fetchBins());
  dispatch(fetchBinTypes());
  dispatch(fetchOrders());
  dispatch(fetchAlerts());
  // dispatch(fetchMaterials());
  // dispatch(fetchMetrics());
};
