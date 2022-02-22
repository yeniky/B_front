import { createSelector } from "reselect";

const selectTag = (state) => state.tags;

export const selectTags = createSelector([selectTag], (tag) => tag.allTags);

//if the list is updated, the selected tag has to update
export const getSelectedTag = createSelector([selectTag], (tagState) =>
  tagState.selectedTag
    ? tagState.allTags.find((tag) => tagState.selectedTag.id === tag.id)
    : null
);

export const selectActiveTags = createSelector([selectTag], (tag) =>
  tag.allTags.filter((tag) => tag.active)
);
