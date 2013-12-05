'use strict';

function dropdownDirective() {
    return {
        restrict: 'C',
        link: function ($scope, $element) {
            
            function toggle() {
                $element.toggleClass('dropdown--opened');
                if ($element.hasClass('dropdown--opened')) {
                    setTimeout(function () {
                        document.addEventListener('click', toggle, false);
                    }, 50);
                } else {
                    document.removeEventListener('click', toggle, false);
                }
            }
            
            $element.bind('click', toggle);
            
            $scope.$on('$destroy', function () {
                document.removeEventListener('click', toggle, false);
            });
        }
    };
}