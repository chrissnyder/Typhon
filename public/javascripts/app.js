(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"application": function(exports, require, module) {
  (function() {
    var App, Desk, Graph, Messages, NewRelic, Project, Projects, Tweet, Tweets,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    require('lib/setup');

    Messages = require('lib/messages');

    Desk = require('models/Desk');

    NewRelic = require('models/NewRelic');

    Project = require('models/Project');

    Tweet = require('models/Tweet');

    Graph = require('controllers/graph');

    Projects = require('controllers/projects');

    Tweets = require('controllers/tweets');

    App = (function(_super) {

      __extends(App, _super);

      App.prototype.elements = {
        '#tweets': 'tweets',
        '#projects': 'projects',
        '#graph': 'graph'
      };

      function App() {
        this.render = __bind(this.render, this);
        var graph, messages, projects, tweets;
        App.__super__.constructor.apply(this, arguments);
        this.render();
        tweets = new Tweets({
          el: this.tweets
        });
        Tweet.fetch();
        projects = new Projects({
          el: this.projects
        });
        Project.fetch();
        Desk.fetch();
        graph = new Graph({
          el: this.graph
        });
        messages = new Messages();
      }

      App.prototype.render = function() {
        return this.html(require('views/app')());
      };

      return App;

    })(Spine.Controller);

    module.exports = App;

  }).call(this);
  
}});

window.require.define({"controllers/graph": function(exports, require, module) {
  (function() {
    var Graph, NewRelic,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    NewRelic = require('models/NewRelic');

    Graph = (function(_super) {

      __extends(Graph, _super);

      function Graph() {
        this.drawGraph = __bind(this.drawGraph, this);      Graph.__super__.constructor.apply(this, arguments);
        NewRelic.bind('create update', this.drawGraph);
        this.getData();
        setInterval(this.getData, 60000);
      }

      Graph.prototype.drawGraph = function(data) {
        this.el.empty();
        this.graph = new Rickshaw.Graph({
          element: document.getElementById('graph'),
          renderer: 'area',
          series: [
            {
              color: '#f47a4b',
              data: data.times
            }
          ]
        });
        return this.graph.render();
      };

      Graph.prototype.getData = function() {
        return NewRelic.fetch();
      };

      return Graph;

    })(Spine.Controller);

    module.exports = Graph;

  }).call(this);
  
}});

window.require.define({"controllers/project_item": function(exports, require, module) {
  (function() {
    var ProjectItem,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    ProjectItem = (function(_super) {

      __extends(ProjectItem, _super);

      ProjectItem.prototype.tag = 'li';

      function ProjectItem() {
        this.render = __bind(this.render, this);      ProjectItem.__super__.constructor.apply(this, arguments);
        if (!this.project) throw 'Must pass a project.';
        this.project.bind('update', this.render);
      }

      ProjectItem.prototype.render = function(project) {
        var index,
          _this = this;
        if (project) this.project = project;
        this.html(require('views/projects/project_item')(this.project));
        if (project != null) {
          index = this.el.index();
          this.el.css({
            position: 'absolute',
            left: this.el.outerWidth() * index
          });
          this.el.before('<li class="blank"></li>');
          this.el.parent().animate({
            paddingLeft: this.el.outerWidth()
          }, 1700, function() {});
          this.el.parent().find('.blank').animate({
            width: 0
          }, 1700, function() {
            return console.log($(this).remove());
          });
          this.el.animate({
            left: 0
          }, 2200, function() {
            _this.el.insertBefore(_this.el.parent().children().first());
            _this.el.css({
              position: 'relative'
            });
            return _this.el.parent().css({
              paddingLeft: 0
            });
          });
        }
        return this.el;
      };

      return ProjectItem;

    })(Spine.Controller);

    module.exports = ProjectItem;

  }).call(this);
  
}});

window.require.define({"controllers/projects": function(exports, require, module) {
  (function() {
    var Project, ProjectItem, Projects,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Project = require('models/Project');

    ProjectItem = require('controllers/project_item');

    Projects = (function(_super) {

      __extends(Projects, _super);

      Projects.prototype.tag = 'ul';

      function Projects() {
        this.add = __bind(this.add, this);      Projects.__super__.constructor.apply(this, arguments);
        Project.bind('create', this.add);
      }

      Projects.prototype.add = function(project) {
        project = new ProjectItem({
          project: project
        });
        this.append(project.render());
        return this.el.css({
          width: this.el.children().size() * this.el.children().first().outerWidth()
        });
      };

      return Projects;

    })(Spine.Controller);

    module.exports = Projects;

  }).call(this);
  
}});

window.require.define({"controllers/repo_item": function(exports, require, module) {
  (function() {
    var RepoItem,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    RepoItem = (function(_super) {

      __extends(RepoItem, _super);

      RepoItem.prototype.tag = 'li';

      function RepoItem() {
        this.render = __bind(this.render, this);      RepoItem.__super__.constructor.apply(this, arguments);
        this.repo.bind('update', this.render);
      }

      RepoItem.prototype.render = function(repo) {
        if (repo) this.repo = repo;
        return this.html(require('views/repos/repo_item')(this.repo));
      };

      return RepoItem;

    })(Spine.Controller);

    module.exports = RepoItem;

  }).call(this);
  
}});

window.require.define({"controllers/repos": function(exports, require, module) {
  (function() {
    var RepoItem, Repos, Repository,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Repository = require('models/Repository');

    RepoItem = require('controllers/repo_item');

    Repos = (function(_super) {

      __extends(Repos, _super);

      Repos.prototype.tag = 'ul';

      function Repos() {
        this.addAll = __bind(this.addAll, this);
        this.add = __bind(this.add, this);      Repos.__super__.constructor.apply(this, arguments);
        Repository.bind('create', this.add);
        Repository.bind('refresh', this.addAll);
      }

      Repos.prototype.add = function(repo) {
        repo = new RepoItem({
          repo: repo
        });
        return this.append(repo.render());
      };

      Repos.prototype.addAll = function() {
        return Repository.each(this.add);
      };

      return Repos;

    })(Spine.Controller);

    module.exports = Repos;

  }).call(this);
  
}});

window.require.define({"controllers/tickets": function(exports, require, module) {
  (function() {
    var Tickets,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Tickets = (function(_super) {

      __extends(Tickets, _super);

      function Tickets() {
        Tickets.__super__.constructor.apply(this, arguments);
      }

      return Tickets;

    })(Spine.Controller);

    module.exports = Tickets;

  }).call(this);
  
}});

window.require.define({"controllers/tweet_item": function(exports, require, module) {
  (function() {
    var Tweet, TweetItem, TwitterText,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    TwitterText = require('lib/twitter-text');

    Tweet = require('models/Tweet');

    TweetItem = (function(_super) {

      __extends(TweetItem, _super);

      TweetItem.prototype.className = 'tweet';

      TweetItem.prototype.tag = 'li';

      function TweetItem() {
        this.linkTweet = __bind(this.linkTweet, this);
        this.remove = __bind(this.remove, this);
        this.render = __bind(this.render, this);      TweetItem.__super__.constructor.apply(this, arguments);
        if (!this.tweet) throw 'Must pass a tweet';
        this.tweet.bind('destroy', this.remove);
      }

      TweetItem.prototype.render = function(tweet) {
        if (tweet) this.tweet = tweet;
        return this.html(require('views/tweets/tweet_item')(this));
      };

      TweetItem.prototype.remove = function() {
        var tweet_width,
          _this = this;
        tweet_width = this.el.width();
        return this.el.animate({
          marginLeft: -tweet_width - 35
        }, (tweet_width / 100) * 1000, 'linear', function() {
          _this.el.remove();
          return Tweet.first().destroy();
        });
      };

      TweetItem.prototype.linkTweet = function(text) {
        return TwitterText.autoLink(text);
      };

      return TweetItem;

    })(Spine.Controller);

    module.exports = TweetItem;

  }).call(this);
  
}});

window.require.define({"controllers/tweets": function(exports, require, module) {
  (function() {
    var Tweet, TweetItem, Tweets,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Tweet = require('models/Tweet');

    TweetItem = require('controllers/tweet_item');

    Tweets = (function(_super) {

      __extends(Tweets, _super);

      Tweets.prototype.tag = 'ul';

      function Tweets() {
        this.fetchTweets = __bind(this.fetchTweets, this);
        this.beginAnimation = __bind(this.beginAnimation, this);
        this.add = __bind(this.add, this);      Tweets.__super__.constructor.apply(this, arguments);
        Tweet.bind('create', this.add);
        Tweet.one('create', this.beginAnimation);
        Tweet.bind('destroy', this.fetchTweets);
      }

      Tweets.prototype.add = function(tweet) {
        tweet = new TweetItem({
          tweet: tweet
        });
        return this.append(tweet.render());
      };

      Tweets.prototype.beginAnimation = function() {
        var screen_width, time,
          _this = this;
        screen_width = $(document).width();
        time = (screen_width / 100) * 1000;
        this.el.css('margin-left', screen_width);
        return this.el.animate({
          marginLeft: 0
        }, time, 'linear', function() {
          return Tweet.first().destroy();
        });
      };

      Tweets.prototype.fetchTweets = function() {
        if (Tweet.count() < 6) return Tweet.fetch();
      };

      return Tweets;

    })(Spine.Controller);

    module.exports = Tweets;

  }).call(this);
  
}});

window.require.define({"lib/messages": function(exports, require, module) {
  (function() {
    var Messages, Project,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Project = require('models/Project');

    Messages = (function(_super) {

      __extends(Messages, _super);

      Messages.prototype.pusherKey = 'b2c4abfba1fee4e72f41';

      Messages.prototype.pusherChannel = 'buildboard';

      Messages.prototype.pusher = {
        'project': 'onProjectUpdate'
      };

      function Messages() {
        this.setupPusherBindings = __bind(this.setupPusherBindings, this);
        this.openChannel = __bind(this.openChannel, this);
        this.openPusher = __bind(this.openPusher, this);
        this.setupPusher = __bind(this.setupPusher, this);      this.pusherChannels = {};
        this.setupPusher();
      }

      Messages.prototype.setupPusher = function() {
        this.openPusher();
        return this.setupPusherBindings(this.defaultChannel, this.pusher);
      };

      Messages.prototype.openPusher = function() {
        if (!this.pusherKey) throw "You need to specify a pusher key";
        this.pusherConnection = new Pusher(this.pusherKey);
        return this.defaultChannel = this.openChannel(this.pusherChannel);
      };

      Messages.prototype.openChannel = function(channelName) {
        return this.pusherChannels[channelName] = this.pusherConnection.subscribe(channelName);
      };

      Messages.prototype.setupPusherBindings = function(channel, bindings) {
        var key, method, _results;
        _results = [];
        for (key in bindings) {
          method = bindings[key];
          _results.push(channel.bind(key, this[method]));
        }
        return _results;
      };

      Messages.prototype.onProjectUpdate = function(data) {
        var p;
        p = Project.findByAttribute('_id', data._id.toLowerCase());
        if (p != null) {
          return p.updateAttributes(data);
        } else {
          return console.log('project not found');
        }
      };

      return Messages;

    })(Spine.Controller);

    module.exports = Messages;

  }).call(this);
  
}});

window.require.define({"lib/setup": function(exports, require, module) {
  (function() {
    var Collection, Instance, Singleton, Spine, isArray, require, singularize, underscore,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    $.ajaxSetup({
      beforeSend: function(xhr, settings) {
        if (window.location.hostname === "0.0.0.0" || window.location.hostname === "localhost") {} else {
          return console.log('');
        }
      }
    });

    Spine = this.Spine || require('spine');

    isArray = Spine.isArray;

    require = this.require || (function(value) {
      return eval(value);
    });

    Collection = (function(_super) {

      __extends(Collection, _super);

      function Collection(options) {
        var key, value;
        if (options == null) options = {};
        for (key in options) {
          value = options[key];
          this[key] = value;
        }
      }

      Collection.prototype.all = function() {
        var _this = this;
        return this.model.select(function(rec) {
          return _this.associated(rec);
        });
      };

      Collection.prototype.first = function() {
        return this.all()[0];
      };

      Collection.prototype.last = function() {
        var values;
        values = this.all();
        return values[values.length - 1];
      };

      Collection.prototype.find = function(id) {
        var records,
          _this = this;
        records = this.select(function(rec) {
          return rec.id + '' === id + '';
        });
        if (!records[0]) throw 'Unknown record';
        return records[0];
      };

      Collection.prototype.findAllByAttribute = function(name, value) {
        var _this = this;
        return this.model.select(function(rec) {
          return _this.associated(rec) && rec[name] === value;
        });
      };

      Collection.prototype.findByAttribute = function(name, value) {
        return this.findAllByAttribute(name, value)[0];
      };

      Collection.prototype.select = function(cb) {
        var _this = this;
        return this.model.select(function(rec) {
          return _this.associated(rec) && cb(rec);
        });
      };

      Collection.prototype.refresh = function(values) {
        var record, records, _i, _j, _len, _len2, _ref;
        _ref = this.all();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          record = _ref[_i];
          delete this.model.records[record.id];
        }
        records = this.model.fromJSON(values);
        if (!isArray(records)) records = [records];
        for (_j = 0, _len2 = records.length; _j < _len2; _j++) {
          record = records[_j];
          record.newRecord = false;
          record[this.fkey] = this.record.id;
          this.model.records[record.id] = record;
        }
        return this.model.trigger('refresh', this.model.cloneArray(records));
      };

      Collection.prototype.create = function(record) {
        record[this.fkey] = this.record.id;
        return this.model.create(record);
      };

      Collection.prototype.associated = function(record) {
        return record[this.fkey] === this.record.id;
      };

      return Collection;

    })(Spine.Module);

    Instance = (function(_super) {

      __extends(Instance, _super);

      function Instance(options) {
        var key, value;
        if (options == null) options = {};
        for (key in options) {
          value = options[key];
          this[key] = value;
        }
      }

      Instance.prototype.exists = function() {
        return this.record[this.fkey] && this.model.exists(this.record[this.fkey]);
      };

      Instance.prototype.update = function(value) {
        if (!(value instanceof this.model)) value = new this.model(value);
        if (value.isNew()) value.save();
        return this.record[this.fkey] = value && value.id;
      };

      return Instance;

    })(Spine.Module);

    Singleton = (function(_super) {

      __extends(Singleton, _super);

      function Singleton(options) {
        var key, value;
        if (options == null) options = {};
        for (key in options) {
          value = options[key];
          this[key] = value;
        }
      }

      Singleton.prototype.find = function() {
        return this.record.id && this.model.findByAttribute(this.fkey, this.record.id);
      };

      Singleton.prototype.update = function(value) {
        if (!(value instanceof this.model)) value = this.model.fromJSON(value);
        value[this.fkey] = this.record.id;
        return value.save();
      };

      return Singleton;

    })(Spine.Module);

    singularize = function(str) {
      return str.replace(/s$/, '');
    };

    underscore = function(str) {
      return str.replace(/::/g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/-/g, '_').toLowerCase();
    };

    Spine.Model.extend({
      hasMany: function(name, model, fkey) {
        var association;
        if (fkey == null) fkey = "" + (underscore(this.className)) + "_id";
        association = function(record) {
          if (typeof model === 'string') model = require(model);
          return new Collection({
            name: name,
            model: model,
            record: record,
            fkey: fkey
          });
        };
        return this.prototype[name] = function(value) {
          if (value != null) association(this).refresh(value);
          return association(this);
        };
      },
      belongsTo: function(name, model, fkey) {
        var association;
        if (fkey == null) fkey = "" + (singularize(name)) + "_id";
        association = function(record) {
          if (typeof model === 'string') model = require(model);
          return new Instance({
            name: name,
            model: model,
            record: record,
            fkey: fkey
          });
        };
        this.prototype[name] = function(value) {
          if (value != null) association(this).update(value);
          return association(this).exists();
        };
        return this.attributes.push(fkey);
      },
      hasOne: function(name, model, fkey) {
        var association;
        if (fkey == null) fkey = "" + (underscore(this.className)) + "_id";
        association = function(record) {
          if (typeof model === 'string') model = require(model);
          return new Singleton({
            name: name,
            model: model,
            record: record,
            fkey: fkey
          });
        };
        return this.prototype[name] = function(value) {
          if (value != null) association(this).update(value);
          return association(this).find();
        };
      }
    });

  }).call(this);
  
}});

window.require.define({"lib/twitter-text": function(exports, require, module) {
  if (typeof window === "undefined" || window === null) {
    window = { twttr: {} };
  }
  if (window.twttr == null) {
    window.twttr = {};
  }
  if (typeof twttr === "undefined" || twttr === null) {
    twttr = {};
  }

  (function() {
    twttr.txt = {};
    twttr.txt.regexen = {};

    var HTML_ENTITIES = {
      '&': '&amp;',
      '>': '&gt;',
      '<': '&lt;',
      '"': '&quot;',
      "'": '&#39;'
    };

    // HTML escaping
    twttr.txt.htmlEscape = function(text) {
      return text && text.replace(/[&"'><]/g, function(character) {
        return HTML_ENTITIES[character];
      });
    };

    // Builds a RegExp
    function regexSupplant(regex, flags) {
      flags = flags || "";
      if (typeof regex !== "string") {
        if (regex.global && flags.indexOf("g") < 0) {
          flags += "g";
        }
        if (regex.ignoreCase && flags.indexOf("i") < 0) {
          flags += "i";
        }
        if (regex.multiline && flags.indexOf("m") < 0) {
          flags += "m";
        }

        regex = regex.source;
      }

      return new RegExp(regex.replace(/#\{(\w+)\}/g, function(match, name) {
        var newRegex = twttr.txt.regexen[name] || "";
        if (typeof newRegex !== "string") {
          newRegex = newRegex.source;
        }
        return newRegex;
      }), flags);
    }

    twttr.txt.regexSupplant = regexSupplant;

    // simple string interpolation
    function stringSupplant(str, values) {
      return str.replace(/#\{(\w+)\}/g, function(match, name) {
        return values[name] || "";
      });
    }

    twttr.txt.stringSupplant = stringSupplant;

    function addCharsToCharClass(charClass, start, end) {
      var s = String.fromCharCode(start);
      if (end !== start) {
        s += "-" + String.fromCharCode(end);
      }
      charClass.push(s);
      return charClass;
    }

    twttr.txt.addCharsToCharClass = addCharsToCharClass;

    // Space is more than %20, U+3000 for example is the full-width space used with Kanji. Provide a short-hand
    // to access both the list of characters and a pattern suitible for use with String#split
    // Taken from: ActiveSupport::Multibyte::Handlers::UTF8Handler::UNICODE_WHITESPACE
    var fromCode = String.fromCharCode;
    var UNICODE_SPACES = [
      fromCode(0x0020), // White_Space # Zs       SPACE
      fromCode(0x0085), // White_Space # Cc       <control-0085>
      fromCode(0x00A0), // White_Space # Zs       NO-BREAK SPACE
      fromCode(0x1680), // White_Space # Zs       OGHAM SPACE MARK
      fromCode(0x180E), // White_Space # Zs       MONGOLIAN VOWEL SEPARATOR
      fromCode(0x2028), // White_Space # Zl       LINE SEPARATOR
      fromCode(0x2029), // White_Space # Zp       PARAGRAPH SEPARATOR
      fromCode(0x202F), // White_Space # Zs       NARROW NO-BREAK SPACE
      fromCode(0x205F), // White_Space # Zs       MEDIUM MATHEMATICAL SPACE
      fromCode(0x3000)  // White_Space # Zs       IDEOGRAPHIC SPACE
    ];
    addCharsToCharClass(UNICODE_SPACES, 0x009, 0x00D); // White_Space # Cc   [5] <control-0009>..<control-000D>
    addCharsToCharClass(UNICODE_SPACES, 0x2000, 0x200A); // White_Space # Zs  [11] EN QUAD..HAIR SPACE

    var INVALID_CHARS = [
      fromCode(0xFFFE),
      fromCode(0xFEFF), // BOM
      fromCode(0xFFFF) // Special
    ];
    addCharsToCharClass(INVALID_CHARS, 0x202A, 0x202E); // Directional change

    twttr.txt.regexen.spaces_group = regexSupplant(UNICODE_SPACES.join(""));
    twttr.txt.regexen.spaces = regexSupplant("[" + UNICODE_SPACES.join("") + "]");
    twttr.txt.regexen.invalid_chars_group = regexSupplant(INVALID_CHARS.join(""));
    twttr.txt.regexen.punct = /\!'#%&'\(\)*\+,\\\-\.\/:;<=>\?@\[\]\^_{|}~\$/;

    var nonLatinHashtagChars = [];
    // Cyrillic
    addCharsToCharClass(nonLatinHashtagChars, 0x0400, 0x04ff); // Cyrillic
    addCharsToCharClass(nonLatinHashtagChars, 0x0500, 0x0527); // Cyrillic Supplement
    addCharsToCharClass(nonLatinHashtagChars, 0x2de0, 0x2dff); // Cyrillic Extended A
    addCharsToCharClass(nonLatinHashtagChars, 0xa640, 0xa69f); // Cyrillic Extended B
    // Hebrew
    addCharsToCharClass(nonLatinHashtagChars, 0x0591, 0x05bf); // Hebrew
    addCharsToCharClass(nonLatinHashtagChars, 0x05c1, 0x05c2);
    addCharsToCharClass(nonLatinHashtagChars, 0x05c4, 0x05c5);
    addCharsToCharClass(nonLatinHashtagChars, 0x05c7, 0x05c7);
    addCharsToCharClass(nonLatinHashtagChars, 0x05d0, 0x05ea);
    addCharsToCharClass(nonLatinHashtagChars, 0x05f0, 0x05f4);
    addCharsToCharClass(nonLatinHashtagChars, 0xfb12, 0xfb28); // Hebrew Presentation Forms
    addCharsToCharClass(nonLatinHashtagChars, 0xfb2a, 0xfb36);
    addCharsToCharClass(nonLatinHashtagChars, 0xfb38, 0xfb3c);
    addCharsToCharClass(nonLatinHashtagChars, 0xfb3e, 0xfb3e);
    addCharsToCharClass(nonLatinHashtagChars, 0xfb40, 0xfb41);
    addCharsToCharClass(nonLatinHashtagChars, 0xfb43, 0xfb44);
    addCharsToCharClass(nonLatinHashtagChars, 0xfb46, 0xfb4f);
    // Arabic
    addCharsToCharClass(nonLatinHashtagChars, 0x0610, 0x061a); // Arabic
    addCharsToCharClass(nonLatinHashtagChars, 0x0620, 0x065f);
    addCharsToCharClass(nonLatinHashtagChars, 0x066e, 0x06d3);
    addCharsToCharClass(nonLatinHashtagChars, 0x06d5, 0x06dc);
    addCharsToCharClass(nonLatinHashtagChars, 0x06de, 0x06e8);
    addCharsToCharClass(nonLatinHashtagChars, 0x06ea, 0x06ef);
    addCharsToCharClass(nonLatinHashtagChars, 0x06fa, 0x06fc);
    addCharsToCharClass(nonLatinHashtagChars, 0x06ff, 0x06ff);
    addCharsToCharClass(nonLatinHashtagChars, 0x0750, 0x077f); // Arabic Supplement
    addCharsToCharClass(nonLatinHashtagChars, 0x08a0, 0x08a0); // Arabic Extended A
    addCharsToCharClass(nonLatinHashtagChars, 0x08a2, 0x08ac);
    addCharsToCharClass(nonLatinHashtagChars, 0x08e4, 0x08fe);
    addCharsToCharClass(nonLatinHashtagChars, 0xfb50, 0xfbb1); // Arabic Pres. Forms A
    addCharsToCharClass(nonLatinHashtagChars, 0xfbd3, 0xfd3d);
    addCharsToCharClass(nonLatinHashtagChars, 0xfd50, 0xfd8f);
    addCharsToCharClass(nonLatinHashtagChars, 0xfd92, 0xfdc7);
    addCharsToCharClass(nonLatinHashtagChars, 0xfdf0, 0xfdfb);
    addCharsToCharClass(nonLatinHashtagChars, 0xfe70, 0xfe74); // Arabic Pres. Forms B
    addCharsToCharClass(nonLatinHashtagChars, 0xfe76, 0xfefc);
    addCharsToCharClass(nonLatinHashtagChars, 0x200c, 0x200c); // Zero-Width Non-Joiner
    // Thai
    addCharsToCharClass(nonLatinHashtagChars, 0x0e01, 0x0e3a);
    addCharsToCharClass(nonLatinHashtagChars, 0x0e40, 0x0e4e);
    // Hangul (Korean)
    addCharsToCharClass(nonLatinHashtagChars, 0x1100, 0x11ff); // Hangul Jamo
    addCharsToCharClass(nonLatinHashtagChars, 0x3130, 0x3185); // Hangul Compatibility Jamo
    addCharsToCharClass(nonLatinHashtagChars, 0xA960, 0xA97F); // Hangul Jamo Extended-A
    addCharsToCharClass(nonLatinHashtagChars, 0xAC00, 0xD7AF); // Hangul Syllables
    addCharsToCharClass(nonLatinHashtagChars, 0xD7B0, 0xD7FF); // Hangul Jamo Extended-B
    addCharsToCharClass(nonLatinHashtagChars, 0xFFA1, 0xFFDC); // half-width Hangul
    // Japanese and Chinese
    addCharsToCharClass(nonLatinHashtagChars, 0x30A1, 0x30FA); // Katakana (full-width)
    addCharsToCharClass(nonLatinHashtagChars, 0x30FC, 0x30FE); // Katakana Chouon and iteration marks (full-width)
    addCharsToCharClass(nonLatinHashtagChars, 0xFF66, 0xFF9F); // Katakana (half-width)
    addCharsToCharClass(nonLatinHashtagChars, 0xFF70, 0xFF70); // Katakana Chouon (half-width)
    addCharsToCharClass(nonLatinHashtagChars, 0xFF10, 0xFF19); // \
    addCharsToCharClass(nonLatinHashtagChars, 0xFF21, 0xFF3A); //  - Latin (full-width)
    addCharsToCharClass(nonLatinHashtagChars, 0xFF41, 0xFF5A); // /
    addCharsToCharClass(nonLatinHashtagChars, 0x3041, 0x3096); // Hiragana
    addCharsToCharClass(nonLatinHashtagChars, 0x3099, 0x309E); // Hiragana voicing and iteration mark
    addCharsToCharClass(nonLatinHashtagChars, 0x3400, 0x4DBF); // Kanji (CJK Extension A)
    addCharsToCharClass(nonLatinHashtagChars, 0x4E00, 0x9FFF); // Kanji (Unified)
    // -- Disabled as it breaks the Regex.
    //addCharsToCharClass(nonLatinHashtagChars, 0x20000, 0x2A6DF); // Kanji (CJK Extension B)
    addCharsToCharClass(nonLatinHashtagChars, 0x2A700, 0x2B73F); // Kanji (CJK Extension C)
    addCharsToCharClass(nonLatinHashtagChars, 0x2B740, 0x2B81F); // Kanji (CJK Extension D)
    addCharsToCharClass(nonLatinHashtagChars, 0x2F800, 0x2FA1F); // Kanji (CJK supplement)
    addCharsToCharClass(nonLatinHashtagChars, 0x3003, 0x3003); // Kanji iteration mark
    addCharsToCharClass(nonLatinHashtagChars, 0x3005, 0x3005); // Kanji iteration mark
    addCharsToCharClass(nonLatinHashtagChars, 0x303B, 0x303B); // Han iteration mark

    twttr.txt.regexen.nonLatinHashtagChars = regexSupplant(nonLatinHashtagChars.join(""));

    var latinAccentChars = [];
    // Latin accented characters (subtracted 0xD7 from the range, it's a confusable multiplication sign. Looks like "x")
    addCharsToCharClass(latinAccentChars, 0x00c0, 0x00d6);
    addCharsToCharClass(latinAccentChars, 0x00d8, 0x00f6);
    addCharsToCharClass(latinAccentChars, 0x00f8, 0x00ff);
    // Latin Extended A and B
    addCharsToCharClass(latinAccentChars, 0x0100, 0x024f);
    // assorted IPA Extensions
    addCharsToCharClass(latinAccentChars, 0x0253, 0x0254);
    addCharsToCharClass(latinAccentChars, 0x0256, 0x0257);
    addCharsToCharClass(latinAccentChars, 0x0259, 0x0259);
    addCharsToCharClass(latinAccentChars, 0x025b, 0x025b);
    addCharsToCharClass(latinAccentChars, 0x0263, 0x0263);
    addCharsToCharClass(latinAccentChars, 0x0268, 0x0268);
    addCharsToCharClass(latinAccentChars, 0x026f, 0x026f);
    addCharsToCharClass(latinAccentChars, 0x0272, 0x0272);
    addCharsToCharClass(latinAccentChars, 0x0289, 0x0289);
    addCharsToCharClass(latinAccentChars, 0x028b, 0x028b);
    // Okina for Hawaiian (it *is* a letter character)
    addCharsToCharClass(latinAccentChars, 0x02bb, 0x02bb);
    // Combining diacritics
    addCharsToCharClass(latinAccentChars, 0x0300, 0x036f);
    // Latin Extended Additional
    addCharsToCharClass(latinAccentChars, 0x1e00, 0x1eff);
    twttr.txt.regexen.latinAccentChars = regexSupplant(latinAccentChars.join(""));

    // A hashtag must contain characters, numbers and underscores, but not all numbers.
    twttr.txt.regexen.hashSigns = /[#＃]/;
    twttr.txt.regexen.hashtagAlpha = regexSupplant(/[a-z_#{latinAccentChars}#{nonLatinHashtagChars}]/i);
    twttr.txt.regexen.hashtagAlphaNumeric = regexSupplant(/[a-z0-9_#{latinAccentChars}#{nonLatinHashtagChars}]/i);
    twttr.txt.regexen.endHashtagMatch = regexSupplant(/^(?:#{hashSigns}|:\/\/)/);
    twttr.txt.regexen.hashtagBoundary = regexSupplant(/(?:^|$|[^&a-z0-9_#{latinAccentChars}#{nonLatinHashtagChars}])/);
    twttr.txt.regexen.validHashtag = regexSupplant(/(#{hashtagBoundary})(#{hashSigns})(#{hashtagAlphaNumeric}*#{hashtagAlpha}#{hashtagAlphaNumeric}*)/gi);

    // Mention related regex collection
    twttr.txt.regexen.validMentionPrecedingChars = /(?:^|[^a-zA-Z0-9_!#$%&*@＠]|RT:?)/;
    twttr.txt.regexen.atSigns = /[@＠]/;
    twttr.txt.regexen.validMentionOrList = regexSupplant(
      '(#{validMentionPrecedingChars})' +  // $1: Preceding character
      '(#{atSigns})' +                     // $2: At mark
      '([a-zA-Z0-9_]{1,20})' +             // $3: Screen name
      '(\/[a-zA-Z][a-zA-Z0-9_\-]{0,24})?'  // $4: List (optional)
    , 'g');
    twttr.txt.regexen.validReply = regexSupplant(/^(?:#{spaces})*#{atSigns}([a-zA-Z0-9_]{1,20})/);
    twttr.txt.regexen.endMentionMatch = regexSupplant(/^(?:#{atSigns}|[#{latinAccentChars}]|:\/\/)/);

    // URL related regex collection
    twttr.txt.regexen.validUrlPrecedingChars = regexSupplant(/(?:[^A-Za-z0-9@＠$#＃#{invalid_chars_group}]|^)/);
    twttr.txt.regexen.invalidUrlWithoutProtocolPrecedingChars = /[-_.\/]$/;
    twttr.txt.regexen.invalidDomainChars = stringSupplant("#{punct}#{spaces_group}#{invalid_chars_group}", twttr.txt.regexen);
    twttr.txt.regexen.validDomainChars = regexSupplant(/[^#{invalidDomainChars}]/);
    twttr.txt.regexen.validSubdomain = regexSupplant(/(?:(?:#{validDomainChars}(?:[_-]|#{validDomainChars})*)?#{validDomainChars}\.)/);
    twttr.txt.regexen.validDomainName = regexSupplant(/(?:(?:#{validDomainChars}(?:-|#{validDomainChars})*)?#{validDomainChars}\.)/);
    twttr.txt.regexen.validGTLD = regexSupplant(/(?:(?:aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|xxx)(?=[^0-9a-zA-Z]|$))/);
    twttr.txt.regexen.validCCTLD = regexSupplant(/(?:(?:ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|ss|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw)(?=[^0-9a-zA-Z]|$))/);
    twttr.txt.regexen.validPunycode = regexSupplant(/(?:xn--[0-9a-z]+)/);
    twttr.txt.regexen.validDomain = regexSupplant(/(?:#{validSubdomain}*#{validDomainName}(?:#{validGTLD}|#{validCCTLD}|#{validPunycode}))/);
    twttr.txt.regexen.validAsciiDomain = regexSupplant(/(?:(?:[a-z0-9#{latinAccentChars}]+)\.)+(?:#{validGTLD}|#{validCCTLD}|#{validPunycode})/gi);
    twttr.txt.regexen.invalidShortDomain = regexSupplant(/^#{validDomainName}#{validCCTLD}$/);

    twttr.txt.regexen.validPortNumber = regexSupplant(/[0-9]+/);

    twttr.txt.regexen.validGeneralUrlPathChars = regexSupplant(/[a-z0-9!\*';:=\+,\.\$\/%#\[\]\-_~|&#{latinAccentChars}]/i);
    // Allow URL paths to contain balanced parens
    //  1. Used in Wikipedia URLs like /Primer_(film)
    //  2. Used in IIS sessions like /S(dfd346)/
    twttr.txt.regexen.validUrlBalancedParens = regexSupplant(/\(#{validGeneralUrlPathChars}+\)/i);
    // Valid end-of-path chracters (so /foo. does not gobble the period).
    // 1. Allow =&# for empty URL parameters and other URL-join artifacts
    twttr.txt.regexen.validUrlPathEndingChars = regexSupplant(/[\+\-a-z0-9=_#\/#{latinAccentChars}]|(?:#{validUrlBalancedParens})/i);
    // Allow @ in a url, but only in the middle. Catch things like http://example.com/@user/
    twttr.txt.regexen.validUrlPath = regexSupplant('(?:' +
      '(?:' +
        '#{validGeneralUrlPathChars}*' +
          '(?:#{validUrlBalancedParens}#{validGeneralUrlPathChars}*)*' +
          '#{validUrlPathEndingChars}'+
        ')|(?:@#{validGeneralUrlPathChars}+\/)'+
      ')', 'i');

    twttr.txt.regexen.validUrlQueryChars = /[a-z0-9!?\*'\(\);:&=\+\$\/%#\[\]\-_\.,~|]/i;
    twttr.txt.regexen.validUrlQueryEndingChars = /[a-z0-9_&=#\/]/i;
    twttr.txt.regexen.extractUrl = regexSupplant(
      '('                                                            + // $1 total match
        '(#{validUrlPrecedingChars})'                                + // $2 Preceeding chracter
        '('                                                          + // $3 URL
          '(https?:\\/\\/)?'                                         + // $4 Protocol (optional)
          '(#{validDomain})'                                         + // $5 Domain(s)
          '(?::(#{validPortNumber}))?'                               + // $6 Port number (optional)
          '(\\/#{validUrlPath}*)?'                                   + // $7 URL Path
          '(\\?#{validUrlQueryChars}*#{validUrlQueryEndingChars})?'  + // $8 Query String
        ')'                                                          +
      ')'
    , 'gi');

    twttr.txt.regexen.validTcoUrl = /^https?:\/\/t\.co\/[a-z0-9]+/i;

    // cashtag related regex
    twttr.txt.regexen.cashtag = /[a-z]{1,6}(?:[._][a-z]{1,2})?/i;
    twttr.txt.regexen.validCashtag = regexSupplant('(^|#{spaces})(\\$)(#{cashtag})(?=$|\\s|[#{punct}])', 'gi');

    // These URL validation pattern strings are based on the ABNF from RFC 3986
    twttr.txt.regexen.validateUrlUnreserved = /[a-z0-9\-._~]/i;
    twttr.txt.regexen.validateUrlPctEncoded = /(?:%[0-9a-f]{2})/i;
    twttr.txt.regexen.validateUrlSubDelims = /[!$&'()*+,;=]/i;
    twttr.txt.regexen.validateUrlPchar = regexSupplant('(?:' +
      '#{validateUrlUnreserved}|' +
      '#{validateUrlPctEncoded}|' +
      '#{validateUrlSubDelims}|' +
      '[:|@]' +
    ')', 'i');

    twttr.txt.regexen.validateUrlScheme = /(?:[a-z][a-z0-9+\-.]*)/i;
    twttr.txt.regexen.validateUrlUserinfo = regexSupplant('(?:' +
      '#{validateUrlUnreserved}|' +
      '#{validateUrlPctEncoded}|' +
      '#{validateUrlSubDelims}|' +
      ':' +
    ')*', 'i');

    twttr.txt.regexen.validateUrlDecOctet = /(?:[0-9]|(?:[1-9][0-9])|(?:1[0-9]{2})|(?:2[0-4][0-9])|(?:25[0-5]))/i;
    twttr.txt.regexen.validateUrlIpv4 = regexSupplant(/(?:#{validateUrlDecOctet}(?:\.#{validateUrlDecOctet}){3})/i);

    // Punting on real IPv6 validation for now
    twttr.txt.regexen.validateUrlIpv6 = /(?:\[[a-f0-9:\.]+\])/i;

    // Also punting on IPvFuture for now
    twttr.txt.regexen.validateUrlIp = regexSupplant('(?:' +
      '#{validateUrlIpv4}|' +
      '#{validateUrlIpv6}' +
    ')', 'i');

    // This is more strict than the rfc specifies
    twttr.txt.regexen.validateUrlSubDomainSegment = /(?:[a-z0-9](?:[a-z0-9_\-]*[a-z0-9])?)/i;
    twttr.txt.regexen.validateUrlDomainSegment = /(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?)/i;
    twttr.txt.regexen.validateUrlDomainTld = /(?:[a-z](?:[a-z0-9\-]*[a-z0-9])?)/i;
    twttr.txt.regexen.validateUrlDomain = regexSupplant(/(?:(?:#{validateUrlSubDomainSegment]}\.)*(?:#{validateUrlDomainSegment]}\.)#{validateUrlDomainTld})/i);

    twttr.txt.regexen.validateUrlHost = regexSupplant('(?:' +
      '#{validateUrlIp}|' +
      '#{validateUrlDomain}' +
    ')', 'i');

    // Unencoded internationalized domains - this doesn't check for invalid UTF-8 sequences
    twttr.txt.regexen.validateUrlUnicodeSubDomainSegment = /(?:(?:[a-z0-9]|[^\u0000-\u007f])(?:(?:[a-z0-9_\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i;
    twttr.txt.regexen.validateUrlUnicodeDomainSegment = /(?:(?:[a-z0-9]|[^\u0000-\u007f])(?:(?:[a-z0-9\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i;
    twttr.txt.regexen.validateUrlUnicodeDomainTld = /(?:(?:[a-z]|[^\u0000-\u007f])(?:(?:[a-z0-9\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i;
    twttr.txt.regexen.validateUrlUnicodeDomain = regexSupplant(/(?:(?:#{validateUrlUnicodeSubDomainSegment}\.)*(?:#{validateUrlUnicodeDomainSegment}\.)#{validateUrlUnicodeDomainTld})/i);

    twttr.txt.regexen.validateUrlUnicodeHost = regexSupplant('(?:' +
      '#{validateUrlIp}|' +
      '#{validateUrlUnicodeDomain}' +
    ')', 'i');

    twttr.txt.regexen.validateUrlPort = /[0-9]{1,5}/;

    twttr.txt.regexen.validateUrlUnicodeAuthority = regexSupplant(
      '(?:(#{validateUrlUserinfo})@)?'  + // $1 userinfo
      '(#{validateUrlUnicodeHost})'     + // $2 host
      '(?::(#{validateUrlPort}))?'        //$3 port
    , "i");

    twttr.txt.regexen.validateUrlAuthority = regexSupplant(
      '(?:(#{validateUrlUserinfo})@)?' + // $1 userinfo
      '(#{validateUrlHost})'           + // $2 host
      '(?::(#{validateUrlPort}))?'       // $3 port
    , "i");

    twttr.txt.regexen.validateUrlPath = regexSupplant(/(\/#{validateUrlPchar}*)*/i);
    twttr.txt.regexen.validateUrlQuery = regexSupplant(/(#{validateUrlPchar}|\/|\?)*/i);
    twttr.txt.regexen.validateUrlFragment = regexSupplant(/(#{validateUrlPchar}|\/|\?)*/i);

    // Modified version of RFC 3986 Appendix B
    twttr.txt.regexen.validateUrlUnencoded = regexSupplant(
      '^'                               + // Full URL
      '(?:'                             +
        '([^:/?#]+):\\/\\/'             + // $1 Scheme
      ')?'                              +
      '([^/?#]*)'                       + // $2 Authority
      '([^?#]*)'                        + // $3 Path
      '(?:'                             +
        '\\?([^#]*)'                    + // $4 Query
      ')?'                              +
      '(?:'                             +
        '#(.*)'                         + // $5 Fragment
      ')?$'
    , "i");


    // Default CSS class for auto-linked lists (along with the url class)
    var DEFAULT_LIST_CLASS = "tweet-url list-slug";
    // Default CSS class for auto-linked usernames (along with the url class)
    var DEFAULT_USERNAME_CLASS = "tweet-url username";
    // Default CSS class for auto-linked hashtags (along with the url class)
    var DEFAULT_HASHTAG_CLASS = "tweet-url hashtag";
    // Default CSS class for auto-linked cashtags (along with the url class)
    var DEFAULT_CASHTAG_CLASS = "tweet-url cashtag";
    // Options which should not be passed as HTML attributes
    var OPTIONS_NOT_ATTRIBUTES = {'urlClass':true, 'listClass':true, 'usernameClass':true, 'hashtagClass':true, 'cashtagClass':true,
                              'usernameUrlBase':true, 'listUrlBase':true, 'hashtagUrlBase':true, 'cashtagUrlBase':true,
                              'usernameUrlBlock':true, 'listUrlBlock':true, 'hashtagUrlBlock':true, 'linkUrlBlock':true,
                              'usernameIncludeSymbol':true, 'suppressLists':true, 'suppressNoFollow':true,
                              'suppressDataScreenName':true, 'urlEntities':true, 'symbolTag':true, 'textWithSymbolTag':true, 'urlTarget':true,
                              'invisibleTagAttrs':true, 'linkAttributeBlock':true, 'linkTextBlock': true
                              };
    var BOOLEAN_ATTRIBUTES = {'disabled':true, 'readonly':true, 'multiple':true, 'checked':true};

    // Simple object cloning function for simple objects
    function clone(o) {
      var r = {};
      for (var k in o) {
        if (o.hasOwnProperty(k)) {
          r[k] = o[k];
        }
      }

      return r;
    }

    twttr.txt.tagAttrs = function(attributes) {
      var htmlAttrs = "";
      for (var k in attributes) {
        var v = attributes[k];
        if (BOOLEAN_ATTRIBUTES[k]) {
          v = v ? k : null;
        }
        if (v == null) continue;
        htmlAttrs += " " + twttr.txt.htmlEscape(k) + "=\"" + twttr.txt.htmlEscape(v.toString()) + "\"";
      }
      return htmlAttrs;
    };

    twttr.txt.linkToText = function(entity, text, attributes, options) {
      if (!options.suppressNoFollow) {
        attributes.rel = "nofollow";
      }
      // if linkAttributeBlock is specified, call it to modify the attributes
      if (options.linkAttributeBlock) {
        options.linkAttributeBlock(entity, attributes);
      }
      // if linkTextBlock is specified, call it to get a new/modified link text
      if (options.linkTextBlock) {
        text = options.linkTextBlock(entity, text);
      }
      var d = {
        text: text,
        attr: twttr.txt.tagAttrs(attributes)
      };
      return stringSupplant("<a#{attr}>#{text}</a>", d);
    };

    twttr.txt.linkToTextWithSymbol = function(entity, symbol, text, attributes, options) {
      var taggedSymbol = options.symbolTag ? "<" + options.symbolTag + ">" + symbol + "</"+ options.symbolTag + ">" : symbol;
      text = twttr.txt.htmlEscape(text);
      var taggedText = options.textWithSymbolTag ? "<" + options.textWithSymbolTag + ">" + text + "</"+ options.textWithSymbolTag + ">" : text;

      if (options.usernameIncludeSymbol || !symbol.match(twttr.txt.regexen.atSigns)) {
        return twttr.txt.linkToText(entity, taggedSymbol + taggedText, attributes, options);
      } else {
        return taggedSymbol + twttr.txt.linkToText(entity, taggedText, attributes, options);
      }
    };

    twttr.txt.linkToHashtag = function(entity, text, options) {
      var hash = text.substring(entity.indices[0], entity.indices[0] + 1);
      var hashtag = twttr.txt.htmlEscape(entity.hashtag);
      var attrs = clone(options.htmlAttrs || {});
      attrs.href = options.hashtagUrlBase + hashtag;
      attrs.title = "#" + hashtag;
      attrs["class"] = options.hashtagClass;

      return twttr.txt.linkToTextWithSymbol(entity, hash, hashtag, attrs, options);
    };

    twttr.txt.linkToCashtag = function(entity, text, options) {
      var cashtag = twttr.txt.htmlEscape(entity.cashtag);
      var attrs = clone(options.htmlAttrs || {});
      attrs.href = options.cashtagUrlBase + cashtag;
      attrs.title = "$" + cashtag;
      attrs["class"] =  options.cashtagClass;

      return twttr.txt.linkToTextWithSymbol(entity, "$", cashtag, attrs, options);
    };

    twttr.txt.linkToMentionAndList = function(entity, text, options) {
      var at = text.substring(entity.indices[0], entity.indices[0] + 1);
      var user = twttr.txt.htmlEscape(entity.screenName);
      var slashListname = twttr.txt.htmlEscape(entity.listSlug);
      var isList = entity.listSlug && !options.suppressLists;
      var attrs = clone(options.htmlAttrs || {});
      attrs["class"] = (isList ? options.listClass : options.usernameClass);
      attrs.href = isList ? options.listUrlBase + user + slashListname : options.usernameUrlBase + user;
      if (!isList && !options.suppressDataScreenName) {
        attrs['data-screen-name'] = user;
      }

      return twttr.txt.linkToTextWithSymbol(entity, at, isList ? user + slashListname : user, attrs, options);
    };

    twttr.txt.linkToUrl = function(entity, text, options) {
      var url = entity.url;
      var displayUrl = url;
      var linkText = twttr.txt.htmlEscape(displayUrl);

      // If the caller passed a urlEntities object (provided by a Twitter API
      // response with include_entities=true), we use that to render the display_url
      // for each URL instead of it's underlying t.co URL.
      var urlEntity = (options.urlEntities && options.urlEntities[url]) || entity;
      if (urlEntity.display_url) {
        linkText = twttr.txt.linkTextWithEntity(urlEntity, options);
      }

      var attrs = clone(options.htmlAttrs || {});
      attrs.href = url;

      // set class only if urlClass is specified.
      if (options.urlClass) {
        attrs["class"] = options.urlClass;
      }

      // set target only if urlTarget is specified.
      if (options.urlTarget) {
        attrs.target = options.urlTarget;
      }

      if (!options.title && urlEntity.display_url) {
        attrs.title = urlEntity.expanded_url;
      }

      return twttr.txt.linkToText(entity, linkText, attrs, options);
    };

    twttr.txt.linkTextWithEntity = function (entity, options) {
      var displayUrl = entity.display_url;
      var expandedUrl = entity.expanded_url;

      // Goal: If a user copies and pastes a tweet containing t.co'ed link, the resulting paste
      // should contain the full original URL (expanded_url), not the display URL.
      //
      // Method: Whenever possible, we actually emit HTML that contains expanded_url, and use
      // font-size:0 to hide those parts that should not be displayed (because they are not part of display_url).
      // Elements with font-size:0 get copied even though they are not visible.
      // Note that display:none doesn't work here. Elements with display:none don't get copied.
      //
      // Additionally, we want to *display* ellipses, but we don't want them copied.  To make this happen we
      // wrap the ellipses in a tco-ellipsis class and provide an onCopy handler that sets display:none on
      // everything with the tco-ellipsis class.
      //
      // Exception: pic.twitter.com images, for which expandedUrl = "https://twitter.com/#!/username/status/1234/photo/1
      // For those URLs, display_url is not a substring of expanded_url, so we don't do anything special to render the elided parts.
      // For a pic.twitter.com URL, the only elided part will be the "https://", so this is fine.

      var displayUrlSansEllipses = displayUrl.replace(/…/g, ""); // We have to disregard ellipses for matching
      // Note: we currently only support eliding parts of the URL at the beginning or the end.
      // Eventually we may want to elide parts of the URL in the *middle*.  If so, this code will
      // become more complicated.  We will probably want to create a regexp out of display URL,
      // replacing every ellipsis with a ".*".
      if (expandedUrl.indexOf(displayUrlSansEllipses) != -1) {
        var displayUrlIndex = expandedUrl.indexOf(displayUrlSansEllipses);
        var v = {
          displayUrlSansEllipses: displayUrlSansEllipses,
          // Portion of expandedUrl that precedes the displayUrl substring
          beforeDisplayUrl: expandedUrl.substr(0, displayUrlIndex),
          // Portion of expandedUrl that comes after displayUrl
          afterDisplayUrl: expandedUrl.substr(displayUrlIndex + displayUrlSansEllipses.length),
          precedingEllipsis: displayUrl.match(/^…/) ? "…" : "",
          followingEllipsis: displayUrl.match(/…$/) ? "…" : ""
        };
        for (var k in v) {
          if (v.hasOwnProperty(k)) {
            v[k] = twttr.txt.htmlEscape(v[k]);
          }
        }
        // As an example: The user tweets "hi http://longdomainname.com/foo"
        // This gets shortened to "hi http://t.co/xyzabc", with display_url = "…nname.com/foo"
        // This will get rendered as:
        // <span class='tco-ellipsis'> <!-- This stuff should get displayed but not copied -->
        //   …
        //   <!-- There's a chance the onCopy event handler might not fire. In case that happens,
        //        we include an &nbsp; here so that the … doesn't bump up against the URL and ruin it.
        //        The &nbsp; is inside the tco-ellipsis span so that when the onCopy handler *does*
        //        fire, it doesn't get copied.  Otherwise the copied text would have two spaces in a row,
        //        e.g. "hi  http://longdomainname.com/foo".
        //   <span style='font-size:0'>&nbsp;</span>
        // </span>
        // <span style='font-size:0'>  <!-- This stuff should get copied but not displayed -->
        //   http://longdomai
        // </span>
        // <span class='js-display-url'> <!-- This stuff should get displayed *and* copied -->
        //   nname.com/foo
        // </span>
        // <span class='tco-ellipsis'> <!-- This stuff should get displayed but not copied -->
        //   <span style='font-size:0'>&nbsp;</span>
        //   …
        // </span>
        v['invisible'] = options.invisibleTagAttrs;
        return stringSupplant("<span class='tco-ellipsis'>#{precedingEllipsis}<span #{invisible}>&nbsp;</span></span><span #{invisible}>#{beforeDisplayUrl}</span><span class='js-display-url'>#{displayUrlSansEllipses}</span><span #{invisible}>#{afterDisplayUrl}</span><span class='tco-ellipsis'><span #{invisible}>&nbsp;</span>#{followingEllipsis}</span>", v);
      }
      return displayUrl;
    };

    twttr.txt.autoLinkEntities = function(text, entities, options) {
      options = clone(options || {});

      options.hashtagClass = options.hashtagClass || DEFAULT_HASHTAG_CLASS;
      options.hashtagUrlBase = options.hashtagUrlBase || "https://twitter.com/#!/search?q=%23";
      options.cashtagClass = options.cashtagClass || DEFAULT_CASHTAG_CLASS;
      options.cashtagUrlBase = options.cashtagUrlBase || "https://twitter.com/#!/search?q=%24";
      options.listClass = options.listClass || DEFAULT_LIST_CLASS;
      options.usernameClass = options.usernameClass || DEFAULT_USERNAME_CLASS;
      options.usernameUrlBase = options.usernameUrlBase || "https://twitter.com/";
      options.listUrlBase = options.listUrlBase || "https://twitter.com/";
      options.htmlAttrs = twttr.txt.extractHtmlAttrsFromOptions(options);
      options.invisibleTagAttrs = options.invisibleTagAttrs || "style='position:absolute;left:-9999px;'";

      // remap url entities to hash
      var urlEntities, i, len;
      if(options.urlEntities) {
        urlEntities = {};
        for(i = 0, len = options.urlEntities.length; i < len; i++) {
          urlEntities[options.urlEntities[i].url] = options.urlEntities[i];
        }
        options.urlEntities = urlEntities;
      }

      var result = "";
      var beginIndex = 0;

      // sort entities by start index
      entities.sort(function(a,b){ return a.indices[0] - b.indices[0]; });

      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        result += text.substring(beginIndex, entity.indices[0]);

        if (entity.url) {
          result += twttr.txt.linkToUrl(entity, text, options);
        } else if (entity.hashtag) {
          result += twttr.txt.linkToHashtag(entity, text, options);
        } else if (entity.screenName) {
          result += twttr.txt.linkToMentionAndList(entity, text, options);
        } else if (entity.cashtag) {
          result += twttr.txt.linkToCashtag(entity, text, options);
        }
        beginIndex = entity.indices[1];
      }
      result += text.substring(beginIndex, text.length);
      return result;
    };

    twttr.txt.autoLinkWithJSON = function(text, json, options) {
      // concatenate all entities
      var entities = [];
      for (var key in json) {
        entities = entities.concat(json[key]);
      }
      // map JSON entity to twitter-text entity
      for (var i = 0; i < entities.length; i++) {
        entity = entities[i];
        if (entity.screen_name) {
          // this is @mention
          entity.screenName = entity.screen_name;
        } else if (entity.text) {
          // this is #hashtag
          entity.hashtag = entity.text;
        }
      }
      // modify indices to UTF-16
      twttr.txt.modifyIndicesFromUnicodeToUTF16(text, entities);

      return twttr.txt.autoLinkEntities(text, entities, options);
    };

    twttr.txt.extractHtmlAttrsFromOptions = function(options) {
      var htmlAttrs = {};
      for (var k in options) {
        var v = options[k];
        if (OPTIONS_NOT_ATTRIBUTES[k]) continue;
        if (BOOLEAN_ATTRIBUTES[k]) {
          v = v ? k : null;
        }
        if (v == null) continue;
        htmlAttrs[k] = v;
      }
      return htmlAttrs;
    };

    twttr.txt.autoLink = function(text, options) {
      var entities = twttr.txt.extractEntitiesWithIndices(text, {extractUrlWithoutProtocol: false});
      return twttr.txt.autoLinkEntities(text, entities, options);
    };

    twttr.txt.autoLinkUsernamesOrLists = function(text, options) {
      var entities = twttr.txt.extractMentionsOrListsWithIndices(text);
      return twttr.txt.autoLinkEntities(text, entities, options);
    };

    twttr.txt.autoLinkHashtags = function(text, options) {
      var entities = twttr.txt.extractHashtagsWithIndices(text);
      return twttr.txt.autoLinkEntities(text, entities, options);
    };

    twttr.txt.autoLinkCashtags = function(text, options) {
      var entities = twttr.txt.extractCashtagsWithIndices(text);
      return twttr.txt.autoLinkEntities(text, entities, options);
    };

    twttr.txt.autoLinkUrlsCustom = function(text, options) {
      var entities = twttr.txt.extractUrlsWithIndices(text, {extractUrlWithoutProtocol: false});
      return twttr.txt.autoLinkEntities(text, entities, options);
    };

    twttr.txt.removeOverlappingEntities = function(entities) {
      entities.sort(function(a,b){ return a.indices[0] - b.indices[0]; });

      var prev = entities[0];
      for (var i = 1; i < entities.length; i++) {
        if (prev.indices[1] > entities[i].indices[0]) {
          entities.splice(i, 1);
          i--;
        } else {
          prev = entities[i];
        }
      }
    };

    twttr.txt.extractEntitiesWithIndices = function(text, options) {
      var entities = twttr.txt.extractUrlsWithIndices(text, options)
                      .concat(twttr.txt.extractMentionsOrListsWithIndices(text))
                      .concat(twttr.txt.extractHashtagsWithIndices(text, {checkUrlOverlap: false}))
                      .concat(twttr.txt.extractCashtagsWithIndices(text));

      if (entities.length == 0) {
        return [];
      }

      twttr.txt.removeOverlappingEntities(entities);
      return entities;
    };

    twttr.txt.extractMentions = function(text) {
      var screenNamesOnly = [],
          screenNamesWithIndices = twttr.txt.extractMentionsWithIndices(text);

      for (var i = 0; i < screenNamesWithIndices.length; i++) {
        var screenName = screenNamesWithIndices[i].screenName;
        screenNamesOnly.push(screenName);
      }

      return screenNamesOnly;
    };

    twttr.txt.extractMentionsWithIndices = function(text) {
      var mentions = [];
      var mentionsOrLists = twttr.txt.extractMentionsOrListsWithIndices(text);

      for (var i = 0 ; i < mentionsOrLists.length; i++) {
        mentionOrList = mentionsOrLists[i];
        if (mentionOrList.listSlug == '') {
          mentions.push({
            screenName: mentionOrList.screenName,
            indices: mentionOrList.indices
          });
        }
      }

      return mentions;
    };

    /**
     * Extract list or user mentions.
     * (Presence of listSlug indicates a list)
     */
    twttr.txt.extractMentionsOrListsWithIndices = function(text) {
      if (!text || !text.match(twttr.txt.regexen.atSigns)) {
        return [];
      }

      var possibleNames = [];

      text.replace(twttr.txt.regexen.validMentionOrList, function(match, before, atSign, screenName, slashListname, offset, chunk) {
        var after = chunk.slice(offset + match.length);
        if (!after.match(twttr.txt.regexen.endMentionMatch)) {
          slashListname = slashListname || '';
          var startPosition = offset + before.length;
          var endPosition = startPosition + screenName.length + slashListname.length + 1;
          possibleNames.push({
            screenName: screenName,
            listSlug: slashListname,
            indices: [startPosition, endPosition]
          });
        }
      });

      return possibleNames;
    };


    twttr.txt.extractReplies = function(text) {
      if (!text) {
        return null;
      }

      var possibleScreenName = text.match(twttr.txt.regexen.validReply);
      if (!possibleScreenName ||
          RegExp.rightContext.match(twttr.txt.regexen.endMentionMatch)) {
        return null;
      }

      return possibleScreenName[1];
    };

    twttr.txt.extractUrls = function(text, options) {
      var urlsOnly = [],
          urlsWithIndices = twttr.txt.extractUrlsWithIndices(text, options);

      for (var i = 0; i < urlsWithIndices.length; i++) {
        urlsOnly.push(urlsWithIndices[i].url);
      }

      return urlsOnly;
    };

    twttr.txt.extractUrlsWithIndices = function(text, options) {
      if (!options) {
        options = {extractUrlsWithoutProtocol: true};
      }

      if (!text || (options.extractUrlsWithoutProtocol ? !text.match(/\./) : !text.match(/:/))) {
        return [];
      }

      var urls = [];

      while (twttr.txt.regexen.extractUrl.exec(text)) {
        var before = RegExp.$2, url = RegExp.$3, protocol = RegExp.$4, domain = RegExp.$5, path = RegExp.$7;
        var endPosition = twttr.txt.regexen.extractUrl.lastIndex,
            startPosition = endPosition - url.length;

        // if protocol is missing and domain contains non-ASCII characters,
        // extract ASCII-only domains.
        if (!protocol) {
          if (!options.extractUrlsWithoutProtocol
              || before.match(twttr.txt.regexen.invalidUrlWithoutProtocolPrecedingChars)) {
            continue;
          }
          var lastUrl = null,
              lastUrlInvalidMatch = false,
              asciiEndPosition = 0;
          domain.replace(twttr.txt.regexen.validAsciiDomain, function(asciiDomain) {
            var asciiStartPosition = domain.indexOf(asciiDomain, asciiEndPosition);
            asciiEndPosition = asciiStartPosition + asciiDomain.length;
            lastUrl = {
              url: asciiDomain,
              indices: [startPosition + asciiStartPosition, startPosition + asciiEndPosition]
            };
            lastUrlInvalidMatch = asciiDomain.match(twttr.txt.regexen.invalidShortDomain);
            if (!lastUrlInvalidMatch) {
              urls.push(lastUrl);
            }
          });

          // no ASCII-only domain found. Skip the entire URL.
          if (lastUrl == null) {
            continue;
          }

          // lastUrl only contains domain. Need to add path and query if they exist.
          if (path) {
            if (lastUrlInvalidMatch) {
              urls.push(lastUrl);
            }
            lastUrl.url = url.replace(domain, lastUrl.url);
            lastUrl.indices[1] = endPosition;
          }
        } else {
          // In the case of t.co URLs, don't allow additional path characters.
          if (url.match(twttr.txt.regexen.validTcoUrl)) {
            url = RegExp.lastMatch;
            endPosition = startPosition + url.length;
          }
          urls.push({
            url: url,
            indices: [startPosition, endPosition]
          });
        }
      }

      return urls;
    };

    twttr.txt.extractHashtags = function(text) {
      var hashtagsOnly = [],
          hashtagsWithIndices = twttr.txt.extractHashtagsWithIndices(text);

      for (var i = 0; i < hashtagsWithIndices.length; i++) {
        hashtagsOnly.push(hashtagsWithIndices[i].hashtag);
      }

      return hashtagsOnly;
    };

    twttr.txt.extractHashtagsWithIndices = function(text, options) {
      if (!options) {
        options = {checkUrlOverlap: true};
      }

      if (!text || !text.match(twttr.txt.regexen.hashSigns)) {
        return [];
      }

      var tags = [];

      text.replace(twttr.txt.regexen.validHashtag, function(match, before, hash, hashText, offset, chunk) {
        var after = chunk.slice(offset + match.length);
        if (after.match(twttr.txt.regexen.endHashtagMatch))
          return;
        var startPosition = offset + before.length;
        var endPosition = startPosition + hashText.length + 1;
        tags.push({
          hashtag: hashText,
          indices: [startPosition, endPosition]
        });
      });

      if (options.checkUrlOverlap) {
        // also extract URL entities
        var urls = twttr.txt.extractUrlsWithIndices(text);
        if (urls.length > 0) {
          var entities = tags.concat(urls);
          // remove overlap
          twttr.txt.removeOverlappingEntities(entities);
          // only push back hashtags
          tags = [];
          for (var i = 0; i < entities.length; i++) {
            if (entities[i].hashtag) {
              tags.push(entities[i]);
            }
          }
        }
      }

      return tags;
    };

    twttr.txt.extractCashtags = function(text) {
      var cashtagsOnly = [],
          cashtagsWithIndices = twttr.txt.extractCashtagsWithIndices(text);

      for (var i = 0; i < cashtagsWithIndices.length; i++) {
        cashtagsOnly.push(cashtagsWithIndices[i].cashtag);
      }

      return cashtagsOnly;
    };

    twttr.txt.extractCashtagsWithIndices = function(text) {
      if (!text || text.indexOf("$") == -1) {
        return [];
      }

      var tags = [];

      text.replace(twttr.txt.regexen.validCashtag, function(match, before, dollar, cashtag, offset, chunk) {
        var startPosition = offset + before.length;
        var endPosition = startPosition + cashtag.length + 1;
        tags.push({
          cashtag: cashtag,
          indices: [startPosition, endPosition]
        });
      });

      return tags;
    };

    twttr.txt.modifyIndicesFromUnicodeToUTF16 = function(text, entities) {
      twttr.txt.convertUnicodeIndices(text, entities, false);
    };

    twttr.txt.modifyIndicesFromUTF16ToUnicode = function(text, entities) {
      twttr.txt.convertUnicodeIndices(text, entities, true);
    };

    twttr.txt.convertUnicodeIndices = function(text, entities, indicesInUTF16) {
      if (entities.length == 0) {
        return;
      }

      var charIndex = 0;
      var codePointIndex = 0;

      // sort entities by start index
      entities.sort(function(a,b){ return a.indices[0] - b.indices[0]; });
      var entityIndex = 0;
      var entity = entities[0];

      while (charIndex < text.length) {
        if (entity.indices[0] == (indicesInUTF16 ? charIndex : codePointIndex)) {
          var len = entity.indices[1] - entity.indices[0];
          entity.indices[0] = indicesInUTF16 ? codePointIndex : charIndex;
          entity.indices[1] = entity.indices[0] + len;

          entityIndex++;
          if (entityIndex == entities.length) {
            // no more entity
            break;
          }
          entity = entities[entityIndex];
        }

        var c = text.charCodeAt(charIndex);
        if (0xD800 <= c && c <= 0xDBFF && charIndex < text.length - 1) {
          // Found high surrogate char
          c = text.charCodeAt(charIndex + 1);
          if (0xDC00 <= c && c <= 0xDFFF) {
            // Found surrogate pair
            charIndex++;
          }
        }
        codePointIndex++;
        charIndex++;
      }
    };

    // this essentially does text.split(/<|>/)
    // except that won't work in IE, where empty strings are ommitted
    // so "<>".split(/<|>/) => [] in IE, but is ["", "", ""] in all others
    // but "<<".split("<") => ["", "", ""]
    twttr.txt.splitTags = function(text) {
      var firstSplits = text.split("<"),
          secondSplits,
          allSplits = [],
          split;

      for (var i = 0; i < firstSplits.length; i += 1) {
        split = firstSplits[i];
        if (!split) {
          allSplits.push("");
        } else {
          secondSplits = split.split(">");
          for (var j = 0; j < secondSplits.length; j += 1) {
            allSplits.push(secondSplits[j]);
          }
        }
      }

      return allSplits;
    };

    twttr.txt.hitHighlight = function(text, hits, options) {
      var defaultHighlightTag = "em";

      hits = hits || [];
      options = options || {};

      if (hits.length === 0) {
        return text;
      }

      var tagName = options.tag || defaultHighlightTag,
          tags = ["<" + tagName + ">", "</" + tagName + ">"],
          chunks = twttr.txt.splitTags(text),
          i,
          j,
          result = "",
          chunkIndex = 0,
          chunk = chunks[0],
          prevChunksLen = 0,
          chunkCursor = 0,
          startInChunk = false,
          chunkChars = chunk,
          flatHits = [],
          index,
          hit,
          tag,
          placed,
          hitSpot;

      for (i = 0; i < hits.length; i += 1) {
        for (j = 0; j < hits[i].length; j += 1) {
          flatHits.push(hits[i][j]);
        }
      }

      for (index = 0; index < flatHits.length; index += 1) {
        hit = flatHits[index];
        tag = tags[index % 2];
        placed = false;

        while (chunk != null && hit >= prevChunksLen + chunk.length) {
          result += chunkChars.slice(chunkCursor);
          if (startInChunk && hit === prevChunksLen + chunkChars.length) {
            result += tag;
            placed = true;
          }

          if (chunks[chunkIndex + 1]) {
            result += "<" + chunks[chunkIndex + 1] + ">";
          }

          prevChunksLen += chunkChars.length;
          chunkCursor = 0;
          chunkIndex += 2;
          chunk = chunks[chunkIndex];
          chunkChars = chunk;
          startInChunk = false;
        }

        if (!placed && chunk != null) {
          hitSpot = hit - prevChunksLen;
          result += chunkChars.slice(chunkCursor, hitSpot) + tag;
          chunkCursor = hitSpot;
          if (index % 2 === 0) {
            startInChunk = true;
          } else {
            startInChunk = false;
          }
        } else if(!placed) {
          placed = true;
          result += tag;
        }
      }

      if (chunk != null) {
        if (chunkCursor < chunkChars.length) {
          result += chunkChars.slice(chunkCursor);
        }
        for (index = chunkIndex + 1; index < chunks.length; index += 1) {
          result += (index % 2 === 0 ? chunks[index] : "<" + chunks[index] + ">");
        }
      }

      return result;
    };

    var MAX_LENGTH = 140;

    // Characters not allowed in Tweets
    var INVALID_CHARACTERS = [
      // BOM
      fromCode(0xFFFE),
      fromCode(0xFEFF),

      // Special
      fromCode(0xFFFF),

      // Directional Change
      fromCode(0x202A),
      fromCode(0x202B),
      fromCode(0x202C),
      fromCode(0x202D),
      fromCode(0x202E)
    ];

    // Returns the length of Tweet text with consideration to t.co URL replacement
    twttr.txt.getTweetLength = function(text, options) {
      if (!options) {
        options = {
            short_url_length: 20,
            short_url_length_https: 21
        };
      }
      var textLength = text.length;
      var urlsWithIndices = twttr.txt.extractUrlsWithIndices(text);

      for (var i = 0; i < urlsWithIndices.length; i++) {
        // Subtract the length of the original URL
        textLength += urlsWithIndices[i].indices[0] - urlsWithIndices[i].indices[1];

        // Add 21 characters for URL starting with https://
        // Otherwise add 20 characters
        if (urlsWithIndices[i].url.toLowerCase().match(/^https:\/\//)) {
           textLength += options.short_url_length_https;
        } else {
          textLength += options.short_url_length;
        }
      }

      return textLength;
    };

    // Check the text for any reason that it may not be valid as a Tweet. This is meant as a pre-validation
    // before posting to api.twitter.com. There are several server-side reasons for Tweets to fail but this pre-validation
    // will allow quicker feedback.
    //
    // Returns false if this text is valid. Otherwise one of the following strings will be returned:
    //
    //   "too_long": if the text is too long
    //   "empty": if the text is nil or empty
    //   "invalid_characters": if the text contains non-Unicode or any of the disallowed Unicode characters
    twttr.txt.isInvalidTweet = function(text) {
      if (!text) {
        return "empty";
      }

      // Determine max length independent of URL length
      if (twttr.txt.getTweetLength(text) > MAX_LENGTH) {
        return "too_long";
      }

      for (var i = 0; i < INVALID_CHARACTERS.length; i++) {
        if (text.indexOf(INVALID_CHARACTERS[i]) >= 0) {
          return "invalid_characters";
        }
      }

      return false;
    };

    twttr.txt.isValidTweetText = function(text) {
      return !twttr.txt.isInvalidTweet(text);
    };

    twttr.txt.isValidUsername = function(username) {
      if (!username) {
        return false;
      }

      var extracted = twttr.txt.extractMentions(username);

      // Should extract the username minus the @ sign, hence the .slice(1)
      return extracted.length === 1 && extracted[0] === username.slice(1);
    };

    var VALID_LIST_RE = regexSupplant(/^#{validMentionOrList}$/);

    twttr.txt.isValidList = function(usernameList) {
      var match = usernameList.match(VALID_LIST_RE);

      // Must have matched and had nothing before or after
      return !!(match && match[1] == "" && match[4]);
    };

    twttr.txt.isValidHashtag = function(hashtag) {
      if (!hashtag) {
        return false;
      }

      var extracted = twttr.txt.extractHashtags(hashtag);

      // Should extract the hashtag minus the # sign, hence the .slice(1)
      return extracted.length === 1 && extracted[0] === hashtag.slice(1);
    };

    twttr.txt.isValidUrl = function(url, unicodeDomains, requireProtocol) {
      if (unicodeDomains == null) {
        unicodeDomains = true;
      }

      if (requireProtocol == null) {
        requireProtocol = true;
      }

      if (!url) {
        return false;
      }

      var urlParts = url.match(twttr.txt.regexen.validateUrlUnencoded);

      if (!urlParts || urlParts[0] !== url) {
        return false;
      }

      var scheme = urlParts[1],
          authority = urlParts[2],
          path = urlParts[3],
          query = urlParts[4],
          fragment = urlParts[5];

      if (!(
        (!requireProtocol || (isValidMatch(scheme, twttr.txt.regexen.validateUrlScheme) && scheme.match(/^https?$/i))) &&
        isValidMatch(path, twttr.txt.regexen.validateUrlPath) &&
        isValidMatch(query, twttr.txt.regexen.validateUrlQuery, true) &&
        isValidMatch(fragment, twttr.txt.regexen.validateUrlFragment, true)
      )) {
        return false;
      }

      return (unicodeDomains && isValidMatch(authority, twttr.txt.regexen.validateUrlUnicodeAuthority)) ||
             (!unicodeDomains && isValidMatch(authority, twttr.txt.regexen.validateUrlAuthority));
    };

    function isValidMatch(string, regex, optional) {
      if (!optional) {
        // RegExp["$&"] is the text of the last match
        // blank strings are ok, but are falsy, so we check stringiness instead of truthiness
        return ((typeof string === "string") && string.match(regex) && RegExp["$&"] === string);
      }

      // RegExp["$&"] is the text of the last match
      return (!string || (string.match(regex) && RegExp["$&"] === string));
    }

    if (typeof module != 'undefined' && module.exports) {
      module.exports = twttr.txt;
    }

  }());
  
}});

window.require.define({"models/Desk": function(exports, require, module) {
  (function() {
    var Desk,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Desk = (function(_super) {

      __extends(Desk, _super);

      function Desk() {
        Desk.__super__.constructor.apply(this, arguments);
      }

      Desk.configure('Case', 'updated_at', 'subject');

      Desk.fetch = function() {
        console.log('Fetching open tickets');
        return $.getJSON('http://localhost:3001/tickets/open', function(data) {
          return _.each(data, function(datum) {
            var d;
            return d = Desk.create(datum);
          });
        });
      };

      return Desk;

    })(Spine.Model);

    module.exports = Desk;

  }).call(this);
  
}});

window.require.define({"models/Issue": function(exports, require, module) {
  (function() {
    var Issue,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Issue = (function(_super) {

      __extends(Issue, _super);

      function Issue() {
        Issue.__super__.constructor.apply(this, arguments);
      }

      Issue.configure('Issue', 'title', 'opened_at');

      Issue.belongsTp('repository', 'models/Repository');

      return Issue;

    })(Spine.Model);

    module.exports = Issue;

  }).call(this);
  
}});

window.require.define({"models/NewRelic": function(exports, require, module) {
  (function() {
    var NewRelic,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    NewRelic = (function(_super) {

      __extends(NewRelic, _super);

      function NewRelic() {
        NewRelic.__super__.constructor.apply(this, arguments);
      }

      NewRelic.configure('NewRelic', 'times');

      NewRelic.fetch = function() {
        console.log('Fetching New Relic data');
        return $.getJSON('http://localhost:3001/newrelic', function(data) {
          if (NewRelic.count() > 0) {
            return NewRelic.update((NewRelic.first()).id, {
              times: data
            });
          } else {
            return NewRelic.create({
              times: data
            });
          }
        });
      };

      return NewRelic;

    })(Spine.Model);

    module.exports = NewRelic;

  }).call(this);
  
}});

window.require.define({"models/Project": function(exports, require, module) {
  (function() {
    var Project,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Project = (function(_super) {

      __extends(Project, _super);

      function Project() {
        Project.__super__.constructor.apply(this, arguments);
      }

      Project.configure('Project', '_id', 'name', 'repository', 'hudson_data');

      Project.fetch = function() {
        console.log('Fetching zooniverse projects');
        return $.getJSON('http://localhost:3001/projects', function(data) {
          return _.each(data, function(datum) {
            var project;
            return project = Project.create(datum);
          });
        });
      };

      return Project;

    })(Spine.Model);

    module.exports = Project;

  }).call(this);
  
}});

window.require.define({"models/Tweet": function(exports, require, module) {
  (function() {
    var Tweet,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Tweet = (function(_super) {

      __extends(Tweet, _super);

      function Tweet() {
        Tweet.__super__.constructor.apply(this, arguments);
      }

      Tweet.configure('Tweet', 'author', 'author_name', 'text', 'time');

      Tweet.fetch = function() {
        console.log('Fetching recent tweets');
        return $.getJSON('http://localhost:3001/twitter/recents', function(data) {
          data = JSON.parse(data);
          return _.each(data, function(datum) {
            return Tweet.create(datum);
          });
        });
      };

      return Tweet;

    })(Spine.Model);

    module.exports = Tweet;

  }).call(this);
  
}});

window.require.define({"views/app": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
        __out.push('<div class="projects_container">\n  <ul id="projects"></ul>\n</div>\n\n<section>\n  <div id="graph"></div>\n</section>\n\n<div id="ticker">\n  <ul id="tweets"></ul>\n</div>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"views/projects/project_item": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
        var commit, issue, _i, _j, _len, _len1, _ref, _ref1;
      
        __out.push('<ul>\n  <li><h2>');
      
        __out.push(this.name);
      
        __out.push('</h2></li>\n  <li>\n    <ul>\n      <li><a href="');
      
        __out.push(this.repository.html_url);
      
        __out.push('">');
      
        __out.push(this.repository.name);
      
        __out.push('</a></li>\n      <li>');
      
        __out.push(this.repository.language);
      
        __out.push('</li>\n      <li>');
      
        __out.push(this.repository.updated_at);
      
        __out.push('</li>\n      <li>Open Issues: ');
      
        __out.push(this.repository.open_issues);
      
        __out.push('</li>\n    </ul>\n  </li>\n  ');
      
        if (this.hudson_data) {
          __out.push('\n    <li>\n      Hudson Status: ');
          __out.push(this.hudson_data.score);
          __out.push('\n    </li>\n  ');
        }
      
        __out.push('\n  <li>\n    <h3>Issues</h3>\n    ');
      
        if (this.repository.issues) {
          __out.push('\n      <ul class="issues">\n      ');
          _ref = this.repository.issues;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            issue = _ref[_i];
            __out.push('\n        <li>');
            __out.push(issue.title);
            __out.push('</li>\n        <li>');
            __out.push(issue.updated_at);
            __out.push('</li>\n      ');
          }
          __out.push('\n      </ul>\n    ');
        }
      
        __out.push('\n  </li>\n  <li>\n    <h3>Commits</h3>\n    ');
      
        if (this.repository.commits) {
          __out.push('\n      <ul class="commits">\n      ');
          _ref1 = this.repository.commits;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            commit = _ref1[_j];
            __out.push('\n        <li>');
            __out.push(commit.committer.login);
            __out.push('</li>\n        <li>');
            __out.push(commit.commit.message);
            __out.push('</li>\n      ');
          }
          __out.push('\n      </ul>\n    ');
        }
      
        __out.push('\n  </li>\n</ul>');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"views/projects/projects": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
      
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"views/repos/repo_item": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
        __out.push('<ul>\n  <li><a href="');
      
        __out.push(this.html_url);
      
        __out.push('">');
      
        __out.push(this.name);
      
        __out.push('</a></li>\n  <li>');
      
        __out.push(this.language);
      
        __out.push('</li>\n  <li>');
      
        __out.push(this.updated_at);
      
        __out.push('</li>\n</ul>');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"views/repos/repos": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
        __out.push('repos.eco\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"views/tweets/tweet_item": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
        __out.push('<div class="author-meta">');
      
        __out.push(this.tweet.author_name);
      
        __out.push('</div>\n<div class="author-meta">(<span class="handle">@');
      
        __out.push(this.tweet.author);
      
        __out.push('</span>): </div>\n<div> ');
      
        __out.push(this.linkTweet(this.tweet.text));
      
        __out.push('</div>');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"views/tweets/tweets": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
      
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

