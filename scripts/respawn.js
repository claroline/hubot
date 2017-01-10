// Description:
//   Refreshes the sources of the bot and restarts it.
//
// Commands:
//   hubot respawn [branch] - re-deploy the bot from a github branch (defaults to master)

const makeExec = require('./../lib/exec-promise')
const exec = makeExec(console.log.bind(console))
const appDir = `${__dirname}/..`

module.exports = robot => {
  var first = true

  // if we're respawning, send a message to the room that trigger the respawn
  // (the "first" stuff is due to a bug, see https://github.com/github/hubot/issues/880)
  robot.brain.on('loaded', () => {
    if (first) {
      first = false

      const respawnRoom = robot.brain.get('respawn-room')

      if (respawnRoom) {
        robot.messageRoom(respawnRoom, 'Back to life!')
        robot.brain.set('respawn-room', null)
      }
    }
  })

  robot.hear(/(foo|bar|baz)/, res => {
    robot.brain.set('last-msg', res.match[1])
  })

  robot.hear(/last/, res => {
    res.reply(robot.brain.get('last-msg') || 'none')
  })

  robot.respond(/respawn( (.+))?/i, res => {
    const branch = res.match[2] || 'master'

    res.reply(`Re-deploying myself from ${branch} branch...`)

    exec(`cd ${appDir}`)
      .then(() => exec('git fetch'))
      .then(() => exec(`git checkout ${branch}`))
      .then(() => exec('git pull'))
      .then(() => exec('npm install'))
      .then(() => exec('supervisorctl restart clarobot'))
      .then(() => robot.brain.set('respawn-room', res.message.room))
      .catch(err => res.reply(`Self deployment failed: ${err.message}`))
  })
}
