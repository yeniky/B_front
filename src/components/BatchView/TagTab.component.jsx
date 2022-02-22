import React, { useState, useEffect, useMemo } from 'react';

//redux
import { connect } from 'react-redux';

import { selectTag, clearSelectedTag } from 'redux/Tags/tags.actions';
import { addKey, deleteKey } from 'redux/Swr/swr.actions';

//components
import Table from 'components/Table/Table.container';
import SearchAndButtons from 'components/SearchAndButtons.component';
import TagModal from 'components/TagModal/TagModal.container';

//hooks
import useSearch from 'hooks/useSearch';
import usePagination from 'hooks/usePagination';

import tagService from 'services/tags';
// import { LocalConvenienceStoreOutlined } from '@material-ui/icons';

const TagTab = ({ onSelectingTag, closeModal, addKey, deleteKey }) => {
  const [status, setStatus] = useState(true);

  const { searchQuery, handleSearchChange, setData, tableData } = useSearch();

  const pageInfo = usePagination(tagService.getAllTags, 1, 3);

  const {
    items: tags,
    page,
    per_page,
    total,
    total_pages,
    order_by,
    order,
    error,
    isLoading,
    actions,
  } = pageInfo;

  useEffect(() => {
    addKey([tagService.getAllTags.name, page, per_page, order_by, order]);
    return () => {
      deleteKey([tagService.getAllTags.name, page, per_page, order_by, order]);
    };
  }, [page, per_page, order_by, order]);

  const buttons = [
    {
      label: status ? 'ver desactivados' : 'ver activados',
      handleClick: () => setStatus(!status),
    },
  ];

  const tableHeaders = [
    { id: 'address', label: 'Tag' },
    { id: 'type', label: 'Tipo' },
    { id: 'container', label: 'Bin' },
    { id: 'batch', label: 'Batch' },
    { id: 'position.zone', label: 'Zona' },
    { id: 'position.signal', label: 'Intensidad' },
    { id: 'status', label: 'Estado de conexión' },
    { id: 'position.timestamp', label: 'Actualización' },
  ];

  const formatedData = useMemo(
    () =>
      tags
        .filter((tag) => tag.active === status)
        .map((tag) => ({
          tag: tag.address,
          type: tag.type || '-',
          bin: tag.container || '-',
          batch: tag.batch || '-',
          zone: tag.position.zone,
          signal: tag.position.signal + '%',
          status: tag.status || '-',
          timestamp: new Date(tag.position.timestamp).toLocaleString(),
        })),
    [tags, status]
  );

  useEffect(() => {
    setData(formatedData);
  }, [formatedData, setData]);

  useEffect(() => {
    return () => closeModal();
  }, [closeModal]);

  return (
    <>
      <SearchAndButtons
        searchQuery={searchQuery}
        changeHandler={handleSearchChange}
        buttons={buttons}
      />
      <Table
        tableHeaders={tableHeaders}
        rows={tableData}
        defaultOrder="timestamp"
        onRowClick={(tag) =>
          onSelectingTag(tags.find((item) => item.address === tag.tag).id)
        }
        handleChangePage={actions.setPage}
        handleChangeRowsPerPage={actions.setPageSize}
        handleChangeOrder={actions.setOrderBy}
        page={page}
        rowsPerPage={per_page}
        total={total}
        total_pages={total_pages}
        changingPage={isLoading}
        showPagination={true}
        order_by={order_by}
        order_dir={order}
        isLoading={isLoading}
      />
      <TagModal />
    </>
  );
};

const mapStateToProps = (state) => ({
  // tags: selectTags(state),
  // bins: selectBins(state),
});

const mapDispatchToProps = (dispatch) => ({
  onSelectingTag: (tag) => dispatch(selectTag(tag)),
  closeModal: () => dispatch(clearSelectedTag()),
  addKey: (key) => dispatch(addKey(key)),
  deleteKey: (key) => dispatch(deleteKey(key)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TagTab);
