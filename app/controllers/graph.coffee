NewRelic = require 'models/NewRelic'

class Graph extends Spine.Controller

  constructor: ->
    super
    NewRelic.bind 'create update', @drawGraph

    @getData()
    setInterval @getData, 60000

  drawGraph: (data) =>
    @el.empty()
    @graph = new Rickshaw.Graph
      element: document.getElementById('graph')
      renderer: 'area'
      series: [
          color: '#f47a4b'
          data: data.times
        ]
    @graph.render()

    # yAxis = new Rickshaw.Graph.Axis.Y
    #   graph: @graph
    # yAxis.render()

  getData: ->
    NewRelic.fetch()

module.exports = Graph