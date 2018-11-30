angular.module('usuarioService', [])
.factory('UsuarioService', ['RestService', 'SETTINGS', '$cordovaFileTransfer', 'Auth', '$q',
	function(RestService, SETTINGS, $cordovaFileTransfer, Auth, $q) {

	var usuarioServiceFactory = {};
	var api = SETTINGS.api + '/usuario';

	//factory methods
	usuarioServiceFactory.registro = registro;
	usuarioServiceFactory.verificarUsuario = verificarUsuario;
	usuarioServiceFactory.recuperarContrasenia = recuperarContrasenia;
	usuarioServiceFactory.eliminarCuentaUsuario = eliminarCuentaUsuario;
	usuarioServiceFactory.actualizarInformacion = actualizarInformacion;
	usuarioServiceFactory.obtenerDatosTarjetaUsuario = obtenerDatosTarjetaUsuario;

	//return factory object
	return usuarioServiceFactory;

	//functions
	function registro(usuario) {
		return RestService.post(SETTINGS.api + '/registro', usuario);
	}

	function verificarUsuario(usuario) {
		return RestService.post(SETTINGS.api + '/authenticate', usuario);
	}

	function recuperarContrasenia(email) {
		return RestService.put(SETTINGS.api + '/reset-password/' + email);
	}

	function eliminarCuentaUsuario(email) {
		return RestService.put(api + '/eliminar-cuenta/' + email);
	}

	function obtenerDatosTarjetaUsuario(customerId) {
		return RestService.get(api + '/tarjeta/' + customerId);
	}

	function actualizarInformacion(usuario, urlImage) {

		// Se verifica si existe una imagen
		if(usuario.imagen) {

			var defered = $q.defer();
			var promesa = defered.promise;

			var params = new Object();
			params.usuario = JSON.stringify(usuario);
			params.urlImage = urlImage;

			// Se crea el objeto
			var options = {
				fileKey: 'file',
				fileName: getFilename(usuario.imagen, usuario._id),
				chunkedMode: false,
				mimeType: 'multipart/form-data',
				params : params,
				headers: {'x-access-token': Auth.getToken()}
			};

			// Se envia al servidor
			$cordovaFileTransfer.upload(api, usuario.imagen || '', options)
			.then(function(result) {
				defered.resolve(JSON.parse(result.response));
			}, function(err) {
				defered.resolve({success: false, message: 'Ocurrio un error al transferir el archivo'});
			}, function (progress) {
				var porcentaje = parseInt((progress.loaded / progress.total) * 100);
			});

			return promesa;
		}

		return RestService.put(SETTINGS.api + '/usuario', {usuario: usuario});
	}

	function getFilename(src, id) {

		// Grab the file name of the photo in the temporary directory
		var currentName = src.replace(/^.*[\\\/]/, '');
		currentName = currentName.split('?');

		if(Array.isArray(currentName)) {
			currentName = currentName[0];
		}

		var extension = currentName.split('.');

		if(Array.isArray(extension)) {
			
			if(extension.length == 1) {
				currentName = 'avatar.jpg';
			} else {
				currentName = id + '.' + extension[1];
			}
		}

		return currentName;
	}
}]);