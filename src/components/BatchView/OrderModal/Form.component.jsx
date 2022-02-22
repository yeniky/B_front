import React, { useState, useEffect } from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';

//components
import Label from 'components/ui/Label.component';
import Select from 'components/Select.component';
import Input from 'components/Input.component';
import { useSelector } from 'react-redux';

const OrderForm = ({
  order,
  orderTypes,
  materialList,
  materialName,
  onChangeHandler,
  formErrors,
}) => {
  const classes = useStyles();

  const user = useSelector((state) => state.user);

  const [material, setMaterial] = useState();

  const typeOptions = orderTypes.map((typeItem) => ({
    label: typeItem.name,
    value: typeItem.name,
  }));

  const materialOptions = materialList.map((materialItem) => ({
    label: materialItem.name,
    value: materialItem.name,
  }));

  useEffect(() => {
    setMaterial(
      materialList.find((materialItem) => materialItem.name === materialName)
    );
  }, [materialName, materialList]);

  return (
    <div className={classes.container}>
      <div className={classes.formColumn}>
        <div className={classes.formItem}>
          <Label textLabel="ID:" />
          <Input
            className={classes.formInput}
            name="name"
            placeholder="<ID_ORDEN>"
            value={order.name}
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
            name="order_type"
            placeholder="Seleccione Tipo"
            options={typeOptions}
            value={order.order_type}
            handleChange={onChangeHandler}
            error={formErrors.order_type}
            disabled={user && user.role !== 'Admin'}
          />
        </div>
        <div className={classes.formItem}>
          <Label textLabel="Material:" />
          <Select
            className={classes.formInput}
            name="material"
            placeholder="Seleccione Material"
            options={materialOptions}
            value={order.material}
            handleChange={onChangeHandler}
            error={formErrors.material}
            disabled={user && user.role !== 'Admin'}
          />
        </div>
        <div className={classes.formItem}>
          <Label textLabel="F. Inicio:" />
          <Input
            className={classes.formInput}
            name="start_date"
            placeholder="Ingrese fecha inicio"
            type="date"
            value={order.start_date}
            handleChange={onChangeHandler}
            error={formErrors.start_date}
            disabled={user && user.role !== 'Admin'}
          />
        </div>
        <div className={classes.formItem}>
          <Label textLabel="F. Termino:" />
          <Input
            className={classes.formInput}
            name="end_date"
            placeholder="Ingrese fecha termino"
            type="date"
            value={order.end_date}
            handleChange={onChangeHandler}
            error={formErrors.end_date}
            disabled={user && user.role !== 'Admin'}
          />
        </div>
        <div className={classes.formItem}>
          <Label textLabel="Agreement:" />
          <Input
            className={classes.formInput}
            name="agreement"
            placeholder="Ingrese agreement"
            value={order.agreement || ''}
            handleChange={onChangeHandler}
            maxLength={20}
            error={formErrors.agreement}
            disabled={user && user.role !== 'Admin'}
          />
        </div>
      </div>
      <div>
        <div className={classes.formItem}>
          <Label textLabel="Purch. doc:" />
          <Input
            className={classes.formInputLarge}
            name="purch_doc"
            placeholder="Ingrese Purch. doc"
            value={order.purch_doc || ''}
            handleChange={onChangeHandler}
            maxLength={20}
            error={formErrors.purch_doc}
            disabled={user && user.role !== 'Admin'}
          />
        </div>
        <div className={classes.formItem}>
          <Label textLabel="Material Desc:" />
          <Input
            className={classes.formInputLarge}
            placeholder={`${
              material && material.description ? material.description : ''
            }`}
            disabled
          />
        </div>
        <div className={classes.formItem}>
          <Label textLabel="MG:" />
          <Input
            className={classes.formInputLarge}
            placeholder={`${
              material && material.material_group ? material.material_group : ''
            }`}
            disabled
          />
        </div>
        <div className={classes.formItem}>
          <Label textLabel="MG Desc:" />
          <Input
            className={classes.formInputLarge}
            placeholder={`${
              material && material.material_group_desc
                ? material.material_group_desc
                : ''
            }`}
            disabled
          />
        </div>
        <div className={classes.formItem}>
          <Label textLabel="MPG:" />
          <Input
            className={classes.formInputLarge}
            placeholder={`${
              material && material.material_pricing_group
                ? material.material_pricing_group
                : ''
            }`}
            disabled
          />
        </div>
        <div className={classes.formItem}>
          <Label textLabel="MPG Desc:" />
          <Input
            className={classes.formInputLarge}
            placeholder={`${
              material && material.material_pricing_desc
                ? material.material_pricing_desc
                : ''
            }`}
            disabled
          />
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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
  formColumn: {
    marginRight: '1rem',
  },
  formInputLarge: {
    marginLeft: '0.7rem',
    width: '18rem',
  },
}));

export default OrderForm;
