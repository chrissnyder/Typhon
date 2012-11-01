require 'lib/setup'

Project = require 'models/Project'
Tweet = require 'models/Tweet'

Projects = require 'controllers/projects'
Tweets = require 'controllers/tweets'

class App extends Spine.Controller
  elements:
    '#tweets': 'tweets'
    '#projects': 'projects'

  constructor: ->
    super
    @render()

    tweets = new Tweets({el: @tweets})
    Tweet.fetch()

    projects = new Projects({el: @projects})
    Project.fetch()

  render: =>
    @html require('views/app')()

module.exports = App
