import axios from 'axios';

const token = localStorage.getItem('token');
const rankClubAPI = axios.create();

if (token) {
  rankClubAPI.defaults.headers.common.Authorization = `Token ${token}`;
}

// Add a response interceptor
rankClubAPI.interceptors.response.use(undefined, (error) => {
  if (error.response.status === 401) {
    localStorage.clear();
    delete rankClubAPI.defaults.headers.common.Authorization;
  }
  return Promise.reject(error);
});

export default rankClubAPI;
