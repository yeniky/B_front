import React, { useState, useEffect } from "react";

//Styles Components
import { makeStyles } from "@material-ui/styles";
import { Typography } from "@material-ui/core";
import { Error } from "@material-ui/icons";

//components
import AlertItem from "components/Alerts/AlertItem.component";

const AlertsColumn = ({ alerts }) => {
  const classes = useStyles();
  const [hasActiveAlerts, setHasActiveAlerts] = useState(false);

  useEffect(() => {
    //check for active alerts to display
    setHasActiveAlerts(alerts.length > 0);
  }, [alerts]);

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Error className={classes.icon} />
        <Typography className={classes.title} variant="h3">
          {"ALERTAS ACTIVAS"}
        </Typography>
      </div>
      <div className={classes.body}>
        {hasActiveAlerts ? (
          <div className={classes.alertList}>
            {alerts.map((alertElement) => (
              <AlertItem
                key={`${alertElement.id}_${alertElement.alert_type}`}
                alert={alertElement}
                inTagModal
              />
            ))}
          </div>
        ) : (
          <Typography className={classes.bodyText}>
            {"No hay alertas activas"}
          </Typography>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: "35%",
  },
  header: {
    display: "flex",
    alignItems: "center",
  },
  icon: {
    width: "2.7rem",
    height: "2.7rem",
    color: theme.palette.common.red,
    marginRight: "0.5rem",
  },
  title: {
    color: theme.palette.common.red,
    fontSize: "1.2rem",
    margin: 0,
  },
  body: {
    height: "10rem",
    marginTop: "0.5rem",
    overflowY: "auto",
  },
  alertList: {
    padding: "0.5rem",
  },
  bodyText: {
    fontSize: "1.2rem",
    color: theme.palette.common.blue,
    fontWeight: 800,
  },
}));

export default AlertsColumn;
