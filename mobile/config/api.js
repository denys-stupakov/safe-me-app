import Constants from 'expo-constants';

const { apiUrl } = Constants.expoConfig.extra;

const API = {
  BASE_URL: apiUrl,
  HELLO: `${apiUrl}/api/hello`,
  // Add more later
};

export default API;