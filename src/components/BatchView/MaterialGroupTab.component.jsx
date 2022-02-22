import React, { useState, useMemo, useEffect, useCallback } from 'react';

//redux
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { addKey, deleteKey } from 'redux/Swr/swr.actions';

import { uploadMaterialResponseSelector } from 'redux/Materials/materials.selectors';

import {
  setSelectedMaterialGroup,
  uploadMaterialGroupCSV,
  confirmCloseGroupCSV,
  clearDataGroupCSV,
} from 'redux/Materials/materials.actions';

//components
import Table from 'components/Table/Table.container';
import SearchAndButtons from 'components/SearchAndButtons.component';
import MaterialGroupModal from 'components/BatchView/MaterialModal/MaterialGroupModal.container';
import UploadCSV from 'components/UploadCsv.component';

//hooks
import useSearch from 'hooks/useSearch';
import { selectUser } from 'redux/Users/user.selectors';
import usePagination from 'hooks/usePagination';

import tagService from 'services/tags';

const MaterialGroupTab = ({
  onNewMaterial,
  onEditMaterial,
  uploadMaterialGroupCSV,
  uploadResponse,
  confirmCloseCSV,
  clearDataCSV,
  user,
  addKey,
  deleteKey,
}) => {
  const [openUpload, setOpenUpload] = useState(false);
  const { searchQuery, handleSearchChange, setData, tableData } = useSearch();

  const pageInfo = usePagination(tagService.getMaterialGroup, 1, 3);

  const {
    items: materialGroupList,
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
    addKey([tagService.getMaterialGroup.name, page, per_page, order_by, order]);
    return () => {
      deleteKey([
        tagService.getMaterialGroup.name,
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
      label: 'crear material group',
      handleClick: () => onNewMaterial(),
    },
  ];

  const tableHeaders = [
    // { id: 'id', label: 'Id' },
    { id: 'name', label: 'Material Group' },
    { id: 'description', label: 'Material Group Description' },
  ];

  const formatedData = useMemo(
    () =>
      materialGroupList.map((materialGroup) => ({
        // id: materialGroup.id,
        name: materialGroup.name,
        description: materialGroup.description,
      })),
    [materialGroupList]
  );

  const findMaterialGroup = useCallback(
    (materialGroupName) =>
      materialGroupList.find((mg) => mg.name === materialGroupName),
    [materialGroupList]
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
          onRowClick={(materialGroup) =>
            onEditMaterial(findMaterialGroup(materialGroup.name))
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
      <MaterialGroupModal />
      <UploadCSV
        open={openUpload}
        handleClose={toggleUpload}
        type="materials group"
        required="Material Group, Matl Grp Desc."
        // optionals="Type of Reproduction, Phase, Package Type y Variety Name."
        handleUpload={(file) => uploadMaterialGroupCSV(file)}
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
  onNewMaterial: () => dispatch(setSelectedMaterialGroup()),
  onEditMaterial: (material) => dispatch(setSelectedMaterialGroup(material)),
  uploadMaterialGroupCSV: (file) => dispatch(uploadMaterialGroupCSV(file)),
  confirmCloseCSV: () => dispatch(confirmCloseGroupCSV()),
  clearDataCSV: () => dispatch(clearDataGroupCSV()),
  addKey: (key) => dispatch(addKey(key)),
  deleteKey: (key) => dispatch(deleteKey(key)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MaterialGroupTab);
