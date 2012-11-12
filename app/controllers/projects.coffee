Project = require 'models/Project'

ProjectItem = require 'controllers/project_item'

class Projects extends Spine.Controller

  tag: 'ul'

  constructor: ->
    super
    Project.bind 'create', @add

  add: (project) =>
    project = new ProjectItem(project: project)
    @append project.render()


module.exports = Projects