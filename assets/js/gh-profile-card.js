/** GitHub Profile Card - v2.0.1 **/
(function(){
"use strict";
var CacheStorage = (function () {
    function CacheStorage() {
    }
    CacheStorage.get = function (key) {
        return CacheStorage.requestCache[key];
    };
    CacheStorage.add = function (url, entry) {
        CacheStorage.requestCache[url] = entry;
        window.localStorage.setItem(CacheStorage.cacheName, JSON.stringify(CacheStorage.requestCache));
    };
    CacheStorage.getCache = function () {
        return JSON.parse(window.localStorage.getItem(CacheStorage.cacheName));
    };
    return CacheStorage;
}());
CacheStorage.cacheName = 'github-request-cache';
CacheStorage.requestCache = CacheStorage.getCache() || {};

var GitHubApiLoader = (function () {
    function GitHubApiLoader() {
        this.apiBase = 'https://api.github.com';
    }
    GitHubApiLoader.prototype.loadUserData = function (username, callback) {
        var _this = this;
        var request = this.apiGet(this.apiBase + "/users/" + username);
        request.success(function (profile) {
            callback({ profile: profile }, null);
        });
        request.error(function (result, request) {
            var error = _this.identifyError(result, request);
            callback(null, error);
        });
    };
    GitHubApiLoader.prototype.identifyError = function (result, request) {
        var error = {
            message: result.message
        };
        if (request.status === 404) {
            error.isWrongUser = true;
        }
        var limitRequests = request.getResponseHeader('X-RateLimit-Remaining');
        if (Number(limitRequests) === 0) {
            var resetTime = request.getResponseHeader('X-RateLimit-Reset');
            error.resetDate = new Date(Number(resetTime) * 1000);
            // full message is too long, leave only general message
            error.message = error.message.split('(')[0];
        }
        return error;
    };
    GitHubApiLoader.prototype.extractLangURLs = function (profileRepositories) {
        return profileRepositories.map(function (repository) { return repository.languages_url; });
    };
    GitHubApiLoader.prototype.apiGet = function (url) {
        var request = this.buildRequest(url);
        return {
            success: function (callback) {
                request.addEventListener('load', function () {
                    if (request.status === 304) {
                        callback(CacheStorage.get(url).data, request);
                    }
                    if (request.status === 200) {
                        var response = JSON.parse(request.responseText);
                        CacheStorage.add(url, {
                            lastModified: request.getResponseHeader('Last-Modified'),
                            data: response
                        });
                        callback(response, request);
                    }
                });
            },
            error: function (callback) {
                request.addEventListener('load', function () {
                    if (request.status !== 200 && request.status !== 304) {
                        callback(JSON.parse(request.responseText), request);
                    }
                });
            }
        };
    };
    GitHubApiLoader.prototype.buildRequest = function (url) {
        var request = new XMLHttpRequest();
        request.open('GET', url);
        this.buildApiHeaders(request, url);
        request.send();
        return request;
    };
    GitHubApiLoader.prototype.buildApiHeaders = function (request, url) {
        request.setRequestHeader('Accept', '08ac1614b7f594e9e330ff815b9374aa82a5a8e9');
        request.setRequestHeader('Accept', 'application/vnd.github.v3+json');
        var urlCache = CacheStorage.get(url);
        if (urlCache) {
            request.setRequestHeader('If-Modified-Since', urlCache.lastModified);
        }
    };
    return GitHubApiLoader;
}());

var DOMOperator = (function () {
    function DOMOperator() {
    }
    DOMOperator.clearChildren = function ($parent) {
        while ($parent.hasChildNodes()) {
            $parent.removeChild($parent.firstChild);
        }
    };
    DOMOperator.createError = function (error, username) {
        var $error = document.createElement('div');
        $error.className = 'error';
        $error.innerHTML = "<span>" + error.message + "</span>";
        if (error.isWrongUser) {
            $error.innerHTML = "<span>Not found user: " + username + "</span>";
        }
        if (error.resetDate) {
            var remainingTime = error.resetDate.getMinutes() - new Date().getMinutes();
            remainingTime = (remainingTime < 0) ? 60 + remainingTime : remainingTime;
            $error.innerHTML += "<span class=\"remain\">Come back after " + remainingTime + " minutes</span>";
        }
        return $error;
    };
    DOMOperator.createProfile = function (data) {
        var $avatar = avatar(data.avatar_url);
        var $name = name(data.html_url, data.login);
        var $location = location(data.location);
        var $followButton = followButton(data.html_url);
        var $followers = followers(data.followers);
        var $followContainer = followContainer([$followButton, $followers]);
        return profile([$avatar, $name, $followContainer, $location]);
        //////////////////
        function appendChildren($parent, nodes) {
            nodes.forEach(function (node) { return $parent.appendChild(node); });
        }
        function profile(children) {
            var $profile = document.createElement('div');
            $profile.classList.add('profile');
            appendChildren($profile, children);
            return $profile;
        }
        function name(profileUrl, name) {
            var $name = document.createElement('a');
            $name.href = profileUrl;
            $name.target = '_blank';
            $name.className = 'name';
            $name.appendChild(document.createTextNode(name));
            return $name;
        }
        function location(location) {
            var $location = document.createElement('span');
            $location.className = 'location';
            $location.innerHTML = location;
            return $location;
        }
        function avatar(avatarUrl) {
            var $avatar = document.createElement('img');
            $avatar.src = avatarUrl;
            $avatar.className = 'avatar';
            return $avatar;
        }
        function followButton(followUrl) {
            var $followButton = document.createElement('a');
            $followButton.href = followUrl;
            $followButton.target = '_blank';
            $followButton.className = 'follow-button';
            $followButton.innerHTML = 'Follow';
            return $followButton;
        }
        function followers(followersAmount) {
            var $followers = document.createElement('span');
            $followers.className = 'followers';
            $followers.innerHTML = '' + followersAmount;
            return $followers;
        }
        function followContainer(children) {
            var $followContainer = document.createElement('div');
            $followContainer.className = 'followMe';
            appendChildren($followContainer, children);
            return $followContainer;
        }
    };
    return DOMOperator;
}());

var GitHubCardWidget = (function () {
    function GitHubCardWidget(options) {
        if (options === void 0) { options = {}; }
        this.apiLoader = new GitHubApiLoader();
        this.$template = this.findTemplate(options.template);
        this.extractHtmlConfig(options, this.$template);
        this.options = this.completeConfiguration(options);
    }
    GitHubCardWidget.prototype.init = function () {
        var _this = this;
        this.apiLoader.loadUserData(this.options.username, function (data, err) {
            _this.userData = data;
            _this.render(_this.options, err);
        });
    };
    GitHubCardWidget.prototype.refresh = function (options) {
        this.options = this.completeConfiguration(options);
        this.render(this.options);
    };
    GitHubCardWidget.prototype.completeConfiguration = function (options) {
        var defaultConfig = {
            username: null,
            template: '#github-card'
        };
        for (var key in defaultConfig) {
            defaultConfig[key] = options[key] || defaultConfig[key];
        }
        return defaultConfig;
    };
    GitHubCardWidget.prototype.findTemplate = function (templateCssSelector) {
        if (templateCssSelector === void 0) { templateCssSelector = '#github-card'; }
        var $template = document.querySelector(templateCssSelector);
        if (!$template) {
            throw "No template found for selector: " + templateCssSelector;
        }
        $template.className = 'gh-profile-card';
        return $template;
    };
    GitHubCardWidget.prototype.extractHtmlConfig = function (widgetConfig, $template) {
        widgetConfig.username = widgetConfig.username || $template.dataset['username'];
        if (!widgetConfig.username) {
            throw 'Not provided username';
        }
    };
    GitHubCardWidget.prototype.render = function (options, error) {
        var $root = this.$template;
        // clear root template element to prepare space for widget
        DOMOperator.clearChildren($root);
        if (error) {
            var $errorSection = DOMOperator.createError(error, options.username);
            $root.appendChild($errorSection);
            return;
        }
        // API doesn't return errors, try to built widget
        var $profile = DOMOperator.createProfile(this.userData.profile);
        $root.appendChild($profile);
    };
    return GitHubCardWidget;
}());

window.GitHubCard = GitHubCardWidget;
document.addEventListener('DOMContentLoaded', function () {
    var $defaultTemplate = document.querySelector('#github-card');
    if ($defaultTemplate) {
        var widget = new GitHubCardWidget();
        widget.init();
    }
});

/**
 * GitHub API interfaces based on documentation
 *
 * @see https://developer.github.com/v3/
 */

})();
