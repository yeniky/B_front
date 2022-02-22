import {
  LOADING_TAGS,
  SUCCESS_TAGS,
  FAIL_TAGS,
  UPDATE_POSITION,
  SELECT_TAG,
  CLEAR_SELECTED_TAG,
  UPDATE_TAGS,
  UPDATE_SELECTED_TAG,
} from "./tags.constants";

const initialStateTags = {
  allTags: [],
  isLoading: false,
  error: false,
  selectedTag: null,
};

const tagReducer = (state = initialStateTags, action = {}) => {
  switch (action.type) {
    case LOADING_TAGS:
      return {
        ...state,
        isLoading: true,
      };
    case SUCCESS_TAGS:
    case UPDATE_TAGS:
    case UPDATE_POSITION:
      return {
        ...state,
        isLoading: false,
        allTags: action.payload,
      };
    case FAIL_TAGS:
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    case SELECT_TAG:
    case UPDATE_SELECTED_TAG:
    case CLEAR_SELECTED_TAG:
      return {
        ...state,
        selectedTag: action.payload,
      };
    default:
      return state;
  }
};

export default tagReducer;
