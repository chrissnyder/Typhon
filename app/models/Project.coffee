
Hudson = require 'models/Hudson'
Repository = require 'models/Repository'

class Project extends Spine.Model
  @configure 'Project', '_id', 'name', 'repository', 'hudson_data'
  # @hasOne 'repository', Repository

  @fetch: ->
    console.log 'Fetching zooniverse projects...'
    $.getJSON 'http://localhost:3001/projects', (data) ->
      _.each data, (datum) ->
        project = Project.create datum
        # repo_data = _.extend datum.repository, {project: project}
        # repo = Repository.create repo_data

        # if datum.hudson?
        #   hudson_data = _.extend datum.hudson_data, {project: project}
        #   hudson = Hudson.create hudson_data

        #   # console.log 'hudson', hudson
        #   project.updateAttribute 'hudson', hudson
        #   # console.log project


module.exports = Project