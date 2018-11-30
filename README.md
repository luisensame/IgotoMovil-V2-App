	Sell-It APP

Aplicación móvil Sell-It

Tecnologías definidas para este proyecto:

	- Ionic Framework v.1
	- AngularJS
	- HTML, CSS
	- Bootstrap

Ambiente móvil

1.- Clonar el repositorio
	
		git clone url-repositorio

2.- Instalar dependecias 
	
		npm install

3.- Ejecutar ambiente de desarrollo
	
		ionic serve --lab




Generaciónde de APK para Playstore

1.- Remover debug console de la aplicación ionic

		ionic plugin rm cordova-plugin-console

La instrucción anterior eliminara los logs debugs existentes en la aplicación

2.- Generar un apk release, para generar este apk se ejecuta la siguiente instrucción

		ionic build android --release

Esto genera un archivo apk en la ruta:

		platforms/android/build/outputs/apk --> dentro estara un archivo llamado android-release-unsigned.apk

El archivo se ha generado correctamente y este posteriormente debe ser firmado con las keystore de la aplicación.



3.- Ejecuta comando sobre el directorio donde se encuentra el keystore y el apk generado por ionic

		"C:\Program Files\Java\jdk1.8.0_121\bin\jarsigner.exe" -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore koua-release-key.keystore android-release-unsigned.apk koua

Una vez ejecutado el comando se solicitara el password: appkoua2017 y se firmara el archivo


4.- Comprimir la aplicacion firmada con zipalign para esto en la misma ruta anterior ejecutar:

		"C:\Users\Rubenss-Ten\AppData\Local\Android\sdk\build-tools\23.0.2\zipalign.exe" -v 4 android-release-unsigned.apk kouamx.apk




Generacion de xcodeproject para Apple Store
Para generar de anera correcta el xcode project deben tenerce las siguientes versiones

	* Version de ionic 2.2.1
	* Version de cordova 6.0.0

Instalacion de depedencias
Una vez clonado el repositorio instalar las depencias como se indica

		npm install
		bower install
		bower install --force


Dependencias Cordova plugins
https://cordova.apache.org/docs/es/latest/platform_plugin_versioning_ref/

		cordova plugin add cordova-plugin-inappbrowser --save
		cordova plugin add cordova-plugin-whitelist --save
		ionic plugin add org.apache.cordova.camera ó cordova plugin add cordova-plugin-camera
		cordova plugin add cordova-plugin-compat
		cordova plugin add cordova-plugin-file-transfer --save
		cordova plugin add cordova-plugin-x-socialsharing
		cordova plugin add cordova-plugin-splashscreen
		cordova plugin add cordova-plugin-statusbar
		cordova plugin add cordova-plugin-device

Plataforma IOS
Agregar plataforma ios al proyecto

		ionic platform add ios


Generacion de assets resources 
		
		ionic resources

Generar el buil de ios que creara el xcodeproject

		ionic build ios

Xcodeproject
Navegar en el path de platform ios para localizar el archivo xcode project y ejecutarlo con xcode.

path: Sell-It-App/platforms/ios/Koua MX.xcodeproj


Una vez abierto el proyecto en Xcode, asociar el perfil de usuario (apple id)

Ejecutar la aplicacion con un emulador

Generar app para produccion

		ionic build ios --release"# Sell-It_Movil_App" 
