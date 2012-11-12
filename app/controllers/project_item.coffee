
class ProjectItem extends Spine.Controller
  tag: 'li'

  constructor: ->
    super
    throw 'Must pass a project.' unless @project
    @project.bind 'update', @render

  render: (project) =>
    @project = project if project
    console.log @project
    @html require('views/projects/project_item')(@project)

    if project?
      # Theoretically...
      console.log 'test'
      index = @el.index()

      @el.css
        position: 'absolute'
        left: @el.outerWidth() * index

      @el.before '<li class="blank"></li>'

      @el.parent().animate {
        paddingLeft: @el.outerWidth()
      }, 1700, ->
        # Nothing

      @el.parent().find('.blank').animate {
        width: 0
      }, 1700, ->
        console.log $(@).remove()

      @el.animate {
        left: 0
        }, 2200, =>
          @el.insertBefore @el.parent().children().first()
          @el.css
            position: 'relative'

          @el.parent().css
            paddingLeft: 0

    return @el


module.exports = ProjectItem