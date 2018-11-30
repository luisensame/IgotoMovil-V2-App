angular.module('restService', [])
.service('RestService', ['$http', '$q', function($http, $q) {
	
	return {

		/**
		 * Metodo post
		 * @param  {String} path		Path de la peticion
		 * @param  {Object} params	Objeto
		 * @return {Promise}        	Retorna una promesa
		 */
		post: function(path, params) {

			var defered = $q.defer();
			var promesa = defered.promise;

			// Se invoca la peticion
			$http.post(path, params).then(function(response) {

				// Se verifica si la peticion fue correcta
				if(response.data) {
					defered.resolve(response.data);
				} else {
					defered.resolve({success:false, message: 'No se puede conectar al servidor', status: 500});
				}
			}, function(error) {
				defered.resolve({success:false, message: error.statusText, status: error.status});
			});

			return promesa;
		},

		/**
		 * Metodo get
		 * @param  {String} path		Path de la peticion
		 * @param  {Object} params	Objeto
		 * @return {Promise}        	Retorna una promesa
		 */
		get: function(path, params) {

			var defered = $q.defer();
			var promesa = defered.promise;

			// Se invoca la peticion
			$http.get(path, params).then(function(response) {

				// Se verifica si la peticion fue correcta
				if(response.data) {
					defered.resolve(response.data);
				} else {
					defered.resolve({success:false, message: 'No se puede conectar al servidor', status: 500});
				}
			}, function(error) {
				defered.resolve({success:false, message: error.statusText, status: error.status});
			});

			return promesa;
		},

		/**
		 * Metodo put
		 * @param  {String} path		Path de la peticion
		 * @param  {Object} params	Objeto
		 * @return {Promise}        	Retorna una promesa
		 */
		put: function(path, params) {

			var defered = $q.defer();
			var promesa = defered.promise;

			// Se invoca la peticion
			$http.put(path, params).then(function(response) {

				// Se verifica si la peticion fue correcta
				if(response.data) {
					defered.resolve(response.data);
				} else {
					defered.resolve({success:false, message: 'No se puede conectar al servidor', status: 500});
				}
			}, function(error) {
				defered.resolve({success:false, message: error.statusText, status: error.status});
			});

			return promesa;
		},

		/**
		 * Metodo delete
		 * @param  {String} path		Path de la peticion
		 * @return {Promise}        	Retorna una promesa
		 */
		delete: function(path) {

			var defered = $q.defer();
			var promesa = defered.promise;

			// Se invoca la peticion
			$http.delete(path).then(function(response) {

				// Se verifica si la peticion fue correcta
				if(response.data) {
					defered.resolve(response.data);
				} else {
					defered.resolve({success:false, message: 'No se puede conectar al servidor', status: 500});
				}
			}, function(error) {
				defered.resolve({success:false, message: error.statusText, status: error.status});
			});

			return promesa;
		},
	}
}]);