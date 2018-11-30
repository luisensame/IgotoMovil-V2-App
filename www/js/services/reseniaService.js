angular.module('reseniaService', [])
.factory('ReseniaService', ['RestService', 'SETTINGS', function(RestService, SETTINGS){

	var reseniaServiceFactory = {};

	// factory methods
	reseniaServiceFactory.registrarResenia = registrarResenia;
	reseniaServiceFactory.obtenerListaResenia = obtenerListaResenia;

	//return factory object
	return reseniaServiceFactory;

	//functions
	function registrarResenia(resenia) {
		return RestService.post(SETTINGS.api + '/resenia', {resenia: resenia});
	}

	function obtenerListaResenia(idProducto) {
		return RestService.get(SETTINGS.api + '/resenia/' + idProducto);
	}
}]);