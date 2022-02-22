import React, { useState, useMemo, useEffect, useCallback } from 'react';

//redux
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { addKey, deleteKey } from 'redux/Swr/swr.actions';

import {
  uploadMaterialResponseSelector,
  selectMaterialPrices,
} from 'redux/Materials/materials.selectors';

import {
  setSelectedMaterialPriceGroup,
  uploadMaterialPriceGroupCSV,
  confirmClosePriceGroupCSV,
  clearDataPriceGroupCSV,
} from 'redux/Materials/materials.actions';

//components
import Table from 'components/Table/Table.container';
import SearchAndButtons from 'components/SearchAndButtons.component';
import MaterialPriceGroupModal from 'components/BatchView/MaterialModal/MaterialPriceGroupModal.container';
import UploadCSV from 'components/UploadCsv.component';

//hooks
import useSearch from 'hooks/useSearch';
import { selectUser } from 'redux/Users/user.selectors';
import usePagination from 'hooks/usePagination';

import tagService from 'services/tags';

const MaterialPriceGroupTab = ({
  // materialPriceGroupList,
  onNewMaterialPriceGroup,
  onEditMaterialPriceGroup,
  uploadMaterialPriceGroupCSV,
  uploadResponse,
  confirmCloseCSV,
  clearDataCSV,
  user,
  addKey,
  deleteKey,
}) => {
  const [openUpload, setOpenUpload] = useState(false);
  const { searchQuery, handleSearchChange, setData, tableData } = useSearch();

  const pageInfo = usePagination(tagService.getMaterialPrice, 1, 3);

  const {
    items: materialPriceGroupList,
    page,
    per_page,
    total,
    total_pages,
    order_by,
    order,
    error,
    isLoading,
    actions,
  } = pageInfo;

  useEffect(() => {
    addKey([tagService.getMaterialPrice.name, page, per_page, order_by, order]);
    return () => {
      deleteKey([
        tagService.getMaterialPrice.name,
        page,
        per_page,
        order_by,
        order,
      ]);
    };
  }, [page, per_page, order_by, order]);

  const toggleUpload = () => {
    setOpenUpload(!openUpload);
    clearDataCSV();
  };

  const buttons = [
    {
      label: 'carga masiva',
      handleClick: () => toggleUpload(),
    },
    {
      label: 'crear material price group',
      handleClick: () => onNewMaterialPriceGroup(),
    },
  ];

  const tableHeaders = [
    // { id: 'id', label: 'Id' },
    { id: 'name', label: 'Material Price Group' },
    { id: 'description', label: 'Material Price Group Description' },
  ];

  const formatedData = useMemo(
    () =>
      materialPriceGroupList.map((materialPriceGroup) => ({
        // id: materialPriceGroup.id,
        name: materialPriceGroup.name,
        description: materialPriceGroup.description,
      })),
    [materialPriceGroupList]
  );

  const findMaterialPriceGroup = useCallback(
    (materialPriceGroupName) =>
      materialPriceGroupList.find((mpg) => mpg.name === materialPriceGroupName),
    [materialPriceGroupList]
  );

  useEffect(() => {
    setData(formatedData);
  }, [formatedData, setData]);

  return (
    <>
      <SearchAndButtons
        searchQuery={searchQuery}
        changeHandler={handleSearchChange}
        buttons={user && user.role === 'Admin' ? buttons : []}
      />
      {tableData && (
        <Table
          tableHeaders={tableHeaders}
          rows={tableData}
          onRowClick={(materialPriceGroup) =>
            onEditMaterialPriceGroup(
              findMaterialPriceGroup(materialPriceGroup.name)
            )
          }
          defaultOrder="id"
          handleChangePage={actions.setPage}
          handleChangeRowsPerPage={actions.setPageSize}
          handleChangeOrder={actions.setOrderBy}
          page={page}
          rowsPerPage={per_page}
          total={total}
          total_pages={total_pages}
          order_by={order_by}
          order_dir={order}
          changingPage={isLoading}
          showPagination={true}
          isLoading={isLoading}
        />
      )}
      <MaterialPriceGroupModal />
      <UploadCSV
        open={openUpload}
        handleClose={toggleUpload}
        type="material price groups"
        required="MPG, MPG Description"
        // optionals="Type of Reproduction, Phase, Package Type y Variety Name."
        handleUpload={(file) => uploadMaterialPriceGroupCSV(file)}
        uploadResponse={uploadResponse}
        confirmUpload={() => confirmCloseCSV()}
      />
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  uploadResponse: uploadMaterialResponseSelector,
  user: selectUser,
});

const mapDispatchToProps = (dispatch) => ({
  onNewMaterialPriceGroup: () => dispatch(setSelectedMaterialPriceGroup()),
  onEditMaterialPriceGroup: (materialPriceGroup) =>
    dispatch(setSelectedMaterialPriceGroup(materialPriceGroup)),
  uploadMaterialPriceGroupCSV: (file) =>
    dispatch(uploadMaterialPriceGroupCSV(file)),
  confirmCloseCSV: () => dispatch(confirmClosePriceGroupCSV()),
  clearDataCSV: () => dispatch(clearDataPriceGroupCSV()),
  addKey: (key) => dispatch(addKey(key)),
  deleteKey: (key) => dispatch(deleteKey(key)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MaterialPriceGroupTab);
