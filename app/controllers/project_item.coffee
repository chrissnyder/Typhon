
class ProjectItem extends Spine.Controller

  tag: 'li'

  constructor: ->
    super
    throw 'Must pass a project.' unless @project

  render: (project) =>
    @project = project if project
    @html require('views/projects/project_item')(@project)

module.exports = ProjectItem