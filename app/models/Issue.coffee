
class Issue extends Spine.Model
  @configure 'Issue', 'title', 'opened_at'
  @belongsTp 'repository', 'models/Repository'

module.exports = Issue