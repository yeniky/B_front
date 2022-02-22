import {
  SET_USER,
  SET_USERNAME,
  SUBSCRIBE,
  UNSUBSCRIBE,
  SET_SUBSCRIPTIONS,
} from 'redux/Users/user.constants';

const stringData = localStorage.getItem('bayer_user');
const user = stringData !== 'undefined' ? JSON.parse(stringData) : undefined;
const initialState = user || {
  isLogguedIn: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return action.payload.isLogguedIn
        ? {
            ...state,
            ...action.payload,
          }
        : {
            ...action.payload,
          };
    case SET_USERNAME:
      return {
        ...state,
        username: action.payload.username,
      };
    case SET_SUBSCRIPTIONS:
      const subscriptionsUpdated = {
        ...state,
        subscriptions: action.payload.subscriptions,
      };
      localStorage.setItem('bayer_user', JSON.stringify(subscriptionsUpdated));
      return subscriptionsUpdated;
    case SUBSCRIBE:
      const alertSubscriptions =
        state.subscriptions[action.payload.alert_type + '_rules'];
      const newUser = {
        ...state,
        subscriptions: {
          ...state.subscriptions,
          [action.payload.alert_type + '_rules']: [
            ...alertSubscriptions,
            action.payload.id,
          ],
        },
      };
      localStorage.setItem('bayer_user', JSON.stringify(newUser));
      return newUser;
    case UNSUBSCRIBE:
      const updatedSubscriptions = state.subscriptions[
        action.payload.alert_type + '_rules'
      ].filter((alertId) => alertId !== action.payload.id);
      const newUser2 = {
        ...state,
        subscriptions: {
          ...state.subscriptions,
          [action.payload.alert_type + '_rules']: updatedSubscriptions,
        },
      };
      localStorage.setItem('bayer_user', JSON.stringify(newUser2));
      return newUser2;
    default:
      return state;
  }
};

export default userReducer;
