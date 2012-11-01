
class Tweet extends Spine.Model
  @configure 'Tweet', 'author', 'author_name', 'text', 'time'

  @fetch: ->
    console.log 'Fetching recent tweets...'
    $.getJSON 'http://localhost:3001/twitter/recents', (data) ->
      data = JSON.parse data
      _.each data, (datum) ->
        Tweet.create datum


module.exports = Tweet