
$.ajaxSetup beforeSend: (xhr) ->
  if window.location.hostname is "0.0.0.0" or window.location.hostname is "localhost"
    Spine.Model.host = "http://localhost:3001" 
  else
    Spine.Model.host = ""