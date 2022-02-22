import {
  LOADING_BATCHS,
  SUCCESS_BATCHS,
  FAIL_BATCHS,
  SELECT_BATCH,
  CLEAR_SELECTED_BATCH,
  UPDATE_BATCHS,
  SET_BATCH_ERRORS,
} from "./batchs.constants";

const initialStateBatch = {
  allBatchs: [],
  isLoading: false,
  error: false,
  selectedBatch: null,
  batchErrors: {},
};

const batchReducer = (state = initialStateBatch, action = {}) => {
  switch (action.type) {
    case LOADING_BATCHS:
      return {
        ...state,
        isLoading: true,
      };
    case SUCCESS_BATCHS:
    case UPDATE_BATCHS:
      return {
        ...state,
        isLoading: false,
        allBatchs: action.payload,
      };
    case FAIL_BATCHS:
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    case SELECT_BATCH:
    case CLEAR_SELECTED_BATCH:
      return {
        ...state,
        selectedBatch: action.payload,
      };
    case SET_BATCH_ERRORS:
      return {
        ...state,
        batchErrors: action.payload,
      };
    default:
      return state;
  }
};

export default batchReducer;
