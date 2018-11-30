angular.module('conektaService', [])
.factory('ConektaService', ['SETTINGS', '$http', '$q', function(SETTINGS, $http, $q) {

	//Conekta config keys
	Conekta.setPublishableKey(SETTINGS.conekta.public_key);
	Conekta.setLanguage("es");

	var conektaFactory = {};
	conektaFactory.tokenizar= tokenizar;
	conektaFactory.validarTarjeta = validarTarjeta;

	return conektaFactory;

	/**
	 * Metodo que tokeniza una tarjeta
	 * @param  {JSON} card datos de la tarjeta del cliente
	 * @return {Promise}      promesa con el resultado de la tokenizacion de la tarjeta
	 */
	function tokenizar(card) {

		//create a promise
		var deferred = $q.defer();
		
		//Params para la tarjeta
		var tokenParams = {card: card};

		//API Conekta para tokenizar la tarjeta
		Conekta.token.create(tokenParams, function (token) {

			// Se crea la respuesta
			deferred.resolve({success: true, token: token});
		}, function (err) {
			deferred.resolve({error: true, message: err.message_to_purchaser});
		});

		return deferred.promise;
	}

	/**
	 * Funcion que valida que los datos de la tarjeta sean validos
	 * @param  {JSON} card datos de la tarjeta
	 * @return {JSON}      resultado de la validacion de la tarjeta
	 */
	function validarTarjeta(card) {

		// Respuesta
		var result = {success : true, descripcion : 'Tarjeta valida'};

		// validacion de numero
		if(!Conekta.card.validateNumber(card.number)) {
			result = {
				validacion : true,
				descripcion : 'El número de la tarjeta no es valido'
			};
		} else if(!Conekta.card.validateExpirationDate(card.exp_month, card.exp_year)) {
			result = {
				validacion : true,
				descripcion : 'La fecha de expiración no es valida'	
			};
		} else if(!Conekta.card.validateCVC(card.cvc)) {
			result = {
				validacion : true,
				descripcion : 'El código CVC no es valido'	
			};
		}

		return result;
	};
}]);