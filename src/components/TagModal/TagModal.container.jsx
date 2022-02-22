import React, { useEffect } from "react";

//redux
import { connect } from "react-redux";

import { clearSelectedTag, changeStatusTag } from "redux/Tags/tags.actions";
import { clearEditBin } from "redux/Bins/bins.actions";
import { alertsTagSelected } from "redux/Alerts/Alerts.actions";

import { getSelectedTag } from "redux/Tags/tags.selectors";
import {
  selectCountAlerts,
  selectedTagAlerts,
} from "redux/Alerts/Alerts.selectors";

//styles components
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

//components
import AlertsColumn from "components/TagModal/AlertsColumn.component";
import TagState from "components/TagModal/TagState.component";
import TagOrderInfo from "components/TagModal/TagOrderInfo.component";
import TagConfig from "components/TagModal/TagConfig.component";
import BinModal from "components/BinModal/BinModal.container";

const TagModal = ({
  tag,
  closeModal,
  alerts,
  onAlertsUpdate,
  updateAlerts,
  changeStatus,
}) => {
  const classes = useStyles();

  useEffect(() => {
    if (tag) {
      updateAlerts(tag);
    }
  }, [onAlertsUpdate, tag, updateAlerts]);

  return (
    tag && (
      <section className={classes.modalContainer}>
        <header className={classes.headerContainer}>
          <Typography
            className={classes.modalTitle}
            variant="h2"
          >{`TAG ${tag.address}`}</Typography>
          <div
            className={classes.closeButton}
            onClick={() => closeModal()}
            variant="h2"
          >
            {"X"}
          </div>
        </header>
        <div className={classes.bodyContainer}>
          <AlertsColumn alerts={alerts} />
          <div className={classes.tagContent}>
            <TagState
              tag={tag}
              onChangeStatus={(id, status) => changeStatus(id, status)}
              closeModal={() => closeModal()}
            />
            {!!tag.order && <TagOrderInfo orderName={tag.order} />}
            <TagConfig tagAdress={tag.address} />
          </div>
        </div>
        <BinModal />
      </section>
    )
  );
};

//styles
const useStyles = makeStyles((theme) => ({
  modalContainer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "18rem",
    backgroundColor: "white",
    zIndex: 2,
  },
  headerContainer: {
    backgroundColor: theme.palette.common.blue,
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem",
  },
  modalTitle: {
    fontSize: "1.2rem",
    fontWeight: 800,
  },
  closeButton: {
    fontSize: "1.2rem",
    cursor: "pointer",
    borderRadius: "50%",
    transition: "all 0.1s ease-out",
    "&:hover": {
      backgroundColor: "white",
      color: theme.palette.common.darkMagenta,
    },
    fontWeight: 800,
    width: "2rem",
    height: "2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bodyContainer: {
    height: "100%",
    padding: "1rem 2rem",
    paddingRight: "3rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  tagContent: {
    width: "65%",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "flex-start",
  },
}));

//connect redux
const mapStateToProps = (state) => ({
  tag: getSelectedTag(state),
  alerts: selectedTagAlerts(state),
  onAlertsUpdate: selectCountAlerts(state),
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => {
    dispatch(clearSelectedTag());
    dispatch(clearEditBin());
  },
  updateAlerts: (tag) => dispatch(alertsTagSelected(tag)),
  changeStatus: (id, status) => dispatch(changeStatusTag(id, status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TagModal);
