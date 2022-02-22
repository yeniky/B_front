import React, { useState, useEffect, useMemo, useRef } from 'react';

//styles
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { ListAlt } from '@material-ui/icons';

//components
import Table from 'components/Table/Table.container';
import SearchAndButtons from 'components/SearchAndButtons.component';
import BinTimeFilterModal from 'components/MetricsView/CsvModals/BinTime/BinTimeFiltersModal.container';

//utils
import { downloadFile } from 'utils';

//hooks
import useSearch from 'hooks/useSearch';
import usePagination from 'hooks/usePagination';

import tagService from 'services/tags';
import { localDateStringToUTC } from 'utils/dates';

const BinTime = () => {
  const classes = useStyles();
  const [downloadData, setDownloadData] = useState([]);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);

  const { searchQuery, handleSearchChange, setData, tableData } = useSearch();

  const pageInfo = usePagination(tagService.getAssociationMetrics, 1, 3);

  const {
    items: DataForTable,
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

  const buttons = [
    {
      label: 'descargar csv',
      handleClick: () => handleDownloadFile(),
    },
  ];

  const tableHeaders = [
    { id: 'container', label: 'Bin' },
    { id: 'address', label: 'Tag' },
    { id: 'batch', label: 'Batch' },
    { id: 'in_time', label: 'Hora de Asociacion' },
    { id: 'out_time', label: 'Hora de Desasociacion' },
    { id: 'permanence', label: 'Tiempo de Permanencia' },
  ];

  const handleDownloadFile = () => {
    setFiltersModalOpen(true);
  };

  const handleDownloadCsv = async (filters) => {
    const filters_req = {};
    for (const key in filters) {
      if (filters[key].isSelected) filters_req[key] = filters[key];
    }
    for (const key in filters_req) {
      if (key.endsWith('_time')) {
        const { start_date, start_time, end_date, end_time } = filters_req[
          key
        ].value;
        const start_datetime = localDateStringToUTC(
          `${start_date}T${start_time}`
        );
        const end_datetime = localDateStringToUTC(`${end_date}T${end_time}`);
        if (key.includes('in'))
          filters_req['in_time'] = [start_datetime, end_datetime];
        else if (key.includes('out'))
          filters_req['out_time'] = [start_datetime, end_datetime];
        else throw 'Invalid';
      } else {
        if (key === 'permanence') {
          filters_req[key] = [
            filters_req[key].value.start,
            filters_req[key].value.end,
          ];
        } else {
          filters_req[key] = filters_req[key].value;
        }
      }
    }

    console.log(filters_req);

    const filtered_alerts = await tagService.getFilteredAssociationMetrics(
      filters_req
    );

    console.log(filtered_alerts);

    const formatedAlerts = filtered_alerts.map((data) => ({
      bin: data.container,
      address: data.tag,
      batch: data.batch,
      in_timestamp: data.in_time
        ? new Date(data.in_time).toLocaleString()
        : '-',
      end_timestamp: data.out_time
        ? new Date(data.out_time).toLocaleString()
        : '-',
      permanence:
        data.permanence !== ''
          ? `${data.permanence} Minuto${data.permanence === 1 ? '' : 's'}`
          : '-',
    }));

    const documentTitles = tableHeaders.map((header) => header.label);
    const documentData = formatedAlerts.map((row) => Object.values(row));
    const formatDownloadData = {
      title: 'TIEMPO DE ASOCIACION DE BIN CON BATCH',
      table: [documentTitles, ...documentData],
    };
    downloadFile(formatDownloadData, 'tiempo_bin_batch');
  };

  const formatedData = useMemo(
    () =>
      DataForTable.map((data) => ({
        bin: data.container,
        address: data.tag,
        batch: data.batch,
        in_timestamp: data.in_time
          ? new Date(data.in_time).toLocaleString()
          : '-',
        end_timestamp: data.out_time
          ? new Date(data.out_time).toLocaleString()
          : '-',
        permanence:
          data.permanence !== ''
            ? `${data.permanence} Minuto${data.permanence === 1 ? '' : 's'}`
            : '-',
      })),
    [DataForTable]
  );

  useEffect(() => {
    setData(formatedData);
  }, [formatedData, setData]);

  return (
    <div className={classes.container}>
      <div className={classes.tableTitleContainer}>
        <ListAlt className={classes.tableIcon} />
        <Typography className={classes.tableTitle} variant="h5">
          {'TIEMPO DE ASOCIACION DE BIN CON BATCH'}
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
        defaultOrder="in_timestamp"
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
      <BinTimeFilterModal
        open={filtersModalOpen}
        onCloseModal={() => setFiltersModalOpen(false)}
        onConfirmDownload={(filters) => handleDownloadCsv(filters)}
        onErrors={{}}
      />
    </div>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    margin: '2rem 0',
  },
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

export default BinTime;
