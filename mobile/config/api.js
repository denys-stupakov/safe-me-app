import Constants from 'expo-constants';

const { apiUrl } = Constants.expoConfig.extra;

const API = {
  BASE_URL: apiUrl,
  HELLO: apiUrl,
  PASSWORD_GENERATE: `${apiUrl}/password/generate`,
};

export default API;