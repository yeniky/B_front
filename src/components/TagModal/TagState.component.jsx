import React, { useState } from 'react';

//styles components
import { Typography } from '@material-ui/core';
import useStyles from 'components/TagModal/columns.styles';

//components
import Button from 'components/Button.component';
import ConfirmModal from 'components/ConfirmModal.component';
import { useSelector } from 'react-redux';
import moment from 'moment';
import 'moment/locale/es';
import { startOfSecond } from 'date-fns';

const TagState = ({ tag, onChangeStatus, closeModal }) => {
  const classes = useStyles();
  const [isDeactivating, setDeactivating] = useState(false);

  const user = useSelector((state) => state.user);

  return (
    <div className={classes.container}>
      <Typography className={classes.title}>{'ESTADO'}</Typography>
      <Typography className={classes.label}>
        {'Zona: '}
        <span className={classes.info}>
          {tag.position.zone ? `${tag.position.zone}` : '---'}
        </span>
      </Typography>
      <Typography className={classes.label}>
        {'Intensidad: '}
        <span className={classes.info}>{tag.position.signal}%</span>
      </Typography>
      <Typography className={classes.label}>
        {'Estado de conexión: '}
        <span className={classes.info}>{tag.status}</span>
      </Typography>
      <Typography className={classes.label}>
        {'Ultima Actualización: '}
        <span className={classes.info}>
          {//new Date(tag.position.timestamp).toLocaleString('es-CL')}  //*SE AGREGA LA MODIFICACION DE HORA
          moment.utc(tag.position.timestamp).local().startOf('seconds').fromNow().toLocaleString('es-CL')}
        </span>
      </Typography>
      {user && user.role === 'Admin' && (
        <Button
          style={{ width: '100%', marginTop: '1rem' }}
          color={tag.active ? 'darkMagenta' : 'blue'}
          onClick={() =>
            tag.active ? setDeactivating(true) : onChangeStatus(tag.id, true)
          }
        >
          {tag.active ? 'DESACTIVAR' : 'ACTIVAR'}
        </Button>
      )}
      <ConfirmModal
        open={isDeactivating}
        title="¿Desea desactivar este Tag?"
        onConfirm={() => {
          onChangeStatus(tag.id, !tag.active);
          setDeactivating(false);
          closeModal();
        }}
        onCancel={() => setDeactivating(false)}
      />
    </div>
  );
};

export default TagState;
