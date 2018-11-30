angular.module('starter.controllers', ['registroController', 'loginController', 
	'mainController', 'perfilController', 'favoritoController', 'misComprasController', 
	'contraseniaController', 'productoController', 'favoritoService', 'cajaController'])

.controller('AppController', ['$rootScope', '$scope', '$state', 'Auth', 'SETTINGS', 'CategoriaProductoService',
	'FavoritoService', '$cordovaSocialSharing', '$ionicPopup', AppController]);

function AppController($rootScope, $scope, $state, Auth, SETTINGS, CategoriaProductoService, FavoritoService,
	$cordovaSocialSharing, $ionicPopup) {

	// Variables
		var alert;

		$scope.totalFavoritos = 0;
		$rootScope.styleBuscar = false;
		$rootScope.showBusqueda = true;
		$rootScope.showCloseSearch = false;
		$scope.showHombresList = false
		$scope.showHombresList = false
		
		$scope.showListHombres = showListHombres
		$scope.showListMujeres = showListMujeres

		function showListHombres() {
			if ($scope.showHombresList == true) {
				$scope.showHombresList = false
				return false
			}else{
				$scope.showHombresList = true
				return true
			}
		}
		function showListMujeres() {
			if ($scope.showMujeresList == true) {
				$scope.showMujeresList = false
			}else{
				$scope.showMujeresList = true
			}
		}
	// Init
		init();

	// Eventos
		$rootScope.$on('favoritos', function(event, data) {
			init();
		});

		$rootScope.$on('actualizaPerfil', function(event, data) {

			// Se invoca a la api
			Auth.getUser().then(function(response) {

				// Se verifica si el usuario es valido
				if(response && response.usuario) {

					// Se obtiene el los datos del usuario
					$scope.usuario = response.usuario;
					
					// Se verifica si existe el nobre
					if($scope.usuario.nombreCompleto) {
						$scope.usuario.nombreCompleto += ' ' + $scope.usuario.apellidos;
					}

					// Se verifica si tiene una imagen
					if(!$scope.usuario.imagen) {
						$scope.usuario.imagen = 'img/avatar.jpg';
					}
				}
			});
		});

	// Funciones
		
		$scope.compartir = compartir;
		$scope.mostrarBuscador = mostrarBuscador;		
		$rootScope.goNoRegister = goNoRegister
		$rootScope.goRegister = goRegister

		//Acordeon para formas de pago
		$scope.toggleGroup = function(group) {
			if ($scope.isGroupShown(group)) {
		      $scope.shownGroup = null;
		    } else {
		    	$scope.shownGroup = group;
		    }
		};
		$scope.isGroupShown = function(group) {
		    return $scope.shownGroup === group;
		};
		function goNoRegister() {
			$rootScope.logeado = false
			$state.go("app.main")
		}
		function goRegister() {
			$rootScope.logeado = true
			//$state.go("app.main")
		}
		function init() {

			// Se invoca a la api
			Auth.getUser().then(function(response) {

				// Se verifica si el usuario es valido
				if(response && response.usuario) {
					obtenerTotalFavoritos(response.usuario.email);
				}
			});
			// Se invoca al servicio
			CategoriaProductoService.find().then(function(response) {

				// Se obtiene la respuesta
				if (response.success) {
					$scope.catalogoCategorias = response.catalogo;				
				}
			});
		}
		// Funcion para mostrar el buscador
        function mostrarBuscador(display) {
            $rootScope.styleBuscar = display;
            //$rootScope.showCloseSearch = true 
            if ($rootScope.showCloseSearch === true) {
                $rootScope.showCloseSearch = false
            }else{
                if ($rootScope.showCloseSearch === false) {
                    $rootScope.showCloseSearch = true
                }
            }
        }

		// Funcion para compartir
		function compartir() {

			// Se construye la url
			var url = SETTINGS.facebook.app.url;
			
			$cordovaSocialSharing.shareViaFacebook('', '', url).then(function(result) {
				//console.log('result', result);
			}, function(err) {
				//console.log('err', err);
				alertPopup('Notificación', 'Para compartir es necesario tener instalada la app de Facebook');
			});
		}

		// // Funcion para mostrar el buscador
		// function mostrarBuscador(display) {
		// 	$rootScope.styleBuscar = display;
		// }

		// Funcion que obtiene el total de productos favoritos
		function obtenerTotalFavoritos(email) {
			
			// Se invoca el servicio
			FavoritoService.obtenerTotalFavoritos(email).then(function(response) {

				// Se verifica si se obtiene el total
				if(response && response.success) {
					$scope.totalFavoritos = response.total || 0;
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

	// Se verifica si un usuario  esta logeado en todas las request
	/*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

		// Verificar si el usuario esta autenticado
		var loggedIn = Auth.isLoggedIn();

        // Se verifica si es un path restringido
		if(toState.isLogin) {

			$rootScope.showBusqueda = toState.showBusqueda;

			// Se verifica si el usuario no se encuentra autentificado
			if(!loggedIn) {
				$state.go('login');
				event.preventDefault();
			} else {

				// Se invoca a la api
				Auth.getUser().then(function(response) {

					// Se verifica si el usuario es valido
					if(response && response.usuario) {

						// Se obtiene el los datos del usuario
						$scope.usuario = response.usuario;
						
						// Se verifica si existe el nobre
						if($scope.usuario.nombreCompleto) {
							$scope.usuario.nombreCompleto += ' ' + $scope.usuario.apellidos;
						}

						// Se verifica si tiene una imagen
						if(!$scope.usuario.imagen) {
							$scope.usuario.imagen = 'img/avatar.jpg';
						}
					} else {
						Auth.saveToken();
						$state.go('login');
					}
				});
			}
		} else if(loggedIn) {
			$state.go('app.main');
			event.preventDefault();
		}
	});*/

	// Se verifica si un usuario  esta logeado en todas las request
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

		// Verificar si el usuario esta autenticado
		var loggedIn = Auth.isLoggedIn();
		if ($rootScope.logeado == false) {
			//console.log("here2")
			//$state.go('app.main');
		}else{
			// Se verifica si es un path restringido
			if(toState.isLogin) {
				//console.log("here")
				if ($rootScope.logeado == false) {
					//console.log("here2")
					//$state.go('app.main');
				}
				$rootScope.showBusqueda = toState.showBusqueda;

				// Se verifica si el usuario no se encuentra autentificado
				if(!loggedIn) {
					$state.go('login');
					event.preventDefault();
				} else {

					// Se invoca a la api
					Auth.getUser().then(function(response) {

						// Se verifica si el usuario es valido
						if(response && response.usuario) {

							// Se obtiene el los datos del usuario
							$scope.usuario = response.usuario;
							
							// Se verifica si existe el nobre
							if($scope.usuario.nombreCompleto) {
								$scope.usuario.nombreCompleto += ' ' + $scope.usuario.apellidos;
							}

							// Se verifica si tiene una imagen
							if(!$scope.usuario.imagen) {
								$scope.usuario.imagen = 'img/avatar.jpg';
							}
						} else {
							Auth.saveToken();
							$state.go('login');
						}
					});
				}
			} else if(loggedIn) {
				if ($rootScope.logeado = false) {

				}else{

					$state.go('app.main');
					event.preventDefault();
				}
			}
		}
        
	});
}