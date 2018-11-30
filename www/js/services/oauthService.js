angular.module('oauthService', [])
.service('OauthService', ['$http', 'SETTINGS', '$q', '$cordovaOauth', 'RestService',
	function($http, SETTINGS, $q, $cordovaOauth, RestService) {

	return {
		facebook: function() {

			var defered = $q.defer();
			var promesa = defered.promise;
			var configFacebook = SETTINGS.facebook;

			// Se invoca a la api de inicio de sesion
			$cordovaOauth.facebook(configFacebook.appId, configFacebook.permisos).then(function(response) {

				var params = {
					params: {
						format: 'json',
						access_token: response.access_token,
						fields: configFacebook.fields,
					}
				};

				RestService.get(configFacebook.url, params).then(function(response) {

					// Se verifica si existe una respuesta
					if(response) {

						// Se verifica si se puede obtener el email del usuairo
						if(response.email) {

							// Se obtiene la imagen del usuario
							response.facebookPicture = 'https://graph.facebook.com/' + response.id + '/picture?width=400&height=400';
							//https://graph.facebook.com/ + response.id + /picture?width=700&height=700
							//https://graph.facebook.com/ + response.id + /picture?type=large

							defered.resolve({success: true, message: 'Se obtiene la informacion del usuario', 
									status: 200, usuario: response});
						} else {
							defered.resolve({success: true, message: 'No se puede obtener la informacion del usuario'});
						}
					} else {
						defered.resolve({success: false, message: 'No se puede conectar servicio de Facebook', status: 500});
					}
				});
			}, function(error) {
				defered.resolve({success: false, message: error, status: 500});
			});

			return promesa;
		}
	}
}])