import React, { useState, useMemo, useEffect, useCallback } from 'react';

import userService from 'services/users';
import { addKey, deleteKey } from 'redux/Swr/swr.actions';

import { connect } from 'react-redux';

//components
import Table from 'components/Table/Table.container';
import SearchAndButtons from 'components/SearchAndButtons.component';

import UserModal from 'components/BatchView/UserModal/UserModal.container';

//hooks
import useSearch from 'hooks/useSearch';
import usePagination from 'hooks/usePagination';

const UsersTab = ({ addKey, deleteKey }) => {
  // const [usersList, setUsersList] = useState(undefined);
  const [selectedUser, setSelectedUser] = useState(null);
  const [errors, setErrors] = useState({});

  const { searchQuery, handleSearchChange, setData, tableData } = useSearch();

  const pageInfo = usePagination(userService.getUserList, 1, 3);

  const {
    items: usersList,
    page,
    per_page,
    total,
    total_pages,
    order_by,
    order,
    error,
    isLoading,
    actions,
    mutate,
  } = pageInfo;

  useEffect(() => {
    addKey([userService.getUserList.name, page, per_page, order_by, order]);
    return () => {
      deleteKey([
        userService.getUserList.name,
        page,
        per_page,
        order_by,
        order,
      ]);
    };
  }, [page, per_page, order_by, order]);

  const buttons = [
    // {
    //   label: 'carga masiva',
    //   handleClick: () => toggleUpload(),
    // },
    {
      label: 'crear usuario',
      handleClick: () => setSelectedUser({}),
    },
  ];

  const handleNewUser = async (newUser) => {
    if (newUser.role === '') {
      setErrors({ role: 'Debe seleccionar un rol.' });
      return;
    }
    try {
      const response = await userService.createUser(
        newUser.email,
        newUser.role
      );
      console.log(response);
      // setUsersList((usersList) => setUsersList([...usersList, response]));
      mutate({ ...pageInfo, items: [...usersList, response] }, true);
      setSelectedUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditUser = async (editedUser) => {
    if (editedUser.role === '') {
      setErrors({ role: 'Debe seleccionar un rol.' });
      return;
    }
    try {
      const uIndex = usersList.findIndex((u) => u.id === editedUser.id);
      const user = usersList[uIndex];
      let changed = false;
      console.log(editedUser);
      if (user.active !== editedUser.active) {
        const setActivationResponse = await userService.setActivation(
          editedUser.id,
          editedUser.active
        );
        console.log(setActivationResponse);
        changed = true;
      }
      if (user.role !== editedUser.role) {
        const setRoleResponse = await userService.setRole(
          editedUser.id,
          editedUser.role
        );
        console.log(setRoleResponse);
        changed = true;
      }

      if (changed) {
        const updatedList = [...usersList];
        updatedList[uIndex] = editedUser;
        mutate({ ...pageInfo, items: updatedList }, false);
        // setUsersList(updatedList);
      }

      setSelectedUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  const tableHeaders = [
    { id: 'username', label: 'Nombre de usuario' },
    { id: 'email', label: 'Correo' },
    { id: 'role', label: 'Rol' },
    { id: 'active', label: 'Activo' },
  ];

  const formatedData = useMemo(
    () =>
      usersList &&
      usersList.map((user) => ({
        name: user.username,
        email: user.email,
        role: user.role,
        active: user.active ? 'Sí' : 'No',
      })),
    [usersList]
  );

  const findUser = useCallback(
    (userEmail) => usersList.find((user) => user.email === userEmail),
    [usersList]
  );

  // useEffect(() => {
  //   userService
  //     .getUserList(0, 1000, 'name', 'asc')
  //     .then((data) => {
  //       console.log(data);
  //       setUsersList(data);
  //     })
  //     .catch((err) => console.error(err));
  // }, []);

  useEffect(() => {
    setData(formatedData);
  }, [formatedData, setData]);

  return (
    <>
      <SearchAndButtons
        searchQuery={searchQuery}
        changeHandler={handleSearchChange}
        buttons={buttons}
      />

      <Table
        isLoading={isLoading}
        tableHeaders={tableHeaders}
        rows={tableData}
        onRowClick={(user) => setSelectedUser(findUser(user.email))}
        defaultOrder="id"
        handleChangePage={actions.setPage}
        handleChangeRowsPerPage={actions.setPageSize}
        handleChangeOrder={actions.setOrderBy}
        page={page}
        rowsPerPage={per_page}
        total={total}
        total_pages={total_pages}
        order_by={order_by}
        order_dir={order}
        changingPage={isLoading}
        showPagination={true}
      />

      <UserModal
        User={selectedUser}
        closeModal={() => setSelectedUser(null)}
        onEditUser={handleEditUser}
        onNewUser={handleNewUser}
        onErrors={errors}
      />
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  addKey: (key) => dispatch(addKey(key)),
  deleteKey: (key) => dispatch(deleteKey(key)),
});

export default connect(undefined, mapDispatchToProps)(UsersTab);
