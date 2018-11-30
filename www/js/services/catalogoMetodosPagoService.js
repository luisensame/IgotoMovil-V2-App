angular.module('catalogoMetodosPagoService', [])
.factory('MetodosPagoService', ['RestService', 'SETTINGS', function(RestService, SETTINGS) {

	var catalogoFactory = {};

	//factory methods
	catalogoFactory.findAll = findAll;

	//return factory object
	return catalogoFactory;	


	//functions
	function findAll(){
		return RestService.get(SETTINGS.api + '/metodos-pago');
	}	
}]);