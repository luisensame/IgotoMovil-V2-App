angular.module('cajaController', ['productoService', 'catalogoMetodosPagoService',
	'catalogoEstadoService', 'pedidoService', 'conektaService', 'usuarioService', 'mercadoPagoService'])

.controller('CajaController', ['$scope', 'ProductoService', '$ionicPopup',
	'$ionicLoading', 'MetodosPagoService', 'Auth', 'CatalogoEstadoService',
	'PedidoService', '$state', '$timeout', 'ConektaService', 'UsuarioService','mercadoPagoService', '$ionicHistory',
	CajaController]);

function CajaController($scope, ProductoService, $ionicPopup, $ionicLoading, MetodosPagoService,
	Auth, CatalogoEstadoService, PedidoService, $state, $timeout, ConektaService, UsuarioService, mercadoPagoService, $ionicHistory) {

	// Variables
		var alert = null;
		var productos = [];

		$scope.anios = [];
		$scope.load = true;
		$scope.pedido = {}; //objeto que contendra la informacion del pedido a comprar
		$scope.usuario = {};
		$scope.tarjeta = {}; // Informacion de la tarjeta
		$scope.totalPagar = 0;
		$scope.listaEstado = [];
		$scope.listaProductos = [];
		$scope.listaMetodosPago = [];
		$scope.procesarCompra = false;
		$scope.isPrimeraCompra = true;
		
	// Inicializacion
		init();

	// Funciones
		$scope.realizarPago = realizarPago;
		$scope.eliminarProducto = eliminarProducto;
		
		function init() {

			$ionicLoading.show({
				template: '<p>Espere</p><ion-spinner icon="lines"></ion-spinner>',
			});

			$scope.totalPagar = 0;
			$scope.listaProductos = [];
			var anioActual = new Date().getFullYear();

			// Se itera 
			for(var i = 0; i < 10;i++) {
				$scope.anios.push(anioActual++);
			}
			
			findAllEstado(); // Se obtiene la lista de estados
			findAllMetodosPago(); // Se obtiene la lista de metodos de pago
			obtenerDatosUsuario(); // Se obtiene la informacion del usuario

			// Se verifica si existen productos para efectuar el pago
			if(localStorage.getItem('productos_carrito')) {

				// Se recupera la lista de productos a pagar
				productos = JSON.parse(localStorage.getItem('productos_carrito'));

				// Se verifica si el tamanio de la lista es mayor que 0
				if(productos.length > 0) {

					// Se itera la lista
					for(var j = 0; j < productos.length; j++) {
						obtenerListaProductos(productos[j]);						
						if((j + 1) == productos.length) {
							$scope.load = false;
							$ionicLoading.hide();
						}
					}
				} else {
					$scope.load = false;
					$ionicLoading.hide();
				}
			} else {
				$scope.load = false;
				$ionicLoading.hide();
			}
			mercadoPagoService.getHola(function (argument) {
				
			})
		}

		// Funcion que obtiene la informacion de los productos
		function obtenerListaProductos(producto) {

			// Se valida si existe al menos una caracteristica
			if(producto.caracteristicas && producto.caracteristicas.length > 0) {
				
				for(var i = 0; i < producto.caracteristicas.length; i++) {
					
					producto.caracteristicas[i] = {
						valor: producto.caracteristicas[i].valor,
						nombre: producto.caracteristicas[i].caracteristica
					};
				}
			}

			// Se invoca al servicio
			ProductoService.obtenerProductoPorId(producto._id).then(function(response) {

				// Se verifica si la respuesta fue exitosa
				if(response.success && response.producto) {
					response.producto.color = producto.color;
					response.producto.noPiezas = parseInt(producto.noPiezas);
					response.producto.caracteristicas = producto.caracteristicas;
					$scope.listaProductos.push(response.producto);
					$scope.totalPagar += (response.producto.precio * response.producto.noPiezas) + response.producto.costoEnvio;
				}
			});
		}

 		// Funcion que obtiene los datos del usuario
		function obtenerDatosUsuario() {

			// Se invoca a la api
			Auth.getUser().then(function(response) {

				// Se verifica si el usuario es valido
				if(response && response.usuario) {

					// Se obtiene el los datos del usuario
					$scope.usuario = response.usuario;
					obtenerDatosTarjeta(response.usuario.customer);
					obtenerListaProductosPorUsuario($scope.usuario._id);
				}
			});
		}

		// Se obtiene los datos de la tarjeta
		function obtenerDatosTarjeta(customer) {

			// Se verifica si existe un customer
			if(customer && customer.id) {

				// Se invoca al servicio
				UsuarioService.obtenerDatosTarjetaUsuario(customer.id).then(function(response) {

					// Se verifica si no ocurrio un error
					if(response.success && response.tarjeta) {
						$scope.tarjeta = response.tarjeta;
					}
				});
			}
		}

		// Funcion que eliminar un producto de la lista
		function eliminarProducto(idProducto) {

			// Se itera la lista
			for(var i = 0; i < productos.length; i++) {
				
				// Se verifica el id de producto
				if(productos[i]._id == idProducto) {
					productos.splice(i, 1);
					localStorage.setItem('productos_carrito', JSON.stringify(productos));
					break;
				}
			}

			init();
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
		 * Funcion que obtiene una lista de metodos de pago		 
		 */
		function findAllMetodosPago() {
			MetodosPagoService.findAll().then(function (res){				
				if (res && res.success) {
					$scope.listaMetodosPago = res.catalogo;
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

		// Se obtiene la lista de productos
		function obtenerListaProductosPorUsuario(idUsuario) {

			$scope.isPrimeraCompra = true;

			// Se invoca el servicio
			PedidoService.obtenerListaProductosPorUsuario(idUsuario).then(function(response) {
				
				// Se verifica si no currio un error y que la lista tenga mas de un pedido
				if(response.success && response.listaProductos.length > 0) {
					$scope.isPrimeraCompra = false;
				}
			});
		}

		// Funcion que evalua el tipo de pago con el que
		// realizará la transaccion
		function realizarPago() {
			if (localStorage.token == undefined) {
				//alertPopup('Notificación', "Lo sentimos para poder comprar productos en nuestra app, necesitas registrarte.")
				$ionicPopup.show({
					title: 'Notificación',
					template: 'Lo sentimos para poder comprar productos en nuestra app, necesitas registrarte.',
					buttons: [
						{
							text: '<b>registrarme</b>',
							type: 'button-positive',
							onTap: function(e) {
								$state.go('registro')
							}
						}
					]
				});
				return false
			}
			// Se verifica si es su primera compra
			if($scope.isPrimeraCompra) {

				return $ionicPopup.show({
					title: 'Confirmar pago',
					template: 'Confirme que sus datos sean correctos, en caso de no ser ' +
							  'así la empresa no se hace responsable por entregas no completadas',
					buttons: [
						{ text: 'Cancelar' },
						{
							text: '<b>Aceptar</b>',
							type: 'button-positive',
							onTap: function(e) {
								$scope.isPrimeraCompra = false;
								realizarPago();
							}
						}
					]
				});
			}
			
			$scope.pedido.monto = $scope.totalPagar;
			$scope.pedido.productos = $scope.listaProductos;
			$scope.pedido.usuario = {
				_id: $scope.usuario._id,
				email: $scope.usuario.email,
				apellidos: $scope.usuario.apellidos || $scope.pedido.usuario.apellidos,
				nombreCompleto: $scope.usuario.nombreCompleto || $scope.pedido.usuario.nombreCompleto,
				direccionEnvio: {
					calle: $scope.usuario.direccionEnvio.calle || $scope.pedido.usuario.direccionEnvio.calle,
					estado: $scope.usuario.direccionEnvio.estado || $scope.pedido.usuario.direccionEnvio.estado,
					telefono: $scope.usuario.direccionEnvio.telefono || $scope.pedido.usuario.direccionEnvio.telefono,
					municipio: $scope.usuario.direccionEnvio.municipio || $scope.pedido.usuario.direccionEnvio.municipio,
					numero: $scope.usuario.direccionEnvio.numero || $scope.pedido.usuario.direccionEnvio.numero,
					codigoPostal: $scope.usuario.direccionEnvio.codigoPostal || $scope.pedido.usuario.direccionEnvio.codigoPostal,
				},
				customer: $scope.usuario.customer || $scope.pedido.usuario.customer,
			};

			// Se verifica el tipo de metodo de pago
			switch($scope.pedido.metodoPago) {
				case 1:

					$scope.procesarCompra = true;
					$ionicLoading.show({
						template: '<p>Espere</p><ion-spinner icon="lines"></ion-spinner>',
					});

					// Se verifica si ya tiene un token
					if(!$scope.usuario.customer || !$scope.usuario.customer.id) {

						// Se verifica si la tarjeta es valida
						var validarTarjeta = ConektaService.validarTarjeta($scope.tarjeta);
						
						// Si la tarjeta es valida
						if(validarTarjeta.success) {

							// Se invoca al servicio
							ConektaService.tokenizar($scope.tarjeta).then(function(response) {

								// Se verifica si la respuesta fue existosa
								if(response && response.success) {
									pagarTarjeta(response.token.id); // Se paga con tarjeta
								} else {
									$ionicLoading.hide();
									$scope.procesarCompra = false;
									alertPopup('Notificación', response.message || 'Ocurrio un error al validar la tarjeta');
								}
							});
						} else {
							$ionicLoading.hide();
							$scope.procesarCompra = false;
							alertPopup('Notificación', validarTarjeta.descripcion);
						}
					} else {
						pagarTarjeta(); // Se paga con tarjeta
					}

					break;
				case 2:
					pagarTransferencia();
					break;
				case 3:
					pagarEnEfectivo();
					break;
				case 4: 
					prepago();
					break;
				case 5:
					prepago();
					break;
				default:
					alertPopup('Notificación', 'Seleccione un método de pago.');
			}
		}

		// Se paga mediante el metodo de pago por Oxxo
		function pagarEnEfectivo() {

			$scope.procesarCompra = true;
			$ionicLoading.show({
				template: '<p>Espere</p><ion-spinner icon="lines"></ion-spinner>',
			});
			
			// Se invoca al servicio
			PedidoService.registrarPedidoEfectivo($scope.pedido).then(function(response) {

				$ionicLoading.hide();
				$scope.procesarCompra = false;
				
				// Se verifica si la respuesta fue correcta
				if(response.success) {

					localStorage.removeItem('productos_carrito');
					alertPopup('Notificación', '¡Ya estuvo, prepárate para recibir y disfrutar!', true);

					$timeout(function() {
						alert.close();
						$ionicHistory.clearCache().then(function () {
							$state.go('app.main');
						});						
					}, 5000);
				} else {
					alertPopup('Notificación', 'Error al realizar el pago.');
				}
			});
		}

		// Funcion que realiza el pago mediante spei
		function pagarTransferencia() {

			$scope.procesarCompra = true;
			$ionicLoading.show({
				template: '<p>Espere</p><ion-spinner icon="lines"></ion-spinner>',
			});
			
			// Se invoca al servicio
			PedidoService.registrarPedidoTransferencia($scope.pedido).then(function(response) {

				$ionicLoading.hide();
				$scope.procesarCompra = false;
				
				// Se verifica si la respuesta fue correcta
				if(response.success) {

					localStorage.removeItem('productos_carrito');
					alertPopup('Notificación', '¡Ya estuvo, prepárate para recibir y disfrutar!', true);

					$timeout(function() {
						alert.close();
						$ionicHistory.clearCache().then(function () {							
							$state.go('app.main');
						});
					}, 5000);
				} else {
					alertPopup('Notificación', 'Error al realizar el pago.');
				}
			});
		}

		// Funcion que realiza el pago mediante tarjeta
		function pagarTarjeta(tokenId) {
			
			// Se invoca al servicio
			PedidoService.registrarPedidoTarjeta($scope.pedido, tokenId).then(function(response) {

				$ionicLoading.hide();
				$scope.procesarCompra = false;
				
				// Se verifica si la respuesta fue correcta
				if(response.success) {

					localStorage.removeItem('productos_carrito');
					alertPopup('Notificación', '¡Ya estuvo, prepárate para recibir y disfrutar!', true);

					$timeout(function() {
						alert.close();
						$ionicHistory.clearCache().then(function () {
							$state.go('app.main');
						});
					}, 5000);
				} else {
					alertPopup('Notificación', 'Error al realizar el pago.');
				}
			});
		}

		// Funcion que realiza el proceso de pre pago
		function prepago () {
			$scope.procesarCompra = true;
			$ionicLoading.show({
				template: '<p>Espere</p><ion-spinner icon="lines"></ion-spinner>',
			});

			// Se invoca al servicio
			PedidoService.prepago($scope.pedido).then(function (response) {

				$ionicLoading.hide();
				$scope.procesarCompra = false;

				// Se verifica si la respuesta fue correcta
				if (response.success) {

					localStorage.removeItem('productos_carrito');
					alertPopup('Proceso completado', '¡Listo! Has completado el proceso de prepago. Muy pronto recibirás información para el pago de tus productos. ', true);

					$timeout(function () {
						alert.close();
						$ionicHistory.clearCache().then(function () {
							$state.go('app.main');
						});
					}, 5000);
				} else {
					alertPopup('Notificación', 'Error al procesar tu prepago, por favor intenta más tarde.');
				}
			});			
		}
}