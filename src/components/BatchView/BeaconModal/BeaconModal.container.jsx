import React, { useState, useEffect } from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';
import { Dialog } from '@material-ui/core';
import { Flare } from '@material-ui/icons';

//components
import Title from 'components/ui/ModalTitle.component';
import Button from 'components/Button.component';

import BeaconForm from 'components/BatchView/BeaconModal/BeaconForm.component';

const BeaconModal = ({ Beacon, onErrors, onCloseModal, onEditBeacon }) => {
  const classes = useStyles();

  const [editedBeacon, setEditedBeacon] = useState();
  const [errors, setErrors] = useState(onErrors);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!!Beacon) {
      setEditedBeacon(Beacon);
    }
  }, [Beacon]);

  const handleFormChange = (event) => {
    let { value, name } = event.target;

    if (name === 'connector_active') {
      setEditedBeacon({
        ...editedBeacon,
        connector_active: !!event.target.checked,
      });
      return;
    }

    setEditedBeacon({ ...editedBeacon, [name]: value });
  };

  return (
    <Dialog open={!!Beacon}>
      {editedBeacon && (
        <div className={classes.container}>
          <Title title={`BALIZA ${editedBeacon.name}`} Icon={Flare} />
          <div className={classes.formContainer}>
            <BeaconForm
              beacon={editedBeacon}
              formErrors={errors}
              onChangeHandler={handleFormChange}
            />
          </div>
          <div className={classes.buttonsContainer}>
            <Button
              className={classes.modalButtons}
              color="green"
              onClick={() => {
                setIsLoading(true);
                onEditBeacon(editedBeacon);
              }}
              isLoading={isLoading}
            >
              {'Guardar'}
            </Button>
            <Button
              className={classes.modalButtons}
              color="red"
              onClick={() => {
                setErrors({});
                onCloseModal();
              }}
            >
              {isLoading ? 'Cerrar' : 'Cancelar'}
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

export default BeaconModal;
