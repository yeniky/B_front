import React, { useState, useEffect } from 'react';

import Leaflet from 'leaflet';
import { Map, ImageOverlay } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

import { makeStyles } from '@material-ui/styles';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';

import MapMarker from './MapMarker.component';
import MapArea from './MapArea.component';
import { useDispatch, useSelector } from 'react-redux';

import {
  setMapCenter,
  setMapRotationAngle,
  setMapStatus,
  setMapZoom,
} from 'redux/Map/map.actions';
import { rotate_point } from 'utils';
import { Grid } from '@material-ui/core';
import Rotate90DegreesCcwIcon from '@material-ui/icons/Rotate90DegreesCcw';

import userService from 'services/users';

const MainMap = ({ tags, zones }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { zoom, center, rotationAngle, isLoaded } = useSelector(
    (state) => state.map
  );

  const user = useSelector((state) => state.user);

  const getMapUrl = (angle) => `/mapa_resp_${angle}.png`;
  const initialBounds = [
    [0, 0],
    [772, 1399],
  ];

  const [polygons, setPolygons] = useState();
  const [markers, setMarkers] = useState();
  const [mapUrl, setMapUrl] = useState(getMapUrl(rotationAngle));
  const [bounds, setBounds] = useState(initialBounds);

  const handleRotateMap = (e) => {
    dispatch(setMapRotationAngle((rotationAngle + 90) % 360));
  };

  const handleViewportChange = (viewport) => {
    dispatch(setMapZoom(viewport.zoom));
    dispatch(setMapCenter(viewport.center));
  };

  const offset = 40 * (5 - zoom + 2 || 0);
  const maxBounds = [
    // ? Adjust this values
    [bounds[0][0] - offset, bounds[0][1] - offset],
    [bounds[1][0] + offset, bounds[1][1] + offset],
  ];

  useEffect(() => {
    setBounds(
      rotationAngle % 180 === 0
        ? [initialBounds[0], initialBounds[1]]
        : [initialBounds[0], [initialBounds[1][1], initialBounds[1][0]]]
    );
  }, [rotationAngle]);

  useEffect(() => {
    if (!isLoaded && user.map_info !== '') {
      const loadedMap = {
        zoom: user.map_info.zoom,
        rotationAngle: user.map_info.rotation,
        center: [user.map_info.center_x, user.map_info.center_y],
      };
      dispatch(setMapStatus(loadedMap));
    }
    return () => userService.saveMapStatus(zoom, rotationAngle, center);
  });

  // useEffect(() => {
  //   userService.saveMapStatus(zoom, rotationAngle, center);
  // }, [zoom, rotationAngle, center]);

  useEffect(() => {
    const updatedUrl = getMapUrl(rotationAngle);
    setMapUrl(updatedUrl);

    if (zones)
      setPolygons(
        zones?.map((z) => {
          const bnds =
            rotationAngle % 180 !== 0
              ? [initialBounds[0], initialBounds[1]]
              : [initialBounds[0], [initialBounds[1][1], initialBounds[1][0]]];

          const [minX, minY] = z.area[0];
          const [maxX, maxY] = z.area[1];

          const a = [minX, minY];
          const b = [minX, maxY];
          const c = [maxX, maxY];
          const d = [maxX, minY];

          const ra = rotate_point(
            a[0],
            a[1],
            bnds[1][0],
            bnds[1][1],
            rotationAngle
          );
          const rb = rotate_point(
            b[0],
            b[1],
            bnds[1][0],
            bnds[1][1],
            rotationAngle
          );
          const rc = rotate_point(
            c[0],
            c[1],
            bnds[1][0],
            bnds[1][1],
            rotationAngle
          );
          const rd = rotate_point(
            d[0],
            d[1],
            bnds[1][0],
            bnds[1][1],
            rotationAngle
          );

          const minX1 = Math.min(...[ra, rb, rc, rd].map((ri) => ri[0]));
          const minY1 = Math.min(...[ra, rb, rc, rd].map((ri) => ri[1]));
          const maxX1 = Math.max(...[ra, rb, rc, rd].map((ri) => ri[0]));
          const maxY1 = Math.max(...[ra, rb, rc, rd].map((ri) => ri[1]));

          const newZone = {
            ...z,
            area: [
              [minX1, minY1],
              [maxX1, maxY1],
            ],
          };

          return <MapArea zone={newZone} key={z.name} />;
        })
      );

    if (tags)
      setMarkers(() => {
        const bnds =
          rotationAngle % 180 !== 0
            ? [initialBounds[0], initialBounds[1]]
            : [initialBounds[0], [initialBounds[1][1], initialBounds[1][0]]];
        return tags.map((tag) => {
          const new_point = rotate_point(
            tag.position.x,
            tag.position.y,
            bnds[1][0],
            bnds[1][1],
            rotationAngle
          );
          const new_tag = { ...tag };
          new_tag.position = { ...tag.position };
          new_tag.position.x = new_point[0];
          new_tag.position.y = new_point[1];
          return <MapMarker tag={new_tag} key={tag.id} />;
        });
      });
  }, [zones, tags, rotationAngle]);

  return (
    <section className={classes.mapContainer}>
      <Map
        className={classes.map}
        center={center}
        minZoom={-1}
        zoom={zoom}
        maxZoom={3}
        zoomSnap={0.25}
        zoomDelta={0.25}
        crs={Leaflet.CRS.Simple}
        maxBounds={maxBounds}
        maxBoundsViscosity={0.8}
        onViewportChanged={handleViewportChange}
      >
        <Grid
          id="clickCapture"
          className={`leaflet-top leaflet-left ${classes.createZoneLabel}`}
        >
          <Rotate90DegreesCcwIcon onClickCapture={handleRotateMap} />
        </Grid>

        <ImageOverlay
          className={classes.imageMap}
          url={mapUrl}
          bounds={bounds}
        />
        <MarkerClusterGroup>{markers}</MarkerClusterGroup>
        {polygons}
      </Map>
    </section>
  );
};

// Firefox 1.0+
const isFirefox = typeof InstallTrigger !== 'undefined';

const useStyles = makeStyles((theme) => ({
  mapContainer: {
    padding: 0,
    margin: 0,
    borderBottom: '1px solid black',
    boxShadow: '1px 2px 2px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.2s ease-in-out',
    height: '87vh',
  },
  map: {
    height: '100%',
    zIndex: 1,
  },
  imageMap: {
    zIndex: 1,
  },
  createZoneLabel: {
    marginTop: isFirefox ? 84 : 84,
    marginLeft: 11,
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
    borderRadius: '4px',
    backgroundColor: '#fff',
    padding: isFirefox ? '4px' : '3px',
    boxShadow: '0 1px 5px rgba(0,0,0,0.65)',
    cursor: 'pointer',
    pointerEvents: 'auto',
    // zIndex: 1000,
  },
}));

export default MainMap;
