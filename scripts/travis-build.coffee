child_process = require('child_process')
module.exports = (robot) ->
  robot.respond /travis-build (.+)/i, (res) ->
    child_process.exec 'ansible travis-build.claroline.net -a "travis-build '+res.match[1]+'"', (error, stdout, stderr) ->
      if (error)
        res.send(error)
        res.send(stderr)
