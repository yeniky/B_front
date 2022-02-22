import {
  LOADING_BINS,
  SUCCESS_BINS,
  FAIL_BINS,
  FILTER_BINS_IN_TAG,
  SELECT_BIN,
  CLEAR_SELECTED_BIN,
  SET_BIN_TYPES,
  //TO REVIEW
  UPDATE_BINS,
  SELECT_BIN_EDIT,
  CLEAR_EDIT_BIN,
  SET_ERRORS,
} from './bins.constants';

const initialStateBins = {
  allBins: [],
  isLoading: false,
  error: false,
  binsInTag: { pairedBin: null, binsAvailables: null },
  selectedBin: null,
  //TO REVIEW
  editedBin: null,
  binErrors: {},
  binTypes: [],
};

const binsReducer = (state = initialStateBins, action = {}) => {
  switch (action.type) {
    case LOADING_BINS:
      return {
        ...state,
        isLoading: true,
      };
    case SUCCESS_BINS:
      return {
        ...state,
        isLoading: false,
        allBins: action.payload,
      };
    case FAIL_BINS:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case FILTER_BINS_IN_TAG:
      return {
        ...state,
        binsInTag: action.payload,
      };
    case SELECT_BIN:
      return {
        ...state,
        selectedBin: action.payload,
      };
    case CLEAR_SELECTED_BIN:
      return {
        ...state,
        selectedBin: null,
      };
    case SET_BIN_TYPES:
      return {
        ...state,
        binTypes: action.payload,
      };
    //TO REVIEW
    case UPDATE_BINS:
      return {
        ...state,
        allBins: action.payload,
      };
    case SELECT_BIN_EDIT:
      return {
        ...state,
        editedBin: action.payload,
      };
    case CLEAR_EDIT_BIN:
      return {
        ...state,
        editedBin: null,
      };
    case SET_ERRORS:
      return {
        ...state,
        binErrors: action.payload,
      };
    default:
      return state;
  }
};

export default binsReducer;
