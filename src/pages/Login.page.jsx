import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { makeStyles } from '@material-ui/styles';

import { ReactComponent as Logo } from 'images/logo-wht.svg';

import { setUser } from 'redux/Users/user.actions';

import userService from 'services/users';
import { CircularProgress } from '@material-ui/core';
import { setUnloadedMap } from 'redux/Map/map.actions';
// import { startFetchs } from 'redux/fetch.actions';

const LoginPage = ({ history }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [userCredentials, setUserCredentials] = useState({
    email: 'admin@mail.com',
    password: 'password',
  });

  const [errors, setErrors] = useState({});
  const [isLogguingIn, setIsLogguingIn] = useState(false);
  const { email, password } = userCredentials;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserCredentials({ ...userCredentials, [name]: value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      setIsLogguingIn(true);
      const user = await userService.login(email, password);
      if (user) {
        const credential = await userService.getToken(email, password);
        setIsLogguingIn(false);
        dispatch(
          setUser({ ...user, token: credential.token, isLogguedIn: true })
        );

        history.push('/dashboard');
      } else {
        setErrors({ token: true });
      }
    } catch (error) {
      console.error(error);
      setErrors({ credentials: true });
      setIsLogguingIn(false);
    }
  };

  useEffect(() => {
    dispatch(setUser({ isLogguedIn: false }));
    dispatch(setUnloadedMap());
  }, [dispatch]);

  return (
    <section className={classes.container}>
      <div className={classes.card}>
        <Logo className={classes.logo} />
        <h5 className={classes.title}>{'Sistema de Posicionamiento'}</h5>
        <form className={classes.formContainer} onSubmit={handleLogin}>
          <label>{'Correo'}</label>
          <input
            className={`${classes.loginInput} ${
              errors.email ? classes.errorForm : undefined
            }`}
            name="email"
            type="email"
            onChange={handleChange}
            value={email}
          />
          <label>{'Contraseña'}</label>
          <input
            className={`${classes.loginInput} ${
              errors.password ? classes.errorForm : undefined
            }`}
            name="password"
            type="password"
            onChange={handleChange}
            value={password}
          />
          {errors.credentials && !(errors.email || errors.password) && (
            <label className={classes.error}>
              {'Credenciales incorrectas'}
            </label>
          )}
          {(errors.email || errors.password) && (
            <label className={classes.error}>{'Campos Faltantes'}</label>
          )}
          {errors.token && (
            <label className={classes.error}>
              {'Error de autenticación, reintente'}
            </label>
          )}
          <button type="submit" className={classes.loginButton}>
            {isLogguingIn ? (
              <CircularProgress size={25} color={'secondary'} />
            ) : (
              'INGRESAR'
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  card: {
    backgroundColor: '#10384f',
    borderRadius: 50,
    width: '25rem',
    height: '33rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    color: 'white',
  },
  logo: {
    height: '9rem',
    marginTop: 40,
  },
  formContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  loginInput: {
    backgroundColor: '#708895',
    color: 'white',
    border: 'solid #708895 1px',
    padding: '3px 4px',
    outline: 'none',
    fontSize: '1.4rem',
  },
  errorForm: {
    borderColor: 'rgb(255, 115, 0)',
  },
  loginButton: {
    backgroundColor: '#624963',
    border: 'none',
    color: 'white',
    fontSize: '1.4rem',
    letterSpacing: 1,
    width: '70%',
    alignSelf: 'center',
    borderRadius: 7,
    padding: '15px 0px',
    marginTop: 40,
    outline: 'none',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#765777',
    },
  },
  error: {
    position: 'absolute',
    color: 'rgb(255, 115, 0)',
    bottom: 65,
  },
  title: {
    fontSize: '1.4rem',
  },
}));

export default withRouter(LoginPage);
