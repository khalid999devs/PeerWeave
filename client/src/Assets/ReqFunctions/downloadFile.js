import axios from 'axios';
import reqs from '../requests';

export const onFileClick = async (file) => {
  try {
    const response = await axios.get(
      `${reqs.DOWNLOAD_FILES}?type=${file.type}&name=${file.name}&destName=${file.dest}`,
      {
        responseType: 'arraybuffer',
        withCredentials: true,
      }
    );

    const contentDisposition = response.headers['content-disposition'];
    const filenameMatch =
      contentDisposition && contentDisposition.match(/filename="(.+)"/);
    const defaultFilename = file.name; // Default filename if not provided by the server

    const filename =
      filenameMatch && filenameMatch[1] ? filenameMatch[1] : defaultFilename;

    // Create a Blob using the binary data from the response
    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || 'application/octet-stream',
    });

    // Create a download link and trigger the download
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  } catch (error) {
    console.log(error);
  }
};
