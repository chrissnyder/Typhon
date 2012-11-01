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
    var App, Project, Projects, Tweet, Tweets,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    require('lib/setup');

    Project = require('models/Project');

    Tweet = require('models/Tweet');

    Projects = require('controllers/projects');

    Tweets = require('controllers/tweets');

    App = (function(_super) {

      __extends(App, _super);

      App.prototype.elements = {
        '#tweets': 'tweets',
        '#projects': 'projects'
      };

      function App() {
        this.render = __bind(this.render, this);
        var projects, tweets;
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
      }

      App.prototype.render = function() {
        return this.html(require('views/app')());
      };

      return App;

    })(Spine.Controller);

    module.exports = App;

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
      }

      ProjectItem.prototype.render = function(project) {
        if (project) this.project = project;
        return this.html(require('views/projects/project_item')(this.project));
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
        Project.bind('project_create', this.add);
      }

      Projects.prototype.add = function(project) {
        project = new ProjectItem({
          project: project
        });
        return this.append(project.render());
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
    var Tweet, TweetItem,
      __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Tweet = require('models/Tweet');

    TweetItem = (function(_super) {

      __extends(TweetItem, _super);

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
        }, tweet_width * 6, 'linear', function() {
          _this.el.remove();
          return Tweet.first().destroy();
        });
      };

      TweetItem.prototype.linkTweet = function(text) {
        text = text.replace(/#([a-zA-Z0-9_-]+)/g, '<a class="hashtag" href="http://www.twitter.com/#search?q=$1">#$1</a>');
        return text.replace(/@([a-zA-Z0-9_-]+)/g, '<a class="twitteruser" href="http://www.twitter.com/$1">@$1</a>');
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
        time = screen_width * 8;
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

window.require.define({"models/Hudson": function(exports, require, module) {
  (function() {
    var Hudson,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Hudson = (function(_super) {

      __extends(Hudson, _super);

      function Hudson() {
        Hudson.__super__.constructor.apply(this, arguments);
      }

      Hudson.configure('Hudson', 'name', 'buildScore', 'healthReport');

      Hudson.belongsTo('project', 'models/Project');

      return Hudson;

    })(Spine.Model);

    module.exports = Hudson;

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

window.require.define({"models/Project": function(exports, require, module) {
  (function() {
    var Hudson, Project, Repository,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Hudson = require('models/Hudson');

    Repository = require('models/Repository');

    Project = (function(_super) {

      __extends(Project, _super);

      function Project() {
        Project.__super__.constructor.apply(this, arguments);
      }

      Project.configure('Project', 'name', 'hudson');

      Project.hasOne('repository', Repository);

      Project.fetch = function() {
        console.log('Fetching zooniverse projects...');
        return $.getJSON('http://localhost:3001/projects', function(data) {
          return _.each(data, function(datum) {
            var hudson, hudson_data, project, repo, repo_data;
            project = Project.create(datum);
            repo_data = _.extend(datum.repository, {
              project: project
            });
            repo = Repository.create(repo_data);
            if (datum.hudson != null) {
              hudson_data = _.extend(datum.hudson_data, {
                project: project
              });
              hudson = Hudson.create(hudson_data);
              project.updateAttribute('hudson', hudson);
            }
            return Project.trigger('project_create', project);
          });
        });
      };

      return Project;

    })(Spine.Model);

    module.exports = Project;

  }).call(this);
  
}});

window.require.define({"models/Repository": function(exports, require, module) {
  (function() {
    var Repository,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

    Repository = (function(_super) {

      __extends(Repository, _super);

      function Repository() {
        Repository.__super__.constructor.apply(this, arguments);
      }

      Repository.configure('Repository', 'name', 'language', 'html_url', 'updated_at');

      Repository.belongsTo('project', 'models/Project');

      Repository.fetch = function() {
        console.log('Fetching repositories');
        return $.getJSON('http://localhost:3001/github/repos', function(data) {
          data = data.reverse();
          return _.each(data, function(datum) {
            return Repository.create(datum);
          });
        });
      };

      return Repository;

    })(Spine.Model);

    module.exports = Repository;

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
        console.log('Fetching recent tweets...');
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
      
        __out.push('<h2>Zooniverse Build Board</h2>\n<ul id="projects"></ul>\n<ul id="tweets"></ul>');
      
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
      
        __out.push('<ul>\n  <li><h3>');
      
        __out.push(this.name);
      
        __out.push('</h3></li>\n  <li>\n    <ul>\n      <li><a href="');
      
        __out.push(this.repository().html_url);
      
        __out.push('">');
      
        __out.push(this.repository().name);
      
        __out.push('</a></li>\n      <li>');
      
        __out.push(this.repository().language);
      
        __out.push('</li>\n      <li>');
      
        __out.push(this.repository().updated_at);
      
        __out.push('</li>\n    </ul>\n  </li>\n  ');
      
        if (this.hudson != null) {
          __out.push('\n  <li>\n    Hudson Status: ');
          __out.push(this.hudson.buildScore);
          __out.push('\n  </li>\n  ');
        }
      
        __out.push('\n</ul>');
      
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
      
        __out.push('<ul>\n  <li>Author: ');
      
        __out.push(this.tweet.author);
      
        __out.push('</li>\n  <li>Name: ');
      
        __out.push(this.tweet.name);
      
        __out.push('</li>\n  <li>Text: ');
      
        __out.push(this.linkTweet(this.tweet.text));
      
        __out.push('</li>\n  <li>Time: ');
      
        __out.push(this.tweet.time);
      
        __out.push('</li>\n</ul>');
      
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

