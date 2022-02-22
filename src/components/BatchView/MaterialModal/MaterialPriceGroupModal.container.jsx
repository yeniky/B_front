import React, { useState, useEffect } from 'react';

//redux
import { connect } from 'react-redux';

import {
  selectedMaterialPriceGroup,
  getMaterialErrors,
} from 'redux/Materials/materials.selectors';

import {
  addNewMaterialPriceGroup,
  saveEditMaterialPriceGroup,
  clearSelectedMaterialPriceGroup,
} from 'redux/Materials/materials.actions';

//styles components
import { makeStyles } from '@material-ui/styles';
import { Dialog } from '@material-ui/core';
import { Eco } from '@material-ui/icons';

//components
import Title from 'components/ui/ModalTitle.component';
import Button from 'components/Button.component';

import MaterialPriceGroupForm from 'components/BatchView/MaterialModal/MaterialPriceGroupForm.component';
import { selectUser } from 'redux/Users/user.selectors';

const MaterialPriceGroupModal = ({
  MaterialPriceGroup,
  closeModal,
  onNewMaterialPriceGroup,
  onEditMaterialPriceGroup,
  onErrors,
  user,
}) => {
  const classes = useStyles();

  const [editedMaterialPriceGroup, setEditedMaterialPriceGroup] = useState();

  useEffect(() => {
    if (!!MaterialPriceGroup) {
      setEditedMaterialPriceGroup(MaterialPriceGroup);
    }
  }, [MaterialPriceGroup]);

  const handleFormChange = (event) => {
    const { value, name } = event.target;
    setEditedMaterialPriceGroup({ ...editedMaterialPriceGroup, [name]: value });
  };

  return (
    <Dialog open={!!MaterialPriceGroup}>
      {editedMaterialPriceGroup && (
        <div className={classes.container}>
          <Title
            title={`MATERIAL PRICE GROUP ${editedMaterialPriceGroup.name}`}
            Icon={Eco}
          />
          <div className={classes.formContainer}>
            <MaterialPriceGroupForm
              materialPriceGroup={editedMaterialPriceGroup}
              formErrors={onErrors}
              onChangeHandler={handleFormChange}
            />
          </div>
          <div className={classes.buttonsContainer}>
            {user && user.role === 'Admin' && (
              <Button
                className={classes.modalButtons}
                color="green"
                onClick={() =>
                  editedMaterialPriceGroup.id
                    ? onEditMaterialPriceGroup(editedMaterialPriceGroup)
                    : onNewMaterialPriceGroup(editedMaterialPriceGroup)
                }
              >
                {`${editedMaterialPriceGroup.id ? 'Guardar' : 'Crear'}`}
              </Button>
            )}
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
  MaterialPriceGroup: selectedMaterialPriceGroup(state),
  onErrors: getMaterialErrors(state),
  user: selectUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(clearSelectedMaterialPriceGroup()),
  onNewMaterialPriceGroup: (newMaterialPriceGroup) =>
    dispatch(addNewMaterialPriceGroup(newMaterialPriceGroup)),
  onEditMaterialPriceGroup: (editedMaterialPriceGroup) =>
    dispatch(saveEditMaterialPriceGroup(editedMaterialPriceGroup)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MaterialPriceGroupModal);
