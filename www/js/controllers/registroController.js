angular.module('registroController', ['usuarioService', 'oauthService'])
.controller('RegistroController', ['$scope', 'UsuarioService', '$ionicPopup', '$timeout',
	'$state', 'OauthService', '$ionicLoading', 'Auth', '$rootScope', RegistroController]);

function RegistroController($scope, UsuarioService, $ionicPopup, $timeout, 
	$state, OauthService, $ionicLoading, Auth, $rootScope) {

	// Variables
		var alert;

		$scope.usuario = {};
		$scope.procesar = false;
		$scope.notificaciones = {};

	// Funciones
		$scope.registro = registro;
		$scope.registroFacebook = registroFacebook;

	// Metodo que registra una nueva cuenta de manera local
		
		// Metodo que registra un nuevo usuario
		function registro(form) {

			$scope.procesar = true;
			$scope.notificaciones = {};

			var usuario = {
				idOrigen: 1, // Tipo de origen local
				email: $scope.usuario.email,
				password: $scope.usuario.password,
			};

			$ionicLoading.show({
		    	template: '<p>Espere</p><ion-spinner icon="lines"></ion-spinner>',
			});

			crearCuenta(usuario, form);
		}

		// Metodo para registrarse mediante facebook
		function registroFacebook() {

			// Se invoca al metodo que incia sesion con facebook
			OauthService.facebook().then(function(response) {

				// Se verifica si respuesta es correcta
				if(response.success) {

					// Se verifica si existe el usuario
					if(response.usuario) {
						$rootScope.logeado = true
						var usuario = {
							idOrigen: 2, // Tipo de origen local
							email: response.usuario.email,
							apellidos: response.usuario.last_name,
							imagen: response.usuario.facebookPicture,
							nombreCompleto: response.usuario.first_name,
						};

						crearCuenta(usuario);
					} else {
						alertPopup('Notificación', 'Lo sentimos pero no podemos acceder a su perfil.');
					}
				} else {
					alertPopup('Notificación', 'Lo sentimos, para su registro es necesario acceder a su perfil de facebook.');
				}
			});
		}

		// Function que crea la cuenta del usuario
		function crearCuenta(usuario, form) {

			// Se invoca al servicio
			UsuarioService.registro(usuario).then(function(response) {

				$ionicLoading.hide(); // Se oculta el loading

				// Se limpia la contrasenia
				$scope.usuario = {email: usuario.email, password: null};
				if(form) form.$setUntouched(); //Set state from touched to untouched
				
				// Se verifica si la respuesta fue correcta
				if(response.success) {

					// Se verifica si el usuario existe
					if(response.usuario) {
						$scope.procesar = false;
						alertPopup('Notificación', 'Esta cuenta ya se encuentra en uso, te invitamos a utilizar un email diferente');
					} else {
						$rootScope.logeado = true
						$scope.usuario = {}; // Se limpian los datos
						$scope.notificaciones.success = true;
						alertPopup('Bienvenido a GONI', 'Su registro fue exitoso, espere un momento por favor', true);
						// Se guarda el token
						Auth.saveToken(response.token);
						$timeout(function() {
							alert.close();
							$state.go('app.main');
							$scope.procesar = false;
							$rootScope.$emit('favoritos');
						}, 5000);
					}
				} else {

					$scope.procesar = false;

					// Se verifica si es un estatus 500
					if(response.status == 500) {
						alertPopup('Notificación', 'Ocurrio un error interno en nuestros servicios');
					} else {
						alertPopup('Notificación', 'Ocurrio un error al conectarse con nuestros servicios');
					}
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