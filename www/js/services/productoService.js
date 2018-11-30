angular.module('productoService', [])
.factory('ProductoService', ['RestService', 'SETTINGS', function(RestService, SETTINGS) {

	var productoServiceFactory = {};

	productoServiceFactory.obtenerTotalProductos = obtenerTotalProductos;
	productoServiceFactory.obtenerListaProductos = obtenerListaProductos;
	productoServiceFactory.obtenerListaProductosDestacados = obtenerListaProductosDestacados;

	productoServiceFactory.obtenerTotalProductosOfertas = obtenerTotalProductosOfertas;
	productoServiceFactory.obtenerListaProductosOferta = obtenerListaProductosOferta;

	productoServiceFactory.obtenerListaProductosBusqueda = obtenerListaProductosBusqueda;

	productoServiceFactory.obtenerTotalProductosCategoria = obtenerTotalProductosCategoria;
	productoServiceFactory.obtenerListaProductosCategoria = obtenerListaProductosCategoria;

	productoServiceFactory.obtenerProductosBusqueda = obtenerProductosBusqueda;
	productoServiceFactory.obtenerTotalProductosBusqueda = obtenerTotalProductosBusqueda;

	productoServiceFactory.obtenerProductoPorId = obtenerProductoPorId;

	productoServiceFactory.actualizarVisitaProducto = actualizarVisitaProducto;

	//return factory object
	return productoServiceFactory;

	// Funcion que obtene la lista de productos
	function obtenerListaProductos(data) {

		var url = SETTINGS.api + '/producto/' + data.noElementos + '/' + data.offSet;

		if(data.categoria) {
			url += '/' + data.categoria;
		}
		//console.log(RestService.get(url))
		return RestService.get(url);
	}

	// Funcion que obtene el total de productos registrados
	function obtenerTotalProductos() {
		return RestService.get(SETTINGS.api + '/producto/total');
	}

	// Funcion que obtene la lista de productos en oferta
	function obtenerTotalProductosOfertas() {
		return RestService.get(SETTINGS.api + '/producto/total-oferta');
	}

	function obtenerListaProductosOferta(data) {
		return RestService.get(SETTINGS.api + '/producto/oferta/' + data.noElementos + '/' + data.offSet);
	}

	function obtenerListaProductosDestacados(data) {
		return RestService.get(SETTINGS.api + '/producto/destacados/' + data.noElementos + '/' + data.offSet);
	}

	function obtenerListaProductosBusqueda(data) {
		var url = SETTINGS.api + '/producto/busqueda/' + data.noElementos + '/' + data.offSet;
		return RestService.post(url, {listaProducto: data.busqueda});
	}

	function obtenerTotalProductosCategoria(idCategoria) {
		return RestService.get(SETTINGS.api + '/producto/total/buscar/categoria/' + idCategoria);
	}

	function obtenerListaProductosCategoria(data) {
		var url = SETTINGS.api + '/producto/categoria/';
		return RestService.get(url + data.noElementos + '/' + data.offSet + '/' + data.idCategoria);
	}

	function obtenerTotalProductosBusqueda(palabra) {
		return RestService.get(SETTINGS.api + '/producto/total-busqueda?palabra=' + palabra);
	}

	function obtenerProductosBusqueda(data) {
		var url = SETTINGS.api + '/producto/busqueda';
		url += '?palabra=' + data.palabra;
		url += '&offSet=' + data.offSet;
		url += '&noElementos=' + data.noElementos;
		return RestService.get(url);
	}

	function obtenerProductoPorId(id) {
		return RestService.get(SETTINGS.api + '/producto/' + id);
	}

	function actualizarVisitaProducto(id) {
		return RestService.put(SETTINGS.api + '/producto/visita/' + id);
	}
}]);