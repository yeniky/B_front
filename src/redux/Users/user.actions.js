import {
  SET_USER,
  SET_USERNAME,
  SUBSCRIBE,
  UNSUBSCRIBE,
} from 'redux/Users/user.constants';
import axios from 'services/_axios';

export const setUser = (user) => (dispatch) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${user?.token}`;
  localStorage.setItem('bayer_user', JSON.stringify(user));
  dispatch({
    type: SET_USER,
    payload: user,
  });
};

export const setUsername = (username) => (dispatch) => {
  dispatch({
    type: SET_USERNAME,
    payload: {
      username,
    },
  });
};

export const subscribe = (alert_type, id) => (dispatch) => {
  dispatch({
    type: SUBSCRIBE,
    payload: {
      alert_type,
      id,
    },
  });
};

export const unsubscribe = (alert_type, id) => (dispatch) => {
  dispatch({
    type: UNSUBSCRIBE,
    payload: {
      alert_type,
      id,
    },
  });
};
