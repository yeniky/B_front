import React, { useState, useEffect } from 'react';

//redux
import { connect } from 'react-redux';

import { getSelectedBatch, getBatchErrors } from 'redux/Batchs/batch.selectors';
import { selectBins } from 'redux/Bins/bins.selectors';
import { selectTags } from 'redux/Tags/tags.selectors';

import { addKey, deleteKey } from 'redux/Swr/swr.actions';
import {
  clearSelectedBatch,
  saveEditedBatch,
  addNewBatch,
  changeStatusBatch,
} from 'redux/Batchs/batchs.actions';
import { selectBin, saveEditBin } from 'redux/Bins/bins.actions';

//style components
import { makeStyles } from '@material-ui/styles';
import { Dialog } from '@material-ui/core';
import { CheckBoxOutlineBlank } from '@material-ui/icons';

//components
import Title from 'components/ui/ModalTitle.component';

import Form from 'components/BatchView/BatchModal/Form.component';
import OrderInfo from 'components/BatchView/BatchModal/OrdenInfo.component';
import BinsTable from 'components/BatchView/BatchModal/BinsTable.component';
import AddItem from 'components/AddItemInModal.component';
import Button from 'components/Button.component';
import ConfirmModal from 'components/ConfirmModal.component';

import BinModal from 'components/BinModal/BinModal.container';
import { selectUser } from 'redux/Users/user.selectors';

import usePagination from 'hooks/usePagination';

import tagService from 'services/tags';

const BatchModal = ({
  Batch,
  closeModal,
  editBin,
  createBin,
  pairWithBatch,
  onSaveBatch,
  onNewBatch,
  onErrors,
  tagList,
  onChangeStatus,
  user,
  addKey,
  deleteKey,
}) => {
  const classes = useStyles();

  const ordersPageInfo = usePagination(tagService.getOrders, 1, 1000);

  const { items: ordersList, mutate } = ordersPageInfo;

  useEffect(() => {
    addKey([
      tagService.getOrders.name,
      ordersPageInfo.page,
      ordersPageInfo.per_page,
      ordersPageInfo.order_by,
      ordersPageInfo.order,
    ]);
    // return () => {
    //   deleteKey([
    //     tagService.getOrders.name,
    //     ordersPageInfo.page,
    //     ordersPageInfo.per_page,
    //     ordersPageInfo.order_by,
    //     ordersPageInfo.order,
    //   ]);
    // };
  }, [
    ordersPageInfo.page,
    ordersPageInfo.per_page,
    ordersPageInfo.order_by,
    ordersPageInfo.order,
  ]);

  const binsPageInfo = usePagination(tagService.getContainers, 1, 1000);

  const { items: binsList, page, per_page, order_by, order } = binsPageInfo;

  useEffect(() => {
    addKey([tagService.getContainers.name, page, per_page, order_by, order]);
    return () => {
      deleteKey([
        tagService.getContainers.name,
        page,
        per_page,
        order_by,
        order,
      ]);
    };
  }, [page, per_page, order_by, order]);

  const [isDeactivating, setDeactivating] = useState(false);

  const [editedBatch, setEditedBatch] = useState();
  useEffect(() => {
    if (!!Batch) {
      setEditedBatch({ ...Batch, order: Batch.order.name || '' });
    }
  }, [Batch]);

  const [selectValue, setSelectValue] = useState('');
  const [selectParams, setSelectParams] = useState({
    placeholder: 'Seleccione Bin',
    options: [],
  });

  useEffect(() => {
    setEditedBatch((currentEdit) => {
      if (currentEdit) {
        return {
          ...currentEdit,
          containers:
            binsList?.filter((bin) => bin.batch === Batch?.name) || [],
        };
      }
    });
    setSelectParams((currentParams) => ({
      ...currentParams,
      options: binsList
        ? binsList
            .filter((bin) => bin.batch === '')
            .map((bin) => ({ label: bin.name, value: bin.name }))
        : [],
    }));
  }, [binsList]);

  const buttonParams = {
    label: 'Crear Bin',
    onClick: () => createBin(),
  };

  const handleFormChange = (event) => {
    const { value, name } = event.target;
    setEditedBatch({ ...editedBatch, [name]: value });
  };

  const pairBinWithBatch = () => {
    if (selectValue) {
      const binFound = binsList?.find((bin) => bin.name === selectValue);
      pairWithBatch({ ...binFound, batch: editedBatch.name });
      // mutate({ ...bins, items: [...binsList, binFound] }, true);
      setSelectValue('');
    }
  };

  return (
    <Dialog open={!!Batch} maxWidth={false}>
      {editedBatch && (
        <div className={classes.container}>
          <Title
            title={`BATCH ${editedBatch.name}`}
            Icon={CheckBoxOutlineBlank}
          />
          <div className={classes.formContainer}>
            <Form
              batch={editedBatch}
              onChangeHandler={handleFormChange}
              ordersList={ordersList}
              formErrors={onErrors}
              onSelectorOpen={() => mutate()}
            />
            <OrderInfo
              orderName={
                editedBatch.order?.name
                  ? editedBatch.order.name
                  : editedBatch.order
              }
              orderList={ordersList}
            />
          </div>
          {editedBatch.id ? (
            <>
              <BinsTable
                associatedBins={editedBatch.containers}
                tagList={tagList}
                handleSelection={editBin}
              />
              {user && user.role === 'Admin' && (
                <AddItem
                  selectParams={selectParams}
                  selectValue={selectValue}
                  onSelectChange={(event) => setSelectValue(event.target.value)}
                  onAddItem={pairBinWithBatch}
                  buttonParams={buttonParams}
                  disabled={!editedBatch.id}
                />
              )}
            </>
          ) : null}
          <div className={classes.buttonsContainer}>
            {user && user.role === 'Admin' && (
              <Button
                className={classes.modalButtons}
                color="green"
                onClick={() =>
                  editedBatch.id
                    ? onSaveBatch(Batch, editedBatch)
                    : onNewBatch(editedBatch)
                }
              >
                {`${editedBatch.id ? 'Guardar' : 'Crear'}`}
              </Button>
            )}
            {user && user.role === 'Admin' && editedBatch.id ? (
              <Button
                className={classes.modalButtons}
                color={editedBatch.active ? 'darkMagenta' : 'blue'}
                onClick={() =>
                  editedBatch.active
                    ? setDeactivating(true)
                    : onChangeStatus(editedBatch.id, true)
                }
              >
                {editedBatch.active ? 'DESACTIVAR' : 'ACTIVAR'}
              </Button>
            ) : null}
            <Button
              className={classes.modalButtons}
              color="red"
              onClick={() => closeModal()}
            >
              {user && user.role === 'Admin' ? 'Cancelar' : 'Cerrar'}
            </Button>
          </div>
        </div>
      )}
      <BinModal />
      <ConfirmModal
        open={isDeactivating}
        title="¿Desea desactivar este batch?"
        onConfirm={() => {
          onChangeStatus(editedBatch.id, !editedBatch.active);
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
  Batch: getSelectedBatch(state),
  tagList: selectTags(state),
  onErrors: getBatchErrors(state),
  user: selectUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(clearSelectedBatch()),
  editBin: (bin) => dispatch(selectBin(bin)),
  createBin: () => dispatch(selectBin()),
  pairWithBatch: (bin, binsList) => dispatch(saveEditBin(bin, binsList)),
  onSaveBatch: (oldBatch, batch) => dispatch(saveEditedBatch(oldBatch, batch)),
  onNewBatch: (newBatch) => dispatch(addNewBatch(newBatch)),
  onChangeStatus: (id, status) => dispatch(changeStatusBatch(id, status)),
  addKey: (key) => dispatch(addKey(key)),
  deleteKey: (key) => dispatch(deleteKey(key)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BatchModal);
