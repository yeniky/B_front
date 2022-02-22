import React, { useMemo } from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';

//components
import Label from 'components/ui/Label.component';
import Input from 'components/Input.component';
import Select from 'components/Select.component';
import { connect } from 'react-redux';

import { selectBinTypes } from 'redux/Bins/bins.selectors';
import { selectUser } from 'redux/Users/user.selectors';

//TODO: Modificar Validaciones
//TODO: cambiar flujo tag

const Form = ({
  bin,
  binTypes,
  onChangeHandler,
  batchList,
  formErrors,
  /*tagList*/
  user,
}) => {
  const classes = useStyles();

  const binTypesOptions = useMemo(
    () =>
      binTypes.map((binType) => ({ label: binType.name, value: binType.name })),
    [binTypes]
  );

  /*   const tagOptions = tagList.map((tagFiltered) => ({
    label: tagFiltered.address,
    value: tagFiltered.address,
  })); */

  const batchOptions = batchList.map((batchItem) => ({
    label: batchItem.name,
    value: batchItem.name,
  }));

  return (
    <div className={classes.container}>
      <div className={classes.formItem}>
        <Label textLabel="ID:" />
        <Input
          className={classes.formInput}
          value={bin.name}
          handleChange={onChangeHandler}
          name="name"
          maxLength={20}
          error={formErrors.name}
          placeholder="Ingrese ID"
          disabled={user && user.role !== 'Admin'}
        />
      </div>
      <div className={classes.formItem}>
        <Label textLabel="Tipo:" />
        <Select
          className={classes.formInput}
          value={bin.type}
          options={binTypesOptions}
          handleChange={onChangeHandler}
          name="type"
          placeholder="Seleccione Tipo"
          error={formErrors.type}
          disabled={user && user.role !== 'Admin'}
        />
      </div>
      <div className={classes.formItem}>
        <Label textLabel="Batch:" />
        <Select
          className={classes.formInput}
          value={bin.batch}
          options={batchOptions}
          handleChange={onChangeHandler}
          name="batch"
          placeholder="Seleccione Batch"
          disabled={user && user.role !== 'Admin'}
        />
      </div>
      <div className={classes.formItem}>
        <Label textLabel="Tag:" />
        <Input
          className={classes.formInput}
          placeholder={`${bin.tag ? bin.tag : '...'}`}
          disabled
        />
        {/*         <Select
          className={classes.formInput}
          value={bin.tag}
          options={tagOptions}
          handleChange={onChangeHandler}
          name="tag"
          placeholder="..."
          white
        /> */}
      </div>
      <div className={classes.formItem} style={{ alignItems: 'flex-start' }}>
        <Label textLabel="Descripción:" />
        <Input
          className={classes.formInput}
          value={bin.description}
          handleChange={onChangeHandler}
          name="description"
          multiline
          rows={7}
          maxLength={50}
          placeholder="Ingrese Descripción"
          disabled={user && user.role !== 'Admin'}
        />
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {},
  formItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  formInput: {
    width: '15rem',
    marginLeft: '1.5rem',
  },
}));

const mapStateToProps = (state) => ({
  binTypes: selectBinTypes(state),
  user: selectUser(state),
});

export default connect(mapStateToProps, undefined)(Form);
