import React, { useState, useEffect, useMemo, useCallback } from 'react';

//redux
import { connect } from 'react-redux';
import { addKey, deleteKey } from 'redux/Swr/swr.actions';

import { selectBatch, clearSelectedBatch } from 'redux/Batchs/batchs.actions';

//components
import SearchAndButtons from 'components/SearchAndButtons.component';
import Table from 'components/Table/Table.container';
import BatchModal from 'components/BatchView/BatchModal/BatchModal.container';

//hooks
import useSearch from 'hooks/useSearch';
import { selectUser } from 'redux/Users/user.selectors';
import usePagination from 'hooks/usePagination';

import tagService from 'services/tags';

const BatchTab = ({
  onSelectBatch,
  closeModal,
  createBatch,
  user,
  addKey,
  deleteKey,
}) => {
  const [status, setStatus] = useState(true);

  const { searchQuery, handleSearchChange, setData, tableData } = useSearch();

  const pageInfo = usePagination(tagService.getBatchs, 1, 3);

  const {
    items: batchs,
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
    addKey([tagService.getBatchs.name, page, per_page, order_by, order]);
    return () => {
      deleteKey([tagService.getBatchs.name, page, per_page, order_by, order]);
    };
  }, [page, per_page, order_by, order]);

  const buttons = [
    {
      label: status ? 'ver desactivados' : 'ver activados',
      handleClick: () => setStatus(!status),
    },
    {
      label: 'crear batch',
      handleClick: () => createBatch(),
    },
  ];

  const tableHeaders = [
    { id: 'name', label: 'Batch' },
    { id: 'quantity', label: 'N° Bins' },
    { id: 'order', label: 'Orden' },
    { id: 'material', label: 'Material' },
    { id: 'material_description', label: 'Material Desc' },
    { id: 'material_group', label: 'MG' },
    { id: 'material_group_description', label: 'MG Desc' },
    { id: 'material_pricing', label: 'MPG' },
    { id: 'material_pricing_description', label: 'MPG Desc' },
    { id: 'type', label: 'Tipo' },
  ];

  const formatedData = useMemo(
    () =>
      batchs
        ? batchs
            .filter((batch) => batch.active === status)
            .map((batch) => ({
              batch: batch.name,
              bins: batch.containers.length,
              order: batch.order ? batch.order.name : 'Sin orden asociada',
              material: batch.order?.material || '-',
              materialDesc: batch.order?.material_description || '-',
              mg: batch.order?.material_group || '-',
              mgDesc: batch.order?.material_group_description || '-',
              mpg: batch.order?.material_pricing || '-',
              mpgDesc: batch.order?.material_pricing_description || '-',
              type: batch.type === 'in' ? 'Entrada' : 'Salida',
            }))
        : [],
    [batchs, status]
  );

  const findBatch = useCallback(
    (batchName) => {
      const batch = batchs.find((batch) => batch.name === batchName);
      return { ...batch, order: batch.order };
    },
    [batchs]
  );

  useEffect(() => {
    setData(formatedData);
  }, [formatedData, setData]);

  useEffect(() => {
    return () => closeModal();
  }, [closeModal]);

  return (
    <>
      <SearchAndButtons
        searchQuery={searchQuery}
        changeHandler={handleSearchChange}
        buttons={user && user.role === 'Admin' ? buttons : []}
      />
      <Table
        // isLoading={isLoading}
        rows={tableData}
        tableHeaders={tableHeaders}
        onRowClick={({ batch }) => onSelectBatch(findBatch(batch))}
        defaultOrder="bins"
        handleChangePage={actions.setPage}
        handleChangeRowsPerPage={actions.setPageSize}
        handleChangeOrder={actions.setOrderBy}
        page={page}
        rowsPerPage={per_page}
        total={total}
        order_by={order_by}
        order_dir={order}
        total_pages={total_pages}
        changingPage={isLoading}
        showPagination={true}
        isLoading={isLoading}
      />
      <BatchModal />
    </>
  );
};

const mapStateToProps = (state) => ({
  user: selectUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  onSelectBatch: (batch) => dispatch(selectBatch(batch)),
  closeModal: () => dispatch(clearSelectedBatch()),
  createBatch: () => dispatch(selectBatch()),
  addKey: (key) => dispatch(addKey(key)),
  deleteKey: (key) => dispatch(deleteKey(key)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BatchTab);
