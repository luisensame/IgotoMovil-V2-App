angular.module('perfilController', ['usuarioService', 'catalogoEstadoService'])
.controller('PerfilController', ['$scope', 'Auth', '$state', '$cordovaCamera', '$ionicLoading',
	'$ionicPopup', 'UsuarioService', '$rootScope', 'SETTINGS', '$timeout', 'CatalogoEstadoService', PerfilController]);

function PerfilController($scope, Auth, $state, $cordovaCamera, $ionicLoading, 
	$ionicPopup, UsuarioService, $rootScope, SETTINGS, $timeout, CatalogoEstadoService) {

	// Variables
		var alert;
		
		$scope.usuario = {};
		$scope.urlImage = null;
		$scope.listaEstado = [];
		$scope.uploadFile = false;
		$scope.procesando = false;

	// Inicializacion
		init();

	// Funciones
		
		$scope.cerrarSesion = cerrarSesion;
		$scope.selecconarImagen = selecconarImagen;
		$scope.actualizarInformacion = actualizarInformacion;
		$scope.confirmarEliminarCuenta = confirmarEliminarCuenta;

		function init() {

			$ionicLoading.show({
				template: '<p>Espere</p><ion-spinner icon="lines"></ion-spinner>',
			});

			findAllEstado();
			obtenerDatosPerfil();
		}

		// Funcion que obtiene los datos del perfil
		function obtenerDatosPerfil() {

			// Se invoca al servicio
			Auth.getUser().then(function(response) {

				// Se obtiene los datos del perfil
				$scope.usuario = response.usuario;
				$scope.urlImage = response.usuario.imagen;
				$ionicLoading.hide(); // Se finaliza el loading

				// Se verifica si tiene una imagen
				if(!$scope.usuario.imagen) {
					$scope.usuario.imagen = 'img/avatar.jpg';
				}
			});
		}

		// Funcion que selecciona una imagen de perfil
		function selecconarImagen() {

			$scope.uploadFile = false;

			// Se verifica si el usuario es local
			if($scope.usuario.idOrigen == 1) {

				var options = {
					quality: 100,
					mediaType: Camera.MediaType.PICTURE,
					destinationType: Camera.DestinationType.FILE_URI,
					sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				};

				$ionicLoading.show({
					template: '<p>Espere</p><ion-spinner icon="lines"></ion-spinner>',
				});

				// Se obtiene la foto del telefono
				navigator.camera.getPicture(function(imagePath) {

					convertToBase64(imagePath, function(base64) {

						$ionicLoading.hide();
						
						// Se verifica si se obtiene la base64
						if(base64) {
							
							var bytes = base64.length;
							var size = parseInt(bytes / 1024);
							
							// Se verifica el tamanio de la imagen
							if(size <= SETTINGS.sizeImage) {
								$scope.usuario.imagen = imagePath;
								$scope.uploadFile = true;
							} else {
								alertPopup('Notificación', 'Seleccione una imagen de peso no mayor a 3MB.');
							}
						}
					});
				}, function(message) {
					$ionicLoading.hide();
					alertPopup('Notificación', 'Error al obtener la imagen del teléfono.');
				}, options);
			} else {
				alertPopup('Notificación', 'Para cambiar su imagen de perfil debe ir a Facebook.com.');
			}
		}

		// Funcion que convierte una imagen a base64
		function convertToBase64(url, callback) {

			var xhr = new XMLHttpRequest();
			
			xhr.onload = function() {
				var reader = new FileReader();
				reader.onloadend = function() {
					callback(reader.result);
				}
				reader.readAsDataURL(xhr.response);
			};

			xhr.open('GET', url);
			xhr.responseType = 'blob';
			xhr.send();
		}

		// Funcion que actualiza la informacion del usuario
		function actualizarInformacion() {

			$scope.procesando = true;
			$ionicLoading.show({
				template: '<p>Espere</p><ion-spinner icon="lines"></ion-spinner>',
			});

			var usuario = {
				_id: $scope.usuario._id,
				email: $scope.usuario.email,
				idOrigen: $scope.usuario.idOrigen,
				apellidos: $scope.usuario.apellidos,
				fechaRegistro: $scope.usuario.fechaRegistro,
				direccionEnvio: $scope.usuario.direccionEnvio,
				nombreCompleto: $scope.usuario.nombreCompleto,
				imagen: ($scope.uploadFile) ? $scope.usuario.imagen : undefined,
			};
			
			// Se invoca al servicio
			UsuarioService.actualizarInformacion(usuario, $scope.urlImage).then(function(response) {

				$ionicLoading.hide();
				$scope.procesando = false;

				// Se verifica si no ocurrio un error
				if(response.success) {
					
					$scope.uploadFile = false;
					$rootScope.$emit('actualizaPerfil');
					alertPopup('Notificación', 'Su información fue actualizada.');
					
					if(response.url) {
						$scope.urlImage = response.url;
						$scope.usuario.imagen = response.url;
					}
				} else {
					alertPopup('Notificación', 'Ocurrio un error al actualizar su información.');
				}
			});
		}

		// Funcion que obtiene los estados
		function findAllEstado() {

			// Se invoca al servicio
			CatalogoEstadoService.findAll().then(function(response) {
				
				// Se verifica si se obtiene la lista
				if(response && response.success) {
					$scope.listaEstado = response.catalogo;
				}
			});
		}

		// Funcion que cierra la sesion de la aplicacion
		function cerrarSesion() {
			Auth.cerrarSesion();
			$state.go('login');
		}

		function confirmarEliminarCuenta() {

			alert = $ionicPopup.show({
				title: 'Eliminar cuenta',
				template: '¿Estas seguro de realizar esta acción?',
				buttons: [
					{
						text: 'Aceptar',
						type: 'button-positive',
						onTap: function () {
							eliminarCuentaUsuario();
						}
					},
					{
						text: 'Cancelar'
					}
				]
			});
		}

		// Funcion que elimina la cuenta de un usuario
		function eliminarCuentaUsuario() {

			$scope.procesando = true;
			$ionicLoading.show({
				template: '<p>Espere</p><ion-spinner icon="lines"></ion-spinner>',
			});

			// Se invoca al servicio
			UsuarioService.eliminarCuentaUsuario($scope.usuario.email).then(function(response) {

				$ionicLoading.hide();
				$scope.procesando = false;
				
				// Se verifica si la cuenta fue eliminada
				if(response.success) {

					alertPopup('Notificación', 'Su cuenta ha sido borrada, espere un momento.', true);
					$timeout(function() {
						cerrarSesion();
						alert.close();
					}, 5000);
				} else {
					alertPopup('Notificación', 'Error al eliminar su cuenta.');
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