
class Repository extends Spine.Model
  @configure 'Repository', '_id', 'name', 'language', 'html_url', 'updated_at'
  @belongsTo 'project', 'models/Project'
  

module.exports = Repository