ajax = require 'lib/ajax'

class NewRelic extends Spine.Model
  @configure 'NewRelic', 'times'

  @fetch: ->
    console.log 'Fetching New Relic data'
    $.getJSON "#{ajax.base}/newrelic", (data) ->
      if NewRelic.count() > 0
        NewRelic.update((NewRelic.first()).id, { times: data })
      else
        NewRelic.create { times: data }

module.exports = NewRelic