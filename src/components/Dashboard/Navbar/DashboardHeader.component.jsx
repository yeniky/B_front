import React from 'react';
import { Visibility } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

import NavButton from 'components/NavButton.component';

const DashboardHeader = ({ setActiveTab, activeTab }) => {
  const classes = useStyles();
  return (
    <div className={classes.buttonsContainer}>
      <Visibility className={classes.visibilityLogo} />
      <NavButton
        active={'viewAll' === activeTab}
        onClick={() => setActiveTab('viewAll')}
      >
        Todos
      </NavButton>
      <NavButton
        active={'viewZones' === activeTab}
        onClick={() => setActiveTab('viewZones')}
      >
        Zonas
      </NavButton>
      <NavButton
        active={'viewFilter' === activeTab}
        onClick={() => setActiveTab('viewFilter')}
      >
        Filtrar
      </NavButton>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  visibilityLogo: {
    color: 'white',
    height: '2.2rem',
    width: '3rem',
    marginRight: 5,
  },
}));
export default DashboardHeader;
