Project = require 'models/Project'

class Messages extends Spine.Controller

  pusherKey: 'b2c4abfba1fee4e72f41'
  pusherChannel: 'buildboard'
  pusher: 
    'project': 'onProjectUpdate'

  constructor: ->
    @pusherChannels = {}
    @setupPusher()

  setupPusher: =>
    @openPusher()
    @setupPusherBindings @defaultChannel, @pusher

  openPusher: ->
    throw "You need to specify a pusher key" unless @pusherKey

    @pusherConnection = new Pusher(@pusherKey)
    @defaultChannel = @openChannel @pusherChannel

  openChannel: (channelName) ->
    @pusherChannels[channelName] = @pusherConnection.subscribe channelName 

  setupPusherBindings: (channel, bindings) ->
    for key, method of bindings
      channel.bind key, @[method]

  onProjectUpdate: (data) ->
    p = Project.findByAttribute '_id', data._id.toLowerCase()

    if p?
      p.updateAttributes data
    else
      console.log 'project not found'

module.exports = Messages