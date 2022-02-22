import React, { useState, useEffect } from 'react';

//redux
import { connect } from 'react-redux';

import { addKey, deleteKey } from 'redux/Swr/swr.actions';

import { selectedOrder, getOrderErrors } from 'redux/Orders/orders.selectors';
import { selectMaterialsWithInfo } from 'redux/Materials/materials.selectors';
import { selectBatchs } from 'redux/Batchs/batch.selectors';
import { selectOrderTypes } from 'redux/Orders/orders.selectors';

import {
  clearSelectedOrder,
  addNewOrder,
  saveEditOrder,
  changeStatusOrder,
} from 'redux/Orders/orders.actions';
import { selectBatch } from 'redux/Batchs/batchs.actions';
import { saveEditedBatch } from 'redux/Batchs/batchs.actions';

//style components
import { makeStyles } from '@material-ui/styles';
import { Dialog } from '@material-ui/core';
import { CheckBoxOutlineBlank } from '@material-ui/icons';

//components
import Title from 'components/ui/ModalTitle.component';
import ConfirmModal from 'components/ConfirmModal.component';
import Form from 'components/BatchView/OrderModal/Form.component';
import BatchTable from 'components/BatchView/OrderModal/BatchTable.component';
import AddItem from 'components/AddItemInModal.component';
import Button from 'components/Button.component';
import BatchModal from 'components/BatchView/BatchModal/BatchModal.container';
import { selectUser } from 'redux/Users/user.selectors';

import usePagination from 'hooks/usePagination';

import tagService from 'services/tags';
import { selectSwrKeys } from 'redux/Swr/swr.selectors';

const OrderModal = ({
  Order,
  closeModal,
  orderTypes,
  onNewOrder,
  createBatch,
  editBatch,
  pairWithOrder,
  onSaveOrder,
  onErrors,
  onChangeStatus,
  user,
  addKey,
  deleteKey,
  swrKeys,
}) => {
  const classes = useStyles();
  const [isDeactivating, setDeactivating] = useState(false);
  const [editedOrder, setEditedOrder] = useState();

  const { items: batchList, page, per_page, order_by, order } = usePagination(
    tagService.getBatchs,
    1,
    1000
  );

  const [entityKey, setEntityKey] = useState();

  useEffect(() => {
    if (!entityKey) {
      const keyToSave = swrKeys.find((k) => k[0] === tagService.getOrders.name);
      if (keyToSave) setEntityKey(keyToSave);
    }
    if (editedOrder && editedOrder.id) {
      addKey([tagService.getBatchs.name, page, per_page, order_by, order]);
    }
    return () => {
      deleteKey([tagService.getBatchs.name, page, per_page, order_by, order]);
    };
  }, [editedOrder, page, per_page, order_by, order]);

  const { items: materialList } = usePagination(
    tagService.getMaterials,
    1,
    1000
  );

  useEffect(() => {
    console.log(Order);
    if (!!Order) {
      setEditedOrder({
        ...Order,
        start_date: Order.start_date
          ? new Date(Order.start_date).toJSON().slice(0, 10)
          : '',
        end_date: Order.end_date
          ? new Date(Order.end_date).toJSON().slice(0, 10)
          : '',
      });
    }
  }, [Order]);

  const [selectValue, setSelectValue] = useState('');
  const [selectParams, setSelectParams] = useState({
    placeholder: 'Seleccione Batch',
    options: [],
  });

  useEffect(() => {
    setSelectParams((currentParams) => ({
      ...currentParams,
      options: batchList
        .filter(
          (batch) =>
            editedOrder &&
            batch.order.name !== editedOrder.name &&
            batch.order.name === ''
        )
        .map((batch) => ({
          label: batch.name,
          value: batch.name,
        })),
    }));
  }, [editedOrder, batchList]);

  const buttonParams = {
    label: 'Crear Batch',
    onClick: () => createBatch(),
  };

  const handleFormChange = (event) => {
    const { value, name } = event.target;
    setEditedOrder({ ...editedOrder, [name]: value });
  };

  const pairBatchWithOrder = () => {
    if (selectValue) {
      const batchFound = batchList.find((batch) => batch.name === selectValue);
      pairWithOrder(batchFound, { ...batchFound, order: editedOrder.name });
      setEditedOrder((currentEdit) => ({
        ...currentEdit,
        batchs: [...currentEdit.batchs, selectValue],
      }));
      setSelectValue('');
    }
  };

  console.log(editedOrder);
  return (
    <Dialog open={!!Order} maxWidth={false}>
      {editedOrder && (
        <div className={classes.container}>
          <Title
            title={`ORDEN ${editedOrder.name}`}
            Icon={CheckBoxOutlineBlank}
          />
          <div className={classes.formContainer}>
            <Form
              order={editedOrder}
              orderTypes={orderTypes}
              onChangeHandler={handleFormChange}
              materialList={materialList}
              formErrors={onErrors}
              materialName={editedOrder.material}
            />
          </div>
          {editedOrder.id ? (
            <>
              <BatchTable
                // associatedBatchs={editedOrder.batchs.map((batchName) =>
                //   batchList.find((batchItem) => batchItem.name === batchName)
                // )}
                associatedBatchs={batchList.filter(
                  (batch) => batch.order?.name === Order?.name
                )}
                handleSelection={(batch) => editBatch(batch)}
              />
              {user && user.role === 'Admin' && (
                <AddItem
                  selectParams={selectParams}
                  selectValue={selectValue}
                  onSelectChange={(event) => setSelectValue(event.target.value)}
                  onAddItem={pairBatchWithOrder}
                  buttonParams={buttonParams}
                  disabled={!editedOrder.id}
                />
              )}
            </>
          ) : null}
          <div className={classes.buttonsContainer}>
            {user && user.role === 'Admin' && (
              <Button
                className={classes.modalButtons}
                color="green"
                onClick={() => {
                  addKey(entityKey);
                  return editedOrder.id
                    ? onSaveOrder(editedOrder)
                    : onNewOrder(editedOrder);
                }}
              >
                {`${editedOrder.id ? 'Guardar' : 'Crear'}`}
              </Button>
            )}
            {user && user.role === 'Admin' && editedOrder.id ? (
              <Button
                className={classes.modalButtons}
                color={editedOrder.active ? 'darkMagenta' : 'blue'}
                onClick={() =>
                  editedOrder.active
                    ? setDeactivating(true)
                    : onChangeStatus(editedOrder.id, true)
                }
              >
                {editedOrder.active ? 'DESACTIVAR' : 'ACTIVAR'}
              </Button>
            ) : null}
            <Button
              className={classes.modalButtons}
              color="red"
              onClick={() => {
                addKey(entityKey);
                closeModal();
              }}
            >
              {user && user.role === 'Admin' ? 'Cancelar' : 'Cerrar'}
            </Button>
          </div>
        </div>
      )}
      <BatchModal />
      <ConfirmModal
        open={isDeactivating}
        title="¿Desea desactivar esta orden?"
        onConfirm={() => {
          onChangeStatus(editedOrder.id, !editedOrder.active);
          setDeactivating(false);
          closeModal();
        }}
        onCancel={() => setDeactivating(false)}
      />
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '2rem',
  },
  formContainer: {
    display: 'flex',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: '0.5rem',
  },
  modalButtons: {
    fontSize: '1rem',
    paddingLeft: '3rem',
    paddingRight: '3rem',
  },
}));

const mapStateToProps = (state) => ({
  Order: selectedOrder(state),
  orderTypes: selectOrderTypes(state),
  onErrors: getOrderErrors(state),
  user: selectUser(state),
  swrKeys: selectSwrKeys(state),
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(clearSelectedOrder()),
  onNewOrder: (newOrder) => dispatch(addNewOrder(newOrder)),
  onSaveOrder: (order) => dispatch(saveEditOrder(order)),
  createBatch: () => dispatch(selectBatch()),
  editBatch: (batch) => dispatch(selectBatch(batch)),
  pairWithOrder: (oldBatch, editedBatch) =>
    dispatch(saveEditedBatch(oldBatch, editedBatch)),
  onChangeStatus: (id, status) => dispatch(changeStatusOrder(id, status)),
  addKey: (key) => dispatch(addKey(key)),
  deleteKey: (key) => dispatch(deleteKey(key)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderModal);
