ajax = require 'lib/ajax'

class Desk extends Spine.Model
  @configure 'Case', 'updated_at', 'subject'

  @fetch: ->
    console.log 'Fetching open tickets'
    $.getJSON "#{ajax.base}/tickets/open", (data) ->
      _.each data, (datum) ->
        d = Desk.create datum

        
module.exports = Desk