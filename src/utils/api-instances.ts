import axios from 'axios';

export const catApiInstance = () => {
  const cat_api_token = process.env.CAT_API_TOKEN;
  if (!cat_api_token) {
    throw new Error('CAT API TOKEN in env not found.');
  }
  return axios.create({
    baseURL: 'https://api.thecatapi.com/v1',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': cat_api_token,
    },
  });
};

const apiInstances = {
  cat: catApiInstance,
};

export default apiInstances;
