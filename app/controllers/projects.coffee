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
    
    @el.css
      width: @el.children().size() * @el.children().first().outerWidth()


module.exports = Projects