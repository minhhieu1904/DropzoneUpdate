const ip = window.location.hostname;
const apiUrl = 'http://' + ip + ':8029/api/';

export const environment = {
  production: true,
  apiUrl: apiUrl,
};