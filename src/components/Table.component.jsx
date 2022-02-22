import React, { useState, useEffect } from "react";

import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { ArrowDropUp, ArrowDropDown, Remove } from "@material-ui/icons";

import Select from "components/Select.component";

//FIXME: REFACTOR TABLE

const CustomTable = ({ tableHeaders, info, onRowClick }) => {
  const classes = useStyles();

  const [selectedColumn, setSelectedColumn] = useState(0);
  const [tableInfo, setTableInfo] = useState(info);
  const [order, setOrder] = useState("asc");
  const [bodyTable, setBodyTable] = useState([]);

  const [value, setValue] = useState("all");

  const sortByKeyAsc = (array, key) => {
    return array.sort((a, b) => {
      let x = a[key];
      let y = b[key];
      return x < y ? -1 : x > y ? 1 : 0;
    });
  };
  const sortByKeyDesc = (array, key) => {
    return array.sort((a, b) => {
      let x = a[key];
      let y = b[key];
      return x > y ? -1 : x < y ? 1 : 0;
    });
  };

  const getKey = () => {
    const row = info[0];
    if (row) {
      const selectedKey = Object.keys(row)[selectedColumn];
      return selectedKey;
    }
  };
  useEffect(() => {
    setBodyTable(
      tableInfo.map((row) => {
        const infoRow = [];
        for (const [, value] of Object.entries(row)) {
          infoRow.push(
            <TableCell className={classes.rowBody} align="center">
              <Typography className={classes.rowBodyText}>{value}</Typography>
            </TableCell>
          );
        }
        return infoRow;
      })
    );
  }, [tableInfo, order]);

  useEffect(() => {
    const selectedKey = getKey();
    if (order === "asc") {
      const sortedInfo = sortByKeyAsc([...info], selectedKey);
      setTableInfo((currentState) => sortedInfo);
    }
    if (order === "desc") {
      const sortedInfo = sortByKeyDesc([...info], selectedKey);
      setTableInfo((currentState) => sortedInfo);
    }
  }, [selectedColumn, order]);

  useEffect(() => {
    //no se agrega la dependencia selectedcolumn porque sino se puede filtrar de una forma no requerida
    const selectedKey = getKey();
    if (value === "all") {
      setTableInfo(info);
    } else {
      const filteredData = info.filter((row) =>
        row[selectedKey].includes(value)
      );
      setTableInfo(filteredData);
    }
  }, [value, info]);

  return (
    <TableContainer className={classes.container}>
      <Table>
        <TableHead>
          <TableRow>
            {tableHeaders.map((headerInfo, index) => (
              <TableCell
                className={classes.rowTitle}
                align="center"
                sortDirection={order}
                onClick={() => {
                  if (index !== selectedColumn) {
                    setValue("all");
                    setSelectedColumn(index);
                  }
                  if (!headerInfo.options) {
                    setOrder((currentOrder) =>
                      currentOrder === "asc" ? "desc" : "asc"
                    );
                  }
                }}
              >
                {headerInfo.options && selectedColumn === index ? (
                  <Select
                    placeholder={headerInfo.title}
                    options={headerInfo.options}
                    value={value}
                    handleChange={(e) => setValue(e.target.value)}
                  />
                ) : (
                  <div className={classes.rowTitleCell}>
                    <Typography className={classes.rowTitleText}>
                      {headerInfo.title}
                    </Typography>
                    {order === "asc" && selectedColumn === index ? (
                      <ArrowDropUp className={classes.arrowOrder} />
                    ) : null}
                    {order === "desc" && selectedColumn === index ? (
                      <ArrowDropDown className={classes.arrowOrder} />
                    ) : null}
                    {selectedColumn !== index ? (
                      <Remove className={classes.arrowOrder} />
                    ) : null}
                  </div>
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody className={classes.completeRow}>
          {bodyTable.map((row, index) => (
            <TableRow
              onClick={() => (onRowClick ? onRowClick(index) : null)}
              key={index}
            >
              {row}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {},
  rowTitle: {
    border: `1px solid black`,
    width: "12.5%",
    backgroundColor: theme.palette.common.blue,
  },
  rowTitleText: {
    fontSize: "1rem",
    fontWeight: 800,
    whiteSpace: "nowrap",
    color: "white",
  },
  rowTitleCell: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  arrowOrder: {
    width: "2.5rem",
    height: "2.5rem",
    color: "white",
  },
  rowBody: {
    border: `1px solid ${theme.palette.common.blue}`,
    width: "12.5%",
  },
  rowBodyText: {
    fontSize: "1rem",
    whiteSpace: "nowrap",
    color: "black",
  },
  completeRow: {
    "& :hover": {
      backgroundColor: "lightBlue",
    },
    cursor: "pointer",
  },
}));

export default CustomTable;
