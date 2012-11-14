ajax = require 'lib/ajax'

class Project extends Spine.Model
  @configure 'Project', '_id', 'name', 'branch', 'repository', 'hudson_data'

  @fetch: ->
    console.log 'Fetching zooniverse projects'
    $.getJSON "#{ajax.base}/projects", (data) ->
      _.each data, (datum) ->
        project = Project.create datum


module.exports = Project