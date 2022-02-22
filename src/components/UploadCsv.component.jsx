import React, { useState, useEffect } from 'react';

//styles components
import { makeStyles } from '@material-ui/styles';
import { Dialog, Typography } from '@material-ui/core';
import { ArrowUpward } from '@material-ui/icons';

//components
import ModalTitle from 'components/ui/ModalTitle.component';
import Button from 'components/Button.component';
import Label from 'components/ui/Label.component';
import Input from 'components/Input.component';

const UploadModal = ({
  open,
  handleClose,
  type,
  required,
  optionals,
  handleUpload,
  uploadResponse,
  confirmUpload,
}) => {
  const classes = useStyles();

  const [file, setFile] = useState();
  const [hasError, setHasError] = useState(false);
  const [fileName, setFileName] = useState('Seleccione un archivo');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  useEffect(() => setHasError(uploadResponse.errors.length > 0), [
    uploadResponse,
  ]);

  useEffect(() => {
    if (
      uploadResponse.status === 'OK' &&
      uploadResponse.errors.length === 0 &&
      open
    ) {
      handleClose();
    }
    if (uploadResponse.status === 'OK') {
      confirmUpload();
    }
  }, [uploadResponse, handleClose, open, confirmUpload]);

  useEffect(() => {
    if (!open) {
      setHasError(false);
      setFile(null);
      setFileName('Seleccione un archivo');
    }
  }, [open]);

  return (
    <Dialog open={open} fullWidth={false} onClose={handleClose}>
      <div className={classes.content}>
        <ModalTitle
          title={`CARGA MASIVA DE ${type.toUpperCase()}`}
          Icon={ArrowUpward}
          style={{ alignSelf: 'flex-start' }}
        />
        <Typography className={classes.instructions}>
          {`Instrucciones: El archivo elegido debe estar en formato CSV con los
          siguientes encabezados obligatorios: `}
          <span className={classes.required}>{required}</span>
          {optionals && ` y los siguientes encabezados opcionales: `}
          {optionals}
        </Typography>
        <div className={classes.fileSelectorContainer}>
          <Label textLabel="Archivo:" />
          <Input
            className={classes.fileSelected}
            classNameInput={classes.fileSelectedInput}
            value={fileName}
            disabled
            error={hasError ? 'Datos invalidos' : false}
          />
          <Button
            className={classes.fileSelector}
            component="label"
            color="blue"
          >
            {'Elegir Archivo'}
            <input
              type="file"
              style={{ display: 'none' }}
              accept=".csv"
              onChange={handleFileChange}
            />
          </Button>
        </div>
        {uploadResponse.errors.length > 0 && (
          <div className={classes.showErrors}>
            {uploadResponse.errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
        <Button
          className={classes.uploadButton}
          color="blue"
          onClick={() => handleUpload(file)}
          disabled={!file}
        >
          {'Cargar Archivo'}
        </Button>
      </div>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem 2rem',
    width: '35rem',
  },
  instructions: {
    textAlign: 'justify',
    color: theme.palette.common.blue,
  },
  required: {
    fontWeight: 800,
  },
  fileSelector: {
    height: '2rem',
  },
  fileSelectorContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: '2rem',
  },
  fileSelected: {
    border: `solid 2px ${theme.palette.common.blue}`,
    padding: '0.2rem 0.5rem',
    width: '17rem',
    borderRadius: '0.5rem',
    backgroundColor: theme.palette.common.grey,
    height: '2rem',
  },
  fileSelectedInput: {
    '&:disabled': {
      color: theme.palette.common.blue,
    },
  },
  uploadButton: {
    marginTop: '2rem',
  },
  showErrors: {
    maxHeight: '7rem',
    overflowY: 'auto',
    width: '100%',
    marginTop: '1.5rem',
    backgroundColor: theme.palette.common.grey,
    border: `solid 2px ${theme.palette.common.red}`,
    borderRadius: 5,
    padding: '0.2rem',
  },
}));

export default UploadModal;
