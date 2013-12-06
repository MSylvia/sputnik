'use strict';

function popupDirective($location) {
    
    var template =
    '<div class="popup-container">' +
        '<div class="popup">' +
            '<div ng-transclude></div>' +
            '<div class="popup__close" ng-click="closePopup()">close</div>' +
        '</div>' +
    '</div>';
    
    return {
        restrict: 'E',
        replace: false,
        scope: false,
        transclude: true,
        template: template,
        link: function ($scope, $element) {
            
            $scope.closePopup = function (evt) {
                $location.url('/');
            }
            
        }
    };
}