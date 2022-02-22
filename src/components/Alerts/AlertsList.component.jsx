import React from 'react';

//redux
import { connect } from 'react-redux';

import { selectAlerts } from 'redux/Alerts/Alerts.selectors';

//styles components
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { Error } from '@material-ui/icons';

//components
import AlertItem from 'components/Alerts/AlertItem.component';

const AlertList = ({ alerts }) => {
  const classes = useStyles();

  console.log(alerts);

  return (
    <section className={classes.container}>
      <div className={classes.alertTitle}>
        <Error className={classes.iconAlert} />
        <Typography className={classes.title} component="h1">
          {'ALERTAS ACTIVAS'}
        </Typography>
      </div>
      <div className={classes.alertList}>
        {alerts.map((alertElement) => (
          <AlertItem
            key={`${alertElement.id}_${alertElement.alert_type}`}
            alert={alertElement}
          />
        ))}
      </div>
    </section>
  );
};

const useStyles = makeStyles((theme) => ({
  alertTitle: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
    color: theme.palette.common.red,
  },
  title: {
    fontWeight: 'bold',
    fontSize: '2rem',
  },
  iconAlert: {
    width: '3.5rem',
    height: '3.5rem',
    marginRight: '0.5rem',
  },
  alertList: {
    marginTop: '1rem',
  },
}));

const mapStateToProps = (state) => ({
  alerts: selectAlerts(state),
});

export default connect(mapStateToProps)(AlertList);
