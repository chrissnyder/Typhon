
class Desk extends Spine.Model
  @configure 'Case', 'updated_at', 'subject'

  @fetch: ->
    console.log 'Fetching open tickets'
    $.getJSON 'http://localhost:3001/tickets/open', (data) ->
      _.each data, (datum) ->
        d = Desk.create datum

        
module.exports = Desk