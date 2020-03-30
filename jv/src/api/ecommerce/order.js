import axios from '../http';

const getRoute = routeName => `/api/ecommerce/${routeName}`;

export const getOrderListApi = params => (
  new Promise((resolve, reject) => {
    axios.get(getRoute('order'), { params })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  })
);

export const getOrderDetailsApi = id => (
  new Promise((resolve, reject) => {
    axios.get(getRoute(`order/${id}`))
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  })
);

export const getOrderTasksApi = id => (
  new Promise((resolve, reject) => {
    axios.get(getRoute(`order/${id}/tasks`))
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error.response.data);
      });
  })
);
