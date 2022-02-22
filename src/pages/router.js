import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';

import { startFetchs } from 'redux/fetch.actions';

import theme from 'components/ui/Theme';

import TopBar from 'components/ui/TopBar.component';

import Login from 'pages/Login.page';
import Dashboard from 'pages/Dashboard.page';
import Batchs from 'pages/Batch.page';
import Alerts from 'pages/Alerts.page';
import Metrics from 'pages/Metrics.page';
import User from 'pages/User.page';
import Admin from 'pages/Admin.page';
import ActivateAccount from 'pages/ActivateAccount.page';

import useWebSocket from 'hooks/useWebSocket';

import ProtectedRoute from 'routes/ProtectedRoute';
import PrivateRoute from 'routes/PrivateRoute';

const endpoint = process.env.REACT_APP_WEBSOCKET_URL;
// const endpoint = 'http://161.35.99.28:5001;
// const endpoint = 'http://127.0.0.1:5001';

const Routes = () => {
  const { isLogguedIn } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLogguedIn) dispatch(startFetchs());
  }, [startFetchs, isLogguedIn]);

  // ! webSocket not working locally
  useWebSocket(endpoint);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <TopBar />
        <Switch>
          <Route exact path="/" component={Login} />
          <ProtectedRoute exact path="/dashboard" component={Dashboard} />
          <ProtectedRoute exact path="/alerts" component={Alerts} />
          <ProtectedRoute exact path="/devices" component={Batchs} />
          <ProtectedRoute exact path="/metrics" component={Metrics} />
          <ProtectedRoute exact path="/user" component={User} />
          <PrivateRoute exact path="/admin" component={Admin} />
          <Route exact path="/activate/:token" component={ActivateAccount} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

// const mapDispatchToProps = (dispatch) => ({
//   startFetchs: () => dispatch(startFetchs()),

// });

export default Routes;
