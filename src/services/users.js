import axios from 'services/_axios';

const baseurl = process.env.REACT_APP_API_URL;

//USER
const login = (username, password) => {
  const request = axios.get(`${baseurl}/api/users/login`, {
    auth: { username, password },
  });
  return request
    .then((res) => res.data)
    .catch((error) => Promise.reject(error.response.data));
};

const getToken = (username, password) => {
  const request = axios.post(`${baseurl}/api/users/token`, null, {
    auth: { username, password },
  });
  return request
    .then((res) => res.data)
    .catch((error) => Promise.reject(error.response.data));
};

const activateAccount = (username, password, token) => {
  const request = axios.post(`${baseurl}/api/users/activation/${token}`, {
    username,
    password,
  });
  return request
    .then((res) => res.data)
    .catch((error) =>
      Promise.reject(
        error.response.status === 400
          ? { message: 'Link de activación inválido.' }
          : { message: 'Ha ocurrido un error.' }
      )
    );
};

const changePassword = (oldPassword, newPassword) => {
  const request = axios.put(`${baseurl}/api/users/password`, {
    old_password: oldPassword,
    password: newPassword,
  });
  return request
    .then((res) => res.data)
    .catch((error) =>
      Promise.reject(
        error.response.status === 400
          ? { message: 'Contraseña actual incorrecta.' }
          : { message: 'Ha ocurrido un error.' }
      )
    );
};

const changeUsername = (id, username, email) => {
  return axios
    .put(`${baseurl}/api/users/${id}`, {
      username,
      email,
    })
    .then((res) => res.data)
    .catch((error) => Promise.reject(error.response.data));
};

//ADMIN
const getUserList = (
  page = 1,
  per_page = 1000,
  order_by = '',
  order = 'asc',
  include_self = false
) => {
  return axios
    .get(`${baseurl}/api/users`, {
      params: { page, per_page, order_by, order, include_self },
    })
    .then((res) => res.data)
    .catch((error) => Promise.reject(error.response.data));
};

const deleteUser = (id) => {
  return axios
    .delete(`${baseurl}/api/users/${id}`)
    .then((res) => res.data)
    .catch((error) => Promise.reject(error.response.data));
};

const createUser = (email, role) => {
  return axios
    .post(`${baseurl}/api/users`, { email, role })
    .then((res) => res.data)
    .catch((error) => Promise.reject(error.response.data));
};

const setActivation = (userId, active) => {
  return axios
    .post(`${baseurl}/api/users/toggle_activate/${userId}`, { active })
    .then((res) => res.data)
    .catch((error) => Promise.reject(error.response.data));
};

// Map
const saveMapStatus = (zoom, rotationAngle, center) => {
  console.log({ zoom, rotationAngle, center });
  const request = axios.put(`${baseurl}/api/users/map`, {
    center_x: center[0],
    center_y: center[1],
    rotation: rotationAngle,
    zoom: zoom,
  });
  return request.then((resp) => resp.data);
};

// Role
const setRole = (userId, role) => {
  return axios
    .post(`${baseurl}/api/users/role/${userId}`, { role })
    .then((res) => res.data)
    .catch((error) => Promise.reject(error?.response?.data));
};

const subscribe = (alertType, ruleId) => {
  return axios
    .post(`${baseurl}/api/rules/subscribe`, {
      alert_type: alertType,
      id: ruleId,
    })
    .then((res) => res.data)
    .catch((error) => Promise.reject(error?.response?.data));
};

const unsubscribe = (alertType, ruleId) => {
  return axios
    .post(`${baseurl}/api/rules/unsubscribe`, {
      alert_type: alertType,
      id: ruleId,
    })
    .then((res) => res.data)
    .catch((error) => Promise.reject(error?.response?.data));
};

export default {
  login,
  getToken,
  activateAccount,
  changePassword,
  changeUsername,
  getUserList,
  deleteUser,
  createUser,
  setActivation,
  // Map
  saveMapStatus,
  // Role
  setRole,
  subscribe,
  unsubscribe,
};
