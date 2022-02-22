import React, { useState, useEffect } from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';

//components
import Title from 'components/Alerts/ConfigTitle.component';
import AlertConfig from 'components/Alerts/AlertItemConfig.component';

import Select from 'components/Select.component';
import Input from 'components/Input.component';
import IconButton from 'components/IconButton.component';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';

const Proximity = ({ rules, addRule, zonesList }) => {
  const classes = useStyles();

  const user = useSelector((state) => state.user);

  const [newRule, setNewRule] = useState(user && user.role === 'Admin');

  const [ruleData, setRuleData] = useState({
    distance: '',
    zones: [],
    id: -1,
  });
  const { distance, zones, id } = ruleData;

  const [errors, setErrors] = useState({
    distance: false,
    zones: false,
  });

  const zoneOptions = [
    { label: 'Todas', value: 'all' },
    ...zonesList.map((zoneItem) => ({
      label: zoneItem.name,
      value: zoneItem.name,
    })),
  ];

  useEffect(() => {
    if (rules.length > 0) {
      setNewRule(false);
    }
  }, [rules]);

  const handleRuleChange = (event) => {
    const { name, value } = event.target;

    const posNumRegEx = /^[1-9]\d*$/;
    const endsWithDigitRegEx = /\d$/;
    if (name === 'distance' && value !== '' && !posNumRegEx.test(value)) {
      if (value.length <= 1 || endsWithDigitRegEx.test(value)) {
        setErrors({ ...errors, [name]: 'Debe ingresar un número positivo' });
      }
    } else if (
      name === 'zones' &&
      value.find((menuItem) => menuItem === 'all')
    ) {
      const zoneValues = zonesList.map((zoneItem) => zoneItem.name);
      if (JSON.stringify(ruleData.zones) === JSON.stringify(zoneValues)) {
        setRuleData({
          ...ruleData,
          zones: [],
        });
        setErrors({ ...errors, [name]: false });
      } else {
        setRuleData({
          ...ruleData,
          zones: zoneValues,
        });
        setErrors({ ...errors, [name]: false });
      }
    } else {
      setRuleData({ ...ruleData, [name]: value });
      setErrors({ ...errors, [name]: false });
    }
  };

  const handleAddRule = () => {
    if (zones.length === 0 || distance === '') {
      setErrors({
        zones: zones.length > 0 ? false : 'Debe seleccionar al menos una zona',
        distance: distance ? false : 'Debe ingresar un número positivo',
      });
    } else if (!errors.zones && !errors.distance) {
      addRule('proximity', { ...ruleData, distance: parseInt(distance) });
      setNewRule(false);
      resetForm();
    }
  };

  const handleEditRule = (data) => {
    if (id === data.id) {
      setRuleData({ zones: [], time: '', id: -1 });
    } else {
      if (data.id < 0) {
        setRuleData({ zones: [], distance: '', id: -1 });
      } else {
        setRuleData({
          zones: data.zones,
          distance: data.distance,
          id: data.id,
        });
      }
    }
    setNewRule(!newRule);
  };

  const resetForm = () => {
    setRuleData({
      distance: '',
      zones: [],
    });
    setErrors({
      distance: false,
      zones: false,
    });
  };

  const ITEM_HEIGHT = 54;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    style: {
      maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,
      // width: 500,
    },
  };

  return (
    <section className={classes.container}>
      <Title
        title="proximidad"
        description="Alerta de proximidad entre materiales, se establece la distancia y las zonas a excluir."
      />
      <div className={classes.rulesList}>
        {rules.length > 0 ? (
          rules.map((rule) => (
            <AlertConfig
              key={rule.id}
              data={rule}
              type={'proximity'}
              onEditRule={handleEditRule}
              selectedId={id}
            />
          ))
        ) : user.role !== 'Admin' ? (
          <Typography component="h4">
            {'No hay alerta de proximidad configurada.'}
          </Typography>
        ) : (
          ''
        )}
      </div>
      {user && user.role === 'Admin' && newRule && (
        <div className={classes.newRuleContainer}>
          <div className={classes.newRuleOptions}>
            <Input
              name="distance"
              placeholder="Distancia"
              value={distance}
              handleChange={handleRuleChange}
              min={0}
              error={errors.distance}
              containerStyles={{ width: '49%' }}
              className={classes.widthItem}
              endAdornment={'metros'}
            />
            <Select
              name="zones"
              options={zoneOptions}
              value={zones}
              handleChange={handleRuleChange}
              error={errors.zones}
              multiple
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <p>{'Zonas'}</p>;
                }
                if (selected.length === zonesList.length) {
                  return <p>{'Todas las zonas'}</p>;
                }

                return selected.join(', ');
              }}
              containerStyles={{ width: '49%' }}
              className={classes.widthItem}
              showCheckBox={true}
              MenuProps={MenuProps}
            />
          </div>
          <div className={classes.buttonsContainer}>
            <IconButton accept onClick={handleAddRule} />
            {id >= 0 && (
              <IconButton
                cancel
                onClick={() => {
                  setNewRule(false);
                  resetForm();
                }}
                style={{ marginLeft: '1rem' }}
              />
            )}
          </div>
        </div>
      )}
      {/* {user && user.role === 'Admin' && (
        <IconButton add onClick={() => setNewRule(true)} />
      )} */}
    </section>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '2rem 0',
  },
  rulesList: {
    margin: '1rem 0',
  },
  newRuleContainer: {
    width: '60%',
    display: 'flex',
    alignItems: 'center',
    margin: '1rem 0',
  },
  newRuleOptions: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginLeft: '1rem',
  },
  widthItem: {
    width: '100%',
  },
}));

export default Proximity;
