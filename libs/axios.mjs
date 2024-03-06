import axios from 'axios';

const instanceAxios = axios.create({
  timeout: 0, // 0 for no timeout
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// instance.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded";
instanceAxios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

export default instanceAxios;
