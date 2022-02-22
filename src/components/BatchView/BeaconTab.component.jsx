import React, { useMemo, useEffect, useState, useCallback } from 'react';

//components
import TableFront from 'components/Table/TableFront.container';
import SearchAndButtons from 'components/SearchAndButtons.component';

//hooks
import useSearch from 'hooks/useSearch';

import tagService from 'services/tags';
import useSWR from 'swr';
import BeaconModal from './BeaconModal/BeaconModal.container';

const BeaconTab = () => {
  const { searchQuery, handleSearchChange, setData, tableData } = useSearch();

  const [selectedBeacon, setSelectedBeacon] = useState(undefined);

  const [errors, setErrors] = useState({});

  const { data: beaconList, mutate } = useSWR('beacons', tagService.getBeacons);

  const tableHeaders = [
    // { id: 'id', label: 'Id' },
    { id: 'name', label: 'Baliza' },
    { id: 'ip', label: 'IP' },
    { id: 'zone', label: 'Zona' },
    { id: 'status', label: 'Estado de conexión' },
    // { id: 'last_update', label: 'Última actualización' },
    { id: 'active', label: 'Alerta Activa' },
    { id: 'connector_active', label: 'Baliza Activa' },
  ];

  const formatedData = useMemo(
    () =>
      beaconList &&
      beaconList.map((beacon) => ({
        // id: beacon.id,
        name: beacon.name || '-',
        ip: beacon.ip || '-',
        zone: beacon.zone,
        status: beacon.status || '-',
        // last_update: beacon.last_update || '-',
        active: beacon.active ? 'Sí' : 'No',
        connector_active: beacon.connector_active ? 'Sí' : 'No',
      })),
    [beaconList]
  );

  const findBeacon = useCallback(
    (beaconName) => beaconList.find((beacon) => beacon.name === beaconName),
    [beaconList]
  );

  const handleEditBeacon = (editedBeacon) => {
    const changeActive = editedBeacon.connector_active
      ? tagService.activateBeacon
      : tagService.deactivateBeacon;
    changeActive(editedBeacon.id)
      .then(() => {
        mutate();
        if (selectedBeacon.zone !== editedBeacon.zone) {
          tagService
            .setBeaconZone(editedBeacon.id, editedBeacon.zone || '')
            .then(() => {
              mutate();
            })
            .finally(setSelectedBeacon(undefined));
        }
      })
      .finally(setSelectedBeacon(undefined));
  };

  const handleCloseModal = () => {
    setErrors({});
    setSelectedBeacon(undefined);
  };

  useEffect(() => {
    setData(formatedData);
  }, [formatedData, setData]);

  return (
    <>
      <SearchAndButtons
        searchQuery={searchQuery}
        changeHandler={handleSearchChange}
      />
      <TableFront
        tableHeaders={tableHeaders}
        rows={tableData}
        onRowClick={(beacon) => {
          // if (beacon.status === 'Online')
          setSelectedBeacon(findBeacon(beacon.name));
        }}
        defaultOrder="name"
        rowsPerPageOptions={[3, 5, 10]}
        isLoading={!tableData}
      />
      {selectedBeacon && (
        <BeaconModal
          Beacon={selectedBeacon}
          onEditBeacon={handleEditBeacon}
          onCloseModal={handleCloseModal}
          onErrors={errors}
        />
      )}
    </>
  );
};

export default BeaconTab;
