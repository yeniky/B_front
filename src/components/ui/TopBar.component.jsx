import React from 'react';

import { NavLink, useLocation, useHistory } from 'react-router-dom';

import { connect } from 'react-redux';
import { selectCountAlerts } from 'redux/Alerts/Alerts.selectors';

import { makeStyles } from '@material-ui/styles';
import { ReactComponent as BayerLogo } from 'images/logo-wht.svg';
import { WarningRounded, AccountCircle } from '@material-ui/icons';
import { selectUser } from 'redux/Users/user.selectors';

const TopBar = ({ getNumberOfAlerts, user }) => {
  const classes = useStyles();
  const location = useLocation();

  const history = useHistory();

  // const user = useSelector((state) => state.user);

  const handleClickUser = () => {
    // const route = user.role === 'Admin' ? '/admin' : '/user';
    // history.push(route);
    history.push('/user');
  };

  return location.pathname !== '/' ? (
    <nav className={classes.container}>
      <NavLink className={classes.logoContainer} to={'/dashboard'}>
        <BayerLogo className={classes.logo} />
        <h4 className={classes.title}>{'Sistema de Posicionamiento'}</h4>
      </NavLink>
      <div>
        {getNumberOfAlerts > 0 && (
          <NavLink className={classes.notifications} to="/alerts">
            <WarningRounded className={classes.warningLogo} />
            <h3>{`${getNumberOfAlerts} ALERTAS ACTIVAS`}</h3>
          </NavLink>
        )}
      </div>
      {user && user.isLogguedIn && (
        <div className={classes.links}>
          <NavLink to={'/dashboard'} activeClassName={classes.active}>
            <p>Mapa</p>
          </NavLink>
          <p>&#47;</p>
          <NavLink to={'/alerts'} activeClassName={classes.active}>
            <p>Alertas</p>
          </NavLink>
          <p>&#47;</p>
          <NavLink to={'/devices'} activeClassName={classes.active}>
            <p>Configuración</p>
          </NavLink>
          <p>&#47;</p>
          <NavLink to={'/metrics'} activeClassName={classes.active}>
            <p>Metricas</p>
          </NavLink>
          <div className={classes.accountCotainer} onClick={handleClickUser}>
            <AccountCircle className={classes.userLogo} />
            {user && user.isLogguedIn && <p>{user.username}</p>}
          </div>
        </div>
      )}
    </nav>
  ) : null;
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    backgroundColor: theme.palette.common.blue,
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  logoContainer: {
    display: 'flex',
    color: 'white',
    alignItems: 'center',
    width: 290,
    height: '100%',
    backgroundColor: '#10384f',
  },
  logo: {
    width: '5rem',
    height: '5rem',
    padding: 10,
  },
  title: {
    fontSize: '16px',
    fontWeight: 'lighter',
    fontStretch: 'ultra-condensed',
    letterSpacing: 0,
    fontFamily: 'Didact Gothic, sans-serif',
  },
  notifications: {
    position: 'absolute',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    '& h3': {
      fontSize: '2rem',
      margin: 0,
    },
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
  },
  warningLogo: {
    marginRight: '1rem',
    width: '3.7rem',
    height: '3.7rem',
    color: theme.palette.common.red,
  },
  links: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    fontSize: '1rem',
    color: 'white',
    '& a p': {
      padding: '0 2px 4px 2px',
      fontWeight: 'lighter',
      transition: 'all 0.1s ease-out',
    },
  },
  active: {
    fontWeight: 800,
  },
  userLogo: {
    width: '4.8rem',
    height: '4.8rem',
  },
  accountCotainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0px 20px',
    cursor: 'pointer',
  },
}));

const mapStateToProps = (state) => ({
  getNumberOfAlerts: selectCountAlerts(state),
  user: selectUser(state),
});

export default connect(mapStateToProps)(TopBar);
