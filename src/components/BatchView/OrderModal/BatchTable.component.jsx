import React, { useMemo, useCallback } from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

//components
import TableFront from 'components/Table/TableFront.container';

const BatchsTable = ({ associatedBatchs, handleSelection }) => {
  const classes = useStyles();

  const tableHeaders = [
    { id: 'batch', label: 'Batch' },
    { id: 'bins', label: 'N Bins' },
    { id: 'type', label: 'Tipo' },
  ];

  const tableData = useMemo(
    () =>
      associatedBatchs.map((batch) => ({
        batch: batch.name,
        b_bins: batch.containers.length,
        type: batch.type === 'in' ? 'Entrada' : 'Salida',
      })),
    [associatedBatchs]
  );

  const findBatch = useCallback(
    (batchName) => associatedBatchs.find((batch) => batch.name === batchName),
    [associatedBatchs]
  );

  return (
    <>
      <Typography className={classes.title}>{'Batches asociados'}</Typography>
      <TableFront
        tableHeaders={tableHeaders}
        rows={tableData}
        onRowClick={({ batch }) => handleSelection(findBatch(batch))}
        defaultOrder="bins"
        rowsPerPageOptions={[2, 4, 6]}
      />
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: theme.palette.common.blue,
    marginBottom: '0.5rem',
  },
}));

export default BatchsTable;
