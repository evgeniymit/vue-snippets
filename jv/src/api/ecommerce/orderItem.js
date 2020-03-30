import axios from '../http';

const getRoute = routeName => `/api/ecommerce/orderitem/${routeName}`;

export const updateOrderItemApi = (id, body) => (
  new Promise((resolve, reject) => {
    axios.put(getRoute(`${id}`), body)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  })
);
