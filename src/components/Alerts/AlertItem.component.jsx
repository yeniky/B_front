import React, { useState } from 'react';

//redux
import { connect, useSelector } from 'react-redux';

import { closeAlert } from 'redux/Alerts/Alerts.actions';

//styles components
import { makeStyles } from '@material-ui/styles';
import { Typography, Dialog } from '@material-ui/core';

//components
import IconButton from 'components/IconButton.component';

const AlertItem = ({ alert, onCloseAlert, inTagModal }) => {
  const classes = useStyles({ width: inTagModal ? '100%' : '60%' });

  const user = useSelector((state) => state.user);

  const { alert_type, id, data, timestamp } = alert;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClose = () => {
    onCloseAlert(alert_type, id);
    setIsModalOpen(false);
  };

  return (
    <div className={classes.alertItem}>
      {alert_type === 'batch' ? (
        <Typography className={classes.text}>{`${new Date(
          timestamp
        ).toLocaleString()} Separacion de ${data.container || data.tag} con ${
          data.batch
        }`}</Typography>
      ) : null}
      {alert_type === 'zone' ? (
        <Typography className={classes.text}>{`${new Date(
          timestamp
        ).toLocaleString()} Permanencia de ${
          data.container || data.tag
        } en zona ${data.zone}`}</Typography>
      ) : null}
      {alert_type === 'proximity' ? (
        <Typography className={classes.text}>{`${new Date(
          timestamp
        ).toLocaleString()} Proximidad de ${data.container1} en ${
          data.zone1
        } con ${data.container2} en ${data.zone2}`}</Typography>
      ) : null}
      {alert_type === 'cleanup' ? (
        <Typography className={classes.text}>{`${new Date(
          timestamp
        ).toLocaleString()} Entrada del tag ${
          data.container
        } en zona de limpieza ${data.zone} atendida por el tag ${
          data.containerCleanup
        }`}</Typography>
      ) : null}
      {alert_type === 'inactivity' ? (
        <Typography className={classes.text}>{`${new Date(
          timestamp
        ).toLocaleString()} ${
          data.device_type === 'Connector' ? ' Baliza' : data.device_type
        } "${data.device_mac}" inactivo por más de ${data.time} ${
          data.time !== 1 ? 'minutos' : 'minuto'
        }`}</Typography>
      ) : null}
      {user && user.role !== 'User' && (
        <IconButton eye onClick={() => setIsModalOpen(true)} />
      )}
      <Dialog open={isModalOpen} maxWidth={false}>
        <div className={classes.modalContainer}>
          <Typography variant="h3" style={{ fontSize: '2rem' }}>
            {'¿Esta seguro de cerrar esta alerta?'}
          </Typography>
          <div className={classes.buttonsModal}>
            <IconButton accept onClick={handleClose} />
            <IconButton cancel onClick={() => setIsModalOpen(false)} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  alertItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    width: (props) => props.width,
  },
  text: {
    backgroundColor: theme.palette.common.red,
    borderRadius: 5,
    color: 'white',
    padding: '0.3rem',
    marginRight: '1rem',
    width: '100%',
  },
  modalContainer: {
    backgroundColor: 'white',
    color: theme.palette.common.blue,
    padding: '5rem',
  },
  buttonsModal: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: '2rem',
  },
}));

const mapDispatchToProps = (dispatch) => ({
  onCloseAlert: (type, id) => dispatch(closeAlert(type, id)),
});

export default connect(null, mapDispatchToProps)(AlertItem);
