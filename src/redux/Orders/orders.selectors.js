import { createSelector } from 'reselect';

const selectOrder = (state) => state.orders;

export const selectOrders = createSelector(
  [selectOrder],
  (order) => order.allOrders
);

export const selectedOrder = createSelector([selectOrder], (orderState) => {
  // if (orderState.selectedOrder && orderState.selectedOrder.id) {
  //   return orderState.allOrders.find(
  //     (order) => order.id === orderState.selectedOrder.id
  //   );
  // } else
  if (orderState.selectedOrder) {
    return orderState.selectedOrder;
  } else {
    return null;
  }
});
export const selectOrderTypes = createSelector(
  [selectOrder],
  (order) => order.orderTypes
);

export const getOrderErrors = createSelector(
  [selectOrder],
  (order) => order.orderErrors
);

export const uploadOrderResponseSelector = createSelector(
  [selectOrder],
  (orderState) => orderState.uploadResponse
);
