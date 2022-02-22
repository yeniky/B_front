import {
  LOADING_BATCHS,
  SUCCESS_BATCHS,
  FAIL_BATCHS,
  SELECT_BATCH,
  CLEAR_SELECTED_BATCH,
  UPDATE_BATCHS,
  SET_BATCH_ERRORS,
  //TO REVIEW
  REMOVE_BATCH_ORDER,
} from './batchs.constants';

//utils
import tagService from 'services/tags';
import BatchSchema from 'schemas/batch';
import { updateItem } from 'utils';

import { selectBatchs } from './batch.selectors';
import { updateBins } from 'redux/Bins/bins.actions';
import { selectBins } from 'redux/Bins/bins.selectors';
// import { selectOrders } from "redux/Orders/orders.selectors";
// import { fetchOrders } from 'redux/Orders/orders.actions';
import { updateTags } from 'redux/Tags/tags.actions';
import { mutateKeys } from 'redux/Swr/swr.actions';
import { selectedOrder } from 'redux/Orders/orders.selectors';
import { saveEditOrder, selectOrder } from 'redux/Orders/orders.actions';

const requestFetchBatchs = () => ({ type: LOADING_BATCHS });

const succesFetchBatchs = (batchs) => ({
  type: SUCCESS_BATCHS,
  payload: batchs,
});

const failFetchBatchs = (error) => ({ type: FAIL_BATCHS, payload: error });

export const fetchBatchs = () => (dispatch) => {
  dispatch(requestFetchBatchs());
  tagService
    .getBatchs()
    // ! remove .items
    .then((batchs) => dispatch(succesFetchBatchs(batchs.items)))
    .catch((error) => dispatch(failFetchBatchs(error)));
};

//NEW ACTIONS
export const selectBatch = (batch) => {
  if (batch) {
    return { type: SELECT_BATCH, payload: batch };
  } else {
    return {
      type: SELECT_BATCH,
      payload: { name: '', order: '', type: '', containers: [] },
    };
  }
};
export const clearSelectedBatch = () => (dispatch) => {
  dispatch({ type: CLEAR_SELECTED_BATCH, payload: null });
  dispatch(setErrors({}));
};

export const saveEditedBatch = (oldBatch, newBatch) => (dispatch, getState) => {
  //backend recieves an array of containers/bins id
  const batchToSend = {
    ...newBatch,
    containers: newBatch.containers.map((bin) => bin.id),
  };
  const [validBatch, errors] = BatchSchema.validate(batchToSend);
  if (!errors) {
    tagService
      .editBatch(validBatch)
      .then((batchResponse) => {
        mutateKeys(getState());
        //update batch list
        const batchList = selectBatchs(getState());
        const batchListUpdated = updateItem(batchList, 'id', {
          [batchResponse.id]: batchResponse,
        });
        dispatch(updateBatchs(batchListUpdated));

        //update binlist
        const binList = selectBins(getState());
        const binListUpdated = binList.map((item) =>
          item.batch === oldBatch.name
            ? { ...item, batch: batchResponse.name }
            : item
        );
        dispatch(updateBins(binListUpdated));

        //update orderslist

        // dispatch(fetchOrders());

        //order has an array of names, the number of batch types (in,out) is calculated in the table view separately.
        //for that reason only the array of names is updated here.
        // const orderList = selectOrders(getState());
        // const orderListUpdated = orderList.map((item) => item.name === batchResponse.order ? )
        // const orderListUpdated = orderList.map((item) => ({
        //   ...item,
        //   batchs: item.batchs
        //     .map((batch) =>
        //       batch === oldBatch.name
        //         ? item.name === batchResponse.order
        //           ? batchResponse.name
        //           : null
        //         : batch
        //     )
        //     .filter((checkForNull) => checkForNull),
        // }));
        // dispatch(updateOrders(orderListUpdated));

        //update tagslist
        dispatch(updateTags());

        dispatch(clearSelectedBatch());
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message &&
          err.response.data.message === 'a batch with that name already exists'
        ) {
          dispatch(setErrors({ name: 'El ID debe ser unico' }));
        }
        //console.log(err.response);
      });
  } else {
    console.log(errors);
    dispatch(setErrors(errors));
  }
};

export const addNewBatch = (newBatch) => (dispatch, getState) => {
  if (newBatch.name && newBatch.type && newBatch.order) {
    tagService
      .createBatch(newBatch)
      .then((addedBatch) => {
        mutateKeys(getState());

        const batchList = selectBatchs(getState());
        const updatedBatchs = [...batchList, addedBatch];
        dispatch({ type: UPDATE_BATCHS, payload: updatedBatchs });

        // const order = selectedOrder(getState());
        // if (order) {
        //   const updatedOrder = {
        //     ...order,
        //     batchs: [...order.batchs, addedBatch],
        //   };
        //   dispatch(saveEditOrder(updatedOrder));
        //   dispatch(selectOrder(updatedOrder));
        // }

        // dispatch(fetchOrders());
        dispatch(selectBatch(addedBatch));
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message &&
          err.response.data.message === 'a batch with that name already exists'
        ) {
          dispatch(setErrors({ name: 'El ID debe ser unico' }));
        }
        //console.log(err.response);
      });
  } else {
    let newError = {};
    if (!newBatch.name) {
      newError.name = 'Debe ingresar un ID';
    }
    if (!newBatch.type) {
      newError.type = 'Debe seleccionar un Tipo';
    }
    if (!newBatch.order) {
      newError.order = 'Debe seleccionar una Orden';
    }
    dispatch(setErrors(newError));
  }
};

export const updateBatchs = (batchs) => ({
  type: UPDATE_BATCHS,
  payload: batchs,
});

const setErrors = (errors) => ({ type: SET_BATCH_ERRORS, payload: errors });

//FIXME: OLD ACTIONS

//vista ordenes
export const removeBatchFromOrder = async (batch) => {
  const modifiedBatch = { ...batch, order: '' };
  const editedBatch = await tagService.editBatch(modifiedBatch);
  return { type: REMOVE_BATCH_ORDER, payload: editedBatch };
};

export const setEditedBatch = (batch) => (dispatch, getState) => {
  tagService.editBatch(batch).then((editedBatch) => {
    mutateKeys(getState());

    const bins = selectBins(getState());
    const batchList = selectBatchs(getState());
    let updatedBins = bins.map((b) =>
      b.batch === editedBatch.name ? { ...b, batch: '' } : b
    );
    batch.containers_id.forEach((id) => {
      updatedBins.forEach((b) => {
        if (b.id === id) {
          b.batch = editedBatch.name;
        }
      });
    });

    dispatch(updateBins(updatedBins));
    dispatch(
      updateBatchs(
        batchList.map((b) => (b.id === editedBatch.id ? editedBatch : b))
      )
    );
  });
};

export const addBatch = (newBatch) => (dispatch, getState) => {
  tagService.createBatch(newBatch).then((batch) => {
    mutateKeys(getState());

    const bins = selectBins(getState());
    const batchs = selectBatchs(getState);
    dispatch(updateBatchs([...batchs, batch]));
    const updatedBins = JSON.parse(JSON.stringify(bins));
    newBatch.containers_id.forEach((id) => {
      updatedBins.forEach((b) => {
        if (b.id === id) {
          b.batch = newBatch.name;
        }
      });
    });
    dispatch(updateBins(updatedBins));
  });
};

export const changeStatusBatch = (id, status) => (dispatch, getState) => {
  tagService.changeStatus('batch', id, status).then((batchResponse) => {
    mutateKeys(getState());

    const batchList = selectBatchs(getState());
    const batchlistUpdated = batchList.map((batch) =>
      batch.id === batchResponse.id ? batchResponse : batch
    );
    dispatch(updateBatchs(batchlistUpdated));
  });
};
