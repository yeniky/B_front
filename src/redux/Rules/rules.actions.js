import {
  FAIL_RULES,
  LOADING_RULES,
  SUCCESS_RULES,
  ADD_RULE,
  DELETE_RULE,
  EDIT_RULE,
} from './rules.constants';

import { SET_SUBSCRIPTIONS } from '../Users/user.constants';

import tagService from 'services/tags';

import {
  selectPermanencyRules,
  selectProximityRules,
  selectSeparationRules,
} from 'redux/Rules/rules.selectors';

export const fetchRules = () => (dispatch) => {
  dispatch({ type: LOADING_RULES });
  tagService
    .getAllRules()
    .then((rules) => {
      console.log(rules);
      return dispatch({
        type: SUCCESS_RULES,
        payload: {
          permanencyRules: rules.zone_rules,
          proximityRules: rules.proximity_rules,
          separationRules: rules.batch_rules,
          cleanupRules: rules.cleanup_rules,
        },
      });
    })
    .catch((error) => dispatch({ type: FAIL_RULES, payload: error }));
};

export const fetchSubscriptions = () => (dispatch) => {
  tagService.getSubscriptions().then((subscriptions) => {
    dispatch({
      type: SET_SUBSCRIPTIONS,
      payload: { subscriptions },
    });
  });
  // .catch((error) => dispatch({ type: FAIL_RULES, payload: error }));
};

export const createRule = (type, data) => (dispatch) => {
  tagService.createRule(type, data).then((response) => {
    if (type === 'zone') {
      dispatch({
        type: ADD_RULE,
        payload: { name: 'permanencyRules', value: response },
      });
    }
    if (type === 'proximity') {
      dispatch({
        type: ADD_RULE,
        payload: { name: 'proximityRules', value: response },
      });
    }
    if (type === 'batch') {
      dispatch({
        type: ADD_RULE,
        payload: { name: 'separationRules', value: response },
      });
    }
  });
};

export const editRule = (type, data) => (dispatch) => {
  tagService.editRule(type, data).then((response) => {
    console.log(response);
    if (type === 'zone') {
      dispatch({
        type: EDIT_RULE,
        payload: { name: 'permanencyRules', value: response, oldRule: data },
      });
      dispatch(fetchSubscriptions());
    }
  });
};

export const deleteRule = (type, id) => (dispatch, getState) => {
  tagService.deleteRule(type, id).then(() => {
    if (type === 'zone') {
      const rules = selectPermanencyRules(getState());
      dispatch({
        type: DELETE_RULE,
        payload: {
          name: 'permanencyRules',
          value: rules.filter((rule) => rule.id !== id),
        },
      });
    }
    if (type === 'proximity') {
      const rules = selectProximityRules(getState());
      dispatch({
        type: DELETE_RULE,
        payload: {
          name: 'proximityRules',
          value: rules.filter((rule) => rule.id !== id),
        },
      });
    }
    if (type === 'batch') {
      const rules = selectSeparationRules(getState());
      dispatch({
        type: DELETE_RULE,
        payload: {
          name: 'separationRules',
          value: rules.filter((rule) => rule.id !== id),
        },
      });
    }
  });
};
