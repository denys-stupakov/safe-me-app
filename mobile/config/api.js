import Constants from 'expo-constants';

const { apiUrl } = Constants.expoConfig.extra;

const API = {
  BASE_URL: apiUrl,
  HELLO: apiUrl,
  PASSWORD_GENERATE: `${apiUrl}/password/generate`,
  VALIDATOR_VALIDATE: `${apiUrl}/validator/validate`,
  AUTH_REGISTER: `${API_BASE_URL}/auth/register`,
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_ME: `${API_BASE_URL}/auth/me`,
};

export default API;