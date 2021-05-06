const ip = window.location.hostname;
const apiUrl = 'http://' + ip + ':8029';

export const commonPerFactory = {
  //Local
  apiUrl: 'http://localhost:5000/api/',
  imageProductUrl: 'http://localhost:5000/uploaded/images/product/',
  videoProductUrl: 'http://localhost:5000/uploaded/video/product/',
  imageArticleUrl: 'http://localhost:5000/uploaded/images/article/',
  videoArticleUrl: 'http://localhost:5000//uploaded/video/article/',
  imageUserUrl: 'http://localhost:5000/uploaded/images/user/',
  imageUserDefault: '../../../assets/img/avatars/user.png',
  serverSentTokenInAppModule: 'localhost:5000',
  linkSentTokenInAppModule: 'localhost:5000/api/auth',
  factoryId: 'SHC',

  // //IIS
  // apiUrl: apiUrl + '/api/',
  // imageProductUrl: apiUrl + '/uploaded/images/product/',
  // videoProductUrl: apiUrl + '/uploaded/video/product/',
  // imageArticleUrl: apiUrl + '/uploaded/images/article/',
  // videoArticleUrl: apiUrl + '/uploaded/video/article/',
  // serverSentTokenInAppModule: ip + ':8029',
  // linkSentTokenInAppModule: ip + ':8029/api/auth',
  // factoryId: 'SHC',
};

export const nameIcon = {
  excel: 'fa fa-file-excel-o text-success',
  word: 'fa fa-file-word-o text-secondary',
  powerpoint: 'fa fa-file-powerpoint-o text-danger',
  pdf: 'fa fa-file-pdf-o text-danger',
  img: 'fa fa-file-image-o text-success',
  video: 'fa fa-file-video-o text-primary'
};

export const listFileExtension = {
  excel: ['xls', 'xlsb', 'xlsm', 'xlsx'],
  word: ['docx', 'dot', 'dotm', 'doc'],
  powerpoint: ['ppsx', 'ppt', 'pptm', 'pptx'],
  pdf: ['pdf'],
  img: ['xbm', 'tif', 'pjp', 'svgz', 'jpg', 'jpeg', 'ico', 'tiff', 'gif', 'svg', 'jfif', 'webp', 'png', 'bmp', 'pjpeg', 'avif'],
  video: ['ogm', 'wmv', 'mpg', 'webm', 'ogv', 'mov', 'asx', 'mpeg', 'mp4', 'm4v', 'avi']
};

export const checkFileExtentionUpload = ['flv', 'mp4', 'm4p', 'mp2', 'mpv', 'ogg', 'avi', 'wmv', 'pdf', 'jpeg', 'jpg', 'png', 'gif', 'tiff', 'bmp'];