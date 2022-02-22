import MaterialTypes from './materials.constants';

import tagService from 'services/tags';

import {
  selectMaterials,
  selectMaterialGroups,
  selectMaterialPrices,
} from './materials.selectors';

import { mutateKeys } from 'redux/Swr/swr.actions';

// export const fetchMaterials = () => async (dispatch) => {
//   try {
//     dispatch({ type: MaterialTypes.LOADING_MATERIALS });
//     // ! remove .items
//     const materials = (await tagService.getMaterials()).items;
//     const material_groups = (await tagService.getMaterialGroup()).items;
//     const material_prices = (await tagService.getMaterialPrice()).items;

//     dispatch({
//       type: MaterialTypes.SUCCESS_MATERIALS,
//       payload: { materials, material_groups, material_prices },
//     });
//   } catch (error) {
//     dispatch({ type: MaterialTypes.FAIL_MATERIALS, payload: error });
//   }
// };

export const setSelectedMaterial = (material) => {
  if (material) {
    return { type: MaterialTypes.SELECT_MATERIAL, payload: material };
  } else {
    return {
      type: MaterialTypes.SELECT_MATERIAL,
      payload: {
        name: '',
        material_group: '',
        description: '',
        material_pricing_group: '',
        reproduction_type: '',
        phase: '',
        package_type: '',
        variety_name: '',
      },
    };
  }
};

export const clearSelectedMaterial = () => (dispatch) => {
  dispatch({ type: MaterialTypes.CLEAR_SELECTED_MATERIAL });
  dispatch(setErrors({}));
};

export const setSelectedMaterialGroup = (materialGroup) => {
  if (materialGroup) {
    return {
      type: MaterialTypes.SELECT_MATERIAL_GROUP,
      payload: materialGroup,
    };
  } else {
    return {
      type: MaterialTypes.SELECT_MATERIAL_GROUP,
      payload: {
        name: '',
        description: '',
      },
    };
  }
};

export const clearSelectedMaterialGroup = () => (dispatch) => {
  dispatch({ type: MaterialTypes.CLEAR_SELECTED_MATERIAL_GROUP });
  dispatch(setErrors({}));
};

export const setSelectedMaterialPriceGroup = (materialPriceGroup) => {
  if (materialPriceGroup) {
    return {
      type: MaterialTypes.SELECT_MATERIAL_PRICE_GROUP,
      payload: materialPriceGroup,
    };
  } else {
    return {
      type: MaterialTypes.SELECT_MATERIAL_PRICE_GROUP,
      payload: {
        name: '',
        description: '',
      },
    };
  }
};

export const clearSelectedMaterialPriceGroup = () => (dispatch) => {
  dispatch({ type: MaterialTypes.CLEAR_SELECTED_MATERIAL_PRICE_GROUP });
  dispatch(setErrors({}));
};

const setErrors = (errors) => ({
  type: MaterialTypes.SET_MATERIAL_ERRORS,
  payload: errors,
});

export const addNewMaterial = (newMaterial) => (dispatch, getState) => {
  if (
    newMaterial.name &&
    newMaterial.description &&
    newMaterial.material_group &&
    newMaterial.material_pricing_group
  ) {
    const materialToSend = {
      ...newMaterial,
      material_price_group: newMaterial.material_pricing_group,
    };
    tagService
      .createMaterial(materialToSend)
      .then((response) => {
        mutateKeys(getState());
        dispatch({ type: MaterialTypes.ADD_MATERIAL, payload: response });
        dispatch(clearSelectedMaterial());
        dispatch(setErrors({}));
      })
      .catch(({ response: { data } }) => {
        if (data.message === 'a material with that name already exists') {
          dispatch(setErrors({ name: 'ID ya existe' }));
        }
      });
  } else {
    let newError = {};
    if (!newMaterial.name) {
      newError.name = 'Debe ingresar un ID';
    }
    if (!newMaterial.description) {
      newError.description = 'Debe ingresar una Descripción';
    }
    if (!newMaterial.material_group) {
      newError.material_group = 'Debe seleccionar un Material Group';
    }
    if (!newMaterial.material_pricing_group) {
      newError.material_pricing_group =
        'Debe seleccionar un Material Pricing Group';
    }
    dispatch(setErrors(newError));
  }
};

export const addNewMaterialGroup = (newMaterialGroup) => (
  dispatch,
  getState
) => {
  if (newMaterialGroup.name && newMaterialGroup.description) {
    tagService
      .createMaterialGroup(newMaterialGroup)
      .then((response) => {
        mutateKeys(getState());
        dispatch({ type: MaterialTypes.ADD_MATERIAL_GROUP, payload: response });
        dispatch(clearSelectedMaterialGroup());
        dispatch(setErrors({}));
      })
      .catch(({ response: { data } }) => {
        if (data.message === 'a material group with that name already exists') {
          dispatch(setErrors({ name: 'ID ya existe' }));
        }
      });
  } else {
    let newError = {};
    if (!newMaterialGroup.name) {
      newError.name = 'Debe ingresar un ID';
    }
    if (!newMaterialGroup.description) {
      newError.description = 'Debe ingresar una Descripción';
    }
    dispatch(setErrors(newError));
  }
};

export const addNewMaterialPriceGroup = (newMaterialPriceGroup) => (
  dispatch,
  getState
) => {
  if (newMaterialPriceGroup.name && newMaterialPriceGroup.description) {
    tagService
      .createMaterialPriceGroup(newMaterialPriceGroup)
      .then((response) => {
        mutateKeys(getState());
        dispatch({
          type: MaterialTypes.ADD_MATERIAL_PRICE_GROUP,
          payload: response,
        });
        dispatch(clearSelectedMaterialPriceGroup());
        dispatch(setErrors({}));
      })
      .catch(({ response: { data } }) => {
        if (
          data.message ===
          'a material price group with that name already exists'
        ) {
          dispatch(setErrors({ name: 'ID ya existe' }));
        }
      });
  } else {
    let newError = {};
    if (!newMaterialPriceGroup.name) {
      newError.name = 'Debe ingresar un ID';
    }
    if (!newMaterialPriceGroup.description) {
      newError.description = 'Debe ingresar una Descripción';
    }
    dispatch(setErrors(newError));
  }
};

export const saveEditMaterial = (editedMaterial) => (dispatch, getState) => {
  if (
    editedMaterial.name &&
    editedMaterial.description &&
    editedMaterial.material_group &&
    editedMaterial.material_pricing_group
  ) {
    const materialToSend = {
      ...editedMaterial,
      material_price_group: editedMaterial.material_pricing_group,
    };
    tagService
      .editMaterial(materialToSend)
      .then((response) => {
        mutateKeys(getState());
        const materialList = selectMaterials(getState());
        const updatedMaterials = materialList.map((materialItem) =>
          materialItem.id === response.id ? response : materialItem
        );

        dispatch({
          type: MaterialTypes.UPDATE_MATERIALS,
          payload: updatedMaterials,
        });
        dispatch(clearSelectedMaterial());
      })
      .catch(({ response: { data } }) => {
        if (data.message === 'a material with that name already exists') {
          dispatch(setErrors({ name: 'ID ya existe' }));
        }
      });
  } else {
    let newError = {};
    if (!editedMaterial.name) {
      newError.name = 'Debe ingresar un ID';
    }
    if (!editedMaterial.description) {
      newError.description = 'Debe ingresar una Descripción';
    }
    if (!editedMaterial.material_group) {
      newError.material_group = 'Debe seleccionar un Material Group';
    }
    if (!editedMaterial.material_pricing_group) {
      newError.material_pricing_group =
        'Debe seleccionar un Material Pricing Group';
    }
    dispatch(setErrors(newError));
  }
};

export const saveEditMaterialGroup = (editedMaterialGroup) => (
  dispatch,
  getState
) => {
  if (editedMaterialGroup.name && editedMaterialGroup.description) {
    tagService
      .editMaterialGroup(editedMaterialGroup)
      .then((response) => {
        mutateKeys(getState());
        const materialGroupList = selectMaterialGroups(getState());
        const updatedMaterialsGroup = materialGroupList.map((materialItem) =>
          materialItem.id === response.id ? response : materialItem
        );

        dispatch({
          type: MaterialTypes.UPDATE_MATERIALS_GROUP,
          payload: updatedMaterialsGroup,
        });
        dispatch(clearSelectedMaterialGroup());
      })
      .catch((err) => {
        console.log(err.toJSON());
        if (
          err?.data?.message ===
          'a material group with that name already exists'
        ) {
          dispatch(setErrors({ name: 'ID ya existe' }));
        }
      });
  } else {
    let newError = {};
    if (!editedMaterialGroup.name) {
      newError.name = 'Debe ingresar un ID';
    }
    if (!editedMaterialGroup.description) {
      newError.description = 'Debe ingresar una Descripción';
    }
    dispatch(setErrors(newError));
  }
};

export const saveEditMaterialPriceGroup = (editedMaterialPriceGroup) => (
  dispatch,
  getState
) => {
  if (editedMaterialPriceGroup.name && editedMaterialPriceGroup.description) {
    tagService
      .editMaterialPriceGroup(editedMaterialPriceGroup)
      .then((response) => {
        mutateKeys(getState());
        const materialPriceGroupList = selectMaterialPrices(getState());
        const updatedMaterialsPriceGroup = materialPriceGroupList.map(
          (materialItem) =>
            materialItem.id === response.id ? response : materialItem
        );

        dispatch({
          type: MaterialTypes.UPDATE_MATERIALS_PRICE_GROUP,
          payload: updatedMaterialsPriceGroup,
        });
        dispatch(clearSelectedMaterialPriceGroup());
      })
      .catch((err) => {
        console.log(err.toJSON());
        if (
          err?.data?.message ===
          'a material price group with that name already exists'
        ) {
          dispatch(setErrors({ name: 'ID ya existe' }));
        }
      });
  } else {
    let newError = {};
    if (!editedMaterialPriceGroup.name) {
      newError.name = 'Debe ingresar un ID';
    }
    if (!editedMaterialPriceGroup.description) {
      newError.description = 'Debe ingresar una Descripción';
    }
    dispatch(setErrors(newError));
  }
};

export const uploadMaterialCSV = (file) => (dispatch, getState) => {
  tagService
    .uploadCSV('material', { file: file })
    .then((response) => {
      mutateKeys(getState());
      dispatch({ type: MaterialTypes.UPLOAD_MATERIAL_CSV, payload: response });
      // dispatch(fetchMaterials());
    })
    .catch((err) => {
      console.log(err.response);
      if (
        err &&
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
      }
      dispatch({
        type: MaterialTypes.UPLOAD_MATERIAL_CSV,
        payload: { errors: [err.response.data.message] },
      });
    });
};

export const uploadMaterialGroupCSV = (file) => (dispatch, getState) => {
  console.log(file);
  tagService
    .uploadCSV('material_group', { file: file })
    .then((response) => {
      mutateKeys(getState());
      dispatch({
        type: MaterialTypes.UPLOAD_MATERIAL_GROUP_CSV,
        payload: response,
      });
      // dispatch(fetchMaterials());
    })
    .catch((err) => {
      console.log(err.response);
      if (
        err &&
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
      }
      dispatch({
        type: MaterialTypes.UPLOAD_MATERIAL_GROUP_CSV,
        payload: { errors: [err.response.data.message] },
      });
    });
};

export const uploadMaterialPriceGroupCSV = (file) => (dispatch, getState) => {
  console.log(file);
  tagService
    .uploadCSV('material_price', { file: file })
    .then((response) => {
      mutateKeys(getState());
      dispatch({
        type: MaterialTypes.UPLOAD_MATERIAL_PRICE_GROUP_CSV,
        payload: response,
      });
      //   dispatch(fetchMaterials());
    })
    .catch((err) => {
      console.log(err.response);
      if (
        err &&
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
      }
      dispatch({
        type: MaterialTypes.UPLOAD_MATERIAL_PRICE_GROUP_CSV,
        payload: { errors: [err.response.data.message] },
      });
    });
};

export const confirmCloseCSV = () => ({
  type: MaterialTypes.CONFIRM_UPLOAD_MATERIAL,
});

export const confirmCloseGroupCSV = () => ({
  type: MaterialTypes.CONFIRM_UPLOAD_MATERIAL_GROUP,
});

export const confirmClosePriceGroupCSV = () => ({
  type: MaterialTypes.CONFIRM_UPLOAD_MATERIAL_PRICE_GROUP,
});

export const clearDataCSV = () => ({
  type: MaterialTypes.CLOSE_MATERIAL_UPLOAD,
});

export const clearDataGroupCSV = () => ({
  type: MaterialTypes.CLOSE_MATERIAL_GROUP_UPLOAD,
});

export const clearDataPriceGroupCSV = () => ({
  type: MaterialTypes.CLOSE_MATERIAL_PRICE_GROUP_UPLOAD,
});
