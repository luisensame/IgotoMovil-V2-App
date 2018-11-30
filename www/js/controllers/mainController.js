angular.module('mainController', ['categoriaProductoService', 'productoService'])
.controller('MainController', ['$scope', 'CategoriaProductoService', 'ProductoService',
	'SETTINGS', '$q', 'FavoritoService', 'Auth', '$rootScope', '$ionicPopup',
	'$ionicLoading', '$timeout', MainController])

function MainController($scope, CategoriaProductoService, ProductoService, SETTINGS,
	$q, FavoritoService, Auth, $rootScope, $ionicPopup, $ionicLoading, $timeout) {		

	// Variables
		var alert;

		var usuario = {};
		var configCargaProductos = {
			offSet: SETTINGS.productos.offSet,
			noElementos: SETTINGS.productos.noElementosInicial
		};

		$scope.load = true; // Se oculta el boton
		$scope.productos = [];
		$scope.palabraClave = {};
		$scope.loadProductos = false;
		$scope.totalRegistros = null;
		$scope.categoriaBuscar = null;
		$scope.catalogoCategorias = [];
		$scope.loadProductosBusqueda = false;
		//funcion que evaluara cuando la imagen del producto este cargada
		$scope.imageLoaded = imageLoaded;
		$scope.bannerShow = true;
		$scope.sliderShow = true;

		$rootScope.categoria = '1'; // Se agrega la categoria

	// Inicializacion
		init();	

	// Funciones
		
		$scope.buscarProducto = buscarProducto;
		$scope.cargarProductos = cargarProductos;
		$scope.agregarFavorito = agregarFavorito;
		$rootScope.mostrarProductos = mostrarProductos;

		function init() {

			$ionicLoading.show({
		    	template: '<p>Espere</p><ion-spinner icon="lines"></ion-spinner>',
			});

			// Se invoca a la api
			Auth.getUser().then(function(response) {

				// Se verifica si el usuario es valido
				if(response && response.usuario) {
					usuario = response.usuario;
					$rootScope.logeado = true
				}else{
					$rootScope.logeado = false
				}
			});

			$scope.loadProductos = true;
			obtenerTotalProductos();
			findCategoriasProductos();
			cargarProductos()
		}

		// Funcion que obtiene la lista de productos
		function obtenerListaProductos(data) {

			// Se invoca al servicio
			ProductoService.obtenerListaProductos(data).then(function(response) {

				$scope.load = false; // Se oculta el boton
				$ionicLoading.hide(); // Se finaliza el loading

				// Se finaliza el scroll infinito
				$scope.$broadcast('scroll.infiniteScrollComplete');

				// Se verifica si no ocurrio un error
				if(response && response.success) {

					// Se verifica si existen productos
					if(response.productos) {
						$scope.productos.push.apply($scope.productos, response.productos);
					} else {
						$scope.loadProductos = false;
						//alertPopup('Notificación', 'Aún no hay productos registrados');
					}
				} else {
					$scope.loadProductos = false;
					alertPopup('Notificación', 'Ocurrio un error al conectarse con nuestros servicios');
				}
			});
		}

		// Funciton que obtien el total de productos
		function obtenerTotalProductos() {

			var defered = $q.defer();
			var promesa = defered.promise;

			// Se invoca al servicio
			ProductoService.obtenerTotalProductos().then(function(response) {

				$scope.totalRegistros = 0; // Se pasa el numero de regisros por default

				// Se verifica si no ocurrio un error
				if(response && response.success) {

					// Se verifica si existen productos
					if(response.totalRegistros > 0) {
						$scope.totalRegistros = response.totalRegistros;
					} else {
						$scope.loadProductos = false;
						$scope.$broadcast('scroll.infiniteScrollComplete');
						$scope.load = false; // Se oculta el boton
						$ionicLoading.hide(); // Se finaliza el loading
						alertPopup('Notificación', 'Aún no hay productos registrados');
					}
				} else {
					$scope.loadProductos = false;
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.load = false; // Se oculta el boton
					$ionicLoading.hide(); // Se finaliza el loading
					alertPopup('Notificación', 'Ocurrio un error al conectarse con nuestros servicios');
				}

				defered.resolve($scope.totalRegistros);
			});

			return promesa;
		}

		// Funcion que obtiene la lista de productos en oferta
		function obtenerListaProductosDestacados(data) {

			// Se invoca al servicio
			ProductoService.obtenerListaProductosDestacados(data).then(function(response) {

				$scope.load = false; // Se oculta el boton
				$ionicLoading.hide(); // Se finaliza el loading

				// Se finaliza el scroll infinito
				$scope.$broadcast('scroll.infiniteScrollComplete');

				// Se verifica si no ocurrio un error
				if(response && response.success) {

					// Se verifica si existen productos
					if(response.productos) {
						$scope.productos.push.apply($scope.productos, response.productos);
					} else {
						$scope.load = false; // Se oculta el boton
						$ionicLoading.hide(); // Se finaliza el loading
						$scope.loadProductos = false;
						//alertPopup('Notificación', 'Aún no hay productos registrados');
					}
				} else {
					$scope.load = false; // Se oculta el boton
					$ionicLoading.hide(); // Se finaliza el loading
					$scope.loadProductos = false;
					alertPopup('Notificación', 'Ocurrio un error al conectarse con nuestros servicios');
				}
			});
		}

		// Funcion que obtiene la lista de productos en oferta
		function obtenerListaProductosOferta(data) {

			// Se invoca al servicio
			ProductoService.obtenerListaProductosOferta(data).then(function(response) {

				$scope.load = false; // Se oculta el boton
				$ionicLoading.hide(); // Se finaliza el loading

				// Se finaliza el scroll infinito
				$scope.$broadcast('scroll.infiniteScrollComplete');

				// Se verifica si no ocurrio un error
				if(response && response.success) {

					// Se verifica si existen productos
					if(response.productos) {
						$scope.productos.push.apply($scope.productos, response.productos);
					} else {
						$scope.load = false; // Se oculta el boton
						$ionicLoading.hide(); // Se finaliza el loading
						$scope.loadProductos = false;
						//alertPopup('Notificación', 'Aún no hay productos registrados');
					}
				} else {
					$scope.load = false; // Se oculta el boton
					$ionicLoading.hide(); // Se finaliza el loading
					$scope.loadProductos = false;
					alertPopup('Notificación', 'Ocurrio un error al conectarse con nuestros servicios');
				}
			});
		}

		// Funciton que obtien el total de productos
		function obtenerTotalProductosOfertas() {

			var defered = $q.defer();
			var promesa = defered.promise;

			// Se invoca al servicio
			ProductoService.obtenerTotalProductosOfertas().then(function(response) {

				$scope.totalRegistros = 0; // Se pasa el numero de regisros por default

				// Se verifica si no ocurrio un error
				if(response && response.success) {

					// Se verifica si existen productos
					if(response.totalRegistros > 0) {
						$scope.totalRegistros = response.totalRegistros;
					} else {
						$scope.loadProductos = false;
						$scope.$broadcast('scroll.infiniteScrollComplete');
						$scope.load = false; // Se oculta el boton
						$ionicLoading.hide(); // Se finaliza el loading
						//alertPopup('Notificación', 'Aún no hay productos de ofertas registrados');
					}
				} else {
					$scope.loadProductos = false;
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.load = false; // Se oculta el boton
					$ionicLoading.hide(); // Se finaliza el loading
					alertPopup('Notificación', 'Ocurrio un error al conectarse con nuestros servicios');
				}

				defered.resolve($scope.totalRegistros);
			});

			return promesa;
		}

		// Funciton que obtien el total de productos
		function obtenerTotalProductosBusquedaRecientes() {

			// Se obtiene los datos de la sesion
			var busquedaRecientes = sessionStorage.getItem('busqueda');

			// Se verifica si existe la sesion
			if(busquedaRecientes) {
				// Se convierte a un objeto json
				busquedaRecientes = JSON.parse(busquedaRecientes);
				$scope.totalRegistros = busquedaRecientes.length;
				configCargaProductos.busqueda = busquedaRecientes;
			} else {

				$scope.load = false; // Se oculta el boton
				$ionicLoading.hide(); // Se finaliza el loading

				$scope.loadProductos = false;
				$scope.$broadcast('scroll.infiniteScrollComplete');

				// Se obtiene el total de registros
				$scope.totalRegistros = 0;
				//alertPopup('Notificación', 'No tiene productos vistos recientemente');
			}
		}

		// Funcion que obtiene la lista de productos en oferta
		function obtenerListaProductosBusqueda(data) {

			// Se invoca al servicio
			ProductoService.obtenerListaProductosBusqueda(data).then(function(response) {

				$scope.load = false; // Se oculta el boton
				$ionicLoading.hide(); // Se finaliza el loading

				// Se finaliza el scroll infinito
				$scope.$broadcast('scroll.infiniteScrollComplete');

				// Se verifica si no ocurrio un error
				if(response && response.success) {

					// Se verifica si existen productos
					if(response.productos) {
						$scope.productos.push.apply($scope.productos, response.productos);
					} else {
						$scope.load = false; // Se oculta el boton
						$ionicLoading.hide(); // Se finaliza el loading
						$scope.loadProductos = false;
						//alertPopup('Notificación', 'No tiene productos vistos recientemente');
					}
				} else {
					$scope.load = false; // Se oculta el boton
					$ionicLoading.hide(); // Se finaliza el loading
					$scope.loadProductos = false;
					alertPopup('Notificación', 'Ocurrio un error al conectarse con nuestros servicios');
				}
			});
		}

		// Funciton que obtiene las categorias
		function findCategoriasProductos() {

			// Se invoca al servicio
			CategoriaProductoService.find().then(function(response) {

				// Se obtiene la respuesta
				if (response.success) {
					$scope.catalogoCategorias = response.catalogo;	
					//console.log($scope.catalogoCategorias)			
				}
			});
		}


		// Funcion que obtiene los productos mediante una categoria
		function mostrarProductos(categoria) {

			$rootScope.categoria = categoria; // Se agrega la categoria

			$scope.load = true; // Se oculta el boton
			$scope.productos = [];
			$scope.palabraClave = {};
			$scope.loadProductos = true;
			$scope.totalRegistros = null;
			$rootScope.styleBuscar = false;
			$scope.categoriaBuscar = categoria;
			if (categoria != null) {
				$scope.bannerShow = false;
				$scope.sliderShow = false;
				$scope.productoNuevo = {
					"padding-top": "60px"
				}
			}else{
				$scope.bannerShow = true;
				$scope.sliderShow = true;
				$scope.productoNuevo = {
					padding: "5px"
				}
			}
			

			configCargaProductos = {
				offSet: SETTINGS.productos.offSet,
				noElementos: SETTINGS.productos.noElementosInicial
			};

			$ionicLoading.show({
		    	template: '<p>Espere</p><ion-spinner icon="lines"></ion-spinner>',
			});

			cargarProductos();
		}

		// Funcion que obtiene el total de productos por categoria
		function obtenerTotalProductosCategoria(idCategoria) {

			var defered = $q.defer();
			var promesa = defered.promise;

			// Se invoca al servicio
			ProductoService.obtenerTotalProductosCategoria(idCategoria).then(function(response) {

				$scope.totalRegistros = 0; // Se pasa el numero de regisros por default

				// Se verifica si no ocurrio un error
				if(response && response.success) {

					// Se verifica si existen productos
					if(response.totalRegistros > 0) {
						$scope.totalRegistros = response.totalRegistros;
					} else {
						$scope.loadProductos = false;
						$scope.$broadcast('scroll.infiniteScrollComplete');
						$scope.load = false; // Se oculta el boton
						$ionicLoading.hide(); // Se finaliza el loading
						//alertPopup('Notificación', 'Aún no hay productos en la categoria seleccionada');
					}
				} else {
					$scope.loadProductos = false;
					$scope.$broadcast('scroll.infiniteScrollComplete');
					$scope.load = false; // Se oculta el boton
					$ionicLoading.hide(); // Se finaliza el loading
					alertPopup('Notificación', 'Ocurrio un error al conectarse con nuestros servicios');
				}

				defered.resolve($scope.totalRegistros);
			});

			return promesa;
		}

		// Funcion que obtiene la lista de productos en oferta
		function obtenerListaProductosCategoria(data) {

			// Se pasa la categoria
			data.idCategoria = $scope.categoriaBuscar;

			// Se invoca al servicio
			ProductoService.obtenerListaProductosCategoria(data).then(function(response) {

				$scope.load = false; // Se oculta el boton
				$ionicLoading.hide(); // Se finaliza el loading

				// Se finaliza el scroll infinito
				$scope.$broadcast('scroll.infiniteScrollComplete');

				// Se verifica si no ocurrio un error
				if(response && response.success) {

					// Se verifica si existen productos
					if(response.productos) {
						$scope.productos.push.apply($scope.productos, response.productos);
					} else {
						$scope.load = false; // Se oculta el boton
						$ionicLoading.hide(); // Se finaliza el loading
						$scope.loadProductos = false;
						//alertPopup('Notificación', 'No tiene productos vistos recientemente');
					}
				} else {
					$scope.load = false; // Se oculta el boton
					$ionicLoading.hide(); // Se finaliza el loading
					$scope.loadProductos = false;
					alertPopup('Notificación', 'Ocurrio un error al conectarse con nuestros servicios');
				}
			});
		}

		// Funciton que carga mas productos
		function cargarProductos() {

			$timeout(function() {

				// Se verifica si el total de registros es null
				if($scope.totalRegistros == null) {

					// Se verifica si se obtiene todos los productos
					if($scope.categoriaBuscar == null || $scope.categoriaBuscar == '1') {

						// Se obtene el total de productos
						obtenerTotalProductos().then(function(response) {
							calcular();
						});
					}

					// Se verifica si obtiene solo los productos de oferta
					else if($scope.categoriaBuscar == '2') {

						// Se obtene el total de productos
						obtenerTotalProductosOfertas().then(function(response) {
							calcular();
						});
					}

					// Se verifica si la categoria a buscar es busquedas recientes
					else if($scope.categoriaBuscar == '3') {
						obtenerTotalProductosBusquedaRecientes();
						calcular();
					} else {

						// Se obtene el total de productos
						obtenerTotalProductosCategoria($scope.categoriaBuscar).then(function(response) {
							calcular();
						});
					}
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

				switch($scope.categoriaBuscar) {
					case null:
						//console.log('Se ordena por fecha');
						obtenerListaProductos(configCargaProductos);
						break;
					case '1':
						//console.log('Se ordena por destacados');
						obtenerListaProductosDestacados(configCargaProductos);
						break;
					case '2':
						//console.log('Se obtienen las ofertas');
						obtenerListaProductosOferta(configCargaProductos);
						break;
					case '3':
						//console.log('Se obtienen las busqueda recientes');
						obtenerListaProductosBusqueda(configCargaProductos);
						break;
					default:
						//console.log('Se ordena por categoria');
						obtenerListaProductosCategoria(configCargaProductos);
				}

				configCargaProductos.offSet += configCargaProductos.noElementos;
			} else {
				$scope.load = false; // Se oculta el boton
				$ionicLoading.hide(); // Se finaliza el loading
				$scope.loadProductos = false;
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}
		}

		// Funcion que agrega un producto a la lista de favoritos
		function agregarFavorito(idProducto) {

			var favorito = {
				email: usuario.email,
				producto: idProducto
			};
			
			// Se invoca al servicio
			FavoritoService.agregarFavorito(favorito).then(function(response) {
				
				// Se verifica si se registro correctamente
				if(response && response.success) {
					
					// Se verifica si el producto ya esta agregado
					if(response.favorito) {
						alertPopup('Notificación', 'El producto seleccionado ya se encuentra agregado como favorito');
					} else {
						$rootScope.$emit('favoritos');
						alertPopup('Notificación', 'Agrego un nuevo producto como favorito');
					}
				} else {
					alertPopup('Notificación', 'Ocurrio un error al conectarse con nuestros servicios');
				}
			});
		}

		// Funcion que busca productos a traves de una palabra
		function buscarProducto() {

			$scope.load = true; // Se oculta el boton
			$scope.productos = [];
			$scope.totalRegistros = null;
			$scope.loadProductos = false;
			$scope.loadProductosBusqueda = false;

			configCargaProductos = {
				offSet: SETTINGS.productos.offSet,
				noElementos: SETTINGS.productos.noElementosInicial
			};

			$ionicLoading.show({
		    	template: '<p>Espere</p><ion-spinner icon="lines"></ion-spinner>',
			});

			// Funcion que obtiene el total de productos por busqueda
			obtenerTotalProductosBusqueda().then(function(response) {
				
				if(response > 0) {
					obtenerProductosBusqueda();
					$scope.loadProductosBusqueda = true;
				}
			});
		}

		// Funciton que carga mas productos
		function cargarProductosBusqueda() {

			$timeout(function() {

				// Se verifica 
				if(configCargaProductos.offSet != 0) {
					configCargaProductos.noElementos = SETTINGS.productos.noElementos;
				}

				// Se verifica si se cargan mas productos
				if(configCargaProductos.offSet < $scope.totalRegistros) {
					obtenerProductosBusqueda();
					configCargaProductos.offSet += configCargaProductos.noElementos;
				} else {
					$scope.load = false; // Se oculta el boton
					$ionicLoading.hide(); // Se finaliza el loading
					$scope.loadProductosBusqueda = false;
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
			}, 1000);
		}

		function obtenerTotalProductosBusqueda() {

			var defered = $q.defer();
			var promesa = defered.promise;

			// Se invoca al servicio
			ProductoService.obtenerTotalProductosBusqueda($scope.palabraClave.texto).then(function(response) {

				$scope.totalRegistros = 0; // Se pasa el numero de regisros por default

				// Se verifica si no ocurrio un error
				if(response && response.success) {

					// Se verifica si existen productos
					if(response.totalRegistros > 0) {
						$scope.totalRegistros = response.totalRegistros;
					} else {
						$scope.load = false; // Se oculta el boton
						$ionicLoading.hide(); // Se finaliza el loading
						$scope.loadProductosBusqueda = false;
						$scope.$broadcast('scroll.infiniteScrollComplete');
						//alertPopup('Notificación', 'Aún no hay productos relacionados con su buqueda');
					}
				} else {
					$scope.load = false; // Se oculta el boton
					$ionicLoading.hide(); // Se finaliza el loading
					$scope.loadProductosBusqueda = false;
					$scope.$broadcast('scroll.infiniteScrollComplete');
					alertPopup('Notificación', 'Ocurrio un error al conectarse con nuestros servicios');
				}

				defered.resolve($scope.totalRegistros);
			});

			return promesa;
		}

		// Funcion que obtiene los productos de busqueda
		function obtenerProductosBusqueda() {

			configCargaProductos.palabra = $scope.palabraClave.texto;

			// Se invoca el servicio
			ProductoService.obtenerProductosBusqueda(configCargaProductos).then(function(response) {

				$scope.load = false; // Se oculta el boton
				$ionicLoading.hide(); // Se finaliza el loading

				// Se finaliza el scroll infinito
				$scope.$broadcast('scroll.infiniteScrollComplete');

				if((configCargaProductos.offSet +   configCargaProductos.noElementos) >= $scope.totalRegistros) {
					$scope.loadProductosBusqueda = false;
				}

				// Se verifica si no ocurrio un error
				if(response && response.success) {

					// Se verifica si existen productos
					if(response.productos) {
						$scope.productos.push.apply($scope.productos, response.productos);
					} else {
						$scope.load = false; // Se oculta el boton
						$ionicLoading.hide(); // Se finaliza el loading
						$scope.loadProductosBusqueda = false;
						//alertPopup('Notificación', 'Aún no hay productos relacionados con su buqueda');
					}
				} else {
					$scope.load = false; // Se oculta el boton
					$ionicLoading.hide(); // Se finaliza el loading
					$scope.loadProductosBusqueda = false;
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

		/**
		 * //funcion que evaluara cuando la imagen del producto este cargada
		 * @param  {Object JSON} object objeto(JSON)		 
		 */
		function imageLoaded(object){
		  	object.loaded = true;
		}
}