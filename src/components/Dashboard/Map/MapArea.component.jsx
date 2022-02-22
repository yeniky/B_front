import React from 'react';
import { Rectangle, Popup } from 'react-leaflet';
import { connect } from 'react-redux';
import { selectTags } from 'redux/Tags/tags.selectors';
import { selectAlerts } from 'redux/Alerts/Alerts.selectors';
import { selectBins } from 'redux/Bins/bins.selectors';

const MapArea = ({ zone, tags, bins, alerts }) => {
  let coords = [[...zone.area[0]], [...zone.area[1]]]; // this way due to shallow copy references
  // https://stackoverflow.com/questions/7486085/copy-array-by-value
  let fixedCords = [coords[0].reverse(), coords[1].reverse()];

  const rectangleColor = () => {
    if (alerts.find((alert) => alert.data?.zone === zone.name)) return 'red';
    // return tags.find((tag) => tag.position.zone === zone.name)
    //   ? '#03fcca'
    //   : '#3388ff';
    const cleanupBins = bins.filter((bin) => bin.type === 'LIMPIEZA');
    return tags.find(
      (tag) =>
        cleanupBins.find((bin) => bin.tag === tag.address) &&
        tag.position.zone === zone.name
    )
      ? '#03fcca'
      : '#3388ff';
  };

  return (
    <Rectangle
      bounds={fixedCords}
      // color={
      //   cleanupAlerts.find((cAlert) => cAlert.data.zone === zone.name)
      //     ? 'red'
      //     : 'blue'
      // }
      // color={
      //   tags.find((tag) => tag.position.zone === zone.name)
      //     ? '#03fcca'
      //     : '#3388ff'
      // }
      color={rectangleColor()}
    >
      <Popup>
        <h2>Area {zone.name}</h2>
      </Popup>
    </Rectangle>
  );
};

const mapStateToProps = (state) => ({
  alerts: selectAlerts(state),
  tags: selectTags(state),
  bins: selectBins(state),
});

export default connect(mapStateToProps, undefined)(MapArea);
