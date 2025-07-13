import axios from 'axios';

const API = 'http://localhost:3001/shipments';

export const getShipments = () => axios.get(API);

export const createShipment = (data) => axios.post(API, data);

export const updateShipment = (id, data) => axios.put(`${API}/${id}`, data);

export const deleteShipment = (id) => axios.delete(`${API}/${id}`);

export const assignShipment = (id, data) =>
  axios.post(`${API}/${id}/assign`, data);
