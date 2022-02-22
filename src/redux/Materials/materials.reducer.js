import MaterialTypes from './materials.constants';

const initialStateMaterials = {
  materials: [],
  material_groups: [],
  material_prices: [],
  isLoading: false,
  error: null,
  selectedMaterial: null,
  selectedMaterialGroup: null,
  selectedMaterialPriceGroup: null,
  materialErrors: {},
  uploadResponse: {
    errors: [],
    status: null,
  },
};

const MaterialsReducer = (state = initialStateMaterials, action = {}) => {
  switch (action.type) {
    case MaterialTypes.LOADING_MATERIALS:
      return {
        ...state,
        isLoading: true,
      };
    case MaterialTypes.SUCCESS_MATERIALS:
      return {
        ...state,
        isLoading: false,
        error: null,
        ...action.payload,
      };
    case MaterialTypes.FAIL_MATERIALS:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case MaterialTypes.SELECT_MATERIAL:
      return {
        ...state,
        selectedMaterial: action.payload,
      };
    case MaterialTypes.CLEAR_SELECTED_MATERIAL:
      return {
        ...state,
        selectedMaterial: null,
      };
    case MaterialTypes.SELECT_MATERIAL_GROUP:
      return {
        ...state,
        selectedMaterialGroup: action.payload,
      };
    case MaterialTypes.CLEAR_SELECTED_MATERIAL_GROUP:
      return {
        ...state,
        selectedMaterialGroup: null,
      };
    case MaterialTypes.SELECT_MATERIAL_PRICE_GROUP:
      return {
        ...state,
        selectedMaterialPriceGroup: action.payload,
      };
    case MaterialTypes.CLEAR_SELECTED_MATERIAL_PRICE_GROUP:
      return {
        ...state,
        selectedMaterialPriceGroup: null,
      };

    case MaterialTypes.SET_MATERIAL_ERRORS:
      return {
        ...state,
        materialErrors: action.payload,
      };
    case MaterialTypes.ADD_MATERIAL:
      return {
        ...state,
        materials: [...state.materials, action.payload],
      };
    case MaterialTypes.ADD_MATERIAL_GROUP:
      return {
        ...state,
        material_groups: [...state.material_groups, action.payload],
      };
    case MaterialTypes.ADD_MATERIAL_PRICE_GROUP:
      return {
        ...state,
        material_prices: [...state.material_prices, action.payload],
      };
    case MaterialTypes.UPDATE_MATERIALS:
      return {
        ...state,
        materials: action.payload,
      };
    case MaterialTypes.UPDATE_MATERIALS_GROUP:
      return {
        ...state,
        material_groups: action.payload,
      };
    case MaterialTypes.UPDATE_MATERIALS_PRICE_GROUP:
      return {
        ...state,
        material_prices: action.payload,
      };
    case MaterialTypes.UPLOAD_MATERIAL_CSV:
      return {
        ...state,
        uploadResponse: { ...action.payload },
      };
    case MaterialTypes.CONFIRM_UPLOAD_MATERIAL:
      return {
        ...state,
        uploadResponse: { ...state.uploadResponse, status: null },
      };
    case MaterialTypes.CLOSE_MATERIAL_UPLOAD:
      return {
        ...state,
        uploadResponse: {
          errors: [],
          status: null,
        },
      };
    default:
      return state;
  }
};

export default MaterialsReducer;
