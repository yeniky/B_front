import React, { useState, useEffect } from 'react';

//redux
import { connect } from 'react-redux';

//import { selectBatchs } from "redux/Batchs/batch.selectors";
import { getSelectedBin, getErrors } from 'redux/Bins/bins.selectors';
import { selectTags } from 'redux/Tags/tags.selectors';
import { selectBatchs } from 'redux/Batchs/batch.selectors';
// import { selectOrders } from 'redux/Orders/orders.selectors';

import {
  clearSelectedBin,
  saveNewBin,
  saveEditBin,
} from 'redux/Bins/bins.actions';

//styles components
import { makeStyles } from '@material-ui/styles';
import { Dialog } from '@material-ui/core';
import { CheckBoxOutlineBlank } from '@material-ui/icons';

//components
import Button from 'components/Button.component';
import Title from 'components/ui/ModalTitle.component';

import Form from 'components/BinModal/Form.component';
import OrderInfo from 'components/BinModal/OrderInfo.component';
import { selectUser } from 'redux/Users/user.selectors';

const BinModal = ({
  Bin,
  closeModal,
  saveBin,
  tagList,
  batchList,
  // orderList,
  onErrors,
  user,
}) => {
  const classes = useStyles();

  const [editedBin, setEditedBin] = useState();
  useEffect(() => {
    if (!!Bin) {
      setEditedBin(Bin);
    }
  }, [Bin]);

  const [orderAssociated, setOrderAssociated] = useState(null);
  useEffect(() => {
    if (editedBin && !!editedBin.batch) {
      const batchFound = batchList.find(
        (batchItem) => batchItem.name === editedBin.batch
      );
      setOrderAssociated(batchFound ? batchFound.order : null);
    } else {
      setOrderAssociated(null);
    }
  }, [batchList, editedBin]);

  const handleFormChange = (event) => {
    const { value, name } = event.target;
    setEditedBin({ ...editedBin, [name]: value });
  };

  return (
    <Dialog open={!!Bin} maxWidth={false}>
      <section className={classes.container}>
        <Title
          Icon={CheckBoxOutlineBlank}
          title={`BIN ${editedBin ? editedBin.name : ''}`}
        />
        <div className={classes.bodyContainer}>
          <Form
            bin={editedBin}
            onChangeHandler={handleFormChange}
            tagList={tagList}
            batchList={batchList}
            formErrors={onErrors}
          />
          {orderAssociated && <OrderInfo orderName={orderAssociated} />}
        </div>
        <div className={classes.buttonsContainer}>
          {user && user.role === 'Admin' && (
            <Button
              className={classes.button}
              color="green"
              onClick={() => saveBin(editedBin)}
              disabled={user && user.role !== 'Admin'}
            >
              {'GUARDAR'}
            </Button>
          )}
          <Button
            className={classes.button}
            color="red"
            onClick={() => closeModal()}
          >
            {user && user.role !== 'Admin' ? 'CERRAR' : 'CANCELAR'}
          </Button>
        </div>
      </section>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '1rem 2rem',
    border: `solid 3px ${theme.palette.common.blue}`,
  },
  bodyContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: 'auto',
    marginTop: '2rem',
    width: '25rem',
  },
  button: {
    width: '10rem',
    padding: 0,
    '& .MuiButton-label': {
      fontSize: '1.2rem',
      fontWeight: 900,
    },
  },
}));

const mapStateToProps = (state) => ({
  Bin: getSelectedBin(state),
  tagList: selectTags(state),
  batchList: selectBatchs(state),
  // orderList: selectOrders(state),
  onErrors: getErrors(state),
  user: selectUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(clearSelectedBin()),
  saveBin: (bin) =>
    bin.id ? dispatch(saveEditBin(bin)) : dispatch(saveNewBin(bin)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BinModal);
