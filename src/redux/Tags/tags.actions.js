import {
  LOADING_TAGS,
  SUCCESS_TAGS,
  FAIL_TAGS,
  UPDATE_POSITION,
  //TO REVIEW
  SELECT_TAG,
  CLEAR_SELECTED_TAG,
  UPDATE_TAGS,
  UPDATE_SELECTED_TAG,
} from './tags.constants';

import tagService from 'services/tags';

import { alertsTagSelected } from 'redux/Alerts/Alerts.actions';
import { filterBinsInTag } from 'redux/Bins/bins.actions';

import { getSelectedTag, selectTags } from 'redux/Tags/tags.selectors';

const requestFetchTags = () => ({ type: LOADING_TAGS });

const successFetchTags = (tags) => ({ type: SUCCESS_TAGS, payload: tags });

const failFetchTags = (error) => ({ type: FAIL_TAGS, payload: error });

export const fetchTags = () => (dispatch) => {
  dispatch(requestFetchTags());
  tagService
    .getAllTags()
    // ! remove .items
    .then((tags) => dispatch(successFetchTags(tags.items)))
    .catch((error) => dispatch(failFetchTags(error)));
};

//NEW ACTIONS

export const updatePositions = (newTags) => (dispatch, getState) => {
  console.log(newTags);
  const oldTags = selectTags(getState());
  const updatedTags = oldTags.map((oldTag) => {
    const newTag = newTags.find((newTag) => oldTag.address === newTag.address);
    return newTag ? { ...oldTag, position: { ...newTag.position } } : oldTag;
  });
  const tagsToCreate = newTags.filter(
    (newTag) => !oldTags.some((oldTag) => oldTag.address === newTag.address)
  );
  console.log(tagsToCreate);
  dispatch({
    type: UPDATE_POSITION,
    payload: [...updatedTags, ...tagsToCreate],
  });
};

export const updateInTag = (values, address) => (dispatch, getState) => {
  //update values in the list of tags and the selected tag
  const tagList = selectTags(getState());
  const targetTag = tagList.find((tag) => tag.address === address);

  const tagUpdated = { ...targetTag, ...values };
  const taglistUpdated = tagList.map((tag) =>
    tag.id === targetTag.id ? tagUpdated : tag
  );

  dispatch(updateTags(taglistUpdated));
  if (getSelectedTag(getState()) !== null) {
    dispatch(updateSelectedTag(tagUpdated));
  }
};

export const updateTags = (tags) => (dispatch, getState) => {
  if (tags) {
    const isTagSelected = getSelectedTag(getState());
    if (isTagSelected) {
      const tagUpdated = tags.find((tag) => tag.id === isTagSelected.id);
      dispatch(updateSelectedTag(tagUpdated));
    }
    dispatch({ type: UPDATE_TAGS, payload: tags });
  } else {
    dispatch(fetchTags());
  }
};

//OLD ACTIONS
export const selectTag = (id) => (dispatch, getState) => {
  const Tags = selectTags(getState());
  const selectedTag = Tags.find((tag) => tag.id === id);

  dispatch({ type: SELECT_TAG, payload: selectedTag });
  dispatch(alertsTagSelected(selectedTag));
  dispatch(filterBinsInTag(selectedTag.container));
};
export const clearSelectedTag = () => ({
  type: CLEAR_SELECTED_TAG,
  payload: null,
});

export const updateSelectedTag = (tag) => (dispatch) => {
  dispatch({ type: UPDATE_SELECTED_TAG, payload: tag });
  dispatch(filterBinsInTag(tag.container));
  dispatch(alertsTagSelected(tag));
};

export const changeStatusTag = (id, status) => (dispatch, getState) => {
  tagService.changeStatus('tags', id, status).then((tagResponse) => {
    const tagList = selectTags(getState());
    const taglistUpdated = tagList.map((tag) =>
      tag.id === tagResponse.id ? tagResponse : tag
    );
    dispatch(updateTags(taglistUpdated));
  });
};
