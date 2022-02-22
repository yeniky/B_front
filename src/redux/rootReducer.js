import { combineReducers } from 'redux';

import tagReducer from 'redux/Tags/tags.reducer';
import batchReducer from 'redux/Batchs/batchs.reducer';
import zoneReducer from 'redux/Zones/zones.reducer';
import binsReducer from 'redux/Bins/bins.reducer';
import ordersReducer from 'redux/Orders/orders.reducer';
import AlertReducer from 'redux/Alerts/Alerts.reducer';
import RulesReducer from 'redux/Rules/rules.reducer';
import MaterialsReducer from 'redux/Materials/materials.reducer';
import MetricsReducer from 'redux/Metrics/metrics.reducer';
import UserReducer from 'redux/Users/user.reducer';
import SwrReducer from 'redux/Swr/swr.reducer';
import MapReducer from 'redux/Map/map.reducer';

const rootReducer = combineReducers({
  tags: tagReducer,
  batchs: batchReducer,
  zones: zoneReducer,
  bins: binsReducer,
  orders: ordersReducer,
  alerts: AlertReducer,
  rules: RulesReducer,
  materials: MaterialsReducer,
  // metrics: MetricsReducer,
  user: UserReducer,
  swr: SwrReducer,
  map: MapReducer,
});

export default rootReducer;
