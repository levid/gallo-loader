// Generated by CoffeeScript 1.6.2
(function() {
  'use strict';
  var Loader,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Loader = (function(_super) {
    __extends(Loader, _super);

    Loader.prototype.opts = {
      map: void 0,
      manifest: void 0,
      manifestCache: void 0,
      preload: void 0,
      loader: void 0,
      w: void 0,
      h: void 0,
      onReload: void 0,
      lazy: void 0
    };

    function Loader(options) {
      this.options = options;
      this.handlePreloadComplete = __bind(this.handlePreloadComplete, this);
      this.handleLoadStart = __bind(this.handleLoadStart, this);
      this.handleFileStart = __bind(this.handleFileStart, this);
      this.handleFileError = __bind(this.handleFileError, this);
      this.handleOverallProgress = __bind(this.handleOverallProgress, this);
      this.handleFileProgress = __bind(this.handleFileProgress, this);
      this.handleFileLoaded = __bind(this.handleFileLoaded, this);
      this.options = $.extend({}, this.opts, this.options);
      this.manifestCache = this.options.manifest.slice();
      this.manifest = this.options.manifest || [];
      this.preload = this.options.preload || void 0;
      this.loader = this.options.loader || void 0;
      this.lazy = this.options.lazy || false;
      this.map = {};
      this.w = 238;
      this.h = 170;
      Gallo.Events.addEventListener("reset", this.options.onReset || function() {});
      Gallo.Events.addEventListener("complete", this.options.onComplete || function() {});
      Gallo.Events.addEventListener("fileStart", this.options.onFileStart || function() {});
      Gallo.Events.addEventListener("loadStart", this.options.onLoadStart || function() {});
      Gallo.Events.addEventListener("fileProgress", this.options.onFileProgress || function() {});
      Gallo.Events.addEventListener("fileError", this.options.onFileError || function() {});
      Gallo.Events.addEventListener("fileLoaded", this.options.onFileLoaded || function() {});
      Gallo.Events.addEventListener("overallProgress", this.options.onOverallProgress || function() {});
      Gallo.Events.addEventListener("manifestLoaded", this.options.onManifestLoaded || this.handleManifestLoaded);
      this.init();
      return this;
    }

    Loader.prototype.init = function() {
      this.reset();
      return this.loadAll();
    };

    Loader.prototype.reset = function() {
      if (this.preload != null) {
        this.preload.close();
      }
      this.manifest = this.manifestCache.slice();
      this.map = {};
      this.preload = new createjs.LoadQueue(true, "assets/");
      createjs.Sound.registerPlugin(createjs.HTMLAudioPlugin);
      this.preload.installPlugin(createjs.Sound);
      this.preload.addEventListener("loadstart", this.handleLoadStart);
      this.preload.addEventListener("filestart", this.handleFileStart);
      this.preload.addEventListener("fileload", this.handleFileLoaded);
      this.preload.addEventListener("progress", this.handleOverallProgress);
      this.preload.addEventListener("fileprogress", this.handleFileProgress);
      this.preload.addEventListener("error", this.handleFileError);
      this.preload.addEventListener("complete", this.handlePreloadComplete);
      this.preload.setMaxConnections(5);
      return Gallo.Events.dispatchEvent('reset');
    };

    Loader.prototype.stop = function() {
      if (this.preload != null) {
        return this.preload.close();
      }
    };

    Loader.prototype.updateItemList = function(item, container) {
      return this.map[item] = container;
    };

    Loader.prototype.loadAll = function() {
      var _results;

      _results = [];
      while (this.manifest.length > 0) {
        _results.push(this.loadAnother());
      }
      return _results;
    };

    Loader.prototype.loadAnother = function() {
      var div, img, item;

      item = this.manifest.shift();
      if (this.manifest.length === 0) {
        event.options = {
          item: item,
          manifest: this.manifest
        };
        Gallo.Events.dispatchEvent('manifestLoaded', event);
      }
      div = $("#template").clone();
      if (this.lazyLoad().isOn() === true && this.getImageType(item) === 'image') {
        img = $("<img />");
        img.addClass("lazy");
        img.attr("src", "assets/grey.jpg");
        img.attr("data-original", "assets/" + item);
        img.attr("width", this.w);
        img.attr("height", this.h);
        div.append(img);
      }
      div.attr("id", "");
      div.addClass("box");
      $("#container").append(div);
      this.updateItemList(item, div);
      if (this.lazyLoad().isOn() === true && this.getImageType(item) === 'image') {
        $(img).lazyload({
          event: 'render',
          effect: 'fadeIn'
        });
        $(img).trigger("render");
      } else {
        this.preload.loadFile(item);
      }
      event.options = {
        item: item,
        manifest: this.manifest
      };
      return Gallo.Events.dispatchEvent('loadAnother', event);
    };

    Loader.prototype.getImageType = function(item) {
      var itemType, _ref;

      itemType = (_ref = item.split('.')) != null ? _ref.pop() : void 0;
      if (itemType === 'jpg' || itemType === 'png' || itemType === 'gif' || itemType === 'svg') {
        itemType = 'image';
      }
      return itemType;
    };

    Loader.prototype.lazyLoad = function() {
      var _this = this;

      return {
        on: function() {
          return _this.lazy = true;
        },
        off: function() {
          return _this.lazy = false;
        },
        isOn: function() {
          if (_this.lazy === true) {
            return true;
          } else {
            return false;
          }
        }
      };
    };

    Loader.prototype.loadSeveral = function(num) {
      var totalItems, _results;

      totalItems = this.manifest.length;
      _results = [];
      while (this.manifest.length > totalItems - num) {
        _results.push(this.loadAnother());
      }
      return _results;
    };

    Loader.prototype.handleFileLoaded = function(event) {
      var div, ir, item, r, result;

      event.options = {
        item: this.map[event.item.src],
        w: this.w,
        h: this.h
      };
      item = this.map[event.item.src];
      result = event.result;
      div = item;
      switch (event.item.type) {
        case createjs.LoadQueue.CSS:
          (document.head || document.getElementsByTagName("head")[0]).appendChild(result);
          div.append("<label>CSS Loaded</label>");
          break;
        case createjs.LoadQueue.IMAGE:
          div.addClass("complete");
          r = result.width / result.height;
          ir = this.w / this.h;
          if (r > ir) {
            result.width = this.w;
            result.height = this.w / r;
          } else {
            result.height = this.h;
            result.width = this.h;
          }
          div.append(result);
          break;
        case createjs.LoadQueue.JAVASCRIPT:
          document.body.appendChild(result);
          div.addClass("complete");
          div.append("<label>JavaScript Loaded</label>");
          break;
        case createjs.LoadQueue.JSON:
        case createjs.LoadQueue.JSONP:
          console.log(result);
          div.addClass("complete");
          div.append("<label>JSON loaded</label>");
          break;
        case createjs.LoadQueue.XML:
          console.log(result);
          div.addClass("complete");
          div.append("<label>XML loaded</label>");
          break;
        case createjs.LoadQueue.SOUND:
          $(event.item).addClass("complete");
          document.body.appendChild(result);
          result.play();
          break;
        case createjs.LoadQueue.SVG:
          div.addClass("complete");
          div.append(result);
      }
      return Gallo.Events.dispatchEvent('fileLoaded', event);
    };

    Loader.prototype.handleFileProgress = function(event) {
      event.options = {
        item: this.map[event.item.src],
        progress: event.progress
      };
      return Gallo.Events.dispatchEvent('fileProgress', event);
    };

    Loader.prototype.handleOverallProgress = function(event) {
      event.options = {
        preload: this.preload
      };
      return Gallo.Events.dispatchEvent('overallProgress', event);
    };

    Loader.prototype.handleFileError = function(event) {
      event.options = {
        item: this.map[event.item.src]
      };
      return Gallo.Events.dispatchEvent('fileError', event);
    };

    Loader.prototype.handleFileStart = function(event) {
      event.options = {
        item: this.map[event.item.src]
      };
      return Gallo.Events.dispatchEvent('fileStart', event);
    };

    Loader.prototype.handleLoadStart = function(event) {
      event.options = {
        preload: this.preload
      };
      return Gallo.Events.dispatchEvent('loadStart', event);
    };

    Loader.prototype.handlePreloadComplete = function(event) {
      return Gallo.Events.dispatchEvent('complete', event);
    };

    Loader.prototype.handleManifestLoaded = function(event) {
      $(".loadButton").attr("disabled", "disabled");
      return $(".loadButton .reload").css("display", "inline");
    };

    return Loader;

  })(Gallo);

  Gallo.Loader = Loader;

}).call(this);
