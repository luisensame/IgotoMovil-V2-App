angular.module('misComprasController', ['pedidoService', 'reseniaService'])
.controller('MisComprasController', ['$scope', 'Auth', 'PedidoService', '$ionicPopover', 'ReseniaService', '$ionicLoading', '$ionicPopup', 'SETTINGS', MisComprasController]);
function MisComprasController($scope, Auth, PedidoService, $ionicPopover, ReseniaService, $ionicLoading, $ionicPopup, SETTINGS) {
	
	//Variables
	$scope.flagEstatusEntrega = true;
	var estatusEntrega = 2;
	$scope.listaPedidos = [];
	$scope.usuario = {};

	//select pedido y producto para marcar como entregado
	$scope.selectPedido = null;
	$scope.selectProducto = null;
	
	//popover que califica un product
	$ionicPopover.fromTemplateUrl('resenia_producto.html', {
    	scope: $scope,
    	backdropClickToClose: false,
    	hardwareBackButtonClose: false,
  	}).then(function(popover) {
    	$scope.popover = popover;
  	});  	

  	//Funciones que muestran y ocultan el loader
  	var showLoading = showLoading;
  	var hideLoading = hideLoading;

  	//Alert popup
  	var alertPopup = alertPopup;

  	//Paginacion para scroll
	$scope.paginacion = {
		offSet: 0,
		noElementos: SETTINGS.productos.noElementosInicial,
		totalPedidos: 0,
		loadPedidos: false
	};
	
	
	var init = init;
	var obtenerPedidosProductos = obtenerPedidosProductos;
	$scope.changeEvent = changeEvent;
	$scope.selectProductoEntregado = selectProductoEntregado;
	var closePopover = closePopover;
	$scope.calificarProducto = calificarProducto;
	var obtenerTotalPedidosProductos = obtenerTotalPedidosProductos;
	$scope.cargarPedidos = cargarPedidos;

	//init start methods
	init();

	/**
	 * Funcion principal al cargar controller	 
	 */
	function init(){
		showLoading();
		// Se invoca a la api
		Auth.getUser().then(function(response) {
			// Se verifica si el usuario es valido
			if(response && response.success) {
				// Se obtiene el los datos del usuario
				$scope.usuario = response.usuario;

				//Se obtiene el total de pedidos con estatus de entrega
				obtenerTotalPedidosProductos($scope.usuario._id, estatusEntrega);
			}
		});
	}


	function obtenerTotalPedidosProductos(idUsuario, estatusEntrega){		
		showLoading();
		PedidoService.obtenerTotalPedidosProductos(idUsuario, estatusEntrega).then(function(response){
			//console.log('response: ', response);
			if (response.success) {			
				$scope.paginacion.totalPedidos = response.totalPedidos;
				if ($scope.paginacion.totalPedidos > 0) {
					$scope.paginacion.loadPedidos = true;
				}
			}
			hideLoading();
		}, function (err){
			//console.log('err total pedidos: ', err);
			hideLoading();
		})
	}

	function cargarPedidos(){
		//console.log('cargando pedidos');
		//console.log('paginacion: ', $scope.paginacion);
		//Si el offset es mayor a 0 el limite de elementos a obtener sera de 10
		if ($scope.paginacion.offSet > 0) {
			$scope.paginacion.noElementos = SETTINGS.productos.noElementos;		
		}

		//Si el offset es menor al total de productos
		if ($scope.paginacion.offSet < $scope.paginacion.totalPedidos) {			
			//Se cargan los pedido faltantes
			obtenerPedidosProductos($scope.paginacion.offSet, $scope.paginacion.noElementos);
			return $scope.paginacion.offSet += $scope.paginacion.noElementos;
		}

		//Se detiene el scroll infinito y se oculta del DOM si no existen mas productos a cargar
	    $scope.$broadcast('scroll.infiniteScrollComplete');
	    $scope.paginacion.loadPedidos = false;
	}

	/**
	 * Funcion que genera el valor de la bandera y obtiene la lista de productos en base al valor	 
	 */
	function changeEvent(){
		showLoading();
		$scope.flagEstatusEntrega = !$scope.flagEstatusEntrega;		
		if ($scope.flagEstatusEntrega) {
			estatusEntrega = 2;
		}else{
			estatusEntrega = 1;
		}

		//Se limpia el array de pedidos para completarlo con los nuevos pedidos
		$scope.listaPedidos = [];
		//Se resetea la paginacion
		$scope.paginacion = {
			offSet: 0,
			noElementos: SETTINGS.productos.noElementosInicial,
			totalPedidos: 0,
			loadPedidos: false
		};

		//Se obtiene el total de pedidos con estatus de entrega
		obtenerTotalPedidosProductos($scope.usuario._id, estatusEntrega);
	}
	
	function obtenerPedidosProductos(offSet, noElementos){
		//console.log('obteniendo resultados');
		PedidoService.obtenerPedidosProductos($scope.usuario._id, estatusEntrega, offSet, noElementos).then(function (result){			
			if (result.success) {
				$scope.listaPedidos.push.apply($scope.listaPedidos, result.pedidos);				
			}else{
	    		$scope.paginacion.loadPedidos = false;
			}
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}, function (err){
			//console.log('err: ', err);
			$scope.$broadcast('scroll.infiniteScrollComplete');
			$scope.paginacion.loadPedidos = false;
			alertPopup('Notificación', 'Error inesperado, por favor inténtalo más tarde.');
		});
	}


	function selectProductoEntregado(idPedido, idProducto, $event){		
		$scope.selectPedido = idPedido;
		$scope.selectProducto = idProducto;
		$scope.popover.show($event);
	}

	function calificarProducto(calificacion){
		showLoading();
		var resenia = {
			idPedido: $scope.selectPedido,
			idProducto: $scope.selectProducto,
			calificacion: calificacion,
			usuario: $scope.usuario._id
		};
		ReseniaService.registrarResenia(resenia).then(function (res){			
			closePopover();
			if (res && res.success) {
				//Se obtiene los productos nuevamente
				//Se limpia el array de pedidos para completarlo con los nuevos pedidos
				$scope.listaPedidos = [];
				//Se resetea la paginacion
				$scope.paginacion = {
					offSet: 0,
					noElementos: SETTINGS.productos.noElementosInicial,
					totalPedidos: 0,
					loadPedidos: false
				};

				//Se obtiene el total de pedidos con estatus de entrega
				obtenerTotalPedidosProductos($scope.usuario._id, estatusEntrega);
			}
			$scope.selectPedido = null;
			$scope.selectProducto = null;
			hideLoading();
		}, function (err){			
			closePopover();
			hideLoading();
			alertPopup('Notificación', 'Error inesperado al calificar producto, por favor inténtalo más tarde.');
		});
	}

	function closePopover(){
		$scope.popover.hide();
	};

	//Cleanup the popover when we're done with it!
	$scope.$on('$destroy', function() {
		$scope.popover.remove();
	});			

	function showLoading(){
		$ionicLoading.show({
    		template: '<p>Espere</p><ion-spinner icon="lines"></ion-spinner>'
		}).then(function (){
			//console.log('show loading');
		});
	}

	function hideLoading(){
		$ionicLoading.hide();
	}


	// Funcion que muestra un pop
	function alertPopup(title, template, success) {

		var options = {title: title, template: template};

		if(!success) {
			options.buttons = [{ text: 'Entendido <i class="ion-android-done"></i>', type: 'button-positive' }];
		}
		$ionicPopup.show(options);
	}
}