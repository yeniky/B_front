import axios from 'services/_axios';

// TODO: Search how to implement this at buildtime using package json
/// DEV VERSION
// const baseurl = "http://161.35.99.28:5000";
// const baseurl = 'http://127.0.0.1:5000';
const baseurl = process.env.REACT_APP_API_URL;

/// BUILD VERSION
//const baseurl = document.location.host;
//const baseurl = '';

const getBaseUrl = () => {
  return baseurl;
};

const getAllTags = (
  page = 1,
  per_page = 1000,
  order_by = '',
  order = 'asc'
) => {
  const request = axios.get(`${baseurl}/api/tags`, {
    params: { page, per_page, order_by, order },
  });
  return request.then((resp) => resp.data);
};

const getZones = () => {
  const request = axios.get(`${baseurl}/api/zones`);
  return request.then((resp) => resp.data);
};

const getBatchs = (page = 1, per_page = 1000, order_by = '', order = 'asc') => {
  const request = axios.get(`${baseurl}/api/batch`, {
    params: { page, per_page, order_by, order },
  });
  return request.then((resp) => resp.data);
};

const getContainers = (
  page = 1,
  per_page = 1000,
  order_by = '',
  order = 'asc'
) => {
  const request = axios.get(`${baseurl}/api/containers`, {
    params: { page, per_page, order_by, order },
  });
  // ! resp.data.items to get results without pageInfo
  return request.then((resp) => resp.data);
};

const getOrders = (page = 1, per_page = 1000, order_by = '', order = 'asc') => {
  const request = axios.get(`${baseurl}/api/orders`, {
    params: { page, per_page, order_by, order },
  });
  return request.then((resp) => resp.data);
};

const getOrderTypes = () => {
  const request = axios.get(`${baseurl}/api/order_types`);
  return request.then((resp) => resp.data);
};

const createOrder = (newOrder) => {
  const request = axios.post(`${baseurl}/api/orders`, newOrder);
  return request.then((resp) => resp.data);
};
const editOrder = (editedOrder) => {
  const request = axios.put(
    `${baseurl}/api/orders/${editedOrder.id}`,
    editedOrder
  );
  return request.then((resp) => resp.data);
};

const getAlerts = () => {
  const request = axios.get(`${baseurl}/api/alerts`);
  return request.then((resp) => resp.data);
};

const getTagsWithoutContainer = () => {
  const request = axios.get(`${baseurl}/api/tags?without_containers=true`);
  return request.then((resp) => resp.data);
};
const getAllRules = () => {
  const request = axios.get(`${baseurl}/api/rules`);
  return request.then((resp) => resp.data);
};

// Material
const getMaterials = (
  page = 1,
  per_page = 1000,
  order_by = '',
  order = 'asc'
) => {
  const request = axios.get(`${baseurl}/api/material`, {
    params: { page, per_page, order_by, order },
  });
  return request.then((resp) => resp.data);
};

const createMaterial = (newMaterial) => {
  const request = axios.post(`${baseurl}/api/material`, newMaterial);
  return request.then((resp) => resp.data);
};

const editMaterial = (editedMaterial) => {
  const request = axios.put(
    `${baseurl}/api/material/${editedMaterial['id']}`,
    editedMaterial
  );
  return request.then((resp) => resp.data);
};

// Material Group
const getMaterialGroup = (
  page = 1,
  per_page = 1000,
  order_by = '',
  order = 'asc'
) => {
  const request = axios.get(`${baseurl}/api/material_group`, {
    params: { page, per_page, order_by, order },
  });
  return request.then((resp) => resp.data);
};

const createMaterialGroup = (newMaterialGroup) => {
  const request = axios.post(`${baseurl}/api/material_group`, newMaterialGroup);
  return request.then((resp) => resp.data);
};

const editMaterialGroup = (editedMaterialGroup) => {
  const request = axios.put(
    `${baseurl}/api/material_group/${editedMaterialGroup['id']}`,
    editedMaterialGroup
  );
  return request.then((resp) => resp.data);
};

// Material Price Group
const getMaterialPrice = (
  page = 1,
  per_page = 1000,
  order_by = '',
  order = 'asc'
) => {
  const request = axios.get(`${baseurl}/api/material_price`, {
    params: {
      page,
      per_page,
      order_by,
      order,
    },
  });
  return request.then((resp) => resp.data);
};

const createMaterialPriceGroup = (newMaterialPriceGroup) => {
  const request = axios.post(
    `${baseurl}/api/material_price`,
    newMaterialPriceGroup
  );
  return request.then((resp) => resp.data);
};

const editMaterialPriceGroup = (editedMaterialPriceGroup) => {
  const request = axios.put(
    `${baseurl}/api/material_price/${editedMaterialPriceGroup['id']}`,
    editedMaterialPriceGroup
  );
  return request.then((resp) => resp.data);
};

// Bin/Tag
const sendNewBinForm = (newContainer) => {
  const request = axios.post(`${baseurl}/api/containers`, newContainer);
  return request.then((resp) => resp.data);
};

const editNewBinForm = (editedContainer) => {
  const request = axios.put(
    `${baseurl}/api/containers/${editedContainer['id']}`,
    editedContainer
  );
  return request.then((resp) => resp.data);
};

const unsetTag = (container) => {
  const request = axios.put(
    `${baseurl}/api/containers/${container['id']}?unset_tag=true`,
    container
  );
  return request.then((resp) => resp.data);
};

const createBatch = (newBatch) => {
  const request = axios.post(`${baseurl}/api/batch`, newBatch);
  return request.then((resp) => resp.data);
};

const editBatch = (editedBatch) => {
  const request = axios.put(
    `${baseurl}/api/batch/${editedBatch.id}`,
    editedBatch
  );
  return request.then((resp) => resp.data);
};

const closeAlert = (closedAlert) => {
  const request = axios.post(`${baseurl}/api/alerts/acknowledge`, closedAlert);
  return request.then((resp) => resp.data);
};
const deleteRule = (type, rule_id) => {
  const request = axios.delete(`${baseurl}/api/rules/${type}/${rule_id}`);
  return request.then((resp) => resp.data);
};
const createRule = (type, rulePayload) => {
  const request = axios.post(`${baseurl}/api/rules/${type}`, rulePayload);
  return request.then((resp) => resp.data);
};

const editRule = (type, rulePayload) => {
  const request = axios.put(
    `${baseurl}/api/rules/${type}/${rulePayload.id}`,
    rulePayload
  );
  return request.then((resp) => resp.data);
};

const getSubscriptions = () => {
  const request = axios.get(`${baseurl}/api/rules/subscriptions`);
  return request.then((resp) => resp.data);
};

const getZoneMetrics = (
  page = 1,
  per_page = 1000,
  order_by = '',
  order = 'asc'
) => {
  const request = axios.get(`${baseurl}/api/metrics/zone`, {
    params: { page, per_page, order_by, order },
  });
  return request.then((resp) => resp.data);
};
const getAssociationMetrics = (
  page = 1,
  per_page = 1000,
  order_by = '',
  order = 'asc'
) => {
  const request = axios.get(`${baseurl}/api/metrics/association`, {
    params: { page, per_page, order_by, order },
  });
  return request.then((resp) => resp.data);
};
const getHistoryMetrics = (
  page = 1,
  per_page = 1000,
  order_by = '',
  order = 'asc'
) => {
  const request = axios.get(`${baseurl}/api/metrics/alert_history`, {
    params: { page, per_page, order_by, order },
  });
  return request.then((resp) => resp.data);
};
//SINGLE FETCH

const getTag = (address) => {
  const request = axios.get(`${baseurl}/api/tags/${address}`);
  return request.then((resp) => resp.data);
};
const getBin = (id) => {
  const request = axios.get(`${baseurl}/api/containers/${id}`);
  return request.then((resp) => resp.data);
};
const getBinTypes = () => {
  const request = axios.get(`${baseurl}/api/tag_types`);
  return request.then((resp) => resp.data);
};

const uploadCSV = (type, { file }) => {
  const formData = new FormData();
  formData.append('file', file);
  const request = axios.post(`${baseurl}/api/${type}/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return request.then((resp) => resp.data);
};

const downloadFile = (data) => {
  const request = axios.post(`${baseurl}/api/utility/csv`, data, {
    responseType: 'blob',
  });
  return request.then((resp) => resp.data);
};

const getFilteredAlertHistoryMetrics = (filters) => {
  const request = axios.post(`${baseurl}/api/metrics/filtered_alert_history`, {
    ...filters,
  });
  return request.then((resp) => resp.data);
};

const getFilteredAssociationMetrics = (filters) => {
  const request = axios.post(`${baseurl}/api/metrics/filtered_association`, {
    ...filters,
  });
  return request.then((resp) => resp.data);
};

const getFilteredZoneMetrics = (filters) => {
  const request = axios.post(`${baseurl}/api/metrics/filtered_zone`, {
    ...filters,
  });
  return request.then((resp) => resp.data);
};

//http://161.35.99.28:5000/api/tags/activate/4=?active=false
const changeStatus = (type, id, status) => {
  const request = axios.post(
    `${baseurl}/api/${type}/activate/${id}?active=${status}`
  );
  return request.then((resp) => resp.data);
};

// Connectors
const getConnectors = () => {
  const request = axios.get(`${baseurl}/api/connectors`);
  return request.then((resp) => resp.data);
};

// Beacons
const getBeacons = () => {
  const request = axios.get(`${baseurl}/api/balizas`);
  return request.then((resp) => resp.data);
};

const setBeaconZone = (id, zone_name) => {
  const request = axios.put(`${baseurl}/api/balizas/${id}`, {
    ...(zone_name && { zone_name }),
  });
  return request.then((resp) => resp.data);
};

const activateBeacon = (id) => {
  const request = axios.post(`${baseurl}/api/balizas/activate/${id}`);
  return request.then((resp) => resp.data);
};

const deactivateBeacon = (id) => {
  const request = axios.post(`${baseurl}/api/balizas/deactivate/${id}`);
  return request.then((resp) => resp.data);
};

export default {
  getAllTags,
  getZones,
  getBatchs,
  getTagsWithoutContainer,
  sendNewBinForm,
  getContainers,
  editNewBinForm,
  unsetTag,
  getOrders,
  getOrderTypes,
  createOrder,
  editOrder,
  createBatch,
  editBatch,
  getBaseUrl,
  getAlerts,
  closeAlert,
  getAllRules,
  deleteRule,
  createRule,
  editRule,
  getSubscriptions,
  getMaterials,
  createMaterial,
  editMaterial,
  getMaterialGroup,
  createMaterialGroup,
  editMaterialGroup,
  getMaterialPrice,
  createMaterialPriceGroup,
  editMaterialPriceGroup,
  getZoneMetrics,
  getAssociationMetrics,
  getHistoryMetrics,
  // Connectors
  getConnectors,
  // Beacons
  getBeacons,
  setBeaconZone,
  activateBeacon,
  deactivateBeacon,
  //SINGLE FETCH
  getTag,
  getBin,
  getBinTypes,
  uploadCSV,
  downloadFile,
  getFilteredAlertHistoryMetrics,
  getFilteredAssociationMetrics,
  getFilteredZoneMetrics,
  changeStatus,
};
