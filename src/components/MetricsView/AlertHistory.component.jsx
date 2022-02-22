import React, { useState, useEffect, useMemo, useRef } from 'react';

//styles
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { ListAlt } from '@material-ui/icons';

//components
import Table from 'components/Table/Table.container';
import SearchAndButtons from 'components/SearchAndButtons.component';
import AlertHistoryFilterModal from 'components/MetricsView/CsvModals/AlertHistory/AlertHistoryFiltersModal.container';

//utils
import { downloadFile } from 'utils';

//hooks
import useSearch from 'hooks/useSearch';
import usePagination from 'hooks/usePagination';

import tagService from 'services/tags';
import { localDateStringToUTC } from 'utils/dates';

const AlertHistory = () => {
  const classes = useStyles();
  const [downloadData, setDownloadData] = useState([]);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);

  const { searchQuery, handleSearchChange, setData, tableData } = useSearch();

  const pageInfo = usePagination(tagService.getHistoryMetrics, 1, 3);

  const {
    items: DataForTable,
    page,
    per_page,
    total,
    total_pages,
    order,
    order_by,
    error,
    isLoading,
    actions,
  } = pageInfo;

  console.log(DataForTable);

  // const { data: DataForTable } = useSWR(
  //   'alert_history',
  //   tagService.getHistoryMetrics
  // );

  const buttons = [
    {
      label: 'descargar csv',
      handleClick: () => handleDownloadFile(),
    },
  ];

  const tableHeaders = [
    { id: 'bin', label: 'Bin' },
    { id: 'address', label: 'Mac' },
    { id: 'batch', label: 'Batch' },
    { id: 'zone', label: 'Zona' },
    { id: 'type', label: 'Tipo de Alerta' },
    { id: 'detail', label: 'Detalle' },
    { id: 'start_timestamp', label: 'Hora de Alerta' },
    { id: 'end_timestamp', label: 'Hora de Aceptacion' },
    { id: 'user', label: 'Usuario' },
  ];

  const handleDownloadFile = () => {
    setFiltersModalOpen(true);
    // const documentTitles = tableHeaders.map((header) => header.label);
    // const documentData = downloadData.map((row) => Object.values(row));
    // const formatDownloadData = {
    //   title: 'HISTORIAL DE ALERTAS',
    //   table: [documentTitles, ...documentData],
    // };
    // downloadFile(formatDownloadData, 'historial_alertas');
  };

  const handleDownloadCsv = async (filters) => {
    const filters_req = {};
    for (const key in filters) {
      if (filters[key].isSelected) filters_req[key] = filters[key];
    }
    for (const key in filters_req) {
      if (key.endsWith('_timestamp')) {
        const { start_date, start_time, end_date, end_time } = filters_req[
          key
        ].value;
        const start_datetime = localDateStringToUTC(
          `${start_date}T${start_time}`
        );
        const end_datetime = localDateStringToUTC(`${end_date}T${end_time}`);
        if (key.includes('trigger'))
          filters_req['start_timestamp'] = [start_datetime, end_datetime];
        else if (key.includes('close'))
          filters_req['end_timestamp'] = [start_datetime, end_datetime];
        else throw 'Invalid';
      } else {
        filters_req[key] = filters_req[key].value;
      }
    }

    console.log(filters_req);

    const filtered_alerts = await tagService.getFilteredAlertHistoryMetrics(
      filters_req
    );

    console.log(filtered_alerts);

    const formatedAlerts = filtered_alerts.map((data) => ({
      bin: data.container || '-',
      address: data.tag || data.device_mac || '-',
      batch: data.batch || '-',
      zone: data.zone || '-',
      type: alertTypes.current[data.alert_type],
      detail: formatDetails(data),
      start_timestamp: data.activation_timestamp
        ? new Date(data.activation_timestamp).toLocaleString()
        : '-',
      end_timestamp: data.close_timestamp
        ? new Date(data.close_timestamp).toLocaleString()
        : '-',
      user: data.user || '-',
    }));

    const documentTitles = tableHeaders.map((header) => header.label);
    const documentData = formatedAlerts.map((row) => Object.values(row));
    const formatDownloadData = {
      title: 'HISTORIAL DE ALERTAS',
      table: [documentTitles, ...documentData],
    };
    downloadFile(formatDownloadData, 'historial_alertas');
  };

  // const alertTypes = useRef(
  //   (type) =>
  //     ({
  //       zone: "Permanencia",
  //       batch: "Separación",
  //       material_group: "Proximidad",
  //     }[type])
  // );

  const alertTypes = useRef({
    zone: 'Permanencia',
    batch: 'Separación',
    proximity: 'Proximidad',
    cleanup: 'Limpieza',
    inactivity: 'Inactividad',
  });

  const formatDetails = (data) => {
    // material_group
    const meters = data?.distance === 1 ? 'Metro' : 'Metros';
    const minutes = data?.time === 1 ? 'Minuto' : 'Minutos';
    if (data.distance !== undefined && data.time === undefined) {
      return `${data.distance} ${meters}`;
    }
    // zone
    if (data.distance === undefined && data.time !== undefined) {
      return `${data.time} ${minutes}`;
    }
    // cleanup
    if (data.containerCleanup) {
      return data.containerCleanup || '-';
    }
    // batch
    if (data.distance !== undefined && data.time !== undefined) {
      return `${data.distance} ${meters} ${data.time} ${minutes}`;
    }
    // inactivity
    if (data.time !== undefined && data.time !== undefined) {
      return `${data.time} ${minutes}`;
    }
    return '-';
  };

  console.log(DataForTable);

  const formatedData = useMemo(
    () =>
      DataForTable
        ? DataForTable.map((data) => ({
            bin: data.container || '-',
            address: data.tag || data.device_mac || '-',
            batch: data.batch || '-',
            zone: data.zone || '-',
            type: alertTypes.current[data.alert_type],
            detail: formatDetails(data),
            start_timestamp: data.activation_timestamp
              ? new Date(data.activation_timestamp).toLocaleString()
              : '-',
            end_timestamp: data.close_timestamp
              ? new Date(data.close_timestamp).toLocaleString()
              : '-',
            user: data.user || '-',
          }))
        : [],
    [DataForTable]
  );

  useEffect(() => {
    setData(formatedData);
  }, [formatedData, setData]);

  return (
    <>
      <div className={classes.tableTitleContainer}>
        <ListAlt className={classes.tableIcon} />
        <Typography className={classes.tableTitle} variant="h5">
          {'HISTORIAL DE ALERTAS'}
        </Typography>
      </div>
      <SearchAndButtons
        searchQuery={searchQuery}
        changeHandler={handleSearchChange}
        buttons={buttons}
      />
      <Table
        tableHeaders={tableHeaders}
        rows={tableData}
        defaultOrder="start_timestamp"
        downloadData={(data) => setDownloadData(data)}
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
      />
      <AlertHistoryFilterModal
        open={filtersModalOpen}
        onCloseModal={() => setFiltersModalOpen(false)}
        onConfirmDownload={(filters) => handleDownloadCsv(filters)}
        onErrors={{}}
        alertTypes={alertTypes}
      />
    </>
  );
};

const useStyles = makeStyles(() => ({
  tableTitleContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  tableIcon: {
    width: '2.5rem',
    height: '2.5rem',
    backgroundColor: '#624963',
    color: 'white',
    borderRadius: '50%',
    padding: '0.5rem',
  },
  tableTitle: {
    fontWeight: 'bold',
    marginLeft: '1rem',
  },
}));

export default AlertHistory;
