import React, { useMemo, useCallback } from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

//components
import TableFront from 'components/Table/TableFront.container';

const BinsTable = ({ associatedBins, tagList, handleSelection }) => {
  const classes = useStyles();

  const tableHeaders = [
    { id: 'bin', label: 'Bin' },
    { id: 'tag', label: 'Tag' },
    { id: 'zone', label: 'Zona' },
    { id: 'signal', label: 'Intensidad' },
    { id: 'timestamp', label: 'Actualización' },
  ];

  const tableData = useMemo(
    () =>
      associatedBins.map((bin) => {
        const tagFound = bin.tag
          ? tagList.find((tag) => tag.address === bin.tag)
          : null;

        return {
          bin: bin.name,
          tag: tagFound ? tagFound.address : '-',
          zone: tagFound ? tagFound.position.zone : '-',
          signal: tagFound ? `${tagFound.position.signal}%` : '-',
          timestamp: tagFound
            ? new Date(tagFound.position.timestamp).toLocaleString()
            : '-',
        };
      }),
    [associatedBins, tagList]
  );

  const findBin = useCallback(
    (binName) => associatedBins.find((bin) => bin.name === binName),
    [associatedBins]
  );

  return (
    <>
      <Typography className={classes.title}>{'Bins asociados'}</Typography>
      <TableFront
        tableHeaders={tableHeaders}
        rows={tableData}
        onRowClick={({ bin }) => handleSelection(findBin(bin))}
        defaultOrder="timestamp"
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

export default BinsTable;
