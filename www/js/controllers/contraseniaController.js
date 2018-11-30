angular.module('contraseniaController', ['usuarioService'])
.controller('ContraseniaController', ['$scope', 'UsuarioService', '$ionicLoading',
	'$ionicPopup', '$timeout', '$state', ContraseniaController]);

function ContraseniaController($scope, UsuarioService, $ionicLoading, $ionicPopup, $timeout, $state) {

	// Variables
		var alert;

		$scope.usuario = {};

	// Funciones
		$scope.recuperarContrasenia = recuperarContrasenia;

		function recuperarContrasenia(form) {

			$scope.procesar = true; // Se oculta el boton
			$ionicLoading.show({
				template: '<p>Espere</p><ion-spinner icon="lines"></ion-spinner>',
			});

			// Se invoca al servicio
			UsuarioService.recuperarContrasenia($scope.usuario.email).then(function(response) {

				$scope.usuario = {};
				form.$setUntouched(); //Set state from touched to untouched
				$ionicLoading.hide(); // Se finaliza el loading
				$scope.procesar = false; // Se oculta el boton

				// Se verifica si la respuesta fue correcta
				if(response && response.success) {

					// Se verifica si se obtiene los datos del usuario
					if(response.usuario) {

						// Se verifica si el usuario es de facebook
						if(response.usuario.idOrigen == 2) {
							alertPopup('Notificación', 'Lo sentimos, ha ingresado su correo de Facebook.');
						} else {

							alertPopup('Notificación', 'Se ha enviado una nueva contraseña a su correo.', true);

							$timeout(function() {
								alert.close();
								$state.go('login');
								$scope.procesar = false;
							}, 5000);
						}
					} else {
						alertPopup('Notificación', 'Lo sentimos, esta cuenta no se encuentra en nuestros registros.');
					}
				} else {
					alertPopup('Notificación', 'Lo sentimos, surgio un problema con nuestros servicios, por favor inténtalo más tarde.');
				}
			});
		}


		// Funcion que muestra un pop
		function alertPopup(title, template, success) {

			var options = {title: title, template: template};

			if(!success) {
				options.buttons = [{ text: 'Entendido <i class="ion-android-done"></i>', type: 'button-positive' }];
			}

			alert = $ionicPopup.show(options);
		}
}