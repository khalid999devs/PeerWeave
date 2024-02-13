const so = 'http://localhost:8000';

export const reqFileWrapper = (src) => {
  if (!src) return null;
  else return so + '/' + src;
};

const reqs = {
  // client
  CLIENT_LOGIN: '',
  CLIENT_LOGOUT: '',
  IS_CLIENT_VALID: '',
  VALID_CLIENT_INFO: '',
};

export default reqs;
