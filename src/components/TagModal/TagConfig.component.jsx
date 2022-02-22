import React, { useState, useEffect } from 'react';

//redux
import { connect } from 'react-redux';

import {
  selectPairedBin,
  selectBinsAvailables,
} from 'redux/Bins/bins.selectors';

import { selectBin, unSetTag, pairTagWithBin } from 'redux/Bins/bins.actions';

//styles components
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

import useStylesColumns from 'components/TagModal/columns.styles';

//components
import Button from 'components/Button.component';
import Select from 'components/Select.component';
import { selectUser } from 'redux/Users/user.selectors';

import useSWR from 'swr';

import tagService from 'services/tags';

const TagConfig = ({
  tagAdress,
  pairedBin,
  binsAvailables,
  editBin,
  createBin,
  onUnSetTag,
  pairTagWithContainer,
  user,
}) => {
  const classes = useStyles();
  const classesColumn = useStylesColumns();

  //bins
  const [binsOptions, setBinsOptions] = useState();
  const [binValue, setBinValue] = useState('');
  const [selectedBin, setSelectedBin] = useState();
  useEffect(() => {
    if (binsAvailables) {
      const options = binsAvailables.map((binItem) => ({
        value: binItem.id,
        label: binItem.name,
      }));
      setBinsOptions(options);
    }
  }, [pairedBin, binsAvailables]);

  useEffect(() => {
    if (binValue !== '' && !pairedBin) {
      const binFound = binsAvailables.find(
        (binItem) => binItem.id === binValue
      );
      setSelectedBin(binFound);
    } else {
      setBinValue('');
    }
  }, [pairedBin, binsAvailables, binValue]);

  return pairedBin ? (
    <div className={classes.container}>
      <div className={classesColumn.container}>
        <Typography className={classesColumn.title}>
          {'CONFIGURACIÓN'}
        </Typography>
        <Typography className={classesColumn.label}>
          {'ID: '}
          <span className={classesColumn.info}>{pairedBin.name}</span>
        </Typography>
        <Typography className={classesColumn.label}>
          {'Tipo: '}
          <span className={classesColumn.info}>{pairedBin.type}</span>
        </Typography>
        <Typography className={classesColumn.label}>
          {'Batch: '}
          <span className={classesColumn.info}>{pairedBin.batch}</span>
        </Typography>
        <Typography className={classesColumn.label}>
          {'Descripción: '}
          <span className={classesColumn.info}>{pairedBin.description}</span>
        </Typography>
      </div>
      {user && user.role === 'Admin' && (
        <div
          className={classes.actionButtonsContainer}
          style={{ marginTop: '0.5rem' }}
        >
          <Button
            className={classes.binActionButtons}
            onClick={() => editBin(pairedBin, tagAdress)}
            color="blue"
          >
            {'Editar Bin'}
          </Button>
          <Button
            className={classes.binActionButtons}
            onClick={() => onUnSetTag()}
            color="blue"
          >
            {'Desasociar'}
          </Button>
        </div>
      )}
      {user && user.role !== 'Admin' && (
        <div
          className={classes.actionButtonsContainer}
          style={{ marginTop: '0.5rem' }}
        >
          <Button
            className={classes.binActionButtons}
            onClick={() => editBin(pairedBin, tagAdress)}
            color="blue"
          >
            {'Ver Bin'}
          </Button>
        </div>
      )}
    </div>
  ) : (
    <div className={classes.container}>
      <div className={classesColumn.container}>
        <Typography className={classesColumn.title}>
          {'CONFIGURACIÓN'}
        </Typography>
        <Typography className={classesColumn.body}>
          {'Tag sin asociar'}
        </Typography>
      </div>
      {user && user.role === 'Admin' && (
        <Select
          className={classes.selectBin}
          placeholder="Seleccione Bin"
          options={binsOptions}
          value={binValue}
          handleChange={(event) => setBinValue(event.target.value)}
        />
      )}
      {user && user.role === 'Admin' && binValue !== '' ? (
        <div className={classes.actionButtonsContainer}>
          <Button
            className={classes.binActionButtons}
            onClick={() => editBin(selectedBin, tagAdress)}
            color="blue"
          >
            {'EDITAR'}
          </Button>
          <Button
            className={classes.binActionButtons}
            onClick={() => pairTagWithContainer(selectedBin)}
            color="blue"
          >
            {'asociar'}
          </Button>
        </div>
      ) : null}
      {user && user.role === 'Admin' && (
        <Button
          className={classes.createBinButton}
          onClick={() => createBin(tagAdress)}
          color="blue"
        >
          {'Crear bin'}
        </Button>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '15rem',
  },
  actionButtonsContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.5rem',
  },
  createBinButton: {
    marginTop: '0.5rem',
  },
  binActionButtons: {
    width: '7rem',
  },
  selectBin: {
    width: '100%',
    marginTop: '0.5rem',
  },
}));

const mapStateToProps = (state) => ({
  pairedBin: selectPairedBin(state),
  binsAvailables: selectBinsAvailables(state),
  user: selectUser(state),
});

const mapDispatchToProps = (dispatch) => ({
  editBin: (bin, tagAddress) => dispatch(selectBin(bin, tagAddress)),
  createBin: (tagAddress) => dispatch(selectBin(null, tagAddress)),
  onUnSetTag: () => dispatch(unSetTag()),
  pairTagWithContainer: (bin) => dispatch(pairTagWithBin(bin)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TagConfig);
