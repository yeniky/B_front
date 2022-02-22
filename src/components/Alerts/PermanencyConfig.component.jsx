import React, { useState } from 'react';

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

const Permanency = ({ rules, addRule, editRule, zones }) => {
  const classes = useStyles();

  const user = useSelector((state) => state.user);

  const [newRule, setNewRule] = useState(false);

  const [ruleData, setRuleData] = useState({ zones: [], time: '', id: -1 });
  const { zones: selectedZones, time, id } = ruleData;

  const [errors, setErrors] = useState({ zones: false, time: false });

  const zoneOptions =
    /*[{ label: 'Sin Zona', value: 'sin zona' }].concat(*/
    zones
      .filter(
        (zoneItem) =>
          !rules.find((r) => r.id !== id && r.zones.indexOf(zoneItem.name) >= 0)
      )
      .map(
        (zoneItem) => ({
          label: zoneItem.name,
          value: zoneItem.name,
        })
        // )
      );

  const handleRuleChange = (event) => {
    const { name, value } = event.target;

    const posNumRegEx = /^[1-9]\d*$/;
    const endsWithDigitRegEx = /\d$/;
    if (name === 'time' && value !== '' && !posNumRegEx.test(value)) {
      if (value.length <= 1 || endsWithDigitRegEx.test(value)) {
        setErrors({ ...errors, [name]: 'Debe ingresar un número positivo' });
      }
    } else if (
      name === 'zones' &&
      value.findIndex((menuItem) => menuItem === '') >= 0
    ) {
      const zoneValues = zones.map((zoneItem) => zoneItem.name);
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
    if (selectedZones.length === 0 || time === '') {
      setErrors({
        zones:
          selectedZones.length > 0
            ? false
            : 'Debe seleccionar al menos una zona',
        time: time ? false : 'Debe ingresar un número positivo',
      });
    } else if (!errors.zones && !errors.time) {
      if (id < 0) {
        addRule('zone', { ...ruleData, time: parseInt(time) });
      } else {
        editRule('zone', { ...ruleData, time: parseInt(time) });
      }
      resetForm();
    }
  };

  const handleEditRule = (data) => {
    if (id === data.id) {
      setRuleData({ zones: [], time: '', id: -1 });
    } else {
      if (data.id < 0) {
        setRuleData({ zones: [], time: '', id: -1 });
      } else {
        setRuleData({ zones: data.zones, time: data.time, id: data.id });
      }
    }

    setNewRule(id !== data.id && data.id >= 0);
  };

  const resetForm = () => {
    setRuleData({ zones: [], time: '', id: -1 });
    setErrors({ zones: false, time: false });
  };

  const ITEM_HEIGHT = 54;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    style: {
      maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,
      // width: 250,
    },
  };

  return (
    <section className={classes.container}>
      <Title
        title="permanencia"
        description="Alerta de permanencia de un tag durante un tiempo determinado en una zona."
      />
      <div className={classes.rulesList}>
        {rules.length > 0 ? (
          rules.map((rule) => (
            <AlertConfig
              key={rule.id}
              data={rule}
              type={'zone'}
              onEditRule={handleEditRule}
              selectedId={id}
            />
          ))
        ) : user.role !== 'Admin' ? (
          <Typography component="h4">
            {'No hay alertas de permanencia configuradas.'}
          </Typography>
        ) : (
          ''
        )}
      </div>
      {newRule && (
        <div className={classes.newRuleContainer}>
          <div className={classes.newRuleOptions}>
            <Input
              name="time"
              placeholder="Tiempo"
              value={time}
              handleChange={handleRuleChange}
              min={0}
              error={errors.time}
              containerStyles={{ width: '49%' }}
              className={classes.widthItem}
              endAdornment={'minutos'}
            />
            <Select
              name="zones"
              placeholder="Seleccionar todas"
              options={zoneOptions}
              value={selectedZones}
              handleChange={handleRuleChange}
              error={errors.zones}
              containerStyles={{ width: '49%' }}
              className={classes.widthItem}
              multiple
              showCheckBox={true}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <p>{'Zonas'}</p>;
                }
                if (selected.length === zones.length) {
                  return <p>{'Todas las zonas'}</p>;
                }

                return selected.join(', ');
              }}
              MenuProps={MenuProps}
            />
          </div>
          <div className={classes.buttonsContainer}>
            <IconButton accept onClick={handleAddRule} />
            <IconButton
              cancel
              onClick={() => {
                setNewRule(false);
                resetForm();
              }}
              style={{ marginLeft: '1rem' }}
            />
          </div>
        </div>
      )}
      {user && user.role === 'Admin' && (
        <IconButton
          add
          onClick={() => {
            setRuleData({ zones: [], time: '', id: -1 });
            setNewRule(true);
          }}
        />
      )}
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

export default Permanency;
