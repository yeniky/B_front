import React, { useState, useEffect } from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';

//components
import Label from 'components/ui/Label.component';
import Select from 'components/Select.component';
import Input from 'components/Input.component';
import MaterialGroupModal from 'components/BatchView/MaterialModal/MaterialGroupModal.container';
import MaterialPriceGroupModal from 'components/BatchView/MaterialModal/MaterialPriceGroupModal.container';

import { useSelector, useDispatch } from 'react-redux';
import {
  setSelectedMaterialGroup,
  setSelectedMaterialPriceGroup,
} from 'redux/Materials/materials.actions';

const MaterialForm = ({
  material,
  onChangeHandler,
  formErrors,
  groupList,
  priceList,
  groupName,
  priceName,
}) => {
  const classes = useStyles();

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const groupOptions = groupList.map((group) => ({
    label: group.name,
    value: group.name,
  }));
  const priceOptions = priceList.map((price) => ({
    label: price.name,
    value: price.name,
  }));

  const [groupDesc, setGroupDesc] = useState();
  useEffect(() => {
    const groupFound = groupList.find(
      (groupItem) => groupItem.name === groupName
    );
    setGroupDesc(groupFound ? groupFound.description : '');
  }, [groupName, groupList]);

  const [priceDesc, setPriceDesc] = useState();
  useEffect(() => {
    const priceFound = priceList.find(
      (priceItem) => priceItem.name === priceName
    );
    setPriceDesc(priceFound ? priceFound.description : '');
  }, [priceName, priceList]);

  return (
    <div className={classes.container}>
      <div className={classes.formItem}>
        <Label textLabel="ID:" />
        <Input
          className={classes.formInput}
          name="name"
          placeholder="<ID_MATERIAL>"
          value={material.name}
          handleChange={onChangeHandler}
          maxLength={20}
          error={formErrors.name}
          disabled={user && user.role !== 'Admin'}
        />
      </div>
      <div className={classes.formItem}>
        <Label textLabel="Material Description:" />
        <Input
          className={classes.formInput}
          name="description"
          placeholder="Ingrese Descripción"
          value={material.description}
          handleChange={onChangeHandler}
          maxLength={30}
          error={formErrors.description}
          disabled={user && user.role !== 'Admin'}
        />
      </div>
      <div className={classes.formItem}>
        <Label textLabel="Material Group (MG):" />
        <div
          onClick={() => {
            if (user && user.role !== 'Admin') {
              dispatch(
                setSelectedMaterialGroup(
                  groupList.find((mg) => mg.name === material.material_group)
                )
              );
            }
          }}
        >
          <Select
            className={classes.formInput}
            name="material_group"
            placeholder="Seleccione Material Group"
            options={groupOptions}
            value={material.material_group}
            handleChange={onChangeHandler}
            error={formErrors.material_group}
            disabled={user && user.role !== 'Admin'}
          />
        </div>
      </div>
      <div className={classes.formItem}>
        <Label textLabel="MG Description:" />
        <Input
          className={classes.formInput}
          placeholder={`${groupDesc}`}
          disabled
        />
      </div>
      <div className={classes.formItem}>
        <Label textLabel="Material Price Group (MPG):" />
        <div
          onClick={() => {
            if (user && user.role !== 'Admin') {
              dispatch(
                setSelectedMaterialPriceGroup(
                  priceList.find(
                    (price) => price.name === material.material_pricing_group
                  )
                )
              );
            }
          }}
        >
          <Select
            className={classes.formInput}
            name="material_pricing_group"
            placeholder="Seleccione Material Pricing Group"
            options={priceOptions}
            value={material.material_pricing_group}
            handleChange={onChangeHandler}
            error={formErrors.material_pricing_group}
            disabled={user && user.role !== 'Admin'}
          />
        </div>
      </div>
      <div className={classes.formItem}>
        <Label textLabel="MPG Description:" />
        <Input
          className={classes.formInput}
          placeholder={`${priceDesc}`}
          disabled
        />
      </div>
      <div className={classes.formItem}>
        <Label textLabel="Type of Reproduction:" />
        <Input
          className={classes.formInput}
          name="reproduction_type"
          placeholder="Ingrese type of reproduction"
          value={material.reproduction_type || ''}
          handleChange={onChangeHandler}
          maxLength={20}
          disabled={user && user.role !== 'Admin'}
        />
      </div>
      <div className={classes.formItem}>
        <Label textLabel="Phase:" />
        <Input
          className={classes.formInput}
          name="phase"
          placeholder="Ingrese phase"
          value={material.phase || ''}
          handleChange={onChangeHandler}
          maxLength={20}
          disabled={user && user.role !== 'Admin'}
        />
      </div>
      <div className={classes.formItem}>
        <Label textLabel="Package Type:" />
        <Input
          className={classes.formInput}
          name="package_type"
          placeholder="Ingrese package type"
          value={material.package_type || ''}
          handleChange={onChangeHandler}
          maxLength={20}
          disabled={user && user.role !== 'Admin'}
        />
      </div>
      <div className={classes.formItem}>
        <Label textLabel="Variety Name:" />
        <Input
          className={classes.formInput}
          name="variety_name"
          placeholder="Ingrese variety name"
          value={material.variety_name || ''}
          handleChange={onChangeHandler}
          maxLength={20}
          disabled={user && user.role !== 'Admin'}
        />
      </div>
      <MaterialGroupModal />
      <MaterialPriceGroupModal />
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

export default MaterialForm;
