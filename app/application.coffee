require 'lib/setup'

Messages = require 'lib/messages'

Desk = require 'models/Desk'
NewRelic = require 'models/NewRelic'
Project = require 'models/Project'
Tweet = require 'models/Tweet'

Graph = require 'controllers/graph'
Projects = require 'controllers/projects'
Tweets = require 'controllers/tweets'

class App extends Spine.Controller
  elements:
    '#tweets': 'tweets'
    '#projects': 'projects'
    '#graph': 'graph'

  constructor: ->
    super
    @render()

    tweets = new Tweets({el: @tweets})
    Tweet.fetch()

    projects = new Projects({el: @projects})
    Project.fetch()

    Desk.fetch()

    graph = new Graph({el: @graph})

    # Setup pusher messaging
    messages = new Messages()

  render: =>
    @html require('views/app')()

module.exports = App
