import OrderTypes from './orders.constants';

import tagService from 'services/tags';

import { fetchTags } from 'redux/Tags/tags.actions';
import { fetchBatchs } from 'redux/Batchs/batchs.actions';

import { selectOrders } from 'redux/Orders/orders.selectors';
import { mutateKeys } from 'redux/Swr/swr.actions';
const requestFetchOrders = () => ({ type: OrderTypes.LOADING_ORDERS });

const successFetchOrders = (orders) => ({
  type: OrderTypes.SUCCESS_ORDERS,
  payload: orders,
});

const failFetchOrders = (error) => ({
  type: OrderTypes.FAIL_ORDERS,
  payload: error,
});

export const fetchOrders = () => (dispatch) => {
  // dispatch(requestFetchOrders());
  // tagService
  //   .getOrders()
  //   // ! remove .items
  //   .then((orders) => dispatch(successFetchOrders(orders.items)))
  //   .catch((error) => dispatch(failFetchOrders(error)));
  tagService.getOrderTypes().then((types) => {
    return dispatch({ type: OrderTypes.ORDER_TYPES, payload: types });
  });
};

export const selectOrder = (order) => {
  if (order) {
    return { type: OrderTypes.SELECT_ORDER, payload: order };
  } else {
    return {
      type: OrderTypes.SELECT_ORDER,
      payload: {
        name: '',
        order_type: '',
        material: '',
        start_date: '',
        end_date: '',
        agreement: '',
        purch_doc: '',
        batches: [],
      },
    };
  }
};

export const clearSelectedOrder = () => (dispatch, getState) => {
  mutateKeys(getState());
  dispatch({ type: OrderTypes.CLEAR_SELECT_ORDER });
  dispatch(setErrors({}));
};

export const addNewOrder = (newOrder) => (dispatch, getState) => {
  const orderToSend = { ...newOrder, type: newOrder.order_type };
  if (
    newOrder.name &&
    newOrder.order_type &&
    newOrder.material &&
    newOrder.start_date <= newOrder.end_date
  ) {
    tagService
      .createOrder(orderToSend)
      .then((response) => {
        mutateKeys(getState());
        dispatch({ type: OrderTypes.ADD_ORDER, payload: response });
        dispatch(fetchTags());
        dispatch(fetchBatchs());
        dispatch(selectOrder(response));
        dispatch(setErrors({}));
      })
      .catch(({ response: { data } }) => {
        if (data.message === 'a order with that name already exists') {
          dispatch(setErrors({ name: 'ID ya existe' }));
        }
      });
  } else {
    let newError = {};
    if (!newOrder.name) {
      newError.name = 'Debe ingresar un ID';
    }
    if (!newOrder.order_type) {
      newError.order_type = 'Debe seleccionar un Tipo';
    }
    if (!newOrder.material) {
      newError.material = 'Debe seleccionar un Material';
    }
    if (newOrder.start_date > newOrder.end_date) {
      newError.end_date = 'Debe ser mayor o igual a la de inicio';
    }
    dispatch(setErrors(newError));
  }
};

export const saveEditOrder = (editedOrder) => (dispatch, getState) => {
  const orderToSend = { ...editedOrder, type: editedOrder.order_type };
  if (
    editedOrder.name &&
    editedOrder.order_type &&
    editedOrder.material &&
    editedOrder.start_date <= editedOrder.end_date
  ) {
    tagService
      .editOrder(orderToSend)
      .then((response) => {
        console.log(getState());
        mutateKeys(getState());
        const orderList = selectOrders(getState());
        const updatedOrders = orderList.map((order) =>
          order.id === response.id ? response : order
        );

        dispatch(updateOrders(updatedOrders));
        dispatch(fetchTags());
        dispatch(fetchBatchs());
        dispatch(clearSelectedOrder());
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message &&
          err.response.data.message === 'a order with that name already exists'
        ) {
          dispatch(setErrors({ name: 'El ID debe ser unico' }));
        }
      });
  } else {
    let newError = {};
    if (!editedOrder.name) {
      newError.name = 'Debe ingresar un ID';
    }
    if (!editedOrder.order_type) {
      newError.order_type = 'Debe seleccionar un Tipo';
    }
    if (!editedOrder.material) {
      newError.material = 'Debe seleccionar un Material';
    }
    if (editedOrder.start_date > editedOrder.end_date) {
      newError.end_date = 'Debe ser mayor o igual a la de inicio';
    }
    dispatch(setErrors(newError));
  }
};

const setErrors = (errors) => ({
  type: OrderTypes.SET_ORDER_ERRORS,
  payload: errors,
});

export const updateOrders = (orderList) => ({
  type: OrderTypes.UPDATE_ORDERS,
  payload: orderList,
});

export const uploadOrderCSV = (file) => (dispatch, getState) => {
  tagService
    .uploadCSV('order', { file: file })
    .then((response) => {
      mutateKeys(getState());
      dispatch({ type: OrderTypes.UPLOAD_ORDER_CSV, payload: response });
      // dispatch(fetchOrders());
    })
    .catch((err) => {
      console.log(err.response);
      if (
        err &&
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
      }
      dispatch({
        type: OrderTypes.UPLOAD_ORDER_CSV,
        payload: { errors: [err.response.data.message] },
      });
    });
};

export const changeStatusOrder = (id, status) => (dispatch, getState) => {
  tagService.changeStatus('orders', id, status).then((orderResponse) => {
    mutateKeys(getState());
    const orderList = selectOrders(getState());
    const orderlistUpdated = orderList.map((order) =>
      order.id === orderResponse.id ? orderResponse : order
    );
    dispatch(updateOrders(orderlistUpdated));
  });
};

export const confirmCloseCSV = () => ({
  type: OrderTypes.CONFIRM_UPLOAD_ORDER,
});

export const clearDataCSV = () => ({
  type: OrderTypes.CLOSE_ORDER_UPLOAD,
});
