import OrderTypes from "./orders.constants";

const initialStateOrders = {
  allOrders: [],
  orderTypes: [],
  isLoading: false,
  error: false,
  selectedOrder: null,
  orderErrors: {},
  uploadResponse: {
    errors: [],
    status: null,
  },
};

const ordersReducer = (state = initialStateOrders, action = {}) => {
  switch (action.type) {
    case OrderTypes.LOADING_ORDERS:
      return {
        ...state,
        isLoading: true,
      };
    case OrderTypes.SUCCESS_ORDERS:
      return {
        ...state,
        isLoading: false,
        allOrders: action.payload,
      };
    case OrderTypes.FAIL_ORDERS:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case OrderTypes.SELECT_ORDER:
      return {
        ...state,
        selectedOrder: action.payload,
      };
    case OrderTypes.CLEAR_SELECT_ORDER:
      return {
        ...state,
        selectedOrder: null,
      };
    case OrderTypes.ORDER_TYPES:
      return {
        ...state,
        orderTypes: action.payload,
      };
    case OrderTypes.ADD_ORDER:
      return {
        ...state,
        allOrders: [...state.allOrders, action.payload],
      };
    case OrderTypes.UPDATE_ORDERS:
      return {
        ...state,
        allOrders: action.payload,
      };
    case OrderTypes.SET_ORDER_ERRORS:
      return { ...state, orderErrors: action.payload };
    case OrderTypes.UPLOAD_ORDER_CSV:
      return {
        ...state,
        uploadResponse: { ...action.payload },
      };
    case OrderTypes.CONFIRM_UPLOAD_ORDER:
      return {
        ...state,
        uploadResponse: { ...state.uploadResponse, status: null },
      };
    case OrderTypes.CLOSE_ORDER_UPLOAD:
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

export default ordersReducer;
