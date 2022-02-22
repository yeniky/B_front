import { createSelector } from 'reselect';

const selectMaterialStore = (state) => state.materials;

export const selectMaterials = createSelector(
  [selectMaterialStore],
  (materials) => materials.materials
);

export const selectMaterialGroups = createSelector(
  [selectMaterialStore],
  (materials) => materials.material_groups
);

export const selectMaterialPrices = createSelector(
  [selectMaterialStore],
  (materials) => materials.material_prices
);

export const selectMaterialsWithInfo = createSelector(
  [selectMaterialStore],
  (materials) => {
    const { material_groups, material_prices } = materials;
    const materialWithInfo = materials.materials.map((materialItem) => {
      const groupFound = material_groups.find(
        (groupItem) => groupItem.name === materialItem.material_group
      );
      const priceFound = material_prices.find(
        (priceItem) => priceItem.name === materialItem.material_pricing_group
      );

      return {
        ...materialItem,
        material_group_desc: groupFound.description,
        material_pricing_desc: priceFound.description,
      };
    });

    return materialWithInfo;
  }
);

export const selectedMaterial = createSelector(
  [selectMaterialStore],
  (materials) => materials.selectedMaterial
);

export const selectedMaterialGroup = createSelector(
  [selectMaterialStore],
  (materials) => materials.selectedMaterialGroup
);

export const selectedMaterialPriceGroup = createSelector(
  [selectMaterialStore],
  (materials) => materials.selectedMaterialPriceGroup
);

export const getMaterialErrors = createSelector(
  [selectMaterialStore],
  (materials) => materials.materialErrors
);

export const uploadMaterialResponseSelector = createSelector(
  [selectMaterialStore],
  (materialState) => materialState.uploadResponse
);
