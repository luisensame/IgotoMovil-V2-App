angular.module('mercadoPagoService', [])
.factory('mercadoPagoService', ['SETTINGS', '$http', '$q', function(SETTINGS, $http, $q) {
	console.log(Mercadopago)
	Mercadopago.setPublishableKey("TEST-6fb0a19d-1afb-41a6-8db9-d4676281767b");
	var mercadoPagoFactory = {};
	mercadoPagoFactory.getHola = getHola;
	
	return mercadoPagoFactory;
	function getHola() {
		console.log("hola mundo")
		Mercadopago.getAllPaymentMethods(function (status, response){
			console.log(response);
		});
        return true
	}
}]);