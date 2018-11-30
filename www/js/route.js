angular.module('route', []).config(function($stateProvider, $urlRouterProvider) {

	$stateProvider

	.state('login', {
		url: '/login',
		controller: 'LoginController',
		templateUrl: 'templates/login.html'
	})
	.state('registro', {
		url: '/registro',
		controller: 'RegistroController',
		templateUrl: 'templates/registro.html',
	})
	.state('reset', {
		url: '/reset',
		controller: 'ContraseniaController',
		templateUrl: 'templates/recuperar_contrasenia.html',
	})

	/* ---------------------------- RUTAS RESTRINGIDAS ---------------------------- */
	.state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/dashboard/menu.html'
	})
	.state('app.main', {
		isLogin: true,
		showBusqueda: true,
		url: '/main',
		views: {
			'menuContent': {
				controller: 'MainController',
				templateUrl: 'templates/dashboard/main.html',
			}
		}
	})
	.state('app.perfil', {
		isLogin: true,
		showBusqueda: false,
		url: '/perfil',
		views: {
			'menuContent': {
				controller: 'PerfilController',
				templateUrl: 'templates/dashboard/perfil.html',
			}
		}
	})	
	.state('app.favoritos', {
		isLogin: true,
		showBusqueda: false,
		cache: false,
		url: '/favoritos',
		views: {
			'menuContent': {
				controller: 'FavoritoController',
				templateUrl: 'templates/dashboard/favoritos.html',
			}
		}
	})
	.state('app.misCompras', {
		isLogin: true,
		showBusqueda: false,
		url: '/mis-compras',
		views: {
			'menuContent': {
				controller: 'MisComprasController',
				templateUrl: 'templates/dashboard/mis-compras.html',
			}
		}
	})
	.state('app.politicasPrivacidad', {
		isLogin: true,
		showBusqueda: false,
		url: '/politicas-privacidad',
		views: {
			'menuContent': {
				templateUrl: 'templates/dashboard/politicas_privacidad.html',
			}
		}
	})
	.state('app.producto', {
		isLogin: true,
		showBusqueda: false,
		url: '/producto/:id',
		views: {
			'menuContent': {
				controller: 'ProductoController',
				templateUrl: 'templates/dashboard/producto.html',
			}
		}
	})
	.state('app.caja', {
		isLogin: true,
		showBusqueda: false,
		url: '/caja',
		cache: false,
		views: {
			'menuContent': {
				controller: 'CajaController',
				templateUrl: 'templates/dashboard/caja.html',
			}
		}
	})
	.state('app.contacto', {
		isLogin: true,
		showBusqueda: false,
		url: '/contacto',
		cache: false,
		views: {
			'menuContent': {
				controller: '',
				templateUrl: 'templates/dashboard/contacto.html',
			}
		}
	});

	// if none of the above states are matched, use this as the fallback
	//$urlRouterProvider.otherwise('/app/main');

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise(function($injector, $location) {
		var $state = $injector.get('$state');
		$state.go('app.main');
	});
});