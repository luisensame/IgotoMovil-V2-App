angular.module('pedidoService', [])
.factory('PedidoService', ['RestService', 'SETTINGS', function(RestService, SETTINGS) {

	var api = SETTINGS.api + '/pedido';

	var productoServiceFactory = {};
	productoServiceFactory.registrarPedidoTarjeta = registrarPedidoTarjeta;
	productoServiceFactory.registrarPedidoEfectivo = registrarPedidoEfectivo;
	productoServiceFactory.registrarPedidoTransferencia = registrarPedidoTransferencia;
	productoServiceFactory.obtenerListaProductosPorUsuario = obtenerListaProductosPorUsuario;
	productoServiceFactory.obtenerTotalPedidosProductos = obtenerTotalPedidosProductos;
	productoServiceFactory.obtenerPedidosProductos = obtenerPedidosProductos;
	productoServiceFactory.prepago = prepago;

	// return factory object
	return productoServiceFactory;

	function registrarPedidoEfectivo(pedido) {
		return RestService.post(api + '/efectivo', {pedido: pedido});
	}

	function registrarPedidoTransferencia(pedido) {
		return RestService.post(api + '/transferencia', {pedido: pedido});
	}

	function obtenerListaProductosPorUsuario(idUsuario) {
		return RestService.get(api + '/' + idUsuario);
	}

	function registrarPedidoTarjeta(pedido, tokenId) {
		return RestService.post(api + '/tarjeta', {pedido: pedido, tokenId: tokenId});
	}

	function obtenerTotalPedidosProductos(idUsuario, estatusEntrega){
		return RestService.get(api + '/total/' + idUsuario + '/' + estatusEntrega);
	}

	function obtenerPedidosProductos(idUsuario, estatusEntrega, offSet, noElementos){
		return RestService.get(api + '/productos/' + idUsuario + '/' + estatusEntrega + '?offSet=' + offSet + '&noElementos=' + noElementos);
	}

	function prepago (pedido){
		return RestService.post(api + '/prepago', { pedido: pedido });
	}
}])