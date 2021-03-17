const ip = window.location.hostname;
const apiUrl = 'http://' + ip + ':8029';

export const environment = {
  production: true,
  apiUrl: apiUrl + '/api/',
};

export const commonPerFactory = {
  // Product
  imageProductUrl: apiUrl + '/uploaded/images/product/',
  videoProductUrl: apiUrl + '/uploaded/video/product/',

  // Article
  imageArticleUrl: apiUrl + '/uploaded/images/article/',
  videoArticleUrl: apiUrl + '/uploaded/video/article/',
}