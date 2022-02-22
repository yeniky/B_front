import React from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';

//components
import Label from 'components/ui/Label.component';
import Input from 'components/Input.component';
// import Select from '@material-ui/core/Select';
import Select from 'components/Select.component';

import CheckBox from '@material-ui/core/Checkbox';

const UserForm = ({ user, onChangeHandler, formErrors }) => {
  const classes = useStyles();

  const userRoles = ['User', 'Supervisor', 'Admin'].map((role) => ({
    label: role,
    value: role,
  }));

  return (
    <div className={classes.container}>
      {user.id !== undefined && (
        <div className={classes.formItem}>
          <Label textLabel="NOMBRE:" />
          <Input
            className={classes.formInput}
            name="username"
            placeholder="<NOMBRE_DE_USUARIO>"
            value={user.username || ''}
            handleChange={onChangeHandler}
            maxLength={20}
            error={formErrors.username}
            disabled
          />
        </div>
      )}
      <div className={classes.formItem}>
        <Label textLabel="EMAIL:" />
        <Input
          className={classes.formInput}
          name="email"
          placeholder="Ingrese email"
          value={user.email || ''}
          handleChange={onChangeHandler}
          maxLength={30}
          error={formErrors.email}
          disabled={user.id !== undefined}
        />
      </div>
      <div className={classes.formItem}>
        <Label textLabel="Rol:" />
        <Select
          className={classes.formInput}
          name="role"
          placeholder="Seleccione Rol"
          options={userRoles}
          value={user.role || ''}
          handleChange={onChangeHandler}
          error={formErrors.role}
        />
      </div>
      {user.id !== undefined && (
        <div className={classes.formItem}>
          <Label textLabel="Activo:" />
          <div className={classes.formInput}>
            <CheckBox
              name="active"
              checked={user.active}
              onChange={onChangeHandler}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  formItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  formInput: {
    marginLeft: '0.7rem',
    width: '18.5rem',
  },
}));

export default UserForm;
