
class RepoItem extends Spine.Controller
  
  tag: 'li'
  
  constructor: ->
    super
    @repo.bind 'update', @render

  render: (repo) =>
    @repo = repo if repo
    @html require('views/repos/repo_item')(@repo)

module.exports = RepoItem