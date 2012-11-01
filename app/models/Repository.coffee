
class Repository extends Spine.Model
  @configure 'Repository', 'name', 'language', 'html_url', 'updated_at'
  @belongsTo 'project', 'models/Project'
  
  @fetch: ->
    console.log 'Fetching repositories'
    $.getJSON 'http://localhost:3001/github/repos', (data) ->
      data = data.reverse()
      _.each data, (datum) ->
        Repository.create datum


module.exports = Repository