import React, { useEffect } from 'react';

//redux
import { connect } from 'react-redux';

import {
  fetchRules,
  createRule,
  editRule,
  fetchSubscriptions,
} from 'redux/Rules/rules.actions';

import {
  selectPermanencyRules,
  selectProximityRules,
  selectSeparationRules,
  selectCleanupRules,
} from 'redux/Rules/rules.selectors';
import { selectZones } from 'redux/Zones/zones.selectors';

//styles components
import { makeStyles } from '@material-ui/core';

//components
import AlertsList from 'components/Alerts/AlertsList.component';
import Permanency from 'components/Alerts/PermanencyConfig.component';
import Proximity from 'components/Alerts/ProximityConfig.component';
import Separation from 'components/Alerts/SeparationConfig.component';
import Cleanup from 'components/Alerts/CleanupConfig.component';

const AlertsPage = ({
  fetch,
  onNewRule,
  onEditRule,
  permanencyRules,
  proximityRules,
  separationRules,
  cleanupRules,
  zones,
}) => {
  const classes = useStyles();

  useEffect(() => {
    console.log('fetching');
    fetch();
  }, []);

  return (
    <main className={classes.container}>
      <AlertsList />
      <Proximity rules={proximityRules} addRule={onNewRule} zonesList={zones} />
      <Separation rules={separationRules} addRule={onNewRule} />
      <Permanency
        rules={permanencyRules}
        addRule={onNewRule}
        zones={[{ name: 'Sin Zona' }].concat(zones)}
        editRule={onEditRule}
      />
      <Cleanup rules={cleanupRules} />
    </main>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: '1rem 2rem',
  },
}));

const mapStateToProps = (state) => ({
  permanencyRules: selectPermanencyRules(state),
  proximityRules: selectProximityRules(state),
  separationRules: selectSeparationRules(state),
  cleanupRules: selectCleanupRules(state),
  zones: selectZones(state),
});

const mapDispatchToProps = (dispatch) => ({
  fetch: () => {
    dispatch(fetchRules());
    dispatch(fetchSubscriptions());
  },
  onNewRule: (type, data) => dispatch(createRule(type, data)),
  onEditRule: (type, data) => dispatch(editRule(type, data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertsPage);
