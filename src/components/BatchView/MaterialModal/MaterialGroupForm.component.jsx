import React from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';

//components
import Label from 'components/ui/Label.component';
import Input from 'components/Input.component';
import { useSelector } from 'react-redux';

const MaterialGroupForm = ({ materialGroup, onChangeHandler, formErrors }) => {
  const classes = useStyles();

  const user = useSelector((state) => state.user);

  return (
    <div className={classes.container}>
      {/* <div className={classes.formItem}>
        <Label textLabel="ID:" />
        <Input
          className={classes.formInput}
          name="name"
          placeholder="<ID_MATERIAL>"
          value={material.name}
          handleChange={onChangeHandler}
          maxLength={20}
          error={formErrors.name}
        />
      </div> */}
      <div className={classes.formItem}>
        <Label textLabel="Material Group Name:" />
        <Input
          className={classes.formInput}
          name="name"
          placeholder="Ingrese Nombre del Material Group"
          value={materialGroup.name}
          handleChange={onChangeHandler}
          maxLength={20}
          disabled={user && user.role !== 'Admin'}
        />
      </div>
      <div className={classes.formItem}>
        <Label textLabel="Material Group Description:" />
        <Input
          className={classes.formInput}
          name="description"
          placeholder="Ingrese Descripción"
          value={materialGroup.description}
          handleChange={onChangeHandler}
          maxLength={30}
          error={formErrors.description}
          disabled={user && user.role !== 'Admin'}
        />
      </div>
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

export default MaterialGroupForm;
