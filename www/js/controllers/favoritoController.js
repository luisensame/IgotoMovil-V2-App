angular.module('favoritoController', ['favoritoService'])
.controller('FavoritoController', ['$scope', 'FavoritoService','$ionicLoading',
	'Auth', '$ionicPopup', 'SETTINGS', '$timeout', '$q', '$rootScope', FavoritoController])

// Controlador
function FavoritoController($scope, FavoritoService, $ionicLoading, Auth,
	$ionicPopup, SETTINGS, $timeout, $q, $rootScope) {

	// Variables
		
		var alert;
		var configCargaProductos = {
			offSet: SETTINGS.productos.offSet,
			noElementos: SETTINGS.productos.noElementosInicial
		};

		$scope.load = true;
		$scope.favoritos = [];
		$scope.totalRegistros = 0;
		$scope.loadProductos = false;

	// Inicializacion
		init();

	// Funciones
		
		$scope.cargarProductos = cargarProductos;
		$scope.eliminarFavorito = eliminarFavorito;

		function init() {

			$ionicLoading.show({
				template: '<p>Espere</p><ion-spinner icon="lines"></ion-spinner>',
			});

			// Se invoca a la api
			Auth.getUser().then(function(response) {

				// Se verifica si el usuario es valido
				if(response && response.usuario) {
					configCargaProductos.email = response.usuario.email;
					obtenerTotalFavoritos(response.usuario.email);
				}
			});
		}

		// Funcion que obtiene el total de productos
		function obtenerTotalFavoritos(email) {

			var defered = $q.defer();
			var promesa = defered.promise;

			// Se invoca al servicio
			FavoritoService.obtenerTotalFavoritos(email).then(function(response) {

				$scope.totalRegistros = 0; // Se pasa el numero de regisros por default
				
				// Se verifica si no ocurrio un error
				if(response.success) {

					// Se verifica si existen productos
					if(response.total > 0) {
						$scope.loadProductos = true;
						$scope.totalRegistros = response.total;
					} else {
						$scope.load = false; // Se oculta el boton
						$ionicLoading.hide(); // Se finaliza el loading
						$scope.loadProductos = false;
						$scope.$broadcast('scroll.infiniteScrollComplete');
						//alertPopup('Notificación', 'Aún no hay productos registrados');
					}
				} else {
					$scope.load = false; // Se oculta el boton
					$ionicLoading.hide(); // Se finaliza el loading
					$scope.loadProductos = false;
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$ionicLoading.show({
						template: '<p>Espere</p><ion-spinner icon="lines"></ion-spinner>',
					});

					alertPopup('Notificación', 'Ocurrio un error al conectarse con nuestros servicios');
				}

				defered.resolve($scope.totalRegistros);
			});

			return promesa;
		}

		// Funcion que obtiene la lista de productos
		function obtenerFavoritos(data) {

			// Se invoca al servicio
			FavoritoService.obtenerFavoritos(data).then(function(response) {
				
				$scope.load = false; // Se oculta el boton
				$ionicLoading.hide(); // Se finaliza el loading

				// Se finaliza el scroll infinito
				$scope.$broadcast('scroll.infiniteScrollComplete');

				// Se verifica si no ocurrio un error
				if(response && response.success) {

					// Se verifica si existen productos
					if(response.favoritos) {
						$scope.favoritos.push.apply($scope.favoritos, response.favoritos);
					} else {
						$scope.loadProductos = false;
						//alertPopup('Notificación', 'Aún no tiene productos como favoritos');
					}
				} else {
					$scope.loadProductos = false;
					alertPopup('Notificación', 'Ocurrio un error al conectarse con nuestros servicios');
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

		// Funciton que carga mas productos
		function cargarProductos() {

			$timeout(function() {

				// Se verifica si el total de registros es null
				if($scope.totalRegistros == null) {

					// Se obtene el total de productos
					obtenerTotalProductos().then(function(response) {
						calcular();
					});
				} else {
					calcular();
				}
			}, 1000);
		}

		function calcular() {

			// Se verifica 
			if(configCargaProductos.offSet != 0) {
				configCargaProductos.noElementos = SETTINGS.productos.noElementos;
			}

			// Se verifica si se cargan mas productos
			if(configCargaProductos.offSet < $scope.totalRegistros) {
				obtenerFavoritos(configCargaProductos);
				configCargaProductos.offSet += configCargaProductos.noElementos;
			} else {
				$scope.load = false; // Se oculta el boton
				$ionicLoading.hide(); // Se finaliza el loading
				$scope.loadProductos = false;
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}
		}

		function eliminarFavorito(f) {

			$ionicLoading.show({
				template: '<p>Espere</p><ion-spinner icon="lines"></ion-spinner>',
			});

			// Se invoca al servicio
			FavoritoService.eliminarFavorito(f._id).then(function(response) {

				$ionicLoading.hide(); // Se finaliza el loading

				// Se verifica si no ocurrio un error
				if(response && response.success) {
					
					$scope.load = true;
					$rootScope.$emit('favoritos');
					alertPopup('Notificación', 'El producto fue eliminado correctamente de favoritos');
					// Se reinicia la configuracion
					configCargaProductos = {
						email: f.email,
						offSet: SETTINGS.productos.offSet,
						noElementos: SETTINGS.productos.noElementosInicial
					};
					
					// Se invoca al metodo
					obtenerTotalFavoritos(f.email).then(function(response) {

						$scope.favoritos = [];
						$scope.totalRegistros = response;

						// Se verifica si el valor es mayor que cero
						if(response > 0) {
							cargarProductos();
						} else {
							$ionicLoading.hide(); // Se finaliza el loading
						}
					});
					
				} else {
					alertPopup('Notificación', 'Ocurrio un error al eliminar el producto de favoritos');
				}
			});
		}
}