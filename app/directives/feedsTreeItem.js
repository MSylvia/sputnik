'use strict';

function feedsTreeItemDirective($compile) {
    
    var categoryTemplate =
    '<div class="feeds-tree__category-container  feeds-tree__category-container--nested">' +
        '<h1 ng-click="selectCategory(item)"' +
            'ng-class="{\'feeds-tree__category--selected\': selectedCategory == item}"' +
            'class="feeds-tree__category">' +
            '<span class="feeds-tree__category-name">{{item.title}}</span>' +
            '<span class="feeds-tree__count">{{item.unreadArticlesCount}}</span>' +
        '</h1>' +
        '##FEEDS##' +
    '</div>';
    
    var allCategoryTemplate = categoryTemplate.replace('##FEEDS##', '');
    var normalCategoryTemplate = categoryTemplate.replace('##FEEDS##', '<feeds-tree-item ng-repeat="catItem in item.feeds" item="catItem"></feeds-tree-item>');
    
    var feedTemplate =
    '<h2 ng-click="selectCategory(item)"' +
        'ng-class="{\'feeds-tree__category--selected\': selectedCategory == item}"' +
        'class="feeds-tree__category  feeds-tree__category--minor">' +
        '<div ng-hide="item.faviconUrl != undefined" class="feeds-tree__icon  feeds-tree__icon--none"/>' +
        '<img ng-show="item.faviconUrl != undefined" ng-src="{{item.faviconUrl}}" class="feeds-tree__icon"/>' +
        '<span class="feeds-tree__category-name">{{item.title}}</span>' +
        '<span ng-show="item.unreadArticlesCount > 0" class="feeds-tree__count">{{item.unreadArticlesCount}}</span>' +
    '</h2>';
    
    return {
        restrict: 'E',
        replace: true,
        scope: { item: '=' },
        link: function ($scope, $element) {
            var templatesMap = {
                'allCategory': allCategoryTemplate,
                'category': normalCategoryTemplate,
                'feed': feedTemplate
            };
            var template = templatesMap[$scope.item.type];
            $element.replaceWith($compile(template)($scope));
        }
    };
}