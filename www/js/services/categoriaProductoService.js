angular.module('categoriaProductoService', [])
.factory('CategoriaProductoService', ['RestService', 'SETTINGS', function(RestService, SETTINGS) {

	var categoriaServiceFactory = {};

	//factory methods
	categoriaServiceFactory.find = find;

	//return factory object
	return categoriaServiceFactory;	


	//functions
	function find(){
		return RestService.get(SETTINGS.api + '/categoria-producto');
	}	
}]);