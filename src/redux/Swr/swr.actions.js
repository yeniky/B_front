import { ADD_KEY, DELETE_KEY } from './swr.constants';
import { selectSwrKeys } from './swr.selectors';
import { mutate } from 'swr';

export const addKey = (key) => (dispatch) =>
  dispatch({ type: ADD_KEY, payload: key });
export const deleteKey = (key) => (dispatch) =>
  dispatch({
    type: DELETE_KEY,
    payload: key,
  });

export const mutateKeys = (state) => {
  const keys = selectSwrKeys(state);
  keys.forEach((k) => mutate(k, undefined, true));
};
