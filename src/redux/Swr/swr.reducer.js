import { ADD_KEY, DELETE_KEY } from './swr.constants';

const initialStateSwr = {
  keys: [],
};

const swrReducer = (state = initialStateSwr, action = {}) => {
  switch (action.type) {
    case ADD_KEY:
      return {
        keys: addKey(action.payload, state.keys),
      };
    case DELETE_KEY:
      return {
        keys: deleteKey(action.payload, state.keys),
      };
    default:
      return state;
  }
};

const addKey = (key, keys) => {
  const i = keys.findIndex((k) => k[0] === key[0]);
  return i < 0
    ? [...keys, key]
    : keys.map((element, index) => (index === i ? key : element));
};

const deleteKey = (key, keys) => {
  const i = keys.findIndex((k) => k[0] === key[0]);
  return i < 0 ? keys : keys.filter((_, index) => index !== i);
};

export default swrReducer;
