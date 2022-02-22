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
  rowsPerPageOptions = [3, 5, 10, 25, 50],
  // new
  handleChangePage,
  handleChangeRowsPerPage,
  handleChangeOrder,
  page = 1,
  rowsPerPage = rowsPerPageOptions[0],
  total = 0,
  total_pages = 0,
  changingPage = false,
  showPagination = true,
  order_dir,
  order_by,
}) => {
  const classes = useStyles();

  const [tableData, setTableData] = useState([]);
  const [order, setOrder] = useState(order_dir || 'asc');
  const [orderBy, setOrderBy] = useState(order_by || defaultOrder);

  const [selectValue, setSelectValue] = useState('');

  useEffect(() => {
    setOrderBy(order_by);
    setOrder(order_dir);
  }, [order_by, order_dir]);

  useEffect(() => setTableData(rows), [rows]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setSelectValue('');
    handleChangeOrder(property, isAsc ? 'desc' : 'asc');
  };

  const handleSelectSort = (event, property, value) => {
    setOrder('asc');
    setOrderBy(property);
    setSelectValue(value);
  };

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

  const emptyRows = rowsPerPage - rows?.length;
  const fill = emptyRows > 0 && (
    <TableRow style={{ height: 53 * emptyRows }}>
      <TableCell colSpan={tableHeaders.length} />
    </TableRow>
  );

  const handleChangePageClick = (event, newPage) => {
    handleChangePage(newPage + 1);
  };

  const handleChangeRowsPerPageClick = (event) => {
    handleChangeRowsPerPage(parseInt(event.target.value, 10));
  };

  // const downloadedData = useMemo(
  //   () => stableSort(tableData, getComparator(order, orderBy)),
  //   [order, orderBy, tableData]
  // );

  const downloadedData = tableData;

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
              {downloadedData.map((row, indexRow) => {
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
              {fill}
            </TableBody>
          </Table>
        </TableContainer>
        {showPagination && (
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page - 1}
            onChangePage={(event, page) =>
              handleChangePage && handleChangePageClick(event, page)
            }
            onChangeRowsPerPage={(event) =>
              handleChangeRowsPerPage && handleChangeRowsPerPageClick(event)
            }
            labelRowsPerPage="Filas por Página:"
            labelDisplayedRows={({ from, to, count }) =>
              `Página: ${
                Math.sign(rows.length) * page
              } de ${total_pages}. Mostrando ${from}-${to} de ${count}`
            }
            nextIconButtonProps={changingPage ? { disabled: changingPage } : {}}
            nextIconButtonText={`${page + 1}`}
            backIconButtonProps={changingPage ? { disabled: changingPage } : {}}
            backIconButtonText={`${page - 1}`}
          />
        )}
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
