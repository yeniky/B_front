import React from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';

//components
import ZoneHistory from 'components/MetricsView/ZoneHistory.component';
import BinTime from 'components/MetricsView//BinTime.component';
import AlertHistory from 'components/MetricsView//AlertHistory.component';

const MetricsView = ({ zoneData, associationData }) => {
  const classes = useStyles();

  return (
    <section>
      <div className={classes.container}>
        <ZoneHistory />
        <BinTime />
        <AlertHistory />
      </div>
    </section>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    padding: '2rem',
  },
}));

export default MetricsView;
