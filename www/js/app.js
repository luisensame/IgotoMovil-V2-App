angular.module('starter', 
	[
	'ionic', 
	'ngCordova', 
	'route', 
	'ngMessages', 
	'app.directives', 
	'starter.controllers',
	'restService',
	'ngCordovaOauth',
	'authService',
	'angularMoment',
  'mercadoPagoService'
  ])
  .constant('SETTINGS', {
    // produccion
    api: 'https://igotomovilapp.herokuapp.com/api',//Produccion
    
    // prueba
    //api: 'http://localhost:3000/api',//Prueba
    facebook: {
      appId: '395931840765262',
      permisos: ['public_profile', 'email'],
      fields: 'first_name,last_name,picture,email',
      url: 'https://graph.facebook.com/v2.2/me',
      app: {
        url: 'http://kouamx.club/social/social.html'
      }
    },
    productos: {
      offSet: 0,
      noElementos: 10,
      noElementosInicial: 20
    },
    sizeImage: 3000,
    conekta: {
      public_key: 'key_WXs858Ni3rUVsjtfoo9rhAw'//Prueba
    },
    compra: {
      descuento: 10,
      costoEnvio: 50,
      descuentoAplicar: 1000,
    },
    resenia: {
      max: 10,
      limit: 2,
    },
    VERSION_APP: 12
  }).run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {      	
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  }).config(['$httpProvider', '$ionicConfigProvider', function($httpProvider, $ionicConfigProvider) {

    // attach our auth interceptor to the http requests
    $httpProvider.interceptors.push('AuthInterceptor');

    //configuracion para back button
    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.backButton.icon('ion-chevron-left');
    $ionicConfigProvider.backButton.text('');


    // Deshbailitar la cache en las vistas
    //$ionicConfigProvider.views.maxCache(0);
  }]).filter('rango', function() {
    return function(number) {
      var res = [];
      for (var i = 1; i <= number; i++) {
        res.push(i);
      }
      return res;
    };
  }).filter('timerDate', function(moment) {
    return function(date) {

      var fechaEntrega = new Date(date);
      var fechaActual = new Date();

      //Si la fecha de entrega ya paso
      if (fechaEntrega < fechaActual) {
        return 'Expirado';
      }

      //parse fechas a moment
      var fa = moment(fechaActual);
      var fe = moment(fechaEntrega);

      //diferencia en dias entre fecha entrega y la fecha actual
      var diffDays = fe.diff(fa, 'days') + 1;

      if (diffDays === 0) {
        return 'Hoy';
      }

      return diffDays + ' días';
    }
  }).directive('imageonload', [function() {
    //Directiva que ejecutara una funciona una vez que se cargue la imagen
    return {
      restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment		
      link: function($scope, iElm, iAttrs, controller) {
        iElm.bind('load', function() {
          $scope.$apply(iAttrs.imageonload);
        });
      }
    };
  }]);
