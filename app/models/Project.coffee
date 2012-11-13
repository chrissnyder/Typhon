
class Project extends Spine.Model
  @configure 'Project', '_id', 'name', 'repository', 'hudson_data'

  @fetch: ->
    console.log 'Fetching zooniverse projects'
    $.getJSON 'http://localhost:3001/projects', (data) ->
      _.each data, (datum) ->
        project = Project.create datum


module.exports = Project