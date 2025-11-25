import Constants from 'expo-constants';

const { apiUrl } = Constants.expoConfig.extra;

const API = {
  BASE_URL: apiUrl,
  HELLO: apiUrl,
  PASSWORD_GENERATE: `${apiUrl}/password/generate`,
  VALIDATOR_VALIDATE: `${apiUrl}/validator/validate`,
  AUTH_REGISTER: `${apiUrl}/auth/register`,
  AUTH_LOGIN: `${apiUrl}/auth/login`,
  AUTH_ME: `${apiUrl}/auth/me`,
  TOPICS:  `${apiUrl}/topics`
};

export default API;