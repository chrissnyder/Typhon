
class Hudson extends Spine.Model
  @configure 'Hudson', 'name', 'buildScore', 'healthReport'
  @belongsTo 'project', 'models/Project'
  
module.exports = Hudson