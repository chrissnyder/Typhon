if window.location.hostname is "0.0.0.0" or window.location.hostname is "localhost"
  baseUrl = "http://localhost:3001" 
else
  baseUrl = "http://zoo-bb-api.herokuapp.com"

Url = {
  base: baseUrl
}

module.exports = Url