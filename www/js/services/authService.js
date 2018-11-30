angular.module('authService', [])
.factory('Auth', ['AuthToken', 'RestService', 'SETTINGS',
	function(AuthToken, RestService, SETTINGS) {

	return {
		saveToken: function(token) {
			AuthToken.setToken(token);
		},
		logout: function() {
			//Limpiar token
			AuthToken.setToken();
		},
		isLoggedIn: function () {
			
			//Si existe un token
			if(AuthToken.getToken()) {
				return true;
			}

			//Si no existe retorna falso
			return false;
		},
		getToken: function() {
			return AuthToken.getToken();
		},
		getUser: function() {
			return RestService.get(SETTINGS.api + '/usuario/me');
		},
		cerrarSesion: function() {
			localStorage.clear();
			sessionStorage.clear();
		}
	};
}])
.factory('AuthToken', ['$window', function($window) {
	return {
		getToken: function() {
			return $window.localStorage.getItem('token');
		},
		setToken: function(token) {

			// Se verifica si existe el token
			if(token) {
				//Se almacen ale token
				$window.localStorage.setItem('token', token);
			}else{
				//Remueve el token
				$window.localStorage.removeItem('token');
			}
		}
	};
}])
.factory('AuthInterceptor', ['$q', 'AuthToken', function($q, AuthToken) {

	return {
		request: function(config) {

			// Se obtiene el token
			var token = AuthToken.getToken();

			// Se verifica si existe un token
			if(token) {

				// Se agrega el token a los headers
				config.headers['x-access-token'] = token;
			}

			return config;
		},
		responseError: function(rejection) {

			//Si el server arrojo un status 403, acceso restringido
			if(rejection.status === 403) {

				//Si el token expiro se emiten eventos de expiracion
				if(rejection.data && rejection.data.expired) {

					// Se limpia el token
					AuthToken.setToken();

					$injector.get('$ionicHistory').nextViewOptions({
		                disableBack: true
					});

					$injector.get('$state').go('login');
				}
			}

			return $q.reject(rejection);
		},
		response: function(response) {
			return response;
		}
	}
}]);