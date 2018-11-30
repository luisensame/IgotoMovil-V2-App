'use strict';
angular.module('productoController', ['productoService', 'favoritoService', 'reseniaService'])
.controller('ProductoController', ['$scope', '$rootScope', '$stateParams',
	'ProductoService', '$ionicPopup', 'FavoritoService', 'Auth',
	'$state', 'ReseniaService', 'SETTINGS', '$ionicPopover', ProductoController])

function ProductoController($scope, $rootScope, $stateParams, ProductoService,
	$ionicPopup, FavoritoService, Auth, $state, ReseniaService, SETTINGS, $ionicPopover) {

	// Variables
		var usuario = {};
		var selectedCaracteriticas = [];

		$scope.slide = {};
		$scope.producto = {};
		$scope.listaResenia = [];
		$scope.selectedColor = null; //propiedades para agregar al carrito
		$scope.mostrarMasResenias = true;
		$scope.resenia = SETTINGS.resenia; // Configuracion de resenias

		//JSON que obtendra el numero de piezas seleccionadas por el usuario
		$scope.selectPiezas = {
			noPiezas: 1
		};

		//popover que notifica variedad de piezas
		$ionicPopover.fromTemplateUrl('notificacion_variedad.html', {
	    	scope: $scope	    	
	  	}).then(function(popover) {
	    	$scope.popover = popover;
	  	});

	// Metodos
		$scope.addColor = addColor;
		$scope.obtenerNombre = obtenerNombre;
		$scope.agregarCarrito = agregarCarrito;
		$scope.agregarFavorito = agregarFavorito;
		$scope.addCaracteristica = addCaracteristica;
		$scope.obtenerCalificacion = obtenerCalificacion;
		$scope.notificacionPiezas = notificacionPiezas;

	// Inicializacion
		init();

	// Funciones
		function init() {

			// Se obtiene el parametro id
			var idProducto = $stateParams.id;

			// Se verifica si existe el parametros
			if(idProducto) {

				configuracionSlider();
				obtenerListaResenia(idProducto);
				obtenerProductoPorId(idProducto); // Se consulta el producto
				agregarBusquedaReciente(idProducto); // Se agrega el producto a busqueda recientes

				//Se consultan los datos del usuario en sesion
				Auth.getUser().then(function(response) {
					// Se verifica si el usuario es valido
					if(response && response.usuario) {
						usuario = response.usuario;
					}
				});
			}
		}

		// Funcion que agrega el id al array de busqueda recientes
		function agregarBusquedaReciente(idProducto) {

			// Se obtiene los datos de la sesion
			var busquedaRecientes = sessionStorage.getItem('busqueda');

			// Se verifica si existe la sesion
			if(busquedaRecientes) {

				// Se convierte a un objeto json
				busquedaRecientes = JSON.parse(busquedaRecientes);

				// Se verifica si el id no existe se agrega a la lista
				if(!existeIdProducto(idProducto, busquedaRecientes)) {
					busquedaRecientes.push(idProducto);
					actualizarVisitaProducto(idProducto);
				}
			} else {
				busquedaRecientes = [idProducto];
				actualizarVisitaProducto(idProducto);
			}
			
			sessionStorage.setItem('busqueda', JSON.stringify(busquedaRecientes));
		}

		// Funcion que verifica si existe el id del producto
		// en el array
		function existeIdProducto(idProducto, busquedaRecientes) {

			// Se itera la lista
			for(var i = 0; i < busquedaRecientes.length; i++) {

				// Se verifica si el id existe
				if(busquedaRecientes[i] == idProducto) {
					return true;
				}
			}

			return false;
		}

		// Funcion que obtiene la informacion del producto
		function obtenerProductoPorId(idProducto) {

			// Se invoca el servicio
			ProductoService.obtenerProductoPorId(idProducto)
			.then(function(res) {

				// Se verifica si no ocurrio un error
				if (res && res.success) {					
					return $scope.producto = res.producto;
				}

				return alertPopup('Notificación', 'Ocurrio un error al visualizar este producto, por favor intentalo nuevamente.');
			}, function (err) {
				return alertPopup('Notificación', err.message || 'Error interno, por favor intentalo más tarde.');
			});
		}

		// Funcion que actualiza el numero de visitas de un producto
		function actualizarVisitaProducto(idProducto) {

			// Se invoca al servicio
			ProductoService.actualizarVisitaProducto(idProducto).then(function(response) {
				//console.log('response', response);
			});
		}

		// Funcion que agrega un producto a la lista de favoritos
		function agregarFavorito() {

			var favorito = {
				email: usuario.email,
				producto: $scope.producto._id
			};			
			
			// Se invoca al servicio
			FavoritoService.agregarFavorito(favorito).then(function(response) {
				
				// Se verifica si se registro correctamente
				if(response && response.success) {
					
					// Se verifica si el producto ya esta agregado
					if(response.favorito) {
						alertPopup('Notificación', 'Este producto ya se encuentra como favorito.');
					} else {
						$rootScope.$emit('favoritos');
						alertPopup('Notificación', 'Producto agregado como favorito.');
					}
				} else {
					alertPopup('Notificación', 'Ocurrio un error al conectarse con nuestros servicios, inténtalo más tarde');
				}
			});
		}

		/**
		 * Funcion que agrega un producto al carrito de compras		 
		 */
		function agregarCarrito(flagCompra){
			//Si el producto no tiene piezas disponibles
			if ($scope.producto.piezasDisponibles <= 0) {
				//notifica cuando el producto se encuentra agotado ya que no tiene piezas disponibles
				return alertPopup('Producto agotado', 'Lo sentimos este producto se encuentra agotado.');
			}
			
			//Si el producto cuenta con colores y no se ha seleccionado alguno
			if ($scope.producto.colores.length > 0 && !$scope.selectedColor) {
				//notifica que seleccione algun color
				return alertPopup('Notificación', 'Selecciona el color de tu preferencia para el producto.');
			}			
			
			//Si el producto cuenta con caracterisiticas
			if ($scope.producto.caracteristicas.length > 0) {
				//Se verifica que todas hayan sido seleccionadas
				var longitud = $scope.producto.caracteristicas.length;
				if (longitud !== selectedCaracteriticas.length) {					
					return alertPopup('Notificación', 'Selecciona las caracterisiticas para tu producto.');
				}
			}

			//Se crea el objeto producto para el carrito
			var productItem = {
				_id: $scope.producto._id,
				color: $scope.selectedColor,
				caracteristicas: selectedCaracteriticas,
				noPiezas: $scope.selectPiezas.noPiezas
			};			

			//Se agrega el producto al carrito
			var productosCarrito = JSON.parse(localStorage.getItem('productos_carrito')) || [];
				productosCarrito.push(productItem);
				localStorage.setItem('productos_carrito', JSON.stringify(productosCarrito));
			alertPopup('Notificación', 'Su producto ha sido agregado exitosamente al carrito');
			//Se redirecciona a la seccion de caja
			if (flagCompra) {
				$state.go('app.caja');
			}
		}

		/**
		 * Funcion que agrega el color seleccionado
		 * @param {String} color seleccionado para el producto del carrito
		 */
		function addColor(color){			
			$scope.selectedColor = color;			
		}

		/**
		 * Funcion que agrega la caracteristica seleccionada para el producto del carrito
		 * @param {String} caracteristica nombre
		 * @param {String} valor          Valor de la caracteristica seleccionada
		 */
		function addCaracteristica(caracteristica, valor){
			//flag para corroborar si la caracteristica ya ha sido agregada
			var exist = false;
			//Se itera sobre las caracteristicas
			for(var i in selectedCaracteriticas){
				//Si existe la caracteristica
				if (selectedCaracteriticas[i].caracteristica === caracteristica) {
					//Se actualiza su valor y la bandera cambia a true de que existe
					selectedCaracteriticas[i].valor = valor;
					exist = true;
					break;
				}
			}
			//Si la caracteristica no existe
			if (!exist) {
				//Se agrega la caracteristica nueva
				selectedCaracteriticas.push({caracteristica: caracteristica, valor: valor});
			}
		}

		// Funcion que muestra un pop
		function alertPopup(title, template, success) {

			var options = {title: title, template: template};
			
			if(!success) {
				options.buttons = [{ text: 'Entendido <i class="ion-android-done"></i>', type: 'button-positive' }];
			}
			
			$ionicPopup.show(options);
		}

		// Funcion que obtiene 10 reseñas ordenadas por fecha
		function obtenerListaResenia(idProducto) {

			// Se invoca el servicio
			ReseniaService.obtenerListaResenia(idProducto).then(function(response) {
				
				// Se verifica si la peticion fue correcta
				if(response.success) {
					$scope.listaResenia = response.listaResenia;
				}
			});
		}

		function obtenerCalificacion(calificacion) {
			return new Array(calificacion);
		}

		function obtenerNombre(usuario) {

			if(!usuario.nombreCompleto && !usuario.apellidos) {
				return usuario.email;
			}

			return usuario.nombreCompleto + ' ' + usuario.apellidos;
		}

		function configuracionSlider() {

			$scope.slide.currentPage = 0;
			$scope.slide.options = {
				initialSlide: 0,
				direction: 'horizontal', //or vertical
				speed: 300, //0.3s transition
				showPager: false
			};

			//create delegate reference to link with slider
			$scope.slide.delegate = null;

			//watch our sliderDelegate reference, and use it when it becomes available
			$scope.$watch('slide.delegate', function(newVal, oldVal) {
				if (newVal != null) {
					$scope.slide.delegate.on('slideChangeEnd', function() {
					$scope.slide.currentPage = $scope.slide.delegate.activeIndex;
						//use $scope.$apply() to refresh any content external to the slider
						$scope.$apply();
					});
				}
			});
		}

		function notificacionPiezas($event){
			//Si el usuario selecciona mas de dos piezas y el producto tiene variedad de colores y caracteristicas
			if ($scope.selectPiezas.noPiezas > 1 && ( ($scope.producto.colores && $scope.producto.colores.length > 0) || ($scope.producto.caracteristicas && $scope.producto.caracteristicas.length > 0) ) ) {
				//console.log('show modal');
				//Se muestra modal
				$scope.popover.show($event);
			}
		}
}