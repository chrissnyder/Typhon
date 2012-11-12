TwitterText = require 'lib/twitter-text'

Tweet = require 'models/Tweet'

class TweetItem extends Spine.Controller

  className: 'tweet'
  tag: 'li'

  constructor: ->
    super
    throw 'Must pass a tweet' unless @tweet
    @tweet.bind 'destroy', @remove

  render: (tweet) =>
    @tweet = tweet if tweet
    @html require('views/tweets/tweet_item')(@)

  remove: =>
    tweet_width = @el.width()

    @el.animate {
      marginLeft: -tweet_width - 35
    }, (tweet_width * 6), 'linear', =>
      @el.remove()
      Tweet.first().destroy()

  linkTweet: (text) =>
    TwitterText.autoLink text


module.exports = TweetItem