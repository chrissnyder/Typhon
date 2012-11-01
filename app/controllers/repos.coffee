Repository = require 'models/Repository'

RepoItem = require 'controllers/repo_item'

class Repos extends Spine.Controller
  
  tag: 'ul'

  constructor: ->
    super
    Repository.bind 'create', @add
    Repository.bind 'refresh', @addAll

  add: (repo) =>
    repo = new RepoItem(repo: repo)
    @append repo.render()

  addAll: =>
    Repository.each @add

module.exports = Repos