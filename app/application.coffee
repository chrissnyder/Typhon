require 'lib/setup'

Tweet = require 'models/Tweet'
Tweets = require 'controllers/tweets'

class App extends Spine.Controller
  elements:
    '#tweets': 'tweets'

  constructor: ->
    super
    @render()

    tweets = new Tweets({el: @tweets})
    console.log tweets
    Tweet.fetch()

  render: =>
    @html require('views/app')()

module.exports = App
