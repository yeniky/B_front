import React, { useMemo } from 'react';

//leaflet
import Leaflet from 'leaflet';
import { Marker, Tooltip } from 'react-leaflet';

//redux
import { connect } from 'react-redux';

import { tagHasAlerts } from 'redux/Alerts/Alerts.selectors';

import { selectTag } from 'redux/Tags/tags.actions';
import { selectBins } from 'redux/Bins/bins.selectors';

const MapMarker = ({ tag, bins, onSelectingTag, hasAlerts }) => {
  const tagIcon = useMemo(() => {
    const tagType = bins.find((bin) => bin.tag === tag.address)?.type;
    if (hasAlerts) {
      if (tagType === 'LIMPIEZA') return '/bin_cleaning_alert.png';
      return tag.container ? '/bin_alert.png' : '/tag_alert.png';
    } else {
      if (tagType === 'LIMPIEZA') return '/bin_cleaning.png';
      return tag.container ? '/bin.png' : '/Tag.png';
    }
  }, [tag, bins, hasAlerts]);

  const tagMarker = new Leaflet.Icon({
    iconUrl: tagIcon,
    iconSize: [38, 51],
  });

  const position = tag['position'];
  const offset = { y: 5.1, x: 0.15 };

  return (
    <Marker
      position={[Number(position.y) + offset.y, Number(position.x) + offset.x]}
      icon={tagMarker}
      key={tag['id']}
      onClick={() => onSelectingTag(tag['id'])}
    >
      <Tooltip direction="bottom" offset={[0, 5]} opacity={0.8}>
        <p className="marker-tooltip">{tag['address']}</p>
      </Tooltip>
    </Marker>
  );
};

const mapDispatchToProps = (dispatch) => ({
  onSelectingTag: (tag) => dispatch(selectTag(tag)),
});

const mapStateToProps = (state, ownProps) => ({
  hasAlerts: tagHasAlerts(state, ownProps),
  bins: selectBins(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(MapMarker);
