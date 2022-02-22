import React, { useState, useEffect, useMemo } from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';
import {
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
} from '@material-ui/core';

//components
import TableHead from './Head.component';
import Loading from 'components/Loading.hoc';

//utils
import { stableSort, getComparator } from './tableUtils';

const CustomTable = ({
  rows,
  tableHeaders,
  onRowClick,
  defaultOrder,
  downloadData,
  rowsPerPageOptions = [10, 25, 50],
}) => {
  const classes = useStyles();

  const [tableData, setTableData] = useState([]);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState(defaultOrder);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [selectValue, setSelectValue] = useState('');

  useEffect(() => setTableData(rows), [rows]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setSelectValue('');
  };

  const handleSelectSort = (event, property, value) => {
    setOrder('asc');
    setOrderBy(property);
    setSelectValue(value);
  };

  useEffect(() => {
    if (rows.length >= page * rowsPerPage) {
      setPage(0);
    }
  }, [rows.length]);

  useEffect(() => {
    if (selectValue === '') {
      setTableData(rows);
    } else {
      const filteredData = rows.filter((row) =>
        row[orderBy].includes(selectValue)
      );
      setTableData(filteredData);
    }
  }, [selectValue, rows, orderBy]);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, tableData.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const downloadedData = useMemo(
    () => stableSort(tableData, getComparator(order, orderBy)),
    [order, orderBy, tableData]
  );

  const formatedData = useMemo(
    () =>
      downloadedData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [page, rowsPerPage, downloadedData]
  );

  useEffect(() => {
    if (downloadData) downloadData(downloadedData);
  }, [downloadData, downloadedData]);

  return (
    <div className={classes.container}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table className={classes.table}>
            <TableHead
              headCells={tableHeaders}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              onSelectSort={handleSelectSort}
            />
            <TableBody>
              {formatedData.map((row, indexRow) => {
                return (
                  <TableRow
                    hover
                    onClick={() => (onRowClick ? onRowClick(row) : null)}
                    tabIndex={-1}
                    key={`${Object.keys(row)[0]}_${indexRow}`}
                  >
                    {Object.keys(row).map((key, index) =>
                      index === 0 ? (
                        <TableCell
                          component="th"
                          scope="row"
                          padding="none"
                          align="center"
                          key={`${row[key]}_${index}`}
                        >
                          {row[key]}
                        </TableCell>
                      ) : (
                        <TableCell align="center" key={`${row[key]}_${index}`}>
                          {row[key]}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por Pagina:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
        />
      </Paper>
      {/*       <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({}));

export default Loading(CustomTable);
