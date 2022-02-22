import React, { useState, useEffect, useMemo } from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectActiveTags } from 'redux/Tags/tags.selectors';
import { selectActiveBatchs } from 'redux/Batchs/batch.selectors';
import { selectZones } from 'redux/Zones/zones.selectors';

import { clearSelectedTag } from 'redux/Tags/tags.actions';

import { makeStyles } from '@material-ui/styles';

import Header from 'components/Dashboard/Navbar/DashboardHeader.component';
import Filters from 'components/Dashboard/Navbar/FilterDisplay.component';
import Map from 'components/Dashboard/Map/Map.component';
import TagModal from 'components/TagModal/TagModal.container';

const Dashboard = ({ tagList, batchList, zoneList, closeModal }) => {
  const classes = useStyles();

  const [activeTab, setActiveTab] = useState('viewAll');
  const [formValues, setFormValues] = useState({
    batchValue: '',
    zoneValue: '',
    tagValue: '',
  });

  const [filtersOrder, setFiltersOrder] = useState([]);

  const filterFormChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });

    const fOrder = [...filtersOrder];

    const keyIndex = fOrder.indexOf(name);
    if (keyIndex < 0) {
      fOrder.push(name);
    } else {
      if (value === '') {
        fOrder.splice(keyIndex, 1);
      }
    }
    setFiltersOrder(fOrder);
  };

  const tagsToDisplay = useMemo(() => {
    if (activeTab === 'viewFilter') {
      let filteredTags = tagList;
      if (formValues.tagValue) {
        filteredTags = filteredTags.filter(
          (tag) => tag.id === formValues.tagValue
        );
      }
      if (formValues.batchValue) {
        filteredTags = filteredTags.filter(
          (tag) => tag.batch === formValues.batchValue
        );
      }
      if (formValues.zoneValue) {
        filteredTags = filteredTags.filter(
          (tag) => tag.position.zone === formValues.zoneValue
        );
      }
      return filteredTags;
    } else {
      return tagList;
    }
  }, [tagList, formValues, activeTab]);

  const zonesToDisplay = useMemo(() => {
    if (activeTab === 'viewFilter' || activeTab === 'viewZones') {
      let filteredZones = zoneList;
      if (formValues.zoneValue) {
        filteredZones = filteredZones.filter(
          (zone) => zone.name === formValues.zoneValue
        );
      }
      return filteredZones;
    } else {
      return [];
    }
  }, [zoneList, formValues, activeTab]);

  // const filterListItems = (list, key, name) => {
  //   filtersOrder.forEach((fo, i) => {
  //     list.filter((item) => item[key] === formValues[fo])
  //   })
  // }

  const filterListBatch = (batchList) => {
    if (
      filtersOrder.length === 0 ||
      filtersOrder[filtersOrder.length - 1] === 'batchValue'
    )
      return batchList;
    let filteredBatchList = [...batchList];
    filtersOrder.forEach((fo) => {
      if (fo === 'tagValue') {
        filteredBatchList = filteredBatchList.filter((batch) =>
          batch.containers.find(
            (c) => c.tag === tagList[formValues[fo] - 1].address
          )
        );
      } else if (fo === 'zoneValue') {
        const selectedZone = zoneList.find((z) => z.name === formValues[fo])
          .name;
        filteredBatchList = filteredBatchList.filter((batch) => {
          const batchContainers = batch.containers;
          return (
            tagList.filter(
              (t) =>
                t.position.zone === selectedZone &&
                batchContainers.some((c) => c.tag === t.address)
            ).length > 0
          );
        });
      }
    });
    return filteredBatchList;
  };

  const filterListZone = (zoneList) => {
    if (
      filtersOrder.length === 0 ||
      filtersOrder[filtersOrder.length - 1] === 'zoneValue'
    )
      return zoneList;
    let filteredZoneList = [...zoneList];
    filtersOrder.forEach((fo) => {
      if (fo === 'tagValue') {
        const selectedTagZone = tagList[formValues[fo] - 1].position.zone;
        filteredZoneList = filteredZoneList.filter(
          (zone) => zone.name === selectedTagZone
        );
      } else if (fo === 'batchValue') {
        const selectedBatchContainers = batchList.find(
          (b) => b.name === formValues[fo]
        ).containers;
        const batchZones = new Set('');
        selectedBatchContainers.forEach((c) => {
          const batchTag = tagList.find((t) => c.tag === t.address);
          if (batchTag) batchZones.add(batchTag.position.zone);
        });
        filteredZoneList = filteredZoneList.filter((zone) =>
          batchZones.has(zone.name)
        );
      }
    });
    return filteredZoneList;
  };

  const filterListTag = (tagList) => {
    if (
      filtersOrder.length === 0 ||
      filtersOrder[filtersOrder.length - 1] === 'tagValue'
    )
      return tagList;
    let filteredTagList = [...tagList];
    filtersOrder.forEach((fo) => {
      if (fo === 'zoneValue') {
        const selectedZone = zoneList.find((z) => z.name === formValues[fo])
          .name;
        filteredTagList = filteredTagList.filter(
          (tag) => tag.position.zone === selectedZone
        );
      } else if (fo === 'batchValue') {
        const selectedBatchContainers = batchList.find(
          (b) => b.name === formValues[fo]
        ).containers;
        filteredTagList = filteredTagList.filter((tag) =>
          selectedBatchContainers.some((c) => c.tag === tag.address)
        );
      }
    });
    return filteredTagList;
  };

  useEffect(() => {
    return () => {
      closeModal();
    };
  }, [closeModal]);

  return (
    <section style={{ height: '78%' }}>
      <div className={classes.container}>
        <div className={classes.containerButtons}>
          <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className={classes.containerFilters}>
          <Filters
            display={activeTab === 'viewFilter'}
            zones={filterListZone(zoneList)}
            tags={filterListTag(tagList)}
            batchs={filterListBatch(batchList)}
            filterFormData={formValues}
            onFilterFormChange={filterFormChangeHandler}
            resetFilters={() =>
              setFormValues({
                batchValue: '',
                zoneValue: '',
                tagValue: '',
              })
            }
          />
        </div>
      </div>
      <Map tags={tagsToDisplay} zones={zonesToDisplay} />
      <TagModal />
    </section>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.common.pink,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    height: '2.25rem',
  },
  containerButtons: {
    gridColumn: '2/3',
  },
  containerFilters: {
    gridColumn: '3/4',
  },
}));

const mapStateToProps = createStructuredSelector({
  tagList: selectActiveTags,
  batchList: selectActiveBatchs,
  zoneList: selectZones,
});

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(clearSelectedTag()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
