import {
  LOADING_BINS,
  SUCCESS_BINS,
  FAIL_BINS,
  FILTER_BINS_IN_TAG,
  SET_BIN_TYPES,
  //FOR REVIEW
  UPDATE_BINS,
  SELECT_BIN,
  CLEAR_SELECTED_BIN,
  SELECT_BIN_EDIT,
  CLEAR_EDIT_BIN,
  SET_ERRORS,
} from './bins.constants';

//utils
import tagService from 'services/tags';
import BinSchema from 'schemas/bin';
import { updateItem } from 'utils';

import { selectBins } from './bins.selectors';
import { getSelectedTag, selectTags } from 'redux/Tags/tags.selectors';
import { selectBatchs } from 'redux/Batchs/batch.selectors';

import {
  updateTags,
  updateSelectedTag,
  updateInTag,
} from 'redux/Tags/tags.actions';
import { updateBatchs } from 'redux/Batchs/batchs.actions';
import { mutateKeys } from 'redux/Swr/swr.actions';

export const fetchBins = () => (dispatch) => {
  dispatch({ type: LOADING_BINS });
  tagService
    .getContainers()
    .then((bins) =>
      dispatch({
        type: SUCCESS_BINS,
        // ! remove .items
        payload: bins.items,
      })
    )
    .catch((error) => dispatch({ type: FAIL_BINS, payload: error }));
};

export const fetchBinTypes = () => (dispatch) => {
  tagService
    .getBinTypes()
    .then((binTypes) => {
      dispatch(setBinTypes(binTypes));
    })
    .catch((error) => dispatch({ type: FAIL_BINS, payload: error }));
};

//NEW ACTIONS

//receive the tag container name
export const filterBinsInTag = (tag) => (dispatch, getState) => {
  const binsList = selectBins(getState());
  //Al agregar un bin al batch tira undefined
  if (tag) {
    //search for the paired bin if exist
    const pairedBin = binsList.find((binItem) => binItem.name === tag);
    dispatch({
      type: FILTER_BINS_IN_TAG,
      payload: { pairedBin: pairedBin, binsAvailables: null },
    });
  } else {
    const binsAvailables = binsList.filter((binItem) => binItem.tag === '');
    dispatch({
      type: FILTER_BINS_IN_TAG,
      payload: { pairedBin: null, binsAvailables: binsAvailables },
    });
  }
};

export const selectBin = (bin, tag) => {
  if (bin) {
    if (tag) {
      return { type: SELECT_BIN, payload: { ...bin, tag: tag } };
    } else {
      return { type: SELECT_BIN, payload: bin };
    }
  } else {
    return {
      type: SELECT_BIN,
      payload: {
        name: '',
        code: '',
        type: '',
        batch: '',
        tag: tag,
        description: '',
      },
    };
  }
};

export const saveEditBin = (editedBin) => (dispatch, getState) => {
  const [validBin, errors] = BinSchema.validate(editedBin);
  if (!errors) {
    delete validBin.tag; //delete to avoid back-end bug: "container already has a tag"
    tagService
      .editNewBinForm(validBin)
      .then((binResponse) => {
        // mutate(
        //   ['getContainers', 1, 1000, 'id', 'asc'],
        //   async (oldData) => {
        //     if (oldData) {
        //       return {
        //         ...oldData,
        //         items: [...oldData.items, binResponse],
        //       };
        //     }
        //   },
        //   true
        // );

        // const keys = selectSwrKeys(getState());

        // console.log(keys);

        // keys.forEach((key) => {
        //   mutate(key, undefined, true);
        // });

        mutateKeys(getState());

        const binList = selectBins(getState());

        const binlistUpdated = binList.map((currentBin) =>
          currentBin.id === binResponse.id ? binResponse : currentBin
        );
        dispatch(updateBins(binlistUpdated));

        let toUpdateInTag = {};

        toUpdateInTag.container = binResponse.tag ? binResponse.name : '';

        if (binResponse.batch) {
          const batchList = selectBatchs(getState());
          const batchToUpdate = batchList.find(
            (batch) => batch.name === binResponse.batch
          );

          const batchUpdated = {
            ...batchToUpdate,
            containers: updateItem(batchToUpdate.containers, 'id', {
              [binResponse.id]: binResponse,
            }),
          };

          toUpdateInTag.batch = binResponse.tag ? batchUpdated.name : '';
          toUpdateInTag.order =
            batchUpdated.order && binResponse.tag ? batchUpdated.order : '';

          const batchlistUpdated = batchList.map((currentBatch) =>
            currentBatch.id === batchUpdated.id ? batchUpdated : currentBatch
          );

          dispatch(updateBatchs(batchlistUpdated));
        } else {
          toUpdateInTag.order = '';
          toUpdateInTag.batch = '';
        }
        if (binResponse.tag) {
          dispatch(updateInTag(toUpdateInTag, binResponse.tag));
        }
        console.log('CLEAR_SELECTED_BIN');
        dispatch(clearSelectedBin());
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message &&
          err.response.data.message ===
            'a container with that name already exists'
        ) {
          dispatch(setErrors({ name: 'El ID debe ser unico' }));
        }
        console.log(err);
        console.log(err.response);
      });
  } else {
    dispatch(setErrors(errors));
  }
};

export const saveNewBin = (newBin) => (dispatch, getState) => {
  const [validBin, errors] = BinSchema.validate(newBin);
  if (!errors) {
    delete validBin.tag;
    tagService
      .sendNewBinForm(validBin)
      .then((binResponse) => {
        mutateKeys(getState());
        const binList = selectBins(getState());
        const binlistUpdated = [...binList, binResponse];
        dispatch(updateBins(binlistUpdated));
        dispatch(filterBinsInTag());
        dispatch(clearSelectedBin());
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message &&
          err.response.data.message ===
            'a container with that name already exists'
        ) {
          dispatch(setErrors({ name: 'El ID debe ser unico' }));
        }
        console.log(err);
        console.log(err.response);
      });
  } else {
    dispatch(setErrors(errors));
  }
};

//FIXME: OLD ACTIONS, FOR REVIEW

export const updateBins = (bins) => ({ type: UPDATE_BINS, payload: bins });

export const setBin = (bin) => ({ type: SELECT_BIN, payload: bin });

export const clearSelectedBin = () => (dispatch) => {
  dispatch({ type: CLEAR_SELECTED_BIN });
  dispatch(setErrors({}));
};

export const pairTagWithBin = (bin) => (dispatch, getState) => {
  const selectedTag = getSelectedTag(getState());
  const tags = selectTags(getState());
  const bins = selectBins(getState());

  //FIXME: Puede mejorar el codigo
  let editedBin = bin;
  editedBin['tag'] = selectedTag['address'];
  tagService
    .editNewBinForm(editedBin)
    .then((bin) => {
      // const keys = selectSwrKeys(getState());
      // keys.forEach((k) => mutate(k, undefined, true));
      mutateKeys(getState());

      let editedBinList = [...bins];
      const idx = editedBinList.findIndex((el) => el['id'] === bin['id']);
      editedBinList[idx] = bin;
      dispatch(updateBins(editedBinList));

      tagService.getTag(selectedTag.address).then((updatedTag) => {
        let tagsModified = [...tags];

        const tagsIdx = tagsModified.findIndex(
          (el) => selectedTag['id'] === el['id']
        );
        tagsModified[tagsIdx] = updatedTag;

        dispatch(updateTags(tagsModified));
        dispatch(updateSelectedTag(updatedTag));
        dispatch(filterBinsInTag(updatedTag.container));
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};

export const setToEdit = (bin) => ({ type: SELECT_BIN_EDIT, payload: bin });
export const clearEditBin = () => ({ type: CLEAR_EDIT_BIN });

export const setErrors = (errors) => ({ type: SET_ERRORS, payload: errors });

export const unSetTag = () => (dispatch, getState) => {
  const selectedTag = getSelectedTag(getState());
  const bins = selectBins(getState());
  const tags = selectTags(getState());
  const bin = bins.filter((bin) => bin['name'] === selectedTag['container'])[0];
  tagService
    .unsetTag(bin)
    .then((bin) => {
      // const keys = selectSwrKeys(getState());
      // keys.forEach((k) => mutate(k, undefined, true));
      mutateKeys(getState());

      let editedBinList = [...bins];
      const idx = editedBinList.findIndex((el) => el['id'] === bin['id']);
      editedBinList[idx] = bin;
      dispatch(updateBins(editedBinList));

      tagService.getTag(selectedTag.address).then((updatedTag) => {
        let tagsModified = [...tags];

        const tagsIdx = tagsModified.findIndex(
          (el) => selectedTag['id'] === el['id']
        );
        tagsModified[tagsIdx] = updatedTag;

        dispatch(filterBinsInTag());
        dispatch(updateTags(tagsModified));
        dispatch(updateSelectedTag(updatedTag));
      });
    })
    .catch((err) => {
      console.log(err);
      console.log(err.response);
    });
};

export const setBinTypes = (binTypes) => ({
  type: SET_BIN_TYPES,
  payload: binTypes,
});
