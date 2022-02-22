import React from 'react';

// redux
import { useSelector } from 'react-redux';
import { selectZoneNames } from 'redux/Zones/zones.selectors';

// styles components
import { makeStyles } from '@material-ui/styles';

// components
import Label from 'components/ui/Label.component';
import Input from 'components/Input.component';

// import Select from '@material-ui/core/Select';
import Select from 'components/Select.component';

import CheckBox from '@material-ui/core/Checkbox';

const BeaconForm = ({ beacon, onChangeHandler, formErrors }) => {
  const classes = useStyles();

  const zoneNames = useSelector(selectZoneNames);
  const user = useSelector((state) => state.user);

  const zoneOptions = zoneNames.map((zoneName) => ({
    label: zoneName,
    value: zoneName,
  }));

  const ITEM_HEIGHT = 54;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    style: {
      maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,
      // width: 500,
    },
  };

  return (
    <div className={classes.container}>
      <div className={classes.formItem}>
        <Label textLabel="NOMBRE:" />
        <Input
          className={classes.formInput}
          name="name"
          placeholder="<NOMBRE_DE_BALIZA>"
          value={beacon.name || ''}
          handleChange={onChangeHandler}
          maxLength={20}
          error={formErrors.username}
          disabled
        />
      </div>

      <div className={classes.formItem}>
        <Label textLabel="Zona:" />
        <Select
          className={classes.formInput}
          name="zone"
          placeholder="Sin Zona"
          options={zoneOptions}
          value={beacon.zone}
          handleChange={onChangeHandler}
          error={formErrors.role}
          disabled={user.role !== 'Admin' || !beacon.connector_active}
          MenuProps={MenuProps}
        />
      </div>

      <div className={classes.formItem}>
        <Label textLabel="Activa:" />
        <div className={classes.formInput}>
          <CheckBox
            name="connector_active"
            checked={beacon.connector_active}
            onChange={onChangeHandler}
          />
        </div>
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

export default BeaconForm;
