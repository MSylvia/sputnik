'use strict';

var fs = require('fs');

exports.make = function (dataPath) {
    
    var model;
    
    //-----------------------------------------------------
    // Init
    //-----------------------------------------------------
    
    if (dataPath && fs.existsSync(dataPath)) {
        model = JSON.parse(fs.readFileSync(dataPath, { encoding: 'utf8' }));
    } else {
        model = {
            categories: [],
            feeds: []
        };
    }
    
    //-----------------------------------------------------
    // Helper functions
    //-----------------------------------------------------
    
    function getFeedByUrl(url) {
        for (var i = 0; i < model.feeds.length; i += 1) {
            if (model.feeds[i].url === url) {
                return model.feeds[i];
            }
        }
        return null;
    }
    
    function getFeedsForCategory(categoryName) {
        var list = [];
        model.feeds.forEach(function (feed) {
            if (feed.category === categoryName) {
                list.push(feed);
            }
        });
        return list;
    }
    
    function save() {
        if (dataPath) {
            fs.writeFileSync(dataPath, JSON.stringify(model, null, 2), { encoding: 'utf8' });
        }
    }
    
    //-----------------------------------------------------
    // API methods
    //-----------------------------------------------------
    
    function addFeed(feedModel) {
        var feed = getFeedByUrl(feedModel.url);
        if (feed) {
            return feed;
        }
        
        feed = feedModel;
        
        model.feeds.push(feed);
        
        if (feed.category && model.categories.indexOf(feed.category) === -1) {
            // add category to model if not present
            model.categories.push(feed.category);
        }
        
        save();
        
        return feed;
    }
    
    function setFeedValue(feedUrl, key, value) {
        var feed = getFeedByUrl(feedUrl);
        feed[key] = value;
        if (key === 'category') {
            addCategory(value);
        }
        
        save();
        
        return feed;
    }
    
    function removeFeed(url) {
        var feed = null;
        for (var i = 0; i < model.feeds.length; i += 1) {
            if (model.feeds[i].url === url) {
                feed = model.feeds.splice(i, 1)[0];
                break;
            }
        }
        
        save();
        
        return feed;
    }
    
    function addCategory(name) {
        if (model.categories.indexOf(name) === -1) {
            model.categories.push(name);
        }
        
        save();
    }
    
    function changeCategoryName(currentName, newName) {
        var currNameIndex = model.categories.indexOf(currentName);
        if (currNameIndex !== -1) {
            if (model.categories.indexOf(newName) !== -1) {
                // newName already is defined, we are merging two categories together
                // so we must to throw away one of this categories from array
                model.categories.splice(currNameIndex, 1);
            } else {
                model.categories[currNameIndex] = newName;
            }
            
            var categoryFeeds = getFeedsForCategory(currentName);
            categoryFeeds.forEach(function (feed) {
                feed.category = newName;
            });
            
            save();
        }
    }
    
    function removeCategory(name) {
        for (var i = 0; i < model.categories.length; i += 1) {
            if (model.categories[i] === name) {
                model.categories.splice(i, 1);
                break;
            }
        }
        var categoryFeeds = getFeedsForCategory(name);
        categoryFeeds.forEach(function (feed) {
            removeFeed(feed.url);
        });
        
        save();
    }
    
    return {
        get categories() {
            return model.categories;
        },
        get feeds() {
            return model.feeds;
        },
        addFeed: addFeed,
        removeFeed: removeFeed,
        setFeedValue: setFeedValue,
        addCategory: addCategory,
        changeCategoryName: changeCategoryName,
        removeCategory: removeCategory,
    };
}