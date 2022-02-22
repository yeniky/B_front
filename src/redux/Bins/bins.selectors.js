import { createSelector } from 'reselect';

const selectBin = (state) => state.bins;

export const selectBins = createSelector([selectBin], (bin) => bin.allBins);

export const selectBinTypes = createSelector(
  [selectBin],
  (bin) => bin.binTypes
);

export const selectPairedBin = createSelector(
  [selectBin],
  (bin) => bin.binsInTag.pairedBin
);
export const selectBinsAvailables = createSelector(
  [selectBin],
  (bin) => bin.binsInTag.binsAvailables
);

export const getSelectedBin = createSelector(
  [selectBin],
  (bin) => bin.selectedBin
);

//TO REVIEW
export const getSelectedEditBin = createSelector(
  [selectBin],
  (bin) => bin.editedBin
);

export const getErrors = createSelector([selectBin], (bin) => bin.binErrors);
