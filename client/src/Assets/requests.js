export const so = 'http://localhost:8000';
export const wso = 'ws://localhost:8000';

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

  //discussions(messenging)
  UPLOAD_DISCUSSION_FILES: '/api/space/add-discussion-files/',
  GET_SPACE_DISCUSSIONS: '/api/space/get-valid-discussions',
  DOWNLOAD_FILES: '/api/space/download-discussion-files',
};

export default reqs;
