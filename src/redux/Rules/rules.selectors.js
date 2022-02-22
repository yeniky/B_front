import { createSelector } from 'reselect';

const selectRulesStore = (state) => state.rules;

export const selectProximityRules = createSelector(
  [selectRulesStore],
  (rules) => rules.proximityRules
);
export const selectPermanencyRules = createSelector(
  [selectRulesStore],
  (rules) => rules.permanencyRules
);
export const selectSeparationRules = createSelector(
  [selectRulesStore],
  (rules) => rules.separationRules
);
export const selectCleanupRules = createSelector(
  [selectRulesStore],
  (rules) => rules.cleanupRules
);
