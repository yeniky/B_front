import React, { useState, useEffect } from 'react';

//redux
import { connect } from 'react-redux';

import {
  selectedMaterialGroup,
  getMaterialErrors,
} from 'redux/Materials/materials.selectors';

import {
  clearSelectedMaterialGroup,
  addNewMaterialGroup,
  saveEditMaterialGroup,
} from 'redux/Materials/materials.actions';

//styles components
import { makeStyles } from '@material-ui/styles';
import { Dialog } from '@material-ui/core';
import { Eco } from '@material-ui/icons';

//components
import Title from 'components/ui/ModalTitle.component';
import Button from 'components/Button.component';

import MaterialGroupForm from 'components/BatchView/MaterialModal/MaterialGroupForm.component';
import { selectUser } from 'redux/Users/user.selectors';

const MaterialGroupModal = ({
  MaterialGroup,
  closeModal,
  onNewMaterialGroup,
  onEditMaterialGroup,
  onErrors,
  user,
}) => {
  const classes = useStyles();

  const [editedMaterialGroup, setEditedMaterialGroup] = useState();

  useEffect(() => {
    if (!!MaterialGroup) {
      setEditedMaterialGroup(MaterialGroup);
    }
  }, [MaterialGroup]);

  const handleFormChange = (event) => {
    const { value, name } = event.target;
    setEditedMaterialGroup({ ...editedMaterialGroup, [name]: value });
  };

  return (
    <Dialog open={!!MaterialGroup}>
      {editedMaterialGroup && (
        <div className={classes.container}>
          <Title
            title={`MATERIAL GROUP ${editedMaterialGroup.name}`}
            Icon={Eco}
          />
          <div className={classes.formContainer}>
            <MaterialGroupForm
              materialGroup={editedMaterialGroup}
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
                  editedMaterialGroup.id
                    ? onEditMaterialGroup(editedMaterialGroup)
                    : onNewMaterialGroup(editedMaterialGroup)
                }
              >
                {`${editedMaterialGroup.id ? 'Guardar' : 'Crear'}`}
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
  MaterialGroup: selectedMaterialGroup(state),
  onErrors: getMaterialErrors(state),
  user: selectUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(clearSelectedMaterialGroup()),
  onNewMaterialGroup: (newMaterialGroup) =>
    dispatch(addNewMaterialGroup(newMaterialGroup)),
  onEditMaterialGroup: (editedMaterialGroup) =>
    dispatch(saveEditMaterialGroup(editedMaterialGroup)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MaterialGroupModal);
