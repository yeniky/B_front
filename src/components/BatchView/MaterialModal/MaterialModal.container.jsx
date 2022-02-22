import React, { useState, useEffect } from 'react';

//redux
import { connect } from 'react-redux';

import {
  selectedMaterial,
  getMaterialErrors,
} from 'redux/Materials/materials.selectors';
import { selectUser } from 'redux/Users/user.selectors';

import {
  clearSelectedMaterial,
  addNewMaterial,
  saveEditMaterial,
} from 'redux/Materials/materials.actions';

//styles components
import { makeStyles } from '@material-ui/styles';
import { Dialog } from '@material-ui/core';
import { Eco } from '@material-ui/icons';

//components
import Title from 'components/ui/ModalTitle.component';
import Button from 'components/Button.component';

import Form from 'components/BatchView/MaterialModal/Form.component';

import usePagination from 'hooks/usePagination';

import tagService from 'services/tags';

const MaterialModal = ({
  Material,
  closeModal,
  onNewMaterial,
  onEditMaterial,
  onErrors,
  user,
}) => {
  const classes = useStyles();

  const { items: groupList } = usePagination(
    tagService.getMaterialGroup,
    1,
    1000
  );

  const { items: priceList } = usePagination(
    tagService.getMaterialPrice,
    1,
    1000
  );

  const [editedMaterial, setEditedMaterial] = useState();
  useEffect(() => {
    if (!!Material) {
      setEditedMaterial(Material);
    }
  }, [Material]);

  const handleFormChange = (event) => {
    const { value, name } = event.target;
    setEditedMaterial({ ...editedMaterial, [name]: value });
  };

  return (
    <Dialog open={!!Material}>
      {editedMaterial && (
        <div className={classes.container}>
          <Title title={`MATERIAL ${editedMaterial.name}`} Icon={Eco} />
          <div className={classes.formContainer}>
            <Form
              material={editedMaterial}
              formErrors={onErrors}
              onChangeHandler={handleFormChange}
              groupList={groupList}
              priceList={priceList}
              groupName={editedMaterial.material_group}
              priceName={editedMaterial.material_pricing_group}
            />
          </div>
          <div className={classes.buttonsContainer}>
            {user && user.role === 'Admin' && (
              <Button
                className={classes.modalButtons}
                color="green"
                onClick={() =>
                  editedMaterial.id
                    ? onEditMaterial(editedMaterial)
                    : onNewMaterial(editedMaterial)
                }
              >
                {`${editedMaterial.id ? 'Guardar' : 'Crear'}`}
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
  Material: selectedMaterial(state),
  onErrors: getMaterialErrors(state),
  // groupList: selectMaterialGroups(state),
  // priceList: selectMaterialPrices(state),
  user: selectUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(clearSelectedMaterial()),
  onNewMaterial: (newMaterial) => dispatch(addNewMaterial(newMaterial)),
  onEditMaterial: (editedMaterial) =>
    dispatch(saveEditMaterial(editedMaterial)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MaterialModal);
