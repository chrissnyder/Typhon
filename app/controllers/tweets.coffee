Tweet = require 'models/Tweet'
TweetItem = require 'controllers/tweet_item'

class Tweets extends Spine.Controller

  constructor: ->
    super
    Tweet.bind 'create', @addTweet
    Tweet.bind 'refresh', @allAll

  addTweet: (tweet) =>
    tweet = new TweetItem(tweet: tweet)
    console.log tweet
    @append tweet.render()

  addTweets: =>
    Tweet.each @addTweet


module.exports = Tweets