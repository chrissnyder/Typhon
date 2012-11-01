Tweet = require 'models/Tweet'

class TweetItem extends Spine.Controller

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
    text = text.replace /#([a-zA-Z0-9_-]+)/g, '<a class="hashtag" href="http://www.twitter.com/#search?q=$1">#$1</a>'
    text.replace /@([a-zA-Z0-9_-]+)/g, '<a class="twitteruser" href="http://www.twitter.com/$1">@$1</a>'


module.exports = TweetItem