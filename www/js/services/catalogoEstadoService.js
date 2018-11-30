angular.module('catalogoEstadoService', [])
.factory('CatalogoEstadoService', ['RestService', 'SETTINGS', function(RestService, SETTINGS) {

	return {
		
		findAll: function() {
			return RestService.get(SETTINGS.api + '/estado');
		}
	};
}])