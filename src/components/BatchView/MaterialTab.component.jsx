import React, { useState, useMemo, useEffect, useCallback } from 'react';

//redux
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { addKey, deleteKey } from 'redux/Swr/swr.actions';

import {
  // selectMaterialsWithInfo,
  uploadMaterialResponseSelector,
} from 'redux/Materials/materials.selectors';

import {
  setSelectedMaterial,
  uploadMaterialCSV,
  confirmCloseCSV,
  clearDataCSV,
} from 'redux/Materials/materials.actions';

//components
import Table from 'components/Table/Table.container';
import SearchAndButtons from 'components/SearchAndButtons.component';
import MaterialModal from 'components/BatchView/MaterialModal/MaterialModal.container';
import UploadCSV from 'components/UploadCsv.component';

//hooks
import useSearch from 'hooks/useSearch';
import { selectUser } from 'redux/Users/user.selectors';
import usePagination from 'hooks/usePagination';

import tagService from 'services/tags';

const MaterialTab = ({
  // materialList,
  onNewMaterial,
  onEditMaterial,
  uploadMaterialCSV,
  uploadResponse,
  confirmCloseCSV,
  clearDataCSV,
  user,
  addKey,
  deleteKey,
}) => {
  const [openUpload, setOpenUpload] = useState(false);
  const { searchQuery, handleSearchChange, setData, tableData } = useSearch();

  const pageInfo = usePagination(tagService.getMaterials, 1, 3);

  const {
    items: materialList,
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
    addKey([tagService.getMaterials.name, page, per_page, order_by, order]);
    return () => {
      deleteKey([
        tagService.getMaterials.name,
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
      label: 'crear material',
      handleClick: () => onNewMaterial(),
    },
  ];

  const tableHeaders = [
    { id: 'name', label: 'Material' },
    { id: 'description', label: 'Material Description' },
    { id: 'material_group', label: 'MG' },
    { id: 'material_group_description', label: 'MG Desc.' },
    { id: 'material_pricing_group', label: 'MPG' },
    { id: 'material_pricing_group_description', label: 'MPG Desc.' },
  ];

  const formatedData = useMemo(
    () =>
      materialList.map((material) => ({
        material: material.name,
        desc: material.description,
        mg: material.material_group,
        mgd: material.material_group_description,
        mpg: material.material_pricing_group,
        mpgd: material.material_pricing_group_description,
      })),
    [materialList]
  );

  const findMaterial = useCallback(
    (materialName) =>
      materialList.find((material) => material.name === materialName),
    [materialList]
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
          onRowClick={({ material }) => onEditMaterial(findMaterial(material))}
          defaultOrder="material"
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
      <MaterialModal />
      <UploadCSV
        open={openUpload}
        handleClose={toggleUpload}
        type="materiales"
        required="Material, Material Description, Matl Group y MPG"
        optionals="Type of Reproduction, Phase, Package Type y Variety Name."
        handleUpload={(file) => uploadMaterialCSV(file)}
        uploadResponse={uploadResponse}
        confirmUpload={() => confirmCloseCSV()}
      />
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  // materialList: selectMaterialsWithInfo,
  uploadResponse: uploadMaterialResponseSelector,
  user: selectUser,
});

const mapDispatchToProps = (dispatch) => ({
  onNewMaterial: () => dispatch(setSelectedMaterial()),
  onEditMaterial: (material) => dispatch(setSelectedMaterial(material)),
  uploadMaterialCSV: (file) => dispatch(uploadMaterialCSV(file)),
  confirmCloseCSV: () => dispatch(confirmCloseCSV()),
  clearDataCSV: () => dispatch(clearDataCSV()),
  addKey: (key) => dispatch(addKey(key)),
  deleteKey: (key) => dispatch(deleteKey(key)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MaterialTab);
