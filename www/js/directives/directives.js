angular.module('app.directives', [])
.directive('validEmail', [function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {

            function customValidator(ngModelValue) {
                
                var pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

                // Se verifica si es valido con el pattern
                if(pattern.test(ngModelValue)) {
                    ctrl.$setValidity('email', true);
                } else {
                    ctrl.$setValidity('email', false);
                }

                return ngModelValue;
            }
            ctrl.$parsers.push(customValidator);
        }
    };
}])
.directive('validPassword', [function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {
            function customValidator(ngModelValue) {

                var pattern = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d$@$!%*?&].{7,16}$/;
                
                // Se verifica si es valido con el pattern
                if(pattern.test(ngModelValue)) {
                    ctrl.$setValidity('password', true);
                } else {
                    ctrl.$setValidity('password', false);
                }

                return ngModelValue;
            }
            ctrl.$parsers.push(customValidator);
        }
    };
}])
.directive('validTelefono', [function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {

            function customValidator(ngModelValue) {
                
                if(ngModelValue.length != 10) {
                    ctrl.$setValidity('telefonoLength', false);
                } else {
                    ctrl.$setValidity('telefonoLength', true);
                }

                var pattern = /^[0-9]{1,10}$/;
                
                if(pattern.test(ngModelValue)) {
                    ctrl.$setValidity('telefono', true);
                } else {
                    ctrl.$setValidity('telefono', false);
                }

                return ngModelValue;
            }

            ctrl.$parsers.push(customValidator);
        }
    };
}])
.directive('codigoPostal', [function() {

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {

            function customValidator(ngModelValue) {
                
                if(ngModelValue || ngModelValue.length != 5) {
                    ctrl.$setValidity('codigoPostal', false);
                } else {
                    ctrl.$setValidity('codigoPostal', true);
                }

                var pattern = /^[0-9]{1,5}$/;
                
                if(pattern.test(ngModelValue)) {
                    ctrl.$setValidity('codigoPostal', true);
                } else {
                    ctrl.$setValidity('codigoPostal', false);
                }

                return ngModelValue;
            }

            ctrl.$parsers.push(customValidator);
        }
    };
}])
.directive('ngNumero', [function() {

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {

            function customValidator(ngModelValue) {

                // Parsing to int
                var valueNumero = parseInt(ngModelValue);

                // Se verifica si no se puede parsear
                if(isNaN(valueNumero)) {
                    ctrl.$setValidity('number', false);
                } else {

                    // Se verifica si no es una direccion valida
                    if(valueNumero <= 0 || ngModelValue.length > 5) {
                        ctrl.$setValidity('numeroDireccion', false);
                    } else {
                        ctrl.$setValidity('number', true);
                        ctrl.$setValidity('numeroDireccion', true);
                    }
                }

                // Se obtiene el primer elemento
                var fields = ngModelValue.split('');
                var valueCero = parseInt(fields[0]);
                if(isNaN(valueCero) || valueCero == 0) {
                    ctrl.$setValidity('numeroDireccion', false);
                } else {
                    ctrl.$setValidity('numeroDireccion', true);
                }

                var pattern = /([0-9])/g;
                
                if(pattern.test(ngModelValue)) {
                    ctrl.$setValidity('number', true);
                } else {
                    ctrl.$setValidity('number', false);
                }

                return ngModelValue;
            }

            ctrl.$parsers.push(customValidator);
        }
    };
}])
.directive('ngNumber', [function() {

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ctrl) {

            function customValidator(ngModelValue) {

                // Parsing to int
                var valueNumero = parseInt(ngModelValue);

                // Se verifica si no se puede parsear
                if(isNaN(valueNumero)) {
                    ctrl.$setValidity('number', false);
                } else {
                    ctrl.$setValidity('number', true);
                }

                var pattern = /([0-9])/g;
                
                if(pattern.test(ngModelValue)) {
                    ctrl.$setValidity('number', true);
                } else {
                    ctrl.$setValidity('number', false);
                }

                return ngModelValue;
            }

            ctrl.$parsers.push(customValidator);
        }
    };
}])