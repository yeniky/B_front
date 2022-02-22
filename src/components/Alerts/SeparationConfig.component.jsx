import React, { useState, useEffect } from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';

//components
import Title from 'components/Alerts/ConfigTitle.component';
import AlertConfig from 'components/Alerts/AlertItemConfig.component';

import Input from 'components/Input.component';
import IconButton from 'components/IconButton.component';
import { useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';

const Permanency = ({ rules, addRule }) => {
  const classes = useStyles();

  const user = useSelector((state) => state.user);

  const [newRule, setNewRule] = useState(user && user.role === 'Admin');

  const [ruleData, setRuleData] = useState({
    distance: '',
    time: '',
    id: -1,
  });
  const { distance, time, id } = ruleData;

  const [errors, setErrors] = useState({
    distance: false,
    time: false,
  });

  useEffect(() => {
    if (rules.length > 0) {
      setNewRule(false);
    }
  }, [rules]);

  const handleRuleChange = (event) => {
    const { name, value } = event.target;

    const posNumRegEx = /^[1-9]\d*$/;
    const endsWithDigitRegEx = /\d$/;
    if (value !== '' && !posNumRegEx.test(value)) {
      if (value.length <= 1 || endsWithDigitRegEx.test(value)) {
        setErrors({ ...errors, [name]: 'Debe ingresar un número positivo' });
      }
    } else {
      setRuleData({ ...ruleData, [name]: value });
      setErrors({ ...errors, [name]: false });
    }
  };

  const handleAddRule = () => {
    if (distance === '' || time === '') {
      setErrors({
        distance: distance ? false : 'Debe ingresar un número positivo',
        time: time ? false : 'Debe ingresar un número positivo',
      });
    } else if (!errors.distance && !errors.time) {
      const ruleOptions = {
        distance: parseInt(distance),
        time: parseInt(time),
      };
      addRule('batch', ruleOptions);
      setNewRule(false);
      resetForm();
    }
  };

  const handleEditRule = (data) => {
    if (id === data.id) {
      setRuleData({ time: '', distance: '', id: -1 });
    } else {
      if (data.id < 0) {
        setRuleData({ time: '', distance: '', id: -1 });
      } else {
        setRuleData({ time: data.time, distance: data.distance, id: data.id });
      }
    }

    setNewRule(!newRule);
  };

  const resetForm = () => {
    setRuleData({
      distance: '',
      time: '',
    });
    setErrors({
      distance: false,
      time: false,
    });
  };

  return (
    <section className={classes.container}>
      <Title
        title="separación"
        description="Alerta de separación de un tag de su batch durante un tiempo determinado y una distancia."
      />
      <div className={classes.rulesList}>
        {rules.length > 0 ? (
          rules.map((rule) => (
            <AlertConfig
              key={rule.id}
              data={rule}
              type={'batch'}
              onEditRule={handleEditRule}
              selectedId={id}
            />
          ))
        ) : user.role !== 'Admin' ? (
          <Typography component="h4">
            {'No hay alerta de separación configurada.'}
          </Typography>
        ) : (
          ''
        )}
      </div>
      {newRule && (
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
