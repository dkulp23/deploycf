'use strict';

module.exports = ['$q', '$log', '$http', 'authService', galleryService];

function galleryService($q, $log, $http, authService) {
  $log.debug('galleryService');

  let service = {};
  service.galleries = [];

  service.createGallery = function(gallery) {
    $log.debug('galleryService.createGallery');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/gallery`; //eslint-disable-line
      let config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      return $http.post(url, gallery, config);
    })
    .then( res => {
      $log.log('gallery created');
      let gallery = res.data;
      service.galleries.unshift(gallery);
      return gallery;
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.fetchGalleries = function() {
    $log.debug('galleryService.fetchGalleries');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/gallery`;//eslint-disable-line
      let config = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      return $http.get(url, config);
    })
    .then( res => {
      $log.log('got your galleries');
      let galleries = res.data;
      service.galleries = galleries;
      return service.galleries;
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.deleteGalleries = function(galleryID, galleryData) {
    $log.debug('galleryService.deleteGalleries');
    $log.log(galleryData);
    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/gallery/${galleryID}`; //eslint-disable-line
      let config = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      return $http.delete(url, config);
    })
    .then( res => {
      $log.log('gallery removed');
      return JSON.parse(res.status);
    })
    .catch( err => {
      $log.error(err);
      return $q.reject(err);
    });
  };

  service.updateGallery = function(galleryID, galleryData) {
    $log.debug('galleryService.updateGalleries');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/gallery/${galleryID}`; //eslint-disable-line
      let config = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      return $http.put(url, galleryData, config);
    })
    .then( res => {
      for (let i = 0; i < service.galleries.length; i++) {
        let current = service.galleries[i];
        if (current._id === galleryID) {
          service.galleries[i] = res.data;
          break;
        }
      }

      $log.log('update res data', res.data);
      return res.data;
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.deleteGallery = function(galleryID) {
    $log.debug('galleryService.deleteGallery');

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/gallery/${galleryID}`; //eslint-disable-line
      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      };

      return $http.delete(url, config);
    })
    .then( res => {
      $log.log(res);
      for (let i=0; i < service.galleries.length; i++) {
        let current = service.galleries[i];
        if (current._id === galleryID) {
          service.galleries.splice(i, 1);
          break;
        }
      }
      return res;
    })
    .catch( err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  return service;
}
