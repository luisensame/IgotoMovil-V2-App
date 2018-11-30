angular.module('loginController', ['usuarioService', 'oauthService'])
.controller('LoginController', ['$scope', 'UsuarioService', '$ionicPopup', '$timeout',
	'$state', 'OauthService', '$ionicLoading', 'Auth', '$rootScope', LoginController]);

function LoginController($scope, UsuarioService, $ionicPopup, $timeout, 
	$state, OauthService, $ionicLoading, Auth, $rootScope) {

	// Variables
		var alert;

		$scope.usuario = {};
		$scope.procesar = false;
		$scope.notificaciones = {};

	// Funciones
		$scope.login = login;
		$scope.loginFacebook = loginFacebook;

		function login(form) {

			$scope.procesar = true; // Se oculta el boton
			$ionicLoading.show({
		    	template: '<p>Espere</p><ion-spinner icon="lines"></ion-spinner>',
			});

			// Se invoca al servicio
			UsuarioService.verificarUsuario($scope.usuario).then(function(response) {

				$scope.usuario = {};
				form.$setUntouched(); //Set state from touched to untouched

				$ionicLoading.hide(); // Se finaliza el loading
				$scope.procesar = false; // Se oculta el boton

				// Se verifica si la respuesta fue correcta
				if(response) {

					// Se verifica si el inicio de sesion fue exitoso
					if(response.success) {

						// Se verifica si existe el usuario
						if(response.usuario) {

							// Se verifica el id de origen del usuario
							if(response.usuario.idOrigen === 1) {
								$rootScope.logeado = true
								// Se verifica si existe el token
								if(response.token) {
									$scope.usuario = {}; // Se limpian los datos
									$rootScope.$emit('favoritos');
									Auth.saveToken(response.token); // Se guarda el token
									$state.go('app.main'); // Se redirecciona
								} else {
									alertPopup('Notificación', 'Usuario y/o contraseña invalidos, por favor verifica tu información.');
								}
							} else {
								alertPopup('Notificación', 'Lo sentimos, para acceder debes iniciar sesión con Facebook.');
							}
						} else {
							alertPopup('Notificación', 'Lo sentimos, esta cuenta no se encuentra en nuestros registros.');
						}
					} else {
						alertPopup('Notificación', 'Lo sentimos, surgio un problema con nuestros servicios, por favor inténtalo más tarde.');
					}
				} else {
					alertPopup('Notificación', 'Lo sentimos, surgio un problema con nuestros servicios, por favor inténtalo más tarde.');
				}
			});
		}
		
		// Function para iniciar sesion con facebook
		function loginFacebook() {

			// Se invoca al metodo que incia sesion con facebook
			OauthService.facebook().then(function(response) {

				// Se verifica la respuesta
				if(response) {

					// Se verifica si respuesta es correcta
					if(response.success) {

						// Se verifica si existe el usuario
						if(response.usuario) {

							var usuario = {
								idOrigen: 2, // Tipo de origen local
								email: response.usuario.email,
								apellidos: response.usuario.last_name,
								imagen: response.usuario.facebookPicture,
								nombreCompleto: response.usuario.first_name,
							};

							$ionicLoading.show({
						    	template: '<p>Espere</p><ion-spinner icon="lines"></ion-spinner>',
							});

							// Se invoca al servicio que verifica al usuario
							UsuarioService.verificarUsuario(usuario).then(function(response) {

								// Se verifica la respuesta
								if(response) {

									// Se verifica si la respuesta fue exitosa
									if(response.success) {

										// Se verifica si existe un token
										if(response.token) {

											$ionicLoading.hide(); // Se finaliza el loading
											$rootScope.$emit('favoritos');
											Auth.saveToken(response.token); // Se guarda el token
											$state.go('app.main'); // Se redirecciona
										} else {
											crearCuenta(usuario);
										}
									} else {
										$ionicLoading.hide();
										alertPopup('Notificación', 'Error al inciar sesión, por favor intenta más tarde.');
									}
								} else {
									$ionicLoading.hide();
									alertPopup('Notificación', 'Lo sentimos, pero tenemos un problema con nuestros servicios.');
								}
							});
						} else {
							alertPopup('Notificación', 'Lo sentimos pero no podemos acceder a su perfil.');
						}
					} else {
						alertPopup('Notificación', 'Lo sentimos, para su registro es necesario acceder a su perfil de facebook.');
					}
				} else {
					alertPopup('Notificación', 'Lo sentimos, pero tenemos un problema con nuestros servicios.');
				}
			});
		}

		// Function que crea la cuenta del usuario
		function crearCuenta(usuario) {

			// Se invoca al servicio
			UsuarioService.registro(usuario).then(function(response) {

				$ionicLoading.hide(); // Se oculta el loading
				
				// Se verifica la respuesta
				if(response) {

					// Se verifica si la respuesta fue correcta
					if(response.success) {

						// Se verifica si el usuario existe
						if(response.usuario) {
							$scope.procesar = false;
							alertPopup('Notificación', 'Esta cuenta ya se encuentra en uso, te invitamos a utilizar un email diferente.');
						} else {
							$rootScope.logeado = true
							$scope.usuario = {}; // Se limpian los datos
							$scope.notificaciones.success = true;
							alertPopup('Bienvenido a GONI', 'Su registro fue exitoso, espere un momento por favor.', true);
							// Se guarda el token
							Auth.saveToken(response.token);
							$timeout(function() {
								alert.close();
								$state.go('app.main');
								$scope.procesar = false;
							}, 5000);
						}
					} else {

						$scope.procesar = false;

						// Se verifica si es un estatus 500
						if(response.status == 500) {
							alertPopup('Notificación', 'Ocurrio un error interno en nuestros servicios.');
						} else {
							alertPopup('Notificación', 'Ocurrio un error al conectarse con nuestros servicios.');
						}
					}
				} else {
					alertPopup('Notificación', 'Lo sentimos, pero tenemos un problema con nuestros servicios.');
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