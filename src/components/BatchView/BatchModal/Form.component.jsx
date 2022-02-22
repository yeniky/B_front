import React from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';

//components
import Label from 'components/ui/Label.component';
import Select from 'components/Select.component';
import Input from 'components/Input.component';
import { useSelector } from 'react-redux';

const BatchForm = ({
  batch,
  ordersList,
  onChangeHandler,
  onSelectorOpen,
  formErrors,
}) => {
  const classes = useStyles();

  const user = useSelector((state) => state.user);

  const typeOptions = [
    { label: 'Salida', value: 'out' },
    { label: 'Entrada', value: 'in' },
  ];

  const ordersOptions = ordersList.map((orderItem) => ({
    label: orderItem.name,
    value: orderItem.name,
  }));

  console.log(ordersList);
  console.log(batch);

  return (
    <div className={classes.container}>
      <div className={classes.formItem}>
        <Label textLabel="ID:" />
        <Input
          className={classes.formInput}
          name="name"
          placeholder="<ID_BATCH>"
          value={batch.name}
          handleChange={onChangeHandler}
          maxLength={20}
          error={formErrors.name}
          disabled={user && user.role !== 'Admin'}
        />
      </div>
      <div className={classes.formItem}>
        <Label textLabel="Tipo:" />
        <Select
          className={classes.formInput}
          name="type"
          placeholder="Seleccione Tipo"
          options={typeOptions}
          value={batch.type}
          handleChange={onChangeHandler}
          error={formErrors.type}
          disabled={user && user.role !== 'Admin'}
        />
      </div>
      <div className={classes.formItem}>
        <Label textLabel="Orden:" />
        <Select
          className={classes.formInput}
          name="order"
          placeholder="Seleccione Orden"
          options={ordersOptions}
          value={batch.order?.name ? batch.order.name : batch.order}
          handleChange={onChangeHandler}
          error={formErrors.order}
          onOpen={onSelectorOpen}
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
    marginLeft: '0.7rem',
    width: '13rem',
  },
}));

export default BatchForm;
