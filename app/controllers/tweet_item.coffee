
class TweetItem extends Spine.Controller

  constructor: ->
    super
    throw 'Must pass a tweet' unless @tweet

  render: (tweet) =>
    @tweet = tweet if tweet
    @html require('views/tweets/tweet_item')(@tweet)

module?.exports = TweetItem