import {
  LOADING_RULES,
  SUCCESS_RULES,
  FAIL_RULES,
  ADD_RULE,
  DELETE_RULE,
  EDIT_RULE,
} from './rules.constants';

const initialStateRules = {
  permanencyRules: [],
  proximityRules: [],
  separationRules: [],
  isLoading: false,
  error: null,
};

const RulesReducer = (state = initialStateRules, action = {}) => {
  switch (action.type) {
    case LOADING_RULES:
      return {
        ...state,
        isLoading: true,
      };
    case SUCCESS_RULES:
      return {
        ...state,
        isLoading: false,
        error: null,
        permanencyRules: action.payload.permanencyRules,
        proximityRules: action.payload.proximityRules,
        separationRules: action.payload.separationRules,
        cleanupRules: action.payload.cleanupRules,
      };
    case FAIL_RULES:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case ADD_RULE:
      const ruleList = [...state[action.payload.name]];
      const ruleIndex = ruleList.findIndex(
        (r) => r.id === action.payload.value.id
      );
      if (ruleIndex < 0) {
        return {
          ...state,
          [action.payload.name]: [
            ...state[action.payload.name],
            action.payload.value,
          ],
        };
      } else {
        ruleList[ruleIndex] = action.payload.value;
        return {
          ...state,
          [action.payload.name]: ruleList,
        };
      }
    case EDIT_RULE:
      const oldRuleId = action.payload.oldRule.id;
      const editedRuleId = action.payload.value.id;

      let rules = [...state[action.payload.name]];
      const editedRuleIndex = rules.findIndex((r) => r.id === editedRuleId);

      // Update rule
      rules[editedRuleIndex] = action.payload.value;

      // Delete old rule
      if (oldRuleId !== editedRuleId) {
        rules = rules.filter((r) => r.id !== oldRuleId);
      }

      return {
        ...state,
        [action.payload.name]: rules,
      };
    case DELETE_RULE:
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    default:
      return state;
  }
};

export default RulesReducer;
