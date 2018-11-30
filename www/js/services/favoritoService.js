angular.module('favoritoService', [])
.factory('FavoritoService', ['RestService', 'SETTINGS', function(RestService, SETTINGS) {

	var favoritoServiceFactory = {};
	var api = SETTINGS.api + '/favorito';

	//factory methods
	favoritoServiceFactory.agregarFavorito = agregarFavorito;
	favoritoServiceFactory.eliminarFavorito = eliminarFavorito;
	favoritoServiceFactory.obtenerFavoritos = obtenerFavoritos;
	favoritoServiceFactory.obtenerTotalFavoritos = obtenerTotalFavoritos;

	//return factory object
	return favoritoServiceFactory;

	//functions
	function obtenerTotalFavoritos(email) {
		return RestService.get(api + '/total/' + email);
	}

	function agregarFavorito(favorito) {
		return RestService.post(api, favorito);
	}

	function obtenerFavoritos(data) {

		var url = api + '?noElementos=' + data.noElementos + '&offSet=' + data.offSet;
		return RestService.get(url + '&email=' + data.email);
	}

	function eliminarFavorito(id) {
		return RestService.delete(api + '/' + id);
	}
}]);