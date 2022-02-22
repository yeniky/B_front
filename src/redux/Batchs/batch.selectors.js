import { createSelector } from 'reselect';

import { selectOrders } from 'redux/Orders/orders.selectors';

const selectBatch = (state) => state.batchs;

export const selectBatchs = createSelector(
  [selectBatch],
  (batch) => batch.allBatchs
);

export const getSelectedBatch = createSelector([selectBatch], (batchState) => {
  // if (batchState.selectedBatch && batchState.selectedBatch.id) {
  //   return batchState.allBatchs.find(
  //     (batch) => batch.id === batchState.selectedBatch.id
  //   );
  // } else
  if (batchState.selectedBatch) {
    return batchState.selectedBatch;
  } else {
    return null;
  }
});

export const getBatchErrors = createSelector(
  [selectBatch],
  (batch) => batch.batchErrors
);

export const batchWithOrderSelector = createSelector(
  [selectBatchs, selectOrders],
  (batchList, orderList) => {
    const hashOrders = Object.fromEntries(
      orderList.map((order) => [order.name, order])
    );
    return batchList.map((batch) => ({
      ...batch,
      order: hashOrders[batch.order],
    }));
  }
);

export const selectActiveBatchs = createSelector([selectBatchs], (batchs) =>
  batchs.filter((batch) => batch.active)
);
