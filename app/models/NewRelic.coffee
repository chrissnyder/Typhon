
class NewRelic extends Spine.Model
  @configure 'NewRelic', 'times'

  @fetch: ->
    console.log 'Fetching New Relic data'
    $.getJSON 'http://localhost:3001/newrelic', (data) ->
      if NewRelic.count() > 0
        NewRelic.update((NewRelic.first()).id, { times: data })
      else
        NewRelic.create { times: data }

module.exports = NewRelic