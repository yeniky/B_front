import { FAIL_ZONES, LOADING_ZONES, SUCCESS_ZONES } from "./zones.constants";

import tagService from "services/tags";

const requestFetchZones = () => ({ type: LOADING_ZONES });

const successFetchZones = (zones) => ({ type: SUCCESS_ZONES, payload: zones });

const failFetchZones = (error) => ({ type: FAIL_ZONES, payload: error });

export const fetchZones = () => (dispatch) => {
  dispatch(requestFetchZones());
  tagService
    .getZones()
    .then((tags) => dispatch(successFetchZones(tags)))
    .catch((error) => dispatch(failFetchZones(error)));
};
