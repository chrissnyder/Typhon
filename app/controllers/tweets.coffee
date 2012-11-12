Tweet = require 'models/Tweet'

TweetItem = require 'controllers/tweet_item'

class Tweets extends Spine.Controller

  tag: 'ul'

  constructor: ->
    super
    Tweet.bind 'create', @add
    Tweet.one 'create', @beginAnimation
    Tweet.bind 'destroy', @fetchTweets

  add: (tweet) =>
    tweet = new TweetItem(tweet: tweet)
    @append tweet.render()

  beginAnimation: =>
    screen_width = $(document).width()
    time = (screen_width / 100) * 1000
    @el.css 'margin-left', screen_width

    @el.animate {
        marginLeft: 0
      }, time, 'linear', =>
        Tweet.first().destroy()

  fetchTweets: =>
    if Tweet.count() < 6
      Tweet.fetch()


module.exports = Tweets