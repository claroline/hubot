// Description:
//   Refreshes the sources of the bot and restarts it.
//
// Commands:
//   hubot respawn [branch] - re-deploy the bot from a github branch (defaults to master)

const makeExec = require('./../lib/exec-promise')
const exec = makeExec(console.log.bind(console))
const appDir = `${__dirname}/..`

module.exports = robot => {
  robot.respond(/respawn( (.+))?/i, res => {
    const branch = res.match[2] || 'master'
    const exec = makeExec(res.reply.bind(res))

    res.reply(`Re-deploying myself from ${branch} branch...`)

    exec(`cd ${appDir}`)
      .then(() => exec('git fetch'))
      .then(() => exec(`git checkout ${branch}`))
      .then(() => exec('git pull'))
      .then(() => exec('npm install'))
      .then(() => exec('supervisorctl restart clarobot'))
      .catch(err => res.reply(`Self deployment failed: ${err.message}`))
  })
}
