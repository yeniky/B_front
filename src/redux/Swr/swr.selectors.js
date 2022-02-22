import { createSelector } from 'reselect';

const selectSwr = (state) => state.swr;

export const selectSwrKeys = createSelector([selectSwr], (swr) => swr.keys);
