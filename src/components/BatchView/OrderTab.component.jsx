import React, { useState, useEffect, useMemo, useCallback } from 'react';

//redux
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { addKey, deleteKey } from 'redux/Swr/swr.actions';

import {
  // selectOrders,
  uploadOrderResponseSelector,
} from 'redux/Orders/orders.selectors';
// import { selectBatchs } from 'redux/Batchs/batch.selectors';

import {
  selectOrder,
  uploadOrderCSV,
  confirmCloseCSV,
  clearDataCSV,
} from 'redux/Orders/orders.actions';

//components
import Table from 'components/Table/Table.container';
import SearchAndButtons from 'components/SearchAndButtons.component';
import OrderModal from 'components/BatchView/OrderModal/OrderModal.container';
import UploadCSV from 'components/UploadCsv.component';

//hooks
import useSearch from 'hooks/useSearch';
import { selectUser } from 'redux/Users/user.selectors';
import usePagination from 'hooks/usePagination';

import tagService from 'services/tags';

const OrdersTab = ({
  // orders,
  // batchs,
  onNewOrder,
  onEditOrder,
  uploadOrderCSV,
  uploadResponse,
  confirmCloseCSV,
  clearDataCSV,
  user,
  addKey,
  deleteKey,
}) => {
  const [openUpload, setOpenUpload] = useState(false);
  const [status, setStatus] = useState(true);

  const { searchQuery, handleSearchChange, setData, tableData } = useSearch();

  const pageInfo = usePagination(tagService.getOrders, 1, 3);

  const {
    items: orders,
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
    addKey([tagService.getOrders.name, page, per_page, order_by, order]);
    return () => {
      deleteKey([tagService.getOrders.name, page, per_page, order_by, order]);
    };
  }, [page, per_page, order_by, order]);

  const toggleUpload = () => {
    setOpenUpload(!openUpload);
    clearDataCSV();
  };

  const buttons = [
    {
      label: status ? 'ver desactivados' : 'ver activados',
      handleClick: () => setStatus(!status),
    },
    {
      label: 'carga masiva',
      handleClick: () => toggleUpload(),
    },
    {
      label: 'crear orden',
      handleClick: () => onNewOrder(),
    },
  ];

  // const countBatchs = useCallback(
  //   (order, type) => {
  //     const filteredBatchs = batchs.filter(
  //       (batchItem) => batchItem.order === order
  //     );
  //     return filteredBatchs.reduce(
  //       (acc, batch) => (batch.type === type ? acc + 1 : acc),
  //       0
  //     );
  //   },
  //   [batchs]
  // );

  const tableHeaders = [
    { id: 'name', label: 'Orden' },
    { id: 'order_type', label: 'Tipo' },
    { id: 'material', label: 'Material' },
    { id: 'material_group', label: 'MG' },
    { id: 'material_pricing', label: 'MPG' },
    { id: 'in_batches', label: 'Batch de Entrada' },
    { id: 'out_batches', label: 'Batch de Salida' },
    { id: 'start_date', label: 'Fecha de Inicio' },
    { id: 'end_date', label: 'Fecha de Termino' },
  ];

  const formatedData = useMemo(
    () =>
      orders
        .filter((order) => order.active === status)
        .map((order) => ({
          order: order.name,
          type: order.order_type,
          material: order.material,
          materialGroup: order.material_group,
          materialPricing: order.material_pricing,
          // batchOut: countBatchs(order.name, 'out'),
          // batchIn: countBatchs(order.name, 'in'),
          batchIn: order.in_batches,
          batchOut: order.out_batches,
          start_timestamp: order.start_date
            ? new Date(order.start_date.split('+')[0]).toLocaleDateString()
            : '-',
          end_timestamp: order.end_date
            ? new Date(order.end_date.split('+')[0]).toLocaleDateString()
            : '-',
        })),
    [orders, status]
  );

  const findOrder = useCallback(
    (orderName) => orders.find((order) => order.name === orderName),
    [orders]
  );

  useEffect(() => {
    setData(formatedData);
  }, [formatedData, setData]);

  return (
    <>
      <SearchAndButtons
        searchQuery={searchQuery}
        changeHandler={handleSearchChange}
        buttons={user && user.role === 'Admin' ? buttons : [buttons[0]]}
      />
      {tableData && (
        <Table
          tableHeaders={tableHeaders}
          rows={tableData}
          onRowClick={(order) => onEditOrder(findOrder(order.order))}
          defaultOrder="start_timestamp"
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
      <OrderModal />
      <UploadCSV
        open={openUpload}
        handleClose={toggleUpload}
        type="ordenes"
        required="Order, Plnt, Ord Type, Crop Year y Material"
        optionals="Agreement, Purch. doc, F. Inicio y F. Termino."
        handleUpload={(file) => uploadOrderCSV(file)}
        uploadResponse={uploadResponse}
        confirmUpload={() => confirmCloseCSV()}
      />
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  // orders: selectOrders,
  // batchs: selectBatchs,
  uploadResponse: uploadOrderResponseSelector,
  user: selectUser,
});

const mapDispatchToProps = (dispatch) => ({
  onNewOrder: () => dispatch(selectOrder()),
  onEditOrder: (order) => dispatch(selectOrder(order)),
  uploadOrderCSV: (file) => dispatch(uploadOrderCSV(file)),
  confirmCloseCSV: () => dispatch(confirmCloseCSV()),
  clearDataCSV: () => dispatch(clearDataCSV()),
  addKey: (key) => dispatch(addKey(key)),
  deleteKey: (key) => dispatch(deleteKey(key)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrdersTab);
