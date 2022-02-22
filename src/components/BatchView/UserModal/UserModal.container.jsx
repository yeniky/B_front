import React, { useState, useEffect } from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';
import { Dialog } from '@material-ui/core';
import { Person } from '@material-ui/icons';

//components
import Title from 'components/ui/ModalTitle.component';
import Button from 'components/Button.component';

import UserForm from 'components/BatchView/UserModal/UserForm.component';

const UserModal = ({ User, closeModal, onErrors, onEditUser, onNewUser }) => {
  const classes = useStyles();

  const [editedUser, setEditedUser] = useState();
  const [errors, setErrors] = useState(onErrors);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!!User) {
      setEditedUser(User);
    }
  }, [User]);

  const handleFormChange = (event) => {
    let { value, name } = event.target;
    if (name === 'active') {
      setEditedUser({ ...editedUser, active: !!event.target.checked });
      return;
    }
    if (name === 'role' && value === '') {
      setErrors({ role: 'Debe seleccionar un rol.' });
    } else setErrors({});
    setEditedUser({ ...editedUser, [name]: value });
  };

  return (
    <Dialog open={!!User}>
      {editedUser && (
        <div className={classes.container}>
          <Title
            title={`USUARIO ${editedUser.username || 'NUEVO'}`}
            Icon={Person}
          />
          <div className={classes.formContainer}>
            <UserForm
              user={editedUser}
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
                const promise = editedUser.id
                  ? onEditUser(editedUser)
                  : onNewUser(editedUser);
                promise.finally(() => setIsLoading(false));
              }}
              isLoading={isLoading}
            >
              {`${editedUser.id ? 'Guardar' : 'Crear'}`}
            </Button>
            <Button
              className={classes.modalButtons}
              color="red"
              onClick={() => {
                setErrors({});
                closeModal();
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

export default UserModal;
